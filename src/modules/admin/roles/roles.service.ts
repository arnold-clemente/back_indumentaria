import { rolesRepository } from './roles.repository';
import { RolUsu } from './roles.types';

export class RolesService {

    // CORRECCIÓN 1: Cambiar el tipo de retorno a Promise<RolUsu[]>
    async getRoles(): Promise<RolUsu[]> {

        const roles = await rolesRepository.getRolesUsuario();
        return roles || [];
    }

    async getRolById(rolId: number): Promise<RolUsu | null> {
        const roles = await rolesRepository.getRolesUsuario();
        const rol = roles.find(r => r.rol_id === rolId);
        return rol || null;
    }

}

export const rolesService = new RolesService();