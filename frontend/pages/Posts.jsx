import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { PostCard } from "../components/PostCard";
import { HomeNav } from "../components/HomeNav";
import { Spinner } from "../components/Spinner";

export const Posts = () => {

    const { posts, getPosts } = useApp();
    const [page, setPage] = useState(1); 
    const [loading, setLoading] = useState(false);
    const loader = useRef(null); 

    useEffect(() => { 
        setLoading(true);
        getPosts(page) 
            .then(() => setLoading(false))
    }, [page]); // Pasamos pagina a la funcion, el numero por defecto sera uno

    useEffect(() => {
        const observer = new IntersectionObserver(entries => entries[0].isIntersecting && setPage(prevPage => prevPage + 1), { threshold: 0.1 }); // Sumaremos 1 a la peticion para traer nuevos resultados con el scroll infinito
        loader.current && observer.observe(loader.current);
        return () => loader.current && observer.unobserve(loader.current);
    }, [loader.current]);

    // Mostramos el spinner en la pimera carga inicial mientras no haya posts
    // Ya mostramos spinner al comprobar auth, pero necesitamos alargarlo para que no se vea un flasheo 
    // del contenido de la pagina sin posts a pagina con posts mientras se cargan en la primera carga
    if (loading && posts.length === 0 && page === 1) return <Spinner />; 
  
    return (
        <>
            <HomeNav />
            <Link to={'new-thought'} className="new-thought">+ Nuevo Thought</Link>
            {
                posts.length === 0 ? ( // Si no hay posts motramos una cara triste y un mensaje
                    <div className="container-sad-face container-sad-face-posts">
                        <img src="/sad.png" alt="Sad Face" />
                        <p>Ups... Nadie ha publicado nada todavía. ¿Te gustaría ser el primero?</p>
                    </div>
                ) : (
                    
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )
            }
            <div ref={loader} style={{ height: "100px", opacity: 0 }}>Loader</div> {/* Div que usaremos como referencia para el scroll infinito */}
        </>
    );
};