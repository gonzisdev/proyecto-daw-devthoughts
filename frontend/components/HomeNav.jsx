import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export const HomeNav = () => {
	
	const [isOpen, setIsOpen] = useState(false); // Estado para manejar el menu de hamburguesa

	return (
		<>
			<nav className="nav">
				<div className="nav-hamburger-search">
					<button
						className={`hamburger ${isOpen ? "is-open" : ""}`}
						onClick={() => setIsOpen(!isOpen)}
					>
						<img src="/menu.png" alt="Menu" />
					</button>
					<SearchBar className="searchbar-nav" />{" "}
					{/* Cuando se muestra el menu de hamburguesa reubicamos aqui el buscador para ofrecer un mejor diseño y liberar el header */}
				</div>
				<ul className={`nav-list ${isOpen ? "open" : ""}`}>
					<li className="nav-item">
						<NavLink to="/home" className="button nav-button" end>
							Thoughts de la comunidad
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink to="/home/following" className="button nav-button" end>
							Thoughts de quien sigo
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink to="/home/likes" className="button nav-button" end>
							Thoughts que me gustan
						</NavLink>
					</li>
				</ul>
			</nav>
		</>
	);
};

