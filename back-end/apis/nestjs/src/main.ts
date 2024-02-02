import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config as global_config} from "./config/global_config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle(global_config["App"]["title"])
    .setDescription(global_config["App"]["description"])
    .setVersion(global_config["App"]["version"])
    .addTag(global_config["App"]["tag"])
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(global_config["Swagger"]["api_route"], app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
