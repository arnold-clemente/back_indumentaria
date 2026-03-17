import { horariosRepository } from "./horarios.repository";
import { HorarioTienda } from "./horarios.types";


export class HorariosService {

    async getHorarios(): Promise<HorarioTienda[]> {

        const horarios = await horariosRepository.getHorariosTiendas();
        return horarios || [];
    }

    async getHorariosTienda(horarioId: number): Promise<HorarioTienda[]> {
        const horarios = await horariosRepository.getHorarioTienda(horarioId);
        return horarios || [];
    }

}

export const horariosService = new HorariosService();