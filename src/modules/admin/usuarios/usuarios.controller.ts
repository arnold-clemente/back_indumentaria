import { Response, Request } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { usuariosService } from './usuarios.service';
import { CreateUsuarioDto, ListUsuariosParams, UpdateUsuarioDto } from './types/usuarios.types';
import multer from 'multer';
import path from 'path';

interface UsuarioParams {
    id: string;
}

const UPLOAD_DIR = path.join(__dirname, '../../../uploads/perfiles');
// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'));
        }
    }
});

export const usuariosListController = async (
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

        const userId = req.user.userId;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const params: ListUsuariosParams = {
            page: page < 1 ? 1 : page,
            limit: limit < 1 ? 10 : limit > 100 ? 100 : limit,
            sortBy: req.query.sortBy as string,
            sortOrder: req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC',
            search: req.query.search as string,
            estado: req.query.estado !== undefined
                ? Number(req.query.estado)
                : 1
        };

        const result = await usuariosService.listarUsuarios(userId, params);

        return res.json({
            success: true,
            ...result,
            message: "Usuarios listados correctamente"
        });

    } catch (error) {
        console.error('Error en listar usuarios:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al listar usuarios',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};


export const getUsuarioController = async (
    req: Request<UsuarioParams> & AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }
        const usuarioId = parseInt(req.params.id, 10);

        const usuario = await usuariosService.getUsuario(usuarioId);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const { ...usuarioSeguro } = usuario;

        return res.status(200).json({
            success: true,
            message: 'Usuario obtenido correctamente',
            data: usuarioSeguro
        });

    } catch (error) {
        console.error('Error en getUsuarioController:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al traer usuario',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};


export const createUsuarioController = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        console.log('=== CREATE USUARIO ===');
        console.log('Headers:', req.headers);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);
        console.log('File:', req.file);
        console.log('Files:', req.files)
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const usuarioData: CreateUsuarioDto = {
            nombres: req.body.nombres || null,
            paterno: req.body.paterno || null,
            materno: req.body.materno || null,
            ci: req.body.ci || null,
            correo: req.body.correo,
            celular: req.body.celular || null,
            usuario: req.body.usuario,
            rol_id: parseInt(req.body.rol_id),
            estado: req.body.estado !== undefined ? parseInt(req.body.estado) : 1,
            avatar: req.file ? req.file : null
        };

        const result = await usuariosService.crearUsuario(
            usuarioData,
            req.user.userId
        );

        if (result.errores && result.errores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: result.errores
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Usuario creado correctamente',
            data: result.usuario
        });

    } catch (error) {
        console.error('Error en createUsuarioController:', error);

        // Error de duplicado en PostgreSQL
        if (error instanceof Error && 'code' in error && error.code === '23505') {
            const detail = (error as any).detail;
            if (detail.includes('correo')) {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: [{
                        field: 'correo',
                        message: 'El correo electrónico ya está registrado'
                    }]
                });
            }
            if (detail.includes('usuario')) {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: [{
                        field: 'usuario',
                        message: 'El nombre de usuario ya está en uso'
                    }]
                });
            }
            if (detail.includes('ci')) {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: [{
                        field: 'ci',
                        message: 'El carnet de identidad ya está registrado'
                    }]
                });
            }
        }

        return res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const updateUsuarioController = async (
    req: Request<UsuarioParams> & AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const usuarioId = parseInt(req.params.id);

        if (isNaN(usuarioId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        const usuarioData: UpdateUsuarioDto = {
            usuario_id: usuarioId,
            nombres: req.body.nombres || null,
            paterno: req.body.paterno || null,
            materno: req.body.materno || null,
            ci: req.body.ci || null,
            correo: req.body.correo,
            celular: req.body.celular || null,
            usuario: req.body.usuario,
            rol_id: parseInt(req.body.rol_id),
            estado: req.body.estado !== undefined ? parseInt(req.body.estado) : 1,
            avatar: req.file ? req.file : null
        };

        const result = await usuariosService.actualizarUsuario(
            usuarioData,
            req.user.userId
        );

        if (result.errores && result.errores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: result.errores
            });
        }

        if (!result.usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: result.usuario
        });

    } catch (error) {
        console.error('Error en updateUsuarioController:', error);

        // Error de duplicado en PostgreSQL
        if (error instanceof Error && 'code' in error && error.code === '23505') {
            const detail = (error as any).detail;
            if (detail.includes('correo')) {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: [{
                        field: 'correo',
                        message: 'El correo electrónico ya está registrado'
                    }]
                });
            }
            if (detail.includes('usuario')) {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: [{
                        field: 'usuario',
                        message: 'El nombre de usuario ya está en uso'
                    }]
                });
            }
        }

        return res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const deleteUsuarioController = async (
    req: Request<UsuarioParams> & AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const usuarioId = parseInt(req.params.id);

        if (isNaN(usuarioId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        // No permitir eliminarse a sí mismo
        if (usuarioId === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propio usuario'
            });
        }

        const eliminado = await usuariosService.eliminarUsuario(
            usuarioId,
            req.user.userId
        );

        if (!eliminado) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        console.error('Error en deleteUsuarioController:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const resetPasswordController = async (
    req: Request<UsuarioParams> & AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const usuarioId = parseInt(req.params.id);

        if (isNaN(usuarioId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        const reseteado = await usuariosService.resetPassword(
            usuarioId,
            req.user.userId
        );

        if (!reseteado) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contraseña reseteada correctamente'
        });

    } catch (error) {
        console.error('Error en resetPasswordController:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al resetear contraseña',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
