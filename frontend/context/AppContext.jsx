import { useState, useEffect, createContext } from "react";
import { useAuth }from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { checkTokenCreateConfig } from "../helpers/checkTokenCreateConfig";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [followingPosts, setFollowingPosts] = useState([]);

    const [profile, setProfile] = useState({});
    const [profilePosts, setProfilePosts] = useState([]);
    const [profileFollowersFollowing, setProfileFollowersFollowing] = useState({});

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const { auth, setAlert, setAuthProfileFollowersFollowing, setAuthProfile, getAuthProfileFollowersFollowing, getAuthProfile } = useAuth();
    const navigate = useNavigate();
    
    // Centralizamos las peticiones y los estados de nuestra app en un context para poder servirlas a las diferentes paginas y componentes 
    // Todas las peticiones al backend una vez logueados, estan protegidas via middleware con un JWT y validadas en front y back
    const getPosts = async (page = 1) => {
        try {
            const config = checkTokenCreateConfig("GET");
            if (!config) return; 
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts?page=${page}`, config);
            const data = await response.json(); // Convertimos a json
            page === 1 ? setPosts(data.posts) : setPosts((prevPosts) => [...prevPosts, ...data.posts]); // En las nuevas peticions del scroll infinito, añadimos los resultados al state con spread operator
        } catch (error) {
            console.log(error);
        };
    };

    const getPost = async id => {
        try {
            const config = checkTokenCreateConfig("GET");
            if (!config) return; 
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/post/${id}`, config);
            const data = await response.json(); 
            setPost(data);
        } catch (error) {
            console.log(error);
        };
    };

    const getLikedPosts = async (page = 1) => {
        try {
            const config = checkTokenCreateConfig("POST");
            if (!config) return; 
            config.body = JSON.stringify({ page }); // Convertimos el objeto con la página a string JSON
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/liked`, config);
            const data = await response.json(); 
            page === 1 ? setLikedPosts(data) : setLikedPosts(prevPosts => [...prevPosts, ...data]); // Usamos el spread operator para actualizar el estado con los resultados
        } catch (error) {
            console.log(error);
        };
    };

    const getFollowingPosts = async (page = 1) => {
        try {
            const config = checkTokenCreateConfig("POST");
            if (!config) return; 
            config.body = JSON.stringify({ page });
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/following-posts`, config);
            const data = await response.json();    
            page === 1 ? setFollowingPosts(data) : setFollowingPosts(prevPosts => [...prevPosts, ...data]); // Usamos el spread operator para actualizar el estado con los resultados
        } catch (error) {
            console.log(error);
        };
    };

    const getProfile = async id => {
        try {
            const config = checkTokenCreateConfig("GET");
            if (!config) return; 
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/userprofile/${id}`, config);
            const data = await response.json();   
            setProfile(data);
        } catch (error) {
            console.log(error);
        };
    };

    const getProfilePosts = async (id, page = 1) => {
        try {
            const config = checkTokenCreateConfig("POST");
            if (!config) return; 
            config.body = JSON.stringify({ id, page });
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/profile-posts`, config);
            const data = await response.json();    
            page === 1 ? setProfilePosts(data) : setProfilePosts(prevPosts => [...prevPosts, ...data]); // Usamos el spread operator para actualizar el array de posts del perfil
        } catch (error) {
            console.log(error);
        };
    };

    const getProfileFollowersFollowing = async id => {
        try {
            const config = checkTokenCreateConfig("GET");
            if (!config) return; 
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/${id}`, config);
            const data = await response.json();     
            setProfileFollowersFollowing(data); // Actualizamos el estado con los datos de la respuesta
        } catch (error) {
            console.log(error); 
        };
    };

    const getFollowing = async id => {
        try {
            const config = checkTokenCreateConfig("GET");
            if (!config) return; 
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/following/${id}`, config);
            const data = await response.json(); 
            setFollowing(data);
        } catch (error) {
            console.log(error); 
        };
    };

    const getFollowers = async id => {
        try {
            const config = checkTokenCreateConfig("GET");
            if (!config) return; 
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/followers/${id}`, config);
            const data = await response.json(); 
            setFollowers(data);
        } catch (error) {
            console.log(error); 
        };
    };
    
    const createPost = async values => {
        try {
            const config = checkTokenCreateConfig("POST");
            if (!config) return; 
            config.body = JSON.stringify(values);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, config);
            const data = await response.json();
            setPosts([data, ...posts]); // Actualizamos el estado con el nuevo post con el spread operator y actualizamos los post del perfil y la seccion de me gustan
            getLikedPosts();
            auth.id && getProfilePosts(auth.id); 
            const msg = "Thought publicado correctamente"; // Definimos un mensaje de exito para la alerta
            setAlert({
                msg: `${msg}`,
                error: false,
            });
            setTimeout(() => {
                setAlert({});
                navigate("/home"); // Redireccionamos en tres segundos
            }, 3000);
        } catch (error) {
            console.log(error);
            setAlert({
                msg: error.message || "Error al publicar el post.", // Mostramos alerta con el error
                error: true,
            });
            setTimeout(() => setAlert({}), 3000);
        };
    };

    const removePost = async id => {
        try {
            const config = checkTokenCreateConfig("DELETE");
            if (!config) return; 
            config.body = JSON.stringify({ id });
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/delete`, config);  
            // Actualizamos el estado para reflejar la eliminación del post con filter y nos traemos todos los post diferentes al borrado
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
            setPost({});
            getLikedPosts();
            getFollowingPosts();
            auth.id && getProfilePosts(auth.id); 
        } catch (error) {
            console.log(error); 
        };
    };

    const addComment = async (params, comment) =>{
        try {
            const config = checkTokenCreateConfig("POST");
            if (!config) return; 
			const values = { post_id: parseInt(params.id), comment };
		    config.body = JSON.stringify(values);
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments`, config);
			if (!response.ok) throw new Error("Hubo un problema al enviar el comentario");
			await getPost(params.id);
			setAlert({
				msg: "Respuesta publicada correctamente",
				error: false,
			});
			setTimeout(() => setAlert({}), 3000);
		} catch (error) {
			setAlert({
				msg: error.message || "Error al publicar el comentario",
				error: true,
			});
		}
    };

    const removeComment = async id => {
        try {
            const config = checkTokenCreateConfig("DELETE");
            if (!config) return; 
            config.body = JSON.stringify({ id });
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/delete`, config);
			const responseData = await response.json();
			setAlert({
				msg: responseData.msg, // Utilizamos responseData.msg para obtener el mensaje del servidor
				error: false,
			});
			setTimeout(() => setAlert({}), 3000);
		} catch (error) {
			console.log(error);
		};
    };

    // Cuando haya cambios en los likes mapearemos y devolveremos un nuevo estado con los posts actualizados, usaremos map para evitar mutation
    const updatePostWithLikes = updatedPost => setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    
    const addLike = async id => {
        try {
            const config = checkTokenCreateConfig("POST");
            if (!config) return; 
            config.body = JSON.stringify({ post_id: id });
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes`, config);
            const data = await response.json(); 
            // Actualizamos los estados
            updatePostWithLikes(data);
            getLikedPosts();
            getFollowingPosts();
            getPost(id);
            auth.id && getProfilePosts(auth.id);
        } catch (error) {
            console.log(error); 
        };
    };

    const removeLike = async id => {
        try {
            const config = checkTokenCreateConfig("DELETE");
            if (!config) return; 
            config.body = JSON.stringify({ post_id: id });
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes/delete`, config);
            const data = await response.json(); 
            updatePostWithLikes(data);
            getLikedPosts();
            getFollowingPosts();
            getPost(id);
            auth.id && getProfilePosts(auth.id);
        } catch (error) {
            console.log(error); 
        };
    };

    const follow = async id => {
        try {
            const config = checkTokenCreateConfig("POST");
            if (!config) return; 
            config.body = JSON.stringify({ id });
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/follow`, config);      
            // Distinguimos entre authProfile y profile para evitar incoherencias y errores en los estados a la hora de la interaccion entre usuario autenticado perfil propio o perfil otro usuario
            getProfileFollowersFollowing(id); // Actualizamos seguidores y seguidos del perfil objetivo
            if (auth.id !== id) { // Comprobamos para evitar llamadas innecesarias si el id es el mismo que el del usuario autenticado
                getAuthProfileFollowersFollowing(auth.id); // Actualizamos seguidores y seguidos y el perfil del usuario autenticado, si es diferente
                getAuthProfile(auth.id);
            };
            getProfile(id); // Actualizamos el perfil objetivo
            getFollowingPosts(); // Actualizamos los posts de los usuarios seguidos
        } catch (error) {
            console.log(error); 
        };
    };

    const unfollow = async id => {
        try {
            const config = checkTokenCreateConfig("DELETE");
            if (!config) return; 
            config.body = JSON.stringify({ id });
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/unfollow`, config);
            getProfileFollowersFollowing(id); 
            if (auth.id !== id) { 
                getAuthProfileFollowersFollowing(auth.id); 
                getAuthProfile(auth.id);
            };
            getProfile(id); 
            getFollowingPosts();
        } catch (error) {
            console.log(error); 
        };
    };

    // Cada vez que auth cambie haremos las siguientes llamadas para tener estados precargados en diferentes paginas
    useEffect(() => { 
        getPosts();
        getLikedPosts();
        getFollowingPosts();
        getProfilePosts(auth.id);
    }, [auth]);

    // Limpiamos todos los estados al hacer logout. En AuthContext cerramos sesion y limpiamos localStorage con el metodo Logout. 
    // Tanto logoutPosts como Logout llaman desde Header.jsx y al eliminar cuenta en EditProfile.jsx
    const logoutPosts = () => {
        setPosts([]);
        setPost({});
        setLikedPosts([]);
        setFollowingPosts([]);
        setProfilePosts([]);
        setProfileFollowersFollowing({});
        setAuthProfileFollowersFollowing({});
        setProfile({});
        setAuthProfile({});
        setFollowing([]);
        setFollowers([]);
    };

    return (
        <AppContext.Provider
            value={{
                posts,
                setPosts,
                getPosts,
                post,
                getPost,
                createPost,
                removePost,
                addComment,
                removeComment,
                addLike,
                removeLike,
                followingPosts,
                getFollowingPosts, 
                getProfile,
                profile,
                likedPosts,
                getLikedPosts,
                profilePosts,
                getProfilePosts,
                profileFollowersFollowing,
                getProfileFollowersFollowing,
                following,
                getFollowing,
                followers,
                getFollowers,
                follow,
                unfollow,
                logoutPosts
            }}
        >
            {children}
        </AppContext.Provider>
    );
};