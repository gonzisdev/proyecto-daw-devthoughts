import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { HomeNav } from "../components/HomeNav";
import { PostCard } from "../components/PostCard";
import { Spinner }from "../components/Spinner";
import { convertToSpanishDateUser } from "../helpers/formatDate";

export const Profile = () => {

	const params = useParams();
	const { auth } = useAuth();
	const {
		profilePosts,
		getProfilePosts,
		profile,
		getProfile,
		authProfile,
		getAuthProfile,
		getProfileFollowersFollowing,
		getAuthProfileFollowersFollowing,
		authProfileFollowersFollowing,
		profileFollowersFollowing,
		follow,
		unfollow,
	} = useApp();
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const loader = useRef(null);

	useEffect(() => {
		setIsLoading(true); // Mostraremos el spinner mientras se realizan las diversas peticiones
		const loadInitialData = async () => {
			await getAuthProfile(auth.id);
			await getProfile(params.id);
			await getProfilePosts(params.id, 1);
			await getProfileFollowersFollowing(params.id),
			await getAuthProfileFollowersFollowing(auth.id);
			setIsLoading(false);
		};

		loadInitialData();
	}, [params.id]); // Cada vez que los params de la URI cambien

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoading) {
					setPage((prevPage) => prevPage + 1); // Sumaremos 1 a la peticion para traer nuevos resultados con el scroll infinito
				}
			},
			{ threshold: 0.1 }
		);

		if (loader.current) {
			observer.observe(loader.current);
		}

		return () => observer.disconnect();
	}, [isLoading]);

	useEffect(() => {
		if (page > 1) {
			getProfilePosts(params.id, page);
		}
	}, [params.id, page]); // Si cambian los params o se realiza una nueva peticion del scroll infinito, actualizamos los posts

	useEffect(() => {
		getAuthProfile(auth.id);
		getAuthProfileFollowersFollowing(auth.id);
	}, [authProfileFollowersFollowing]); // Cuando cambie los seguidores o seguidos del usuario autenticado actualizamos su perfil y sus seguidores y seguidos

	const handleFollow = () => {
		if (profileFollowersFollowing.following.includes(auth.id)) {
			unfollow(profile.id);
		} else {
			follow(profile.id);
		}
	};

	if (isLoading) {
		return <Spinner />; // Mostramos spinner si isLoading esta como true
	}

	const currentProfile =
		auth.id === parseInt(params.id) ? authProfile : profile; // Condicional para mostrar perfil y dividir en dos estados y evitar errores de render y estados
	const followersFollowing =
		currentProfile.id === auth.id
			? authProfileFollowersFollowing
			: profileFollowersFollowing; // Lo mismo

	return (
		<>
			<HomeNav />
			<Link to={"/home/new-thought"} className="new-thought">
				+ Nuevo Thought
			</Link>
			<div className="container-profile">
				<div className="container-profle-data-container">
					<div className="container-profile-data">
						<div className="container-profile-title">
							<h2>Perfil de {currentProfile.nick}</h2>
							{/* Mostrar "Te sigue" o "No te sigue" solo si currentProfile es igual a profile (otro usuario) */}
							{currentProfile.id !== auth.id &&
								(followersFollowing.followers &&
								followersFollowing.followers.includes(auth.id) ? (
									<span className="profile-follower-tag">Te sigue</span>
								) : (
									<span className="profile-follower-tag">No te sigue</span>
								))}
							{/* Mostrar botón de seguir o no seguir según corresponda, solo si estamos en el perfil de otro usuario */}
							{currentProfile.id !== auth.id &&
								(followersFollowing.following &&
								followersFollowing.following.includes(auth.id) ? (
									<button
										onClick={handleFollow}
										className="profile-follower-button unfollow"
									>
										- No seguir
									</button>
								) : (
									<button
										onClick={handleFollow}
										className="profile-follower-button"
									>
										+ SEGUIR
									</button>
								))}
						</div>
						<div>
							<div className="container-profile-followers">
								<p>
									<Link to={`/home/profile/following/${params.id}`}>
										<span>Seguidos: </span>
									</Link>
									{currentProfile.following_count}
								</p>
								<p>
									<Link to={`/home/profile/followers/${params.id}`}>
										<span>Seguidores: </span>
									</Link>
									{currentProfile.followers_count}
								</p>
							</div>
							<p>
								<span>Imagen:</span>
							</p>
							<div className="container-avatar container-avatar-profile">
								{currentProfile.image === null ? (
									<img src="/avatar.jpg" alt="Default avatar" />
								) : (
									<img
										src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
											currentProfile.image
										}`}
										alt="User avatar"
									/>
								)}
							</div>
							<p>
								<span>Nombre: </span>
								{currentProfile.name}
							</p>
							<p>
								<span>Apellidos: </span>
								{currentProfile.surname}
							</p>
							<p>
								<span>Email: </span>
								{currentProfile.email}
							</p>
							<p>
								<span>Fecha de registro: </span>
								{convertToSpanishDateUser(currentProfile.register_date)}
							</p>
							<p>
								<span>Descripción: </span>
								{currentProfile.description === null ||
								currentProfile.description === ""
									? "Sin descripción"
									: currentProfile.description}
							</p>
						</div>
						<div className="container-profile-button">
							{auth.id === currentProfile.id ? ( // Mostraremos un boton para editar el perfil si el usuario autenticado esta en su perfil
								<button className="button button-profile">
									<Link to={`/home/edit-profile/${auth.id}`}>
										Editar perfil
									</Link>
								</button>
							) : (
								""
							)}
						</div>
					</div>
				</div>
				<div className="container-profile-thoughts">
					{profilePosts.length === 0 ? ( // Si no hay posts mostraremos un mensaje y una cara triste
						<div className="container-sad-face container-sad-face-profile">
							<img src="/sad.png" alt="Sad Face" />
							<p>
								Ups... Parece que {currentProfile.nick} no ha publicado ningún
								thought
							</p>
						</div>
					) : (
						profilePosts.map((post) => <PostCard key={post.id} post={post} />)
					)}
				</div>
			</div>
			{/* Div que hace de referencia para ejecutar las nuevas peticions del scroll infinito */}
			<div ref={loader} style={{ height: "100px", opacity: 0 }}>
				Loader
			</div>
		</>
	);
};