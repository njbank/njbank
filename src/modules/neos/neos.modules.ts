import { Module } from '@nestjs/common';

import { NeosService } from './neos.service';

@Module({
  providers: [NeosService],
  exports: [NeosService],
})
export class NeosModule {}
