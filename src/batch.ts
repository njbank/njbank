import { NestFactory } from '@nestjs/core';

import { FactoryModule } from './batch.module';
import { FactoryService } from './batch.service';

export async function main() {
  const app = await NestFactory.create(FactoryModule);
  const service = await app.resolve(FactoryService);
  const response = await service.exec();
  return response;
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1); // Retry Job Task by exiting the process
  })
  .then((msg) => {
    console.info(msg);
    process.exit(0);
  });
