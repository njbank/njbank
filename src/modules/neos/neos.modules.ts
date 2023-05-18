import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExecutedMessage } from './entities/executed-message.entity';
import { NeosService } from './neos.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExecutedMessage])],
  providers: [NeosService],
  exports: [NeosService],
})
export class NeosModule {}
