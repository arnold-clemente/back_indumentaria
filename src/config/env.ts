import dotenv from 'dotenv';

dotenv.config();

export const env = {
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',
    POSTMAN_URL: process.env.POSTMAN_URL || 'http://localhost:4200',
    JWT_SECRET: process.env.JWT_SECRET || 'MueG470g,bM-j%I&n!gñ',
    PORT: process.env.PORT || '3000',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || '5432',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'postgres',
};
