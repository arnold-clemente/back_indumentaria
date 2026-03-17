import cors from 'cors';
import { env } from '../config/env';

export const corsMiddleware = cors({

    origin: [
        env.FRONTEND_URL,
        env.POSTMAN_URL
    ],

    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ],

    credentials: true
});
