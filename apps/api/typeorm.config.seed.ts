import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config({ path: '.env' });

const { DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;

const entities = ['src/**/*.entity{.ts,.js}', '**/*.entity{.ts,.js}'];
const migrations = [
  'src/db/seeds/*',
  'db/db/seeds/*',
  'db/apps/backend/src/db/seeds/*',
];

const connectionSource = new DataSource({
  database: DB_DATABASE,
  entities: entities,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  host: DB_HOST,
  migrations: migrations,
  namingStrategy: new SnakeNamingStrategy(),
  password: DB_PASSWORD,
  port: Number(DB_PORT),
  ssl: true,
  synchronize: false,
  type: 'postgres',
  username: DB_USERNAME,
});

export default connectionSource;
