import { Module } from '@nestjs/common';

import { NeosController } from './neos.controller';
import { NeosService } from './neos.service';

@Module({
  controllers: [NeosController],
  providers: [NeosService],
  exports: [NeosService],
})
export class NeosModule {}
