import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { homeService } from './home.service';

export const homeController = (
    req: AuthRequest,
    res: Response
) => {

    const userId = req.user.userId;

    const result = homeService(userId);
    res.json(result);
};
