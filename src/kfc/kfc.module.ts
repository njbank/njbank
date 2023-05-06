import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NeosModule } from '../neos/neos.modules';
import { User } from '../users/entities/user.entity';
import { KfcController } from './kfc.controller';
import { KfcService } from './kfc.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NeosModule],
  exports: [TypeOrmModule],
  controllers: [KfcController],
  providers: [KfcService],
})
export class KfcModule {}
