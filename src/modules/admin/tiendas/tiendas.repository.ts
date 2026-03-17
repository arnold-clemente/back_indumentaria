import { pool } from '../../../config/database';
import { ListTiendasParams, TiendaRow } from './tiendas.types';

export class TiendasRepository {

    // repositories/tiendas.repository.ts
    async getTiendas(params: ListTiendasParams): Promise<{
        data: TiendaRow[];
        total: number;
    }> {
        const {
            page = 1,
            limit = 10,
            sortBy = 't.tienda_id',
            sortOrder = 'ASC',
            search,
            estado = 1
        } = params;

        const offset = (page - 1) * limit;

        // Mapeo correcto de columnas para ordenamiento
        const columnMap: Record<string, string> = {
            tienda_id: 't.tienda_id',
            nombre: 't.nombre',
            descripcion: 't.descripcion',
            direccion: 't.direccion',
            celular: 't.celular',
            telefono: 't.telefono',
            correo: 't.correo',
            propietario: 'propietario', // para ordenar por nombre del propietario
            estado: 't.estado'
        };

        const sanitizedSortBy = columnMap[sortBy] || 't.tienda_id';
        const sanitizedSortOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';

        let query = `
        SELECT 
            t.tienda_id, 
            t.nombre, 
            t.descripcion, 
            t.logo, 
            t.direccion, 
            t.celular, 
            t.telefono, 
            t.correo,
            t.estado,
            TRIM(CONCAT_WS(' ', u.nombres, u.paterno, u.materno)) as propietario,
            COUNT(*) OVER() as total_count
        FROM tiendas.tiendas t
        LEFT JOIN autenticacion.usuarios u ON t.usuario_id = u.usuario_id
        WHERE 1=1
    `;

        const queryParams: any[] = [];
        let paramIndex = 1;

        // Filtro por estado de la tienda
        if (estado !== undefined) {
            query += ` AND t.estado = $${paramIndex}`;
            queryParams.push(estado);
            paramIndex++;
        }

        // Búsqueda por texto
        if (search) {
            query += ` AND (
            t.nombre ILIKE $${paramIndex} OR 
            t.descripcion ILIKE $${paramIndex} OR 
            t.direccion ILIKE $${paramIndex} OR 
            t.correo ILIKE $${paramIndex} OR 
            t.celular ILIKE $${paramIndex} OR 
            t.telefono ILIKE $${paramIndex} OR
            u.nombres ILIKE $${paramIndex} OR 
            u.paterno ILIKE $${paramIndex} OR 
            u.materno ILIKE $${paramIndex}
        )`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY ${sanitizedSortBy} ${sanitizedSortOrder}`;
        query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

        queryParams.push(limit, offset);

        const result = await pool.query(query, queryParams);

        const total = result.rows.length > 0
            ? Number(result.rows[0].total_count)
            : 0;

        const data = result.rows.map(({ total_count, ...rest }) => rest);

        return { data, total };
    }

    // async getUsuario(usuarioId: number): Promise<Usuario | null> {
    //     const query = `
    //         SELECT 
    //             u.usuario_id,
    //             u.nombres,
    //             u.paterno,
    //             u.materno,
    //             u.ci,
    //             u.correo,
    //             u.avatar_url,
    //             u.celular,
    //             u.estado,
    //             u.usuario,
    //             u.rol_id,
    //             r.nombre as rol_nombre,
    //             u.fecha_creacion,
    //             u.fecha_modificacion,
    //             u.creado_por,
    //             u.modificado_por
    //         FROM autenticacion.usuarios u
    //         LEFT JOIN autenticacion.roles r ON u.rol_id = r.rol_id
    //         WHERE u.usuario_id = $1 AND u.estado = 1
    //     `;

    //     const result = await pool.query<Usuario>(query, [usuarioId]);
    //     return result.rows[0] || null;
    // }

    // async getUsuarioByCorreo(correo: string): Promise<UsuarioConPassword | null> {
    //     const query = `
    //         SELECT 
    //             u.*,
    //             r.nombre as rol_nombre
    //         FROM autenticacion.usuarios u
    //         LEFT JOIN autenticacion.roles r ON u.rol_id = r.rol_id
    //         WHERE u.correo = $1
    //     `;

    //     const result = await pool.query(query, [correo]);
    //     return result.rows[0] || null;
    // }

    // async getUsuarioByUsuario(usuario: string): Promise<UsuarioConPassword | null> {
    //     const query = `
    //         SELECT 
    //             u.*,
    //             r.nombre as rol_nombre
    //         FROM autenticacion.usuarios u
    //         LEFT JOIN autenticacion.roles r ON u.rol_id = r.rol_id
    //         WHERE u.usuario = $1
    //     `;

    //     const result = await pool.query(query, [usuario]);
    //     return result.rows[0] || null;
    // }

    // async getUsuarioByCi(ci: string): Promise<UsuarioConPassword | null> {
    //     const query = `
    //         SELECT 
    //             u.*,
    //             r.nombre as rol_nombre
    //         FROM autenticacion.usuarios u
    //         LEFT JOIN autenticacion.roles r ON u.rol_id = r.rol_id
    //         WHERE u.ci = $1
    //     `;

    //     const result = await pool.query(query, [ci]);
    //     return result.rows[0] || null;
    // }
    // async crearUsuario(
    //     data: CreateUsuarioDto,
    //     creadoPor: number
    // ): Promise<Usuario> {
    //     const client = await pool.connect();

    //     try {
    //         await client.query('BEGIN');

    //         // Generar password por defecto (ejemplo: CI o un valor por defecto)
    //         const defaultPassword = data.ci || '12345678';
    //         const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    //         const query = `
    //             INSERT INTO autenticacion.usuarios (
    //                 nombres, paterno, materno, ci, correo, celular,
    //                 usuario, rol_id, estado, creado_por, modificado_por,
    //                 password, avatar_url, fecha_creacion, fecha_modificacion
    //             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    //             RETURNING *
    //         `;

    //         const values = [
    //             data.nombres,
    //             data.paterno,
    //             data.materno,
    //             data.ci,
    //             data.correo,
    //             data.celular,
    //             data.usuario,
    //             data.rol_id,
    //             data.estado || 1,
    //             creadoPor,
    //             creadoPor,
    //             hashedPassword,
    //             data.avatar ? `/perfiles/${data.avatar.filename}` : `perfiles/10.jpg`
    //         ];

    //         const result = await client.query(query, values);

    //         await client.query('COMMIT');

    //         const { password, ...usuario } = result.rows[0];
    //         return usuario;

    //     } catch (error) {
    //         await client.query('ROLLBACK');
    //         throw error;
    //     } finally {
    //         client.release();
    //     }
    // }

    // async actualizarUsuario(
    //     data: UpdateUsuarioDto,
    //     modificadoPor: number
    // ): Promise<Usuario | null> {
    //     const client = await pool.connect();

    //     try {
    //         await client.query('BEGIN');

    //         const setClauses: string[] = [];
    //         const values: any[] = [];
    //         let paramIndex = 1;

    //         // Construir dinámicamente las cláusulas SET
    //         if (data.nombres !== undefined) {
    //             setClauses.push(`nombres = $${paramIndex++}`);
    //             values.push(data.nombres);
    //         }
    //         if (data.paterno !== undefined) {
    //             setClauses.push(`paterno = $${paramIndex++}`);
    //             values.push(data.paterno);
    //         }
    //         if (data.materno !== undefined) {
    //             setClauses.push(`materno = $${paramIndex++}`);
    //             values.push(data.materno);
    //         }
    //         if (data.ci !== undefined) {
    //             setClauses.push(`ci = $${paramIndex++}`);
    //             values.push(data.ci);
    //         }
    //         if (data.correo !== undefined) {
    //             setClauses.push(`correo = $${paramIndex++}`);
    //             values.push(data.correo);
    //         }
    //         if (data.celular !== undefined) {
    //             setClauses.push(`celular = $${paramIndex++}`);
    //             values.push(data.celular);
    //         }
    //         if (data.usuario !== undefined) {
    //             setClauses.push(`usuario = $${paramIndex++}`);
    //             values.push(data.usuario);
    //         }
    //         if (data.rol_id !== undefined) {
    //             setClauses.push(`rol_id = $${paramIndex++}`);
    //             values.push(data.rol_id);
    //         }
    //         if (data.estado !== undefined) {
    //             setClauses.push(`estado = $${paramIndex++}`);
    //             values.push(data.estado);
    //         }
    //         if (data.avatar) {
    //             setClauses.push(`avatar_url = $${paramIndex++}`);
    //             values.push(`/perfiles/${data.avatar.filename}`);
    //         }

    //         setClauses.push(`fecha_modificacion = NOW()`);
    //         setClauses.push(`modificado_por = $${paramIndex++}`);
    //         values.push(modificadoPor);

    //         if (setClauses.length === 0) {
    //             return await this.getUsuario(data.usuario_id);
    //         }

    //         const query = `
    //             UPDATE autenticacion.usuarios
    //             SET ${setClauses.join(', ')}
    //             WHERE usuario_id = $${paramIndex}
    //             RETURNING *
    //         `;

    //         values.push(data.usuario_id);

    //         const result = await client.query(query, values);

    //         await client.query('COMMIT');

    //         if (result.rows.length === 0) {
    //             return null;
    //         }

    //         const { password, ...usuario } = result.rows[0];

    //         // Obtener el nombre del rol
    //         const usuarioConRol = await this.getUsuario(data.usuario_id);
    //         return usuarioConRol;

    //     } catch (error) {
    //         await client.query('ROLLBACK');
    //         throw error;
    //     } finally {
    //         client.release();
    //     }
    // }

    // async eliminarUsuario(usuarioId: number, modificadoPor: number): Promise<boolean> {
    //     const query = `
    //         UPDATE autenticacion.usuarios
    //         SET estado = 0, 
    //             fecha_modificacion = NOW(),
    //             modificado_por = $2
    //         WHERE usuario_id = $1
    //         RETURNING usuario_id
    //     `;

    //     const result = await pool.query(query, [usuarioId, modificadoPor]);
    //     return result.rowCount !== null && result.rowCount > 0;
    // }

    // async cambiarPassword(
    //     usuarioId: number,
    //     nuevaPassword: string,
    //     modificadoPor: number
    // ): Promise<boolean> {
    //     const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    //     const query = `
    //         UPDATE autenticacion.usuarios
    //         SET password = $2,
    //             fecha_modificacion = NOW(),
    //             modificado_por = $3
    //         WHERE usuario_id = $1
    //         RETURNING usuario_id
    //     `;

    //     const result = await pool.query(query, [usuarioId, hashedPassword, modificadoPor]);
    //     return result.rowCount !== null && result.rowCount > 0;
    // }

    // async validarExistenciaUsuario(
    //     correo: string,
    //     usuario: string,
    //     ci?: string | null,
    //     usuarioId?: number
    // ): Promise<{ campo: string; mensaje: string }[]> {
    //     const errores: { campo: string; mensaje: string }[] = [];

    //     // Verificar correo
    //     const correoQuery = `
    //         SELECT usuario_id FROM autenticacion.usuarios 
    //         WHERE correo = $1 ${usuarioId ? 'AND usuario_id != $2' : ''}
    //     `;
    //     const correoParams = usuarioId ? [correo, usuarioId] : [correo];
    //     const correoResult = await pool.query(correoQuery, correoParams);

    //     if (correoResult.rows.length > 0) {
    //         errores.push({
    //             campo: 'correo',
    //             mensaje: 'El correo electrónico ya está registrado'
    //         });
    //     }

    //     // Verificar usuario
    //     const usuarioQuery = `
    //         SELECT usuario_id FROM autenticacion.usuarios 
    //         WHERE usuario = $1 ${usuarioId ? 'AND usuario_id != $2' : ''}
    //     `;
    //     const usuarioParams = usuarioId ? [usuario, usuarioId] : [usuario];
    //     const usuarioResult = await pool.query(usuarioQuery, usuarioParams);

    //     if (usuarioResult.rows.length > 0) {
    //         errores.push({
    //             campo: 'usuario',
    //             mensaje: 'El nombre de usuario ya está en uso'
    //         });
    //     }

    //     // Verificar CI si se proporciona
    //     if (ci) {
    //         const ciQuery = `
    //             SELECT usuario_id FROM autenticacion.usuarios 
    //             WHERE ci = $1 ${usuarioId ? 'AND usuario_id != $2' : ''}
    //         `;
    //         const ciParams = usuarioId ? [ci, usuarioId] : [ci];
    //         const ciResult = await pool.query(ciQuery, ciParams);

    //         if (ciResult.rows.length > 0) {
    //             errores.push({
    //                 campo: 'ci',
    //                 mensaje: 'El carnet de identidad ya está registrado'
    //             });
    //         }
    //     }

    //     return errores;
    // }

}

export const tiendasRepository = new TiendasRepository();