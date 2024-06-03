import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth }  from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { HomeNav }from "../components/HomeNav";
import { Alert } from "../components/Alert";
import { PostCard } from "../components/PostCard";
import { convertToSpanishDate } from "../helpers/formatDate";

export const Post = () => {

	const params = useParams();
	const navigate = useNavigate();
	const { alert, auth } = useAuth();
	const { post, getPost, addComment, removeComment } = useApp();

    const [comment, setComment] = useState("");
	const [isPostLiked, setIsPostLiked] = useState(false);

	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	useEffect(() => {
		getPost(params.id); // Obtenemos el post con los params de la URL
	}, [params.id]);

	useEffect(() => {
		if (post && post.likes && post.likes.includes(auth.id)) {
			// Comprobamos si el usuario logueado le ha dado like antes o no al post
			setIsPostLiked(true);
		} else {
			setIsPostLiked(false);
		};
	}, [post, auth]);

	const handleChange = e => {
		// Manejamos el cambio en los inputs, actualizamos el estado del comentario y validamos errores
		const { name, value } = e.target;
		setComment(value);
		if (touched[name]) {
			const validationError = validateComment(value);
			setErrors({ ...errors, [name]: validationError });
		};
	};

	const handleBlur = e => {
		// Validamos el comentario cuando el usuario deja el campo
		const { name, value } = e.target;
		setTouched({ ...touched, [name]: true });
		const validationError = validateComment(value);
		setErrors({ ...errors, [name]: validationError });
	};

	const validateComment = comment => {
		if (!comment) return "El comentario no puede ir vacío";
		if (comment.length > 255)
			return "Un comentario permite como máximo 255 caracteres";
		return "";
	};

	const handleSubmit = async e => {
		e.preventDefault();
		// Antes de enviar, validamos el comentario y marcamos el campo como tocado
		const validationError = validateComment(comment);
		if (validationError) {
			setErrors({ ...errors, comment: validationError });
			setTouched({ ...touched, comment: true });
			return;
		};
		await addComment(params, comment);
		setComment("");
	};

	const handleRemove = async id => {
		await removeComment(id)
		getPost(params.id);
	};

	const { msg } = alert; // hacemos destructuring para verificar si existe la alerta y poder mostrarla en pantalla. Si existe msg, hay alerta

	return (
		<>
			<HomeNav />
			{msg ? (
				<div className="alert-container">
					<Alert alert={alert} />
				</div>
			) : (
				<Link to={"/home/new-thought"} className="new-thought">
					{" "}
					+ Nuevo Thought
				</Link>
			)}
			{post.id ? (
				<>
					<PostCard post={post} isLiked={isPostLiked} />
					<div className="container container-new-post container-comment">
						<form onSubmit={handleSubmit}>
							<div className="card">
								<label htmlFor="post">¿En qué estás pensando?</label>
								<textarea
									name="comment"
									id="comment"
									placeholder="Escribe aquí tu respuesta. Máximo 255 caracteres..."
									value={comment}
									onChange={handleChange}
									onBlur={handleBlur}
									className="textarea-comment"
								/>
								{touched.comment && errors.comment ? (
									<div className="form-error">
										<p>{errors.comment}</p>
									</div>
								) : null}
							</div>

							<div className="button-container container-button-comment">
								<button className="button" type="submit">
									Responder
								</button>
							</div>
						</form>
					</div>
					<div className="container-comments">
						{post.num_comments === 0 ? (
							<h2 className="no-comments">Este thought no tiene comentarios</h2> // Si no hay comentarios mostramos este encabezado
						) : (
							post.comments.map((comment) => (
								<div key={comment.id} className="comment">
									<div className="comment-title">
										<div className="container-avatar">
											{comment.user_image === null ? (
												<img src="/avatar.jpg" alt="Default avatar" />
											) : (
												<img
													src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
														comment.user_image
													}`}
													alt="User avatar"
												/>
											)}
										</div>
										<h2>
											<Link
												to={`/home/profile/${comment.user_id}`}
												className="nick"
											>
												@{comment.user_nick}
											</Link>
										</h2>
									</div>

									<div className="comment-content">
										<p className="comment-text">{comment.comment}</p>
										<div className="comment-date-delete">
											<p className="comment-date">
												{convertToSpanishDate(comment.comment_date)}
											</p>
											{auth.id === comment.user_id ? (
												<p>
													<button // Damos opcion de borrar el comentario al autor del mismo
														onClick={() => handleRemove(comment.id)}
														className="comment-delete"
													>
														🗑️
													</button>
												</p>
											) : null}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</>
			) : (
				// Si no existe post.id (es que hemos borrado el postt, o intentamos entrar en un post inexistente) redireccionamos
				navigate("/home")
			)}
		</>
	);
};