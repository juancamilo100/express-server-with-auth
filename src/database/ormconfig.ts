import { DataSourceOptions, DataSource } from "typeorm";
import {
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_USER
} from "../../config";

const config: DataSourceOptions = {
  type: "postgres",
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: false,
  entities: [
    __dirname + "/entities/*.entity{.ts,.js}",
  ],
  migrations: [__dirname + "/../../migrations/*{.ts,.js}"]
};

const AppDataSource = new DataSource(config)

export = AppDataSource;
