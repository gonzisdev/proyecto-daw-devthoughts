// Funciones helpers reutilizables para verificar la existencia de un token y crear la configuracion de la peticion
export const checkTokenCreateConfig = method => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    return {
        method: method, 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };
};

// Funcion helper para crear la configuracion de la peticion cuando no necesitamos un token
export const createConfig = method => {
    return {
        method: method, 
        headers: {
            "Content-Type": "application/json",
        }
    };
};