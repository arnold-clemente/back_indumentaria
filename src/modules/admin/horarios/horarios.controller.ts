import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';

export const horariosTiendasController = async (
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

        const horarios = await rolesService.getRoles();

        if (!horarios) {
            return res.status(404).json({
                success: false,
                message: 'No se ha encontrado horarios'
            });
        }


        return res.status(200).json({
            success: true,
            message: 'Horarios obtenido correctamente',
            data: horarios
        });

    } catch (error) {
        console.error('Error en horarios tiendas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al traer horarios',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
