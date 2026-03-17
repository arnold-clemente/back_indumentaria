import { Pool } from 'pg';
import { env } from './env';

export const pool = new Pool({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
});

export const connectDB = async () => {
    try {

        const client = await pool.connect();

        console.log('✅ PostgreSQL connected successfully');

        client.release();

    } catch (error) {

        console.error('❌ Database connection error:', error);

        process.exit(1);
    }
};
