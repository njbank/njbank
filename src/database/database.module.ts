import 'dotenv/config';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RankingBoard } from '../endpoints/ranking/entities/ranking-board.entity';
import { RankingEntries } from '../endpoints/ranking/entities/ranking-entries.entity';
import { Shop } from '../endpoints/shop/entities/shop.entity';
import { Skin } from '../endpoints/skin/entities/skin.entity';
import { Token } from '../endpoints/token/entities/token.entity';
import { User } from '../endpoints/users/entities/user.entity';
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
        socketPath: configService.get('POSTGRES_SOCKET'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: databaseEntities,
        migrations: [migrationFilesDir],
        synchronize: false,
        extra: {
          ssl: configService.get('POSTGRES_SSL'),
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
