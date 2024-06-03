import { useState, useEffect, createContext } from "react";
import { useAuth }from "../hooks/useAuth";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followingPosts, setFollowingPosts] = useState([]);
    const [profilePosts, setProfilePosts] = useState([]);
    const [profile, setProfile] = useState({});
    const [authProfile, setAuthProfile] = useState({});
    const [profileFollowersFollowing, setProfileFollowersFollowing] = useState({});
    const [authProfileFollowersFollowing, setAuthProfileFollowersFollowing] = useState({});

    const { auth, setAuth } = useAuth();
    
    // Centralizamos las peticiones y los estados de nuestra app en un context para poder servirlas a las diferentes paginas y componentes 
    // Todas las peticiones al backend una vez logueados, estan protegidas via middleware con un JWT y validadas en el front y back
    const getPosts = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return; // Si no hay token, impedimos la peticion
    
            const config = {
                method: 'GET', // Metodo HTTP
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Incluimos el token
                }
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts?page=${page}`, config);
            const data = await response.json(); // Convertimos a json
    
            if (page === 1) {
                setPosts(data.posts);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...data.posts]); // En las nuevas peticions del scroll infinito, añadimos los resultados al state con spread operator
            };
        } catch (error) {
            console.log(error);
        };
    };

    const getPost = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/post/${id}`, config);
            const data = await response.json(); 
    
            setPost(data);
        } catch (error) {
            console.log(error);
        };
    };

    const getLikedPosts = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ page }) // Convertimos el objeto con la página a string JSON
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/liked`, config);
            const data = await response.json(); 
    
            if (page === 1) {
                setLikedPosts(data);
            } else {
                setLikedPosts(prevPosts => [...prevPosts, ...data]); // Usamos el spread operator para actualizar el estado con los resultados
            };
        } catch (error) {
            console.log(error);
        };
    };

    const getFollowingPosts = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ page })
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/following-posts`, config);
            const data = await response.json(); 
    
            if (page === 1) {
                setFollowingPosts(data);
            } else {
                setFollowingPosts(prevPosts => [...prevPosts, ...data]); // Usamos el spread operator para actualizar el estado con los resultados
            };
        } catch (error) {
            console.log(error);
        };
    };

    const getProfile = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/userprofile/${id}`, config);
            const data = await response.json(); 
    
            setProfile(data);
        } catch (error) {
            console.log(error);
        };
    };

    const getAuthProfile = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const config = {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/userprofile/${id}`, config);
            const data = await response.json(); 

            setAuthProfile(data); 
        } catch (error) {
            console.log(error); 
        };
    };

    const getProfilePosts = async (id, page = 1) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const config = {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id, page })
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/profile-posts`, config);
            const data = await response.json(); 
    
            if (page === 1) {
                setProfilePosts(data); 
            } else {
                setProfilePosts(prevPosts => [...prevPosts, ...data]); // Usamos el spread operator para actualizar el array de posts del perfil
            };
        } catch (error) {
            console.log(error);
        };
    };

    const getProfileFollowersFollowing = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const config = {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/${id}`, config);
            const data = await response.json(); 
    
            setProfileFollowersFollowing(data); // Actualizamos el estado con los datos de la respuesta
        } catch (error) {
            console.log(error); 
        };
    };

    const getAuthProfileFollowersFollowing = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const config = {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/${id}`, config);
            const data = await response.json(); 

            setAuthProfileFollowersFollowing(data);
        } catch (error) {
            console.log(error);
        };
    };

    const getFollowing = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/following/${id}`, config);
            const data = await response.json(); 
    
            setFollowing(data);
        } catch (error) {
            console.log(error); 
        };
    };

    const getFollowers = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/followers/${id}`, config);
            const data = await response.json(); 
    
            setFollowers(data);
        } catch (error) {
            console.log(error); 
        };
    };

    useEffect(() => { // Cada vez que auth cambie haremos las siguientes llamadas
        getPosts();
        getLikedPosts();
        getFollowingPosts();
        getProfilePosts(auth.id);
    }, [auth]);

    const removePost = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ id })
            };
    
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/delete`, config);
    
            // Actualizamos el estado para reflejar la eliminación del post con filter y nos traemos todos los post diferentes al borrado
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
            setPost({});
            getLikedPosts();
            getFollowingPosts();
            if (auth.id) {
                getProfilePosts(auth.id);
            };
        } catch (error) {
            console.log(error); 
        };
    };

    const updatePostWithLikes = updatedPost => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)) // Cuando haya cambios en los likes mapearemos y devolveremos un nuevo estado con los posts actualizados, usaremos map para evitar mutation
        );
    };

    const addLike = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ post_id: id })
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes`, config);
            const data = await response.json(); 
    
            // Actualizamos los estados
            updatePostWithLikes(data);
            getLikedPosts();
            getFollowingPosts();
            getPost(id);
            if (auth.id) {
                getProfilePosts(auth.id);
            };
        } catch (error) {
            console.log(error); 
        };
    };

    const removeLike = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'DELETE', // Método HTTP
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ post_id: id })
            };
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes/delete`, config);
            const data = await response.json(); 
    
            updatePostWithLikes(data);
            getLikedPosts();
            getFollowingPosts();
            getPost(id);
            if (auth.id) {
                getProfilePosts(auth.id);
            }
        } catch (error) {
            console.log(error); 
        };
    };

    const follow = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ id })
            };
    
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/follow`, config);
            
            // Distinguimos entre authProfile y profile para evitar incoherencias y errores en los estados, a la hora de la interaccion usuario autenticado perfil propio o perfil otro usuario
            getProfileFollowersFollowing(id); // Actualizamos seguidores y seguidos del perfil objetivo
            if (auth.id !== id) { // Comprobamos para evitar llamadas innecesarias si el id es el mismo que el del usuario autenticado
                getAuthProfileFollowersFollowing(auth.id); // Actualizamos seguidores y seguidos y el perfil del usuario autenticado, si es diferente
                getAuthProfile(auth.id);
            }
            getProfile(id); // Actualizamos el perfil objetivo
            getFollowingPosts(); // Actualizamos los posts de los usuarios seguidos
        } catch (error) {
            console.log(error); 
        };
    };

    const unfollow = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const config = {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ id })
            };

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/followers/unfollow`, config);

            getProfileFollowersFollowing(id); 
            if (auth.id !== id) { 
                getAuthProfileFollowersFollowing(auth.id); 
                getAuthProfile(auth.id);
            }
            getProfile(id); 
            getFollowingPosts();
        } catch (error) {
            console.log(error); 
        };
    };

    // Limpiamos todos los estados
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

    const deleteUser = async id => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const config = {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            };
    
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/delete`, config);
    
            // Limpiamos los estados y localStorage tras la eliminacion del usuario
            setPosts([]);
            setPost({});
            setLikedPosts([]);
            setFollowingPosts([]);
            setProfilePosts([]);
            setProfileFollowersFollowing({});
            setProfile({});
            setFollowing([]);
            setFollowers([]);
            localStorage.removeItem("token");
            setAuth({});
        } catch (error) {
            console.log(error); 
        };
    };

    return (
        <AppContext.Provider
            value={{
                posts,
                setPosts,
                getPosts,
                post,
                getPost,
                removePost,
                addLike,
                removeLike,
                followingPosts,
                getFollowingPosts, 
                getProfile,
                profile,
                getAuthProfile,
                authProfile,
                likedPosts,
                getLikedPosts,
                profilePosts,
                getProfilePosts,
                profileFollowersFollowing,
                getProfileFollowersFollowing,
                authProfileFollowersFollowing,
                getAuthProfileFollowersFollowing,
                following,
                getFollowing,
                followers,
                getFollowers,
                follow,
                unfollow,
                logoutPosts,
                deleteUser
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
