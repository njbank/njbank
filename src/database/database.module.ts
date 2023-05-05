import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Token } from '../token/entities/token.entity';
import 'dotenv/config';
import { join } from 'path';

export const databaseEntities = [User, Token];
export const migrationFilesDir = join(
  __dirname,
  'database/migrations',
  '*.entity.{ts,js}',
);

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
        extra: {
          ssl: 'true',
        },
        entities: databaseEntities,
        synchronize: false,
        migrations: [migrationFilesDir],
      }),
    }),
  ],
})
export class DatabaseModule {}
