import { HorarioTienda } from "./horarios.types";


export class RolesService {

    // CORRECCIÓN 1: Cambiar el tipo de retorno a Promise<RolUsu[]>
    async getRoles(): Promise<HorarioTienda[]> {

        const horarios = await rolesRepository.getRolesUsuario();
        return horarios || [];
    }

    async getRolById(rolId: number): Promise<HorarioTienda | null> {
        const horarios = await rolesRepository.getRolesUsuario();
        const rol = horarios.find(r => r.rol_id === rolId);
        return rol || null;
    }

}

export const rolesService = new RolesService();