import { Module } from '@nestjs/common';
import { NeosService } from './neos.service';
import { NeosController } from './neos.controller';

@Module({
  controllers: [NeosController],
  providers: [NeosService],
  exports: [NeosService],
})
export class NeosModule {}
