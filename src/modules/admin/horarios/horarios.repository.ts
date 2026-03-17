import { pool } from '../../../config/database';
import { HorarioTienda } from './horarios.types';

export class HorariosRepository {

    async getHorariosTiendas(): Promise<HorarioTienda[]> {
        const query = `
            SELECT DISTINCT h.horario_id, h.dia, h.estado
            FROM tiendas.horarios h  
            WHERE h.estado = 1
        `;

        const result = await pool.query<HorarioTienda>(query);
        return result.rows;
    }

    async getHorarioTienda(tiendaId: number): Promise<HorarioTienda[]> {
        const query = `
            SELECT DISTINCT h.horario_id, h.dia, h.estado
            FROM tiendas.tienda_horarios th 
            LEFT JOIN tiendas.horarios h  ON th.horario_id = h.horario_id AND h.estado = 1
            WHERE th.estado = 1 and th.tienda_id = $1
        `;

        const result = await pool.query<HorarioTienda>(query, [tiendaId]);
        return result.rows;
    }

}

export const horariosRepository = new HorariosRepository();


