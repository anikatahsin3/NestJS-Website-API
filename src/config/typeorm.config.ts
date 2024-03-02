import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

const dotenv_path = path.resolve(process.cwd(), `.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) { /* do nothing */ }

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    
    useFactory: async(): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            entities: [__dirname + './../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
            cli: {
                 migrationsDir: __dirname + '/../database/migrations',
            },
            extra: {
                charset: 'utf8mb4_unicode_ci',
            },
            synchronize: false,
            logging: true
        }
    }
}

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [__dirname + './../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    cli: {
         migrationsDir: __dirname + '/../database/migrations',
    },
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    logging: true
}