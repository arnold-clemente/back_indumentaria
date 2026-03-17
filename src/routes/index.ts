import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import homeRoutes from '../modules/web/home/home.routes';
import usuariosRoutes from '../modules/admin/usuarios/usuarios.routes';
import rolesRoutes from '../modules/admin/roles/roles.routes';
import tiendasRoutes from '../modules/admin/tiendas/tiendas.routes';
import horariosRoutes from '../modules/admin/horarios/horarios.routes';

const router = Router();

router.use('/auth', authRoutes);
// RUTAS ADMINISTRATIVAS 
// usuarios 
router.use('/admin/usuarios', usuariosRoutes);
// roles 
router.use('/admin/roles', rolesRoutes);
// tiendas 
router.use('/admin/tiendas', tiendasRoutes);
// horarios 
router.use('/admin/horarios', horariosRoutes);
// preguntas 
// router.use('/admin/preguntas', horariosRoutes);


// RUTAS DE PUBLICAS
router.use('/home', homeRoutes);

export default router;
