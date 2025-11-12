import 'reflect-metadata';
import { DataSource } from 'typeorm';

const isProd = (process.env.NODE_ENV ?? 'development') === 'production';
const useSSL = /^true$/i.test(process.env.DATABASE_SSL || '');

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'postgres',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'n88prd',
  entities: isProd ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
  migrations: isProd ? ['dist/migrations/*.js'] : ['src/migrations/*.ts'],
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});
