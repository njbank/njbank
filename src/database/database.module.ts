import 'dotenv/config';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RankingBoard } from '../api/ranking/entities/ranking-board.entity';
import { RankingEntries } from '../api/ranking/entities/ranking-entries.entity';
import { Shop } from '../api/shop/entities/shop.entity';
import { Skin } from '../api/skin/entities/skin.entity';
import { Token } from '../api/token/entities/token.entity';
import { User } from '../api/users/entities/user.entity';
import { ApiKey } from '../middleware/auth/entities/api-key.entity';
import { Permission } from '../middleware/auth/entities/permission.entity';

export const databaseEntities = [
  User,
  Token,
  RankingBoard,
  RankingEntries,
  Skin,
  Shop,
  ApiKey,
  Permission,
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
