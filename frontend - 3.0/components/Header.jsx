import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { SearchBar }from "./SearchBar";
import { Alert } from "./Alert";

export const Header = () => {
	
	const { alert, auth, logout } = useAuth();
	const { logoutPosts } = useApp();

	const { msg } = alert;

	const handleLogout = () => {
		logout(); // Cierra sesion y elimina el token de LocalStorage
		logoutPosts(); // Limpia todos los estados de la App
	};

	// Comportamiento condicional para mostrar un header diferente si estamos logueados o no
	return (
		<>
			{auth.id ? (
				<header className="header header-home">
					<div className="header-left header-left-home">
						<h1>
							<Link to='/'>DevThoughts</Link>
						</h1>
						<p>La comunidad de alumnos de DAW de Ilerna</p>
					</div>
					<div className="header-right header-right-home">
						<SearchBar className="searchbar-header"/>
						<div className="header-user">
							<div className="container-user">
								<div className="container-avatar"> 
									{auth.image === null ? (
										<img src="/avatar.jpg" alt="Default avatar" /> /* Si el usuario no tiene imagen mostramos una por defecto */
									) : (
										<img
											src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
												auth.image
											}`}
											alt="User avatar"
										/>
									)}
								</div>
								<Link to={`profile/${auth.id}`} className="nick">
									@{auth.nick}
								</Link>
							</div>

							<button className="button button-profile">
								<Link to={`profile/${auth.id}`}>Mi perfil</Link>
							</button>
							<button onClick={handleLogout} className="logout">
								Salir
							</button>
						</div>
					</div>
				</header>
			) : (
				<header className="header header-login">
					<div className="header-left header-left-login">
						<h1>
							<Link to='/'>DevThoughts</Link>
						</h1>
						<p>La comunidad de alumnos de DAW de Ilerna</p>
					</div>
					<div className="header-right header-right-login">
						{msg ? <Alert alert={alert} /> : ""}
					</div>
				</header>
			)}
		</>
	);
};
