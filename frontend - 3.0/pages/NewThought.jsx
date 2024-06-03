import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { HomeNav } from "../components/HomeNav";
import { Alert } from "../components/Alert";

export const NewThought = () => {
	
	const { alert } = useAuth();
	const { createPost } = useApp();

	const [values, setValues] = useState({ post: "" });
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const handleChange = e => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

	const handleBlur = e => {
		const { name } = e.target;
		setTouched({ ...touched, [name]: true });
		const validationErrors = validate(values);
		setErrors(validationErrors);
	};

	const validate = values => {
		const errors = {};
		if (!values.post) {
			errors.post = "El thought no puede ir vacío";
		} else if (values.post.length > 255) {
			errors.post = "Un thought permite como máximo 255 caracteres";
		}
		return errors;
	};

	const handleSubmit = async e => {
		e.preventDefault();
		// Antes de enviar validamos y marcamos como tocado, para mostrar error si lo hubiera en la vista
		const validationErrors = validate(values);
		setErrors(validationErrors);
		setTouched({ post: true });
		if (Object.keys(validationErrors).length === 0) await createPost(values); // Si no hay errores enviamos el formulario
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