import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useApp }from "../hooks/useApp";
import { PostCard }from "../components/PostCard";
import { HomeNav } from "../components/HomeNav";

export const Following = () => {
  
  const { followingPosts, getFollowingPosts } = useApp();
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  useEffect(() => { getFollowingPosts(page) }, [page]); 

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries[0].isIntersecting && setPage(prevPage => prevPage + 1), { threshold: 0.1 });
    loader.current && observer.observe(loader.current);
    return () => loader.current && observer.unobserve(loader.current);
  }, [loader.current]);

  return (
    <>
      <HomeNav />
      <Link to={'/home/new-thought'} className="new-thought">+ Nuevo Thought</Link>
      {
        followingPosts.length === 0 ? ( // Si no hay posts motramos una cara triste y un mensaje
          <div className="container-sad-face container-sad-face-posts">
            <img src="/sad.png" alt="Sad Face" />
            <p>Ups... ¿Todavía no sigues a nadie? Prueba a darle follow a algún usuario</p> 
          </div>
        ) : (
          followingPosts.map((followingPost) => (
            <PostCard key={followingPost.id} post={followingPost} />
          ))
        )
      }
      <div ref={loader} style={{ height: "100px", opacity: 0 }}>Loader</div> {/* Div que usaremos como referencia para el scroll infinito */}
    </>
  );
};