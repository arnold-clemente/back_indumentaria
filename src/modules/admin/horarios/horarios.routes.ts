import { Router } from 'express';


import { corsMiddleware } from '../../../middleware/cors.middleware';

import { authMiddleware } from '../../../middleware/auth.middleware';
import { permisosMiddleware } from '../../../middleware/permisos.middleware';
import { permisos } from '../../../config/permisos';
import { horariosController } from './horarios.controller';

const router = Router();

router.get(
    '/dias',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.TIENDA.LIST, permisos.TIENDA.CREATE]),
    horariosController
);

export default router;
