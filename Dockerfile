FROM ubuntu:latest
LABEL image.name="tech-challenge:v1"
WORKDIR /app
COPY . .
RUN ./setup.sh
WORKDIR /app/back-end/apis/nestjs
RUN npm install
RUN npm run protobuf-gen
RUN npm run build
expose 3000
CMD ["npm", "start"]