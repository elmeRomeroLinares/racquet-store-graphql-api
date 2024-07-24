import { DataSource } from 'typeorm';
import { User } from './entities/User';
import dotenv from 'dotenv';

dotenv.config();

const dbPort = process.env.DB_PORT

if (!dbPort) {
    throw new Error('Environment variable db_port is missing')
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(dbPort, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
