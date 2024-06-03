// Configuramos CORS  para controlar desde qué dominios
// se pueden hacer peticiones. Se utiliza una lista blanca para permitir
// solicitudes solo desde los origenes especificados
export const corsOptions = {
    origin: function(origin, callback){
        const whitelist = [process.env.FRONTEND_URL];
        if(!origin || whitelist.includes(origin)){
            // Si el origen de la solicitud esta permitido, se permite el acceso a la API
            callback(null, true);
        }else{
            // Si el origen no esta permitido, se rechaza la solicitud con un error de CORS
            callback(new Error('Error de CORS'));
        };  
    }
};