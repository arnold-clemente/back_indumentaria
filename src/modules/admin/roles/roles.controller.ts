import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { rolesService } from './roles.service';

export const rolesActivosController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const roles = await rolesService.getRoles();

        if (!roles) {
            return res.status(404).json({
                success: false,
                message: 'No se ha encontrado roles'
            });
        }


        return res.status(200).json({
            success: true,
            message: 'Roles obtenido correctamente',
            data: roles
        });

    } catch (error) {
        console.error('Error en rolesActivos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al traer usuario',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
