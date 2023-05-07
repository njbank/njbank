import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NeosModule } from '../../modules/neos/neos.modules';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { KfcController } from './kfc.controller';
import { KfcService } from './kfc.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NeosModule, UsersModule],
  exports: [KfcService],
  controllers: [KfcController],
  providers: [KfcService],
})
export class KfcModule {}
