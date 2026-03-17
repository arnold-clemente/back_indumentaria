import { Response, NextFunction } from 'express';
import { AuthRequest } from "./auth.middleware";
import { pool } from '../config/database';

export const permisosMiddleware = (permisosRequeridos: string | string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Usuario no autenticado"
                });
            }

            // Convertir a array si es un string
            const permisos = Array.isArray(permisosRequeridos) 
                ? permisosRequeridos 
                : [permisosRequeridos];

            if (permisos.length === 0) {
                return res.status(500).json({
                    message: "Configuración de permisos inválida"
                });
            }

            // Construir query dinámica para múltiples permisos
            const query = `
                SELECT DISTINCT p.nombre
                FROM autenticacion.usuarios u
                LEFT JOIN autenticacion.roles r ON u.rol_id = r.rol_id AND r.estado = 1
                LEFT JOIN autenticacion.rol_permiso rp ON r.rol_id = rp.rol_id AND rp.estado = 1
                LEFT JOIN autenticacion.permisos p ON rp.permiso_id = p.permiso_id AND p.estado = 1
                WHERE u.usuario_id = $1 
                AND u.estado = 1
                AND p.nombre = ANY($2::text[])
            `;
            
            const result = await pool.query(query, [userId, permisos]);

            // Verificar si tiene ALGUNO de los permisos (result.rows.length > 0)
            if (result.rows.length === 0) {
                return res.status(403).json({
                    message: "No tienes permisos para acceder a este recurso",
                });
            }

            // Opcional: adjuntar los permisos que tiene a la request
            req.user = {
                ...req.user,
                permisos: result.rows.map(row => row.nombre)
            };

            next();

        } catch (error) {
            console.error('Error en middleware de permisos:', error);
            return res.status(500).json({
                message: "Error al verificar permisos"
            });
        }
    };
};