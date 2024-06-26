import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { HomeNav } from "../components/HomeNav";
import { Spinner } from "../components/Spinner";
import { convertToSpanishDateUser } from "../helpers/formatDate";

export const FollowersList = () => {
	
	const params = useParams();
	const { auth, authProfile, getAuthProfile, getAuthProfileFollowersFollowing, authProfileFollowersFollowing } = useAuth();
	const { followers, getFollowers, profile, getProfile, getProfileFollowersFollowing, profileFollowersFollowing, follow, unfollow } = useApp();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadInitialData = async () => {
			// Segun este estado mostraremos el spinner hasta que la informacion este lista, usamos una promesa para ello
			// Ya mostramos spinner comprobando el auth, pero necesitamos alargar el tiempo de espera muestre mientras se recibe mas informacion
			setIsLoading(true); // Mostraremos el spinner mientras se realizan las diversas peticiones
			await Promise.all([
                getAuthProfile(auth.id),
                getProfile(params.id),
                getFollowers(params.id, 1),
                getProfileFollowersFollowing(params.id),
                getAuthProfileFollowersFollowing(auth.id)
            ]);
			setIsLoading(false);
		};
		loadInitialData();
	}, [params.id]); // Cada vez que los params de la URI cambien

	useEffect(() => {
		getAuthProfile(auth.id);
		getAuthProfileFollowersFollowing(auth.id);
	}, [authProfileFollowersFollowing]); // Cuando cambie los seguidores o seguidos del usuario autenticado actualizamos su perfil y sus seguidores y seguidos

	const handleFollow = () => profileFollowersFollowing.following.includes(auth.id) ? unfollow(profile.id) : follow(profile.id);

	const currentProfile = auth.id === parseInt(params.id) ? authProfile : profile; // Condicional para mostrar perfil y dividir en dos estados y evitar errores de render y estados
	const followersFollowing = currentProfile.id === auth.id ? authProfileFollowersFollowing : profileFollowersFollowing; // Lo mismo pero con los seguidores y seguidos
	
	if (isLoading) return <Spinner />;
	
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
				<div className="follow-list">
					{followers.length === 0 ? (
						<div className="container-sad-face container-sad-face-profile">
							<img src="/sad.png" alt="Sad Face" />
							<p>Ups... Parece que {profile.nick} no tiene ningún seguidor</p>
						</div>
					) : (
						<table className="table-followers">
							<thead>
								<tr>
									<th colSpan={4}>{profile.nick} es seguido por:</th>
								</tr>
							</thead>
							<tbody>
								{followers.map((follower) => (
									<tr key={follower.id}>
										<td>
											{follower.image === null ? (
												<img src="/avatar.jpg" alt="Default avatar" />
											) : (
												<img
													src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
														follower.image
													}`}
													alt="User avatar"
												/>
											)}
										</td>
										<td>
											<Link
												to={`/home/profile/${follower.id}`}
												className="nick"
											>
												@{follower.nick}
											</Link>
										</td>
										<td>
											{follower.description === null ||
											follower.description === ""
												? "Sin descripción"
												: follower.description}
										</td>
										<td>
											Desde el {convertToSpanishDateUser(follower.following_date)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</>
	);
};