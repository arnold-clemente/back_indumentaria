export const homeService = (userId: number) => {

    return {

        message: "Bienvenido al Home",

        userId,

        fecha: new Date()

    };
};
