import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { HomeNav } from "../components/HomeNav";
import { Spinner } from "../components/Spinner";
import { convertToSpanishDateUser } from "../helpers/formatDate";

export const FollowersList = () => {
	
	const params = useParams();
	const { auth } = useAuth();
	const {
		followers,
		getFollowers,
		profileFollowersFollowing,
		getProfileFollowersFollowing,
		profile,
		getProfile,
		follow,
		unfollow,
	} = useApp();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true); // Segun este estado mostraremos el spinner hasta que la informacion este lista, usamos una promesa para ello:
			await Promise.all([
				getProfile(params.id),
				getFollowers(params.id),
				getProfileFollowersFollowing(params.id),
			]);
			setIsLoading(false); 
		};
		fetchData();
	}, [params.id]); // Lo ejecutamos cada vez que cambien los params

	useEffect(() => {
		getProfile(params.id);
		getFollowers(params.id);
		getProfileFollowersFollowing(params.id);
	}, [followers]); // Actualizamos el state cada vez que haya cambios en los followers. Los cambios pueden ser vistos en tiempo real por cualquier usuario, ya que su estado tiene independencia.

	const handleFollow = () => {
		if (profileFollowersFollowing.following.includes(auth.id)) {
			unfollow(profile.id);
		} else {
			follow(profile.id);
		};
	};

	if (isLoading) return <Spinner />; // Mostramos spinner segun estado de isLoading

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
							<h2>Perfil de {profile.nick}</h2>
							{auth.id ===
							parseInt(
								params.id
							) ? null : profileFollowersFollowing.followers &&
							  profileFollowersFollowing.followers.length !== 0 &&
							  profileFollowersFollowing.followers.includes(auth.id) ? (
								<span className="profile-follower-tag">Te sigue</span>
							) : (
								<span className="profile-follower-tag">No te sigue</span>
							)}
							{auth.id ===
							parseInt(
								params.id
							) ? null : profileFollowersFollowing.following &&
							  profileFollowersFollowing.following.length !== 0 &&
							  profileFollowersFollowing.following.includes(auth.id) ? (
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
									+ Seguir
								</button>
							)}
						</div>
						<div>
							<div className="container-profile-followers">
								<p>
									<Link to={`/home/profile/following/${params.id}`}>
										<span>Seguidos: </span>
									</Link>
									{profile.following_count}
								</p>
								<p>
									<Link to={`/home/profile/followers/${params.id}`}>
										<span>Seguidores: </span>
									</Link>
									{profile.followers_count}
								</p>
							</div>
							<p>
								<span>Imagen:</span>
							</p>
							<div className="container-avatar container-avatar-profile">
								{profile.image === null ? (
									<img src="/avatar.jpg" alt="Default avatar" />
								) : (
									<img
										src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
											profile.image
										}`}
										alt="User avatar"
									/>
								)}
							</div>
							<p>
								<span>Nombre: </span>
								{profile.name}
							</p>
							<p>
								<span>Apellidos: </span>
								{profile.surname}
							</p>
							<p>
								<span>Email: </span>
								{profile.email}
							</p>
							<p>
								<span>Fecha de registro: </span>
								{convertToSpanishDateUser(profile.register_date)}
							</p>
							<p>
								<span>Descripción: </span>
								{profile.description === null || profile.description === ""
									? "Sin descripción"
									: profile.description}
							</p>
						</div>
						<div className="container-profile-button">
							{auth.id === profile.id ? (
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