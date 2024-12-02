﻿import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  synchronize: false, // Remove this line in production
  autoLoadEntities: true,
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
}

export const connectionSource = new DataSource(typeOrmConfig as DataSourceOptions);