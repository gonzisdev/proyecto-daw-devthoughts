import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const SignUp = () => {
	
	const { createUser } = useAuth();

	const [formValues, setFormValues] = useState({ // Iniciamos los campos vacios
		name: "",
		surname: "",
		email: "",
		password: "",
		nick: "",
	});
	const [code, setCode] = useState("");
	const [formErrors, setFormErrors] = useState({});
	const [touched, setTouched] = useState({});

	const handleChange = e => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value }); // Actualiza el valor del campo modificado
	};

	const handleBlur = e => {
		const { name } = e.target;
		setTouched({ ...touched, [name]: true }); // Marcamos el campo como tocado
		const validationErrors = validateForm(formValues);
		setFormErrors(validationErrors);
	};

	const validateForm = values => {
		// Reglas de validacion
		const errors = {};
		if (!values.name) {
			errors.name = "El nombre es obligatorio";
		};
		if (!values.surname) {
			errors.surname = "Los apellidos son obligatorios";
		};
		if (!values.email) {
			errors.email = "El email es obligatorio";
		} else if (!/\S+@\S+\.\S+/.test(values.email)) {
			errors.email = "El email no es válido";
		};
		if (!values.password) {
			errors.password = "La contraseña es obligatoria";
		} else if (values.password.length < 6) {
			errors.password = "La contraseña debe contener al menos 6 caracteres";
		};
		if (!values.nick) {
			errors.nick = "El nick de usuario es obligatorio";
		};
		return errors;
	};

	const handleSubmit = async e => {
		// Antes de enviar el formulario lo validamos y marcamos los campos como tocados para mostrar alerta si hay error
		e.preventDefault();
		const validationErrors = validateForm(formValues);
		setFormErrors(validationErrors);
		setTouched({
			name: true,
			surname: true,
			email: true,
			password: true,
			nick: true,
		});
		// Si no hay errores mandamos la peticion
		if (Object.keys(validationErrors).length === 0) {
			const data = await createUser(formValues); // Enviamos los datos del formulario si no hay errores
			setCode(data.code); // Actualizamos el codigo de seguridad con la respuesta para mostrarlo en pantalla
		};
	};

	return (
		<div className="container container-signup">
			{code ? (
				<>
					<div className="container-title">
						<h2>Código de seguridad</h2>
					</div>
					<div className="card">
						<p className="code-title">
							Copia y guarda el siguiente código en un lugar seguro:
						</p>
						<p className="code">{code}</p>
					</div>
				</>
			) : (
				<form onSubmit={handleSubmit}>
					<div className="container-title">
						<h2>Crear cuenta</h2>
					</div>
					<div className="card">
						<label htmlFor="name">Nombre</label>
						<input
							type="text"
							name="name"
							id="name"
							placeholder="Tu nombre"
							value={formValues.name}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						{touched.name && formErrors.name && (
							<div className="form-error">
								<p>{formErrors.name}</p>
							</div>
						)}
					</div>
					<div className="card">
						<label htmlFor="name">Apellidos</label>
						<input
							type="text"
							name="surname"
							id="surname"
							placeholder="Tus apellidos"
							value={formValues.surname}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						{touched.surname && formErrors.surname && (
							<div className="form-error">
								<p>{formErrors.surname}</p>
							</div>
						)}
					</div>
					<div className="card">
						<label htmlFor="name">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="Tu email"
							autoComplete="email"
							value={formValues.email}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						{touched.email && formErrors.email && (
							<div className="form-error">
								<p>{formErrors.email}</p>
							</div>
						)}
					</div>
					<div className="card">
						<label htmlFor="name">Contraseña</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Tu contraseña"
							autoComplete="off"
							value={formValues.password}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						{touched.password && formErrors.password && (
							<div className="form-error">
								<p>{formErrors.password}</p>
							</div>
						)}
					</div>
					<div className="card">
						<label htmlFor="name">Nick</label>
						<input
							type="text"
							name="nick"
							id="nick"
							placeholder="Tu nick"
							value={formValues.nick}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						{touched.nick && formErrors.nick && (
							<div className="form-error">
								<p>{formErrors.nick}</p>
							</div>
						)}
					</div>
					<div className="button-container">
						<button className="button" type="submit">
							Regístrate
						</button>
					</div>
				</form>
			)}
			<div className="form-links">
				<Link to={"/"} className="form-link">
					¿Ya tienes una cuenta? Inicia sesión
				</Link>
				<Link to={"/forgot-password"} className="form-link">
					He olvidado mi contraseña
				</Link>
			</div>
		</div>
	);
};