import jwt from 'jsonwebtoken';
import { User }from '../models/User.js';

export const checkAuth = async (req, res, next) => {
    // Variable donde almacenamos el token JWT de los encabezados de la solicitud
    let token;
    // Verificamos si existe un encabezado authorization y que comienze con Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraemos el token y eliminamos la parte de Bearer
            token = req.headers.authorization.split(' ')[1];
            // Decodificamos el token usando la clave secreta del .env para ver si es valido
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Buscamos al usuario en la BBDD
            req.user = await User.getUserById(decoded.id);
            // Si el token es valido y el usuario existe saltamos al siguiente middleware
            return next();
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'});
        };
    };
    // Si el token no existe mandamos un mensaje de error
    if (!token) {
        const error = new Error('Token no válido');
        return res.status(401).json({msg: error.message});
    };  
    next();
};
