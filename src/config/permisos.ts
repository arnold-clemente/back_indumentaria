// config/permisos.ts

// Organizar por módulos
export const permisos = {
     INICIO: {
        BIENVENIDA: 'inicio',
    },
    USUARIO: {
        LIST: 'usuario.list',
        CREATE: 'usuario.create',
        EDIT: 'usuario.edit',
        DELETE: 'usuario.delete',
        PASSWORD: 'usuario.password',
    },
    ROL: {
        LIST: 'rol.list',
        CREATE: 'rol.create',
        EDIT: 'rol.edit',
        DELETE: 'rol.delete',
        ASIGNAR: 'rol.asignar',
    },
    TIENDA: {
        LIST: 'tienda.list',
        CREATE: 'tienda.create',
        EDIT: 'tienda.edit',
        DELETE: 'tienda.delete',
    },
    
} as const;

// Helper para obtener todos los permisos como array
export const todosLosPermisos = Object.values(permisos).flatMap(
    modulo => Object.values(modulo)
);

// Tipo para TypeScript
export type Permiso = typeof todosLosPermisos[number];