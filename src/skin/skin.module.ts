import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Skin } from './entities/skin.entity';
import { SkinController } from './skin.controller';
import { SkinService } from './skin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Skin])],
  exports: [TypeOrmModule],
  controllers: [SkinController],
  providers: [SkinService],
})
export class SkinModule {}
