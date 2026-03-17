export interface RegisterDTO {

    nombres: string;
    paterno: string;
    materno?: string;

    ci: string;

    correo: string;

    usuario: string;

    password: string;

    celular?: string;
}

export interface LoginDTO {

    login: string; // correo o usuario

    password: string;
}
