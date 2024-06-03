import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { PostCard } from "../components/PostCard";
import { HomeNav } from "../components/HomeNav";

export const Posts = () => {

    const { posts, getPosts } = useApp();
    const [ page, setPage ] = useState(1); 
    const loader = useRef(null); 

    useEffect(() => {
        getPosts(page);
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);
            };
        }, { threshold: 0.1 });

        if (loader.current) {
            observer.observe(loader.current);
        };

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            };
        };
    }, [loader.current]);

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