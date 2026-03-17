import { Router } from 'express';
import {
    loginController,
    registerController
} from './auth.controller';
import { corsMiddleware } from '../../middleware/cors.middleware';

const router = Router();

router.post('/register', corsMiddleware, registerController);

router.post('/login', corsMiddleware, loginController);

export default router;
