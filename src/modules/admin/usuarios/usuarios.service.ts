import { usuariosRepository } from './usuarios.repository';
import { CreateUsuarioDto, ListUsuariosParams, UpdateUsuarioDto, Usuario, UsuarioRow } from './types/usuarios.types';
import { ValidationError } from '../../../core/models/error-validate';
import { PaginatedResponse } from '../../../core/models/paginate.types';

export class UsuariosService {

    async listarUsuarios(
        userId: number,
        params: ListUsuariosParams
    ): Promise<PaginatedResponse<UsuarioRow>> {

        const { page = 1, limit = 10 } = params;

        const { data, total } = await usuariosRepository.getUsuarios(params);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextUrl: null,
                prevUrl: null
            }
        };
    }

    async getUsuario(usuarioId: number): Promise<Usuario | null> {
        // Obtener información básica del usuario
        const usuario = await usuariosRepository.getUsuario(usuarioId);

        if (!usuario) {
            return null;
        }

        return usuario;
    }

    async crearUsuario(
        data: CreateUsuarioDto,
        creadoPor: number
    ): Promise<{ usuario: Usuario; errores?: ValidationError[] }> {

        // Validar campos requeridos
        const errores: ValidationError[] = [];

        if (!data.nombres) {
            errores.push({
                field: 'nombres',
                message: 'El nombre es obligatorio'
            });
        }

        if (!data.correo) {
            errores.push({
                field: 'correo',
                message: 'El correo electrónico es obligatorio'
            });
        }

        if (!data.usuario) {
            errores.push({
                field: 'usuario',
                message: 'El nombre de usuario es obligatorio'
            });
        }

        if (!data.rol_id) {
            errores.push({
                field: 'rol_id',
                message: 'Debe seleccionar un rol'
            });
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.correo && !emailRegex.test(data.correo)) {
            errores.push({
                field: 'correo',
                message: 'El formato del correo electrónico no es válido'
            });
        }

        // Validar longitud de campos según BD
        if (data.nombres && data.nombres.length > 50) {
            errores.push({
                field: 'nombres',
                message: 'El nombre no puede tener más de 50 caracteres'
            });
        }

        if (data.paterno && data.paterno.length > 50) {
            errores.push({
                field: 'paterno',
                message: 'El apellido paterno no puede tener más de 50 caracteres'
            });
        }

        if (data.materno && data.materno.length > 50) {
            errores.push({
                field: 'materno',
                message: 'El apellido materno no puede tener más de 50 caracteres'
            });
        }

        if (data.ci && data.ci.length > 12) {
            errores.push({
                field: 'ci',
                message: 'El carnet de identidad no puede tener más de 12 caracteres'
            });
        }

        if (data.correo && data.correo.length > 150) {
            errores.push({
                field: 'correo',
                message: 'El correo no puede tener más de 150 caracteres'
            });
        }

        if (data.celular && data.celular.length > 25) {
            errores.push({
                field: 'celular',
                message: 'El celular no puede tener más de 25 caracteres'
            });
        }

        if (data.usuario && data.usuario.length > 100) {
            errores.push({
                field: 'usuario',
                message: 'El usuario no puede tener más de 100 caracteres'
            });
        }

        // Validar existencia en BD
        if (data.correo || data.usuario || data.ci) {
            const existentes = await usuariosRepository.validarExistenciaUsuario(
                data.correo,
                data.usuario,
                data.ci
            );

            errores.push(...existentes.map(e => ({
                field: e.campo,
                message: e.mensaje
            })));
        }

        if (errores.length > 0) {
            return { usuario: null as any, errores };
        }

        const usuario = await usuariosRepository.crearUsuario(data, creadoPor);
        return { usuario };
    }


    async actualizarUsuario(
        data: UpdateUsuarioDto,
        modificadoPor: number
    ): Promise<{ usuario: Usuario | null; errores?: ValidationError[] }> {

        // Validar que el usuario existe
        const usuarioExistente = await this.getUsuario(data.usuario_id);
        if (!usuarioExistente) {
            return {
                usuario: null,
                errores: [{
                    field: 'general',
                    message: 'El usuario no existe'
                }]
            };
        }

        const errores: ValidationError[] = [];

        // Validar formato de correo si se actualiza
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.correo && !emailRegex.test(data.correo)) {
            errores.push({
                field: 'correo',
                message: 'El formato del correo electrónico no es válido'
            });
        }

        // Validar longitudes si se actualizan
        if (data.nombres && data.nombres.length > 50) {
            errores.push({
                field: 'nombres',
                message: 'El nombre no puede tener más de 50 caracteres'
            });
        }

        if (data.paterno && data.paterno.length > 50) {
            errores.push({
                field: 'paterno',
                message: 'El apellido paterno no puede tener más de 50 caracteres'
            });
        }

        if (data.materno && data.materno.length > 50) {
            errores.push({
                field: 'materno',
                message: 'El apellido materno no puede tener más de 50 caracteres'
            });
        }

        if (data.ci && data.ci.length > 12) {
            errores.push({
                field: 'ci',
                message: 'El carnet de identidad no puede tener más de 12 caracteres'
            });
        }

        if (data.correo && data.correo.length > 150) {
            errores.push({
                field: 'correo',
                message: 'El correo no puede tener más de 150 caracteres'
            });
        }

        if (data.celular && data.celular.length > 25) {
            errores.push({
                field: 'celular',
                message: 'El celular no puede tener más de 25 caracteres'
            });
        }

        if (data.usuario && data.usuario.length > 100) {
            errores.push({
                field: 'usuario',
                message: 'El usuario no puede tener más de 100 caracteres'
            });
        }

        // Validar existencia en BD (excluyendo el usuario actual)
        if (data.correo || data.usuario || data.ci) {
            const existentes = await usuariosRepository.validarExistenciaUsuario(
                data.correo || usuarioExistente.correo,
                data.usuario || usuarioExistente.usuario,
                data.ci !== undefined ? data.ci : usuarioExistente.ci,
                data.usuario_id
            );

            errores.push(...existentes.map(e => ({
                field: e.campo,
                message: e.mensaje
            })));
        }

        if (errores.length > 0) {
            return { usuario: null, errores };
        }

        const usuario = await usuariosRepository.actualizarUsuario(data, modificadoPor);
        return { usuario };
    }

    async eliminarUsuario(usuarioId: number, modificadoPor: number): Promise<boolean> {
        // Validar que el usuario existe
        const usuario = await this.getUsuario(usuarioId);
        if (!usuario) {
            return false;
        }

        return await usuariosRepository.eliminarUsuario(usuarioId, modificadoPor);
    }

    async resetPassword(usuarioId: number, modificadoPor: number): Promise<boolean> {
        // Validar que el usuario existe
        const usuario = await this.getUsuario(usuarioId);
        if (!usuario) {
            return false;
        }

        // Resetear password al CI o un valor por defecto
        const nuevaPassword = usuario.ci || '12345678';
        return await usuariosRepository.cambiarPassword(usuarioId, nuevaPassword, modificadoPor);
    }

}

export const usuariosService = new UsuariosService();