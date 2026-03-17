import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const start = Date.now();

    const { method, originalUrl } = req;

    console.log(
        `📥 ${method} ${originalUrl} - ${new Date().toISOString()}`
    );

    res.on('finish', () => {

        const duration = Date.now() - start;

        console.log(
            `📤 ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`
        );
    });

    next();
};
