import 'reflect-metadata';

import fs from 'fs';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { dump } from 'js-yaml';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './modules/http-exception-filter/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Neos銀行 API docs')
    .setDescription('Neos銀行のAPI仕様書です。')
    .setVersion('0.1')
    .addServer('https://bank.neos.love', 'Production server')
    .addServer('https://njbank-staging.hinasense.jp', 'Staging server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger-spec.yaml', dump(document, {}));
  fs.writeFileSync(
    './swagger-spec.json',
    JSON.stringify(document, undefined, 2),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
