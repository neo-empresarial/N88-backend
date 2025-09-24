// src/typeorm-cli.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'ep-wispy-surf-a52nipjl.us-east-2.aws.neon.tech',
  port: 5432,
  username: 'neondb_owner',
  password: 'npg_c5o3LNlhtWVa',
  database: 'neondb',
  entities: ['dist/**/*.entity.js'],
  migrations: ['src/migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
});

export default AppDataSource;