import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkTokenCreateConfig, createConfig } from "../helpers/checkTokenCreateConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [alert, setAlert] = useState({});
    const [authProfile, setAuthProfile] = useState({});
    const [authProfileFollowersFollowing, setAuthProfileFollowersFollowing] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Se ejecutara una vez cada vez que entremos a la app web, si existe un token no expirado y valido en localStorage nos logueara automaticamente (ver AuthLayout.jsx) o no nos dejara entrar si no estamos identificados (ver HomeLayout.jsx)
    // Nos traera nuestro usuario para establecer auth (solo proprocionamos desde el backend: id, nick, token e imagen)
    useEffect(() => {
        const authUser = async () => {
            const config = checkTokenCreateConfig("GET");
            if (!config) {
                setLoading(false);
                return; 
            };
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, config); // Realizamos la solicitud
                const data = await response.json(); // Convertimos a JSON        
                setAuth(data); // Actualizamos el estado 
            } catch (error) {
                console.log(error);
                setAuth({}); // En caso de error, reseteamos el estado
            } finally{
                setLoading(false);
            };
        };       
        authUser(); // Llamamos a la funcion
    }, []);

    const login = async (values) => {
        try {
            const config = createConfig("POST");
            config.body = JSON.stringify(values);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, config );
            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(errorData.msg || "Error al iniciar sesión.");
            };
            const data = await response.json();
            localStorage.setItem("token", data.token); // Guardamos el token generado al hacer login en localStorage
            setAuth(data);
            navigate("/home"); // Redireccionamos 
        } catch (error) {
            console.log(error);
            setAlert({
                msg: error.message, // Usamos el mensaje del error lanzado o el mensaje por defecto
                error: true,
            });
            setTimeout(() => setAlert({}), 3000);
        };
    };

    const logout = () => { // Eliminaremos el token y vaciamos el estado de auth
        localStorage.removeItem('token');
        setAuth({});
    };

    const getAuthProfile = async id => {
        try {
            const config = checkTokenCreateConfig("GET");
            if (!config) return;  
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/userprofile/${id}`, config);
            const data = await response.json(); 
            setAuthProfile(data); 
        } catch (error) {
            console.log(error); 
        };
    };

    const getAuthProfileFollowersFollowing = async id => {
        try {
            const config = checkTokenCreateConfig("GET");
            if (!config) return; 
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/${id}`, config);
            const data = await response.json(); 
            setAuthProfileFollowersFollowing(data);
        } catch (error) {
            console.log(error);
        };
    };
    
    const createUser = async formValues => {
        try {
            const config = createConfig("POST");
            config.body = JSON.stringify(formValues);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, config);
            if (!response.ok) { // Verifica si el estado de la respuesta indica un error
                const errorData = await response.json(); //
                throw new Error(errorData.msg || "Error al crear el usuario."); // Lanza el mensaje de error del backend o un mensaje por defecto
            };
            const data = await response.json();
            setAlert({
                msg: `${data.msg}`,
                error: false,
            });
            setTimeout(() =>  setAlert({}), 3000);
            return data; // Devolvemos data para poder mostrar el codigo de usuario despues del registro
        } catch (error) {
            console.log(error);
            setAlert({
                msg: error.message, // Mostramos el mensaje de error del backen o el alternativo
                error: true,
            });
            setTimeout(() => setAlert({}), 3000);
        };
    };

    const updateUser = async (params, formData) => {
        try {
            const formPayload = new FormData();
            formPayload.append("nick", formData.nick);
            formPayload.append("description", formData.description);
            if (formData.image) formPayload.append("image", formData.image);           
            const token = localStorage.getItem("token");
            if (!token) return;
            const config = {
                method: 'PUT', 
                headers: {
                    // El navegador especifica automaticamente: 'Content-Type': 'multipart/form-data' por lo que no es necesario incluirlo
                    // Dejaremos que el navegador establezca el boundary ya qaue es necesario para el FormData y no podemos establecerlo manualmente al incluir un file
                    Authorization: `Bearer ${token}`,
                },
                body: formPayload // El cuerpo de la solicitud es el objeto FormData
            };
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/updateprofile/${params.id}`, config);
            if (!response.ok) {
                const errorData = await response.json(); // Obtenemos el cuerpo de la respuesta para extraer el mensaje de error
                throw new Error(errorData.msg || "Error al actualizar el perfil.");
            };       
            const data = await response.json();     
            const msg = data.msg;
            setAuth(data.result);
            setAlert({
                msg: `${msg}`,
                error: false,
            });
            setTimeout(() => {
                setAlert({}); // Limpiamos la alerta y redireccionamos
                navigate('/home')
            }, 3000);
        } catch (error) {
            console.log(error); 
            setAlert({
                msg: error.message || "Error al actualizar el perfil.",
                error: true,
            });
            setTimeout(() => setAlert({}), 3000);
        };
    };

    const changePassword = async values => {
        try {
            const config = createConfig("POST");
            config.body = JSON.stringify(values);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`, config);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Error al procesar la solicitud.");
            }
            const data = await response.json();
            setAlert({
                msg: data.msg, // Mostramos msg de exito del controlador
                error: false,
            });
            setTimeout(() => {
                setAlert({});
                navigate("/"); // Redireccionamos al login
            }, 3000);
        } catch (error) {
            console.log(error);
            setAlert({
                msg: error.message || "Error al procesar la solicitud.",
                error: true,
            });
            setTimeout(() => setAlert({}), 3000);
        };
    };

    const deleteUser = async id => {
        try {
            const config = checkTokenCreateConfig("DELETE");
            if (!config) return; 
            config.body = JSON.stringify({ id })
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/delete`, config);
            // Limpiamos los estados y localStorage tras la eliminacion del usuario
            logoutPosts() // Desde AppContext (estados de la app (posts, perfil, etc))
            logout() // Desde AuthContext (token de localstorage y auth)
        } catch (error) {
            console.log(error); 
        };
    };

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                alert,
                setAlert,
                login,
                logout,
                getAuthProfile,
                authProfile,
                setAuthProfile,
                getAuthProfileFollowersFollowing,
                authProfileFollowersFollowing,
                setAuthProfileFollowersFollowing,
                createUser,
                updateUser,
                changePassword,
                deleteUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};