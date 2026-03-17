import { Router } from 'express';

import { homeController } from './home.controller';

import { corsMiddleware } from '../../../middleware/cors.middleware';

import { authMiddleware } from '../../../middleware/auth.middleware';

const router = Router();

router.get(
    '/',
    corsMiddleware,
    authMiddleware,
    homeController
);

export default router;
