# Development Stage
FROM alpine:latest AS development
LABEL image.name="tech-challenge:dev"
WORKDIR /app
COPY . .
RUN ./setup.sh
WORKDIR /app/back-end/apis/nestjs
RUN adduser -D user && chown -R user /app
USER user
RUN npm install
RUN npm run protobuf-gen
RUN npm run build
expose 3000
CMD ["npm", "run", "start:dev"]

#Production Stage
FROM alpine:latest AS test
LABEL image.name="tech-challenge:test"
WORKDIR /app
COPY . .
RUN ./setup.sh
RUN adduser -D user && chown -R user /app
USER user
WORKDIR /app/back-end/apis/nestjs
RUN npm install
RUN npm run protobuf-gen
RUN npm run build
expose 3000
CMD ["npm", "run", "test:e2e"]

#Production Stage
FROM alpine:latest AS production
LABEL image.name="tech-challenge:v1"
WORKDIR /app
COPY . .
RUN ./setup.sh
RUN adduser -D user && chown -R user /app
USER user
WORKDIR /app/back-end/apis/nestjs
RUN npm install
RUN npm run protobuf-gen
RUN npm run build
expose 3000
CMD ["npm", "run", "start:prod"]