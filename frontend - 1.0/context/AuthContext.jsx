import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [alert, setAlert] = useState({});

    const navigate = useNavigate();

    useEffect(() => { // Se ejecutara una vez cada vez que entremos a la app web, si existe un token no expirado y valido en localStorage nos logueara automaticamente
        const authUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
        
            // Configuración de la solicitud Fetch con los headers
            const config = {
                method: 'GET', // Método HTTP para la solicitud
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Incluimos el token
                }
            };
        
            try {
                // Realizar la solicitud
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, config);
                
                // Convertimos a JSON
                const data = await response.json();
        
                // Actualizamos el estado y redirigimos
                setAuth(data);
                navigate('/home');
            } catch (error) {
                console.log(error);
                setAuth({}); // En caso de error, reseteamos el estado
            };
        };       
        // Llamamos a la funcion
        authUser();
    }, []);

    const logout = () => { // Eliminaremos el token y vaciamos el estado de auth
        localStorage.removeItem('token');
        setAuth({});
    };

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                alert,
                setAlert,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
};