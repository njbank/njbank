import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggingService } from './logging.service';
import { Log } from './tneities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
