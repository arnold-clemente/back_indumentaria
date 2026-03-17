import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const JWT_SECRET = env.JWT_SECRET;

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token requerido"
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "Token inválido"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(`🔐 Usuario autenticado ID: ${(decoded as any).userId}`);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token inválido o expirado"
        });
    }
};
