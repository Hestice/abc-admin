import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config({ path: '.env' });

const { DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USERNAME, NODE_ENV } = process.env;

const isDevelopment = NODE_ENV === 'development';
const isLocalhost = DB_HOST === 'localhost';

// Only apply SSL for non-local, non-development environments
const sslConfig = !isLocalhost && !isDevelopment ? {
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  }
} : {};

const entities = ['src/**/*.entity{.ts,.js}', '**/*.entity{.ts,.js}'];
const migrations = [
  'src/db/seeds/*',
  'db/db/seeds/*',
  'db/apps/backend/src/db/seeds/*',
];

const connectionSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: entities,
  migrations: migrations,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  ...sslConfig
});

export default connectionSource;
