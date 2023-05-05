import { databaseEntities, migrationFilesDir } from './database.module';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: databaseEntities,
  synchronize: false,
  migrations: [migrationFilesDir],
  extra: {
    ssl: 'true',
  },
});
