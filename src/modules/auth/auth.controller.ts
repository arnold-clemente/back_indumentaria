import { Request, Response } from 'express';
import { loginService, registerService } from './auth.service';

export const registerController = async (
    req: Request,
    res: Response
) => {

    try {

        const result = await registerService(req.body);

        res.status(201).json(result);

    } catch (error: any) {

        res.status(400).json({
            message: error.message
        });
    }
};

export const loginController = async (
    req: Request,
    res: Response
) => {

    try {

        const result = await loginService(req.body);

        res.json(result);

    } catch (error: any) {

        res.status(400).json({
            message: error.message
        });
    }
};
