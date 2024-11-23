import { useState } from "react";
import { Link } from "react-router-dom";
import { checkTokenCreateConfig } from "../helpers/checkTokenCreateConfig";

export const SearchBar = ({ className }) => {
	
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleSearch = async () => {	
		if (searchTerm !== "") { // Impedimos la búsqueda si el campo esta vacio
			try {
				const config = checkTokenCreateConfig("POST"); // Necesitamos el token para hacer la petición a nuestro backend y pasar el middleware de JWT
				if (!config) return;
				config.body = JSON.stringify({ term: searchTerm }); // Convertimos a JSON
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/search`, config);
				if (!response.ok) {
					if (response.status === 404) {
						const errorData = await response.json(); // Obtenemos el cuerpo de la respuesta para extraer el mensaje de error definido en el backend, si no existiera definimos unos mensajes alternativos
						throw new Error(errorData.msg || "No se encontraron resultados");
					} else {
						throw new Error("Error al realizar la búsqueda");
					};
				};
				const data = await response.json(); // Convertimos la respuesta a JSON
				// Mostramos resultados y abrimos modal
				setSearchResults(data);
				setShowModal(true);
				setErrorMessage("");
			} catch (error) {
				console.log(error);
				// Configuramos los mensajes basandonos en la captura de la excepcion
				setErrorMessage(error.message || "Error al realizar la búsqueda");
				setSearchResults([]);
				setShowModal(true);
			};
		};
	};

	const handleChange = e => setSearchTerm(e.target.value); // Colocamos en el state el termino de busqueda

	const handleSubmit = e => { // En el submit prevenimos la accion por defecto y llamamos a la funcion de busqueda
		e.preventDefault();
		handleSearch();
	};

	const closeModal = () => setShowModal(false); // Cerramos el modal

	return (
		<div className={`user-search ${className}`}>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Buscar usuarios..."
					value={searchTerm}
					onChange={handleChange}
				/>
				<button type="submit">Buscar</button>
			</form>
			{showModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h2 className="modal-title">Resultados:</h2>
						<span className="close" onClick={closeModal}>
							X
						</span>
						<div className="modal-results-container">
							{errorMessage ? (
								<p className="modal-error">{errorMessage}</p>
							) : (
								<ul>
									{searchResults.map((user) => (
										<li key={user.id}>
											<Link
												to={`/home/profile/${user.id}`}
												onClick={closeModal}
											>
												<div className="container-avatar">
													{user.image === null ? (
														<img src="/avatar.jpg" alt="Default avatar" />
													) : (
														<img
															src={`${
																import.meta.env.VITE_BACKEND_URL
															}/uploads/${user.image}`}
															alt="User avatar"
														/>
													)}
												</div>
												@{user.nick} - {user.name} {user.surname} ||{" "}
												{user.description === null || user.description === ""
													? "Sin descripción"
													: user.description}
											</Link>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};