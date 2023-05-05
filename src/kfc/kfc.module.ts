import { Module } from '@nestjs/common';
import { KfcService } from './kfc.service';
import { KfcController } from './kfc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  controllers: [KfcController],
  providers: [KfcService],
})
export class KfcModule {}
