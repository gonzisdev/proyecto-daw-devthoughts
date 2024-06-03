import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { PostCard } from "../components/PostCard";
import { HomeNav } from "../components/HomeNav";

export const Likes = () => {

  const { likedPosts, getLikedPosts } = useApp();
  const [ page, setPage ] = useState(1);
  const loader = useRef(null);

  useEffect(() => {
    getLikedPosts(page); // Pasamos pagina a la funcion, su valor por defecto es 1
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1); // En cada llamada, incrementamos en 1 la pagina para el scroll infinito
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
  }, []);

  return (
		<>
			<HomeNav />
			<Link to={'/home/new-thought'} className="new-thought">+ Nuevo Thought</Link>
			{
				likedPosts.length === 0 ? ( // Si no hay posts motramos una cara triste y un mensaje
					<div className="container-sad-face container-sad-face-posts">
						<img src="/sad.png" alt="Sad Face" />
						<p>Ups... ¿No te gusta lo que piensa la gente? Prueba a darle like a algún thought</p>
					</div>
				) : (
					
					likedPosts.map((likedPost) => (
					<PostCard key={likedPost.id} post={likedPost} />
					))
				)
			}
			<div ref={loader} style={{ height: "100px", opacity: 0 }}>Loader</div> {/* Div que usaremos como referencia para el scroll infinito */}
		</>
    
  )
};