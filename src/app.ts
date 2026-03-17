import express from 'express';
import routes from './routes';
import path from 'path';
import { errorMiddleware } from './middleware/error.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';

export const createApp = () => {

    const app = express();

    // Logger
    app.use(loggerMiddleware);

    // CORS
    app.use(corsMiddleware);

    // middleware
    app.use(express.json());

    // rutas de imagenes
    app.use(
        "/imagenes",
        express.static(path.join(__dirname, "uploads"))
    );

    // rutas
    app.use('/api', routes);

    // error handler
    app.use(errorMiddleware);

    return app;
};
