import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { HomeNav } from "../components/HomeNav";
import { Alert } from "../components/Alert";

export const NewThought = () => {
	
	const { alert, setAlert, auth } = useAuth();
	const { posts, setPosts, getLikedPosts, getProfilePosts } = useApp();
	const navigate = useNavigate();

	const [values, setValues] = useState({ post: "" });
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

	const handleBlur = (e) => {
		const { name } = e.target;
		setTouched({ ...touched, [name]: true });
		const validationErrors = validate(values);
		setErrors(validationErrors);
	};

	const validate = (values) => {
		const errors = {};
		if (!values.post) {
			errors.post = "El thought no puede ir vacío";
		} else if (values.post.length > 255) {
			errors.post = "Un thought permite como máximo 255 caracteres";
		}
		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Antes de enviar validamos y marcamos como tocado, para mostrar error si lo hubiera en la vista
		const validationErrors = validate(values);
		setErrors(validationErrors);
		setTouched({ post: true });

		if (Object.keys(validationErrors).length === 0) {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					return;
				}

				const config = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(values),
				};

				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_URL}/api/posts`,
					config
				);

				// Convertimos la respuesta a JSON
				const data = await response.json();

				// Actualizamos el estado con el nuevo post con el spread operator y actualizamos los post del perfil y la seccion de me gustan
				setPosts([data, ...posts]);
				getLikedPosts();
				if (auth.id) {
					getProfilePosts(auth.id);
				};

				const msg = "Thought publicado correctamente"; // Definimos un mensaje de exito para la alerta
				setAlert({
					msg: `${msg}`,
					error: false,
				});
				setTimeout(() => {
					setAlert({});
					navigate("/home"); // Redireccionamos en tres segundos
				}, 3000);
			} catch (error) {
				console.log(error);
				setAlert({
					msg: error.message || "Error al publicar el post.", // Mostramos alerta con el error
					error: true,
				});
				setTimeout(() => {
					setAlert({}); // Limpiamos la alerta
				}, 3000);
			};
		};
	};

	const { msg } = alert;

	return (
		<>
			<HomeNav />
			<div className="alert-container">{msg && <Alert alert={alert} />}</div>

			<div className="container container-new-post">
				<form onSubmit={handleSubmit}>
					<div className="container-title">
						<h2>Nuevo thought</h2>
					</div>
					<div className="card">
						<label htmlFor="post">¿En qué estás pensando?</label>
						<textarea
							name="post"
							id="post"
							placeholder="Escribe aquí tu thought. Máximo 255 caracteres..."
							value={values.post}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						{touched.post && errors.post ? (
							<div className="form-error">
								<p>{errors.post}</p>
							</div>
						) : null}
					</div>

					<div className="button-container">
						<button className="button" type="submit">
							Publicar
						</button>
					</div>
				</form>
			</div>
		</>
	);
};