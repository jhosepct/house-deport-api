import { registerAs } from '@nestjs/config'

export default registerAs('config', () => {
    return {
        JWT_SECRET: process.env.JWT_SECRET,
        TITLE: process.env.TITLE,
        HOST: process.env.HOST,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_URL_LOCAL: process.env.DATABASE_URL_LOCAL,
    }
});