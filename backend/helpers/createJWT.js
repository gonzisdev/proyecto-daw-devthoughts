import jwt  from "jsonwebtoken";

export const createJWT = id => {
    // Retorna un JWT usando sign de jwt
    // - Primer argumento: payload del JWT, en este caso un objeto con el id del usuario
    // - Segundo argumento: la clave secreta para firmar el token del .env
    // - Tercer argumento: opciones del token: expiracion en 30 dias
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};