
import dotenv from "dotenv";
import path from "path";

let configPath;

// Only use dotenv in non-production environments
if (process.env.NODE_ENV !== 'production') {
    const configPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`);
    dotenv.config({ path: configPath });
}

export const PORT = process.env.PORT;
export const APP_NAME = process.env.APP_NAME;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const POSTGRES_PORT = process.env.POSTGRES_PORT;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB = process.env.POSTGRES_DB;
export const PGADMIN_DEFAULT_EMAIL = process.env.PGADMIN_DEFAULT_EMAIL;
export const PGADMIN_DEFAULT_PASSWORD = process.env.PGADMIN_DEFAULT_PASSWORD;
export const DEFAULT_ADMIN_USER_EMAIL = process.env.DEFAULT_ADMIN_USER_EMAIL;
export const DEFAULT_ADMIN_USER_PASSWORD = process.env.DEFAULT_ADMIN_USER_PASSWORD;
