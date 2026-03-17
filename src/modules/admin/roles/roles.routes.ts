import { Router } from 'express';


import { corsMiddleware } from '../../../middleware/cors.middleware';

import { authMiddleware } from '../../../middleware/auth.middleware';
import { permisosMiddleware } from '../../../middleware/permisos.middleware';
import { permisos } from '../../../config/permisos';
import { rolesActivosController } from './roles.controller';

const router = Router();

router.get(
    '/activos',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.USUARIO.LIST]),
    rolesActivosController
);

export default router;
