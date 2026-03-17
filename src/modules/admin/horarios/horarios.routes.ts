import { Router } from 'express';


import { corsMiddleware } from '../../../middleware/cors.middleware';

import { authMiddleware } from '../../../middleware/auth.middleware';
import { permisosMiddleware } from '../../../middleware/permisos.middleware';
import { permisos } from '../../../config/permisos';

const router = Router();

router.get(
    '/',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.TIENDA.LIST, permisos.TIENDA.CREATE]),
    rolesActivosController
);

export default router;
