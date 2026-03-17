import { pool } from '../../../config/database';
import { RolUsu } from './roles.types';

export class RolesRepository {    

    async getRolesUsuario(): Promise<RolUsu[]> {
        const query = `
            SELECT DISTINCT r.rol_id, r.nombre, r.estado
            FROM autenticacion.roles r 
            WHERE r.estado = 1
        `;

        const result = await pool.query<RolUsu>(query);
        return result.rows;
    }

}

export const rolesRepository = new RolesRepository();