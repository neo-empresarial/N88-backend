import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'n88',
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  synchronize: true, // Remove this line in production
  autoLoadEntities: true,
}