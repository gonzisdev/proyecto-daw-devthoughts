import { useAuth } from "../hooks/useAuth";
import { useApp }from "../hooks/useApp";
import { Link } from "react-router-dom";
import { convertToSpanishDate } from "../helpers/formatDate";

export const PostCard = ({ post }) => {
	
	const { addLike, removeLike, removePost } = useApp();
	const { auth } = useAuth();

	// Manejamos los likes: dar o quitarlo en funcion de si le habiamos dado like previamente
	const handleLike = () => {
		if (post.liked_by === null) {
			addLike(post.id);
		} else if (post.liked_by.includes(auth.nick)) {
			removeLike(post.id);
		} else {
			addLike(post.id);
		};
	};

	// Damos la posibilidad de borrar el post si el usuario autenticado es el autor del mismo
	const handleRemove = () => {
		if (post.user_id === auth.id) {
			removePost(post.id);
		};
	};

	return (
		<div className="container-postcard">
			<div className="container-title-postcard">
				<div className="container-avatar">
					{post.image === null ? (
						<img src="/avatar.jpg" alt="Default avatar" />
					) : (
						<img
							src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${post.image}`}
							alt="User avatar"
						/>
					)}
				</div>
				<h2>
					<Link to={`/home/profile/${post.user_id}`} className="nick">
						@{post.nick}
					</Link>
				</h2>
			</div>
			<div className="container-post-postcard">
				<p>{post.post}</p>
			</div>
			<div className="container-post-info">
				<div className="container-post-likes-comments">
					<p>
						<span>
							<Link to={`/home/post/${post.id}`}>Respuestas: </Link>
						</span>
						{post.num_comments}
					</p>
					<p>
						<button onClick={handleLike} className="like-delete">
							{/* Mostraremos un emoji u otro en funcion de si liked_by contiene el nick de usuario autenticado */}
							{post.liked_by === null || !post.liked_by.includes(auth.nick)
								? "🤍"
								: "❤️"}
						</button>
						{post.num_likes}
					</p>
					{/* Mostraremos el emoji de borrar post y damos la posibilidad de borrado si el id del usuario autenticado coincide con el id del autor del post */}
					{auth.id === post.user_id ? (
						<p>
							<button onClick={handleRemove} className="like-delete">
								🗑️ X
							</button>
						</p>
					) : null}
				</div>
				<div className="container-post-date">
					<p>
						<span>Publicado: </span>
						{convertToSpanishDate(post.post_date)}
					</p>
				</div>
			</div>
		</div>
	);
};
