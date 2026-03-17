import { Router } from 'express';


import { corsMiddleware } from '../../../middleware/cors.middleware';

import { authMiddleware } from '../../../middleware/auth.middleware';
import { createUsuarioController, deleteUsuarioController, getUsuarioController, resetPasswordController, updateUsuarioController, upload, usuariosListController } from './usuarios.controller';
import { permisosMiddleware } from '../../../middleware/permisos.middleware';
import { permisos } from '../../../config/permisos';

const router = Router();

router.get(
    '/',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.USUARIO.LIST]),
    usuariosListController
);

router.get(
    '/:id',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.USUARIO.LIST]),
    getUsuarioController
);

router.post(
    '/',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.USUARIO.CREATE]),
    upload.single('avatar'), createUsuarioController
);

router.put(
    '/:id',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.USUARIO.EDIT]),
    upload.single('avatar'), updateUsuarioController
);

router.delete(
    '/:id',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.USUARIO.DELETE]),
    deleteUsuarioController
);

router.post(
    '/:id/reset-password',
    corsMiddleware,
    authMiddleware,
    permisosMiddleware([permisos.USUARIO.PASSWORD]),
    resetPasswordController
);


export default router;
