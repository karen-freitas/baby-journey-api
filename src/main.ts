import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as yaml from 'js-yaml';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: process.env.URI_FRONTEND,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Baby Journey API')
    .setDescription('API documentation for Baby Journey project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

   fs.writeFileSync('./swagger.yaml', yaml.dump(document));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
