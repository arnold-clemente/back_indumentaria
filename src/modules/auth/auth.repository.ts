import { pool } from '../../config/database';

interface PermisoRow {
    nombre: string;
}

interface RolRow {
    nombre: string;
}

export const findUserByLogin = async (login: string) => {

    const query = `
        SELECT *
        FROM autenticacion.usuarios
        WHERE (correo = $1 OR usuario = $1)
        AND estado = 1
    `;

    const result = await pool.query(query, [login]);

    return result.rows[0];
};

export const findUserByEmail = async (correo: string) => {

    const query = `
        SELECT *
        FROM autenticacion.usuarios
        WHERE correo = $1
    `;

    const result = await pool.query(query, [correo]);

    return result.rows[0];
};

export const findUserByUsuario = async (usuario: string) => {

    const query = `
        SELECT *
        FROM autenticacion.usuarios
        WHERE usuario = $1
    `;

    const result = await pool.query(query, [usuario]);

    return result.rows[0];
};

export const createUser = async (user: any) => {

    const query = `
        INSERT INTO autenticacion.usuarios
        (
            nombres,
            paterno,
            materno,
            ci,
            correo,
            password,
            usuario,
            celular,
            creado_por,
            modificado_por
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING usuario_id, correo, usuario, nombres
    `;

    const values = [
        user.nombres,
        user.paterno,
        user.materno,
        user.ci,
        user.correo,
        user.password,
        user.usuario,
        user.celular,
        1,
        1
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


export const findUserByRoles = async (usuarioId: any) => {

    const query = `
        SELECT DISTINCT r.nombre
        FROM autenticacion.usuarios ur 
        LEFT JOIN autenticacion.roles r ON ur.rol_id = r.rol_id 
        WHERE (ur.usuario_id = $1) AND ur.estado = 1 AND r.estado = 1
    `;
    const result = await pool.query<RolRow>(query, [usuarioId]);

    return result.rows.map(row => row.nombre);
};


export const findUserByPermisos = async (usuarioId: number): Promise<string[]> => {
    const query = `
        SELECT DISTINCT p.nombre
        FROM autenticacion.usuarios ur 
        LEFT JOIN autenticacion.roles r ON ur.rol_id = r.rol_id AND r.estado = 1
        LEFT JOIN autenticacion.rol_permiso rp ON r.rol_id = rp.rol_id AND rp.estado = 1
        LEFT JOIN autenticacion.permisos p ON rp.permiso_id = p.permiso_id AND p.estado = 1
        WHERE (ur.usuario_id = $1) AND ur.estado = 1
    `;

    const result = await pool.query<PermisoRow>(query, [usuarioId]);

    return result.rows.map(row => row.nombre);
};
