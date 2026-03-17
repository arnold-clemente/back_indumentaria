import { PaginationParams } from "../../../core/models/paginate.types";

// para la paginacion de lista 
export interface TiendaRow {
    tienda_id: number;
    nombre: string | null; // nullable en la BD
    descripcion: string;
    logo: string | null;
    direccion: string;
    celular: string | null;
    telefono: string | null;
    correo: string | null;
    propietario: string; // nombre completo del propietario
    estado: number; // estado de la tienda
}


export interface ListTiendasParams extends Partial<PaginationParams> {
    search?: string;
    estado?: number;
}

// para el usuario 
export interface Tienda {
    tienda_id: number;
    nombre: string;
    usuario_id: number;
    descripcion: string;
    logo?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    direccion: string;
    celular?: string | null;
    telefono?: string | null;
    correo?: string | null;
    creado_por: number;
    estado?: number;
    verificado?: number;
}

// Para creación/actualización de usuario
export interface CreateTiendaDto {
    nombre: string;
    usuario_id: number;
    descripcion: string;
    logo?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    direccion: string;
    celular?: string | null;
    telefono?: string | null;
    correo?: string | null;
    creado_por: number;
    estado?: number;
    verificado?: number;
}

export interface UpdateTiendaDto extends Partial<CreateTiendaDto> {
    usuario_id: number;
}

export interface TiendaConPassword extends Tienda {
    password: string | null;
}