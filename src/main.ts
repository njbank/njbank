import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Neos銀行 API docs')
    .setDescription('Neos銀行のAPI仕様書です。')
    .setVersion('1.0')
    .addServer('https://bank.neos.love', 'Production server')
    .addServer('https://njbank-staging.hinasense.jp', 'Staging server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
