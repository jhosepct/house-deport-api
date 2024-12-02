import { registerAs } from '@nestjs/config'

export interface Config {
    JWT_SECRET: string;
    TITLE: string;
    HOST: string;
    PORT: string;
    DATABASE_URL: string;
    DATABASE_URL_LOCAL: string;
    ENCRYPTED_KEY: string;
}

export default registerAs('config', ():Config => {
    return {
        JWT_SECRET: process.env.JWT_SECRET,
        TITLE: process.env.TITLE,
        HOST: process.env.HOST,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_URL_LOCAL: process.env.DATABASE_URL_LOCAL,
        ENCRYPTED_KEY: process.env.ENCRYPTED_KEY
    }
});