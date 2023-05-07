import 'dotenv/config';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RankingBoard } from '../ranking/entities/ranking-board.entity';
import { RankingEntries } from '../ranking/entities/ranking-entries.entity';
import { Shop } from '../shop/entities/shop.entity';
import { Skin } from '../skin/entities/skin.entity';
import { Token } from '../token/entities/token.entity';
import { User } from '../users/entities/user.entity';

export const databaseEntities = [
  User,
  Token,
  RankingBoard,
  RankingEntries,
  Skin,
  Shop,
];

const migrationFilesDir = 'dist/database/migrations/*.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
        }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: databaseEntities,
        migrations: [migrationFilesDir],
        synchronize: false,
        extra: {
          ssl: 'true',
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
