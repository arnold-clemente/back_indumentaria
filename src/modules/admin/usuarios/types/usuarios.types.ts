import { PaginationParams } from "../../../../core/models/paginate.types";

// para la paginacion de lista 
export interface UsuarioRow {
    usuario_id: number;
    nombre_completo: string;
    ci: string;
    correo: string;
    avatar_url: string | null;
    usuario: string;
    rol: string;
    estado: number;
}


export interface ListUsuariosParams extends Partial<PaginationParams> {
    search?: string;
    estado?: number;
}

// para el usuario 
export interface Usuario {
    usuario_id: number;
    nombres: string | null;
    paterno: string | null;
    materno: string | null;
    ci: string | null;
    correo: string;
    avatar_url: string | null;
    celular: string | null;
    estado: number;
    usuario: string;
    rol_id: number;
    rol_nombre: string;
    fecha_creacion: Date;
    fecha_modificacion: Date | null;
    creado_por: number;
    modificado_por: number;
}

// Para creación/actualización de usuario
export interface CreateUsuarioDto {
    nombres: string | null;
    paterno: string | null;
    materno: string | null;
    ci: string | null;
    correo: string;
    celular: string | null;
    usuario: string;
    rol_id: number;
    estado?: number;
    avatar?: Express.Multer.File | null;
}

export interface UpdateUsuarioDto extends Partial<CreateUsuarioDto> {
    usuario_id: number;
}

export interface UsuarioConPassword extends Usuario {
    password: string | null;
}