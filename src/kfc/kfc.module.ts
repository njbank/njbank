import { Module } from '@nestjs/common';
import { KfcService } from './kfc.service';
import { KfcController } from './kfc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { NeosModule } from 'src/neos/neos.modules';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NeosModule],
  exports: [TypeOrmModule],
  controllers: [KfcController],
  providers: [KfcService],
})
export class KfcModule {}
