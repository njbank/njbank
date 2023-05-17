import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggingModule } from '../../modules/logging/logging.modules';
import { NeosModule } from '../../modules/neos/neos.modules';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { KfcController } from './kfc.controller';
import { KfcService } from './kfc.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    NeosModule,
    UsersModule,
    LoggingModule,
  ],
  exports: [KfcService],
  controllers: [KfcController],
  providers: [KfcService],
})
export class KfcModule {}
