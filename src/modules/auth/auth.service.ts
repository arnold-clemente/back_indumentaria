import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

import {
    findUserByLogin,
    findUserByEmail,
    findUserByUsuario,
    createUser,
    findUserByRoles,
    findUserByPermisos
} from './auth.repository';

import { RegisterDTO, LoginDTO } from './auth.types';

const JWT_SECRET = env.JWT_SECRET;

export const registerService = async (data: RegisterDTO) => {

    // Validaciones obligatorias

    if (!data.ci)
        throw new Error("CI es obligatorio");

    if (!data.correo)
        throw new Error("Correo es obligatorio");

    if (!data.usuario)
        throw new Error("Usuario es obligatorio");

    if (!data.password)
        throw new Error("Password es obligatorio");


    // verificar correo

    const existingEmail = await findUserByEmail(data.correo);

    if (existingEmail)
        throw new Error("El correo ya existe");


    // verificar usuario

    const existingUsuario = await findUserByUsuario(data.usuario);

    if (existingUsuario)
        throw new Error("El usuario ya existe");


    // hash password

    const hashedPassword = await bcrypt.hash(data.password, 10);


    // crear usuario

    const user = await createUser({
        ...data,
        password: hashedPassword
    });


    // generar token

    const token = jwt.sign(
        { userId: user.usuario_id },
        JWT_SECRET,
        { expiresIn: '8h' }
    );


    return {
        user,
        token
    };
};


export const loginService = async (data: LoginDTO) => {

    if (!data.login)
        throw new Error("Correo o usuario es requerido");

    if (!data.password)
        throw new Error("Password es requerido");


    const user = await findUserByLogin(data.login);


    if (!user)
        throw new Error("Usuario no encontrado");


    const validPassword = await bcrypt.compare(
        data.password,
        user.password
    );


    if (!validPassword)
        throw new Error("Password incorrecto");


    const token = jwt.sign(
        { userId: user.usuario_id },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    const roles = await findUserByRoles(user.usuario_id);
    const permisos = await findUserByPermisos(user.usuario_id);


    return {

        user: {
            usuario_id: user.usuario_id,
            nombres: user.nombres,
            correo: user.correo,
            usuario: user.usuario,
            ci: user.ci,
            avatar_url: user.avatar_url
        },
        roles,
        permisos,
        token
    };
};
