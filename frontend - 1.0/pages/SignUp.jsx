import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const SignUp = () => {
	
	const { setAlert } = useAuth();

	const [formValues, setFormValues] = useState({
		name: "",
		surname: "",
		email: "",
		password: "",
		nick: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [code, setCode] = useState("");

	const handleChange = e => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleBlur = e => {
		const { name } = e.target;
		setTouched({ ...touched, [name]: true });
		const validationErrors = validateForm(formValues);
		setFormErrors(validationErrors);
	};

	const validateForm = values => {
		const errors = {};
		if (!values.name) errors.name = "El nombre es obligatorio";
		if (!values.surname) errors.surname = "Los apellidos son obligatorios";
		if (!values.email) {
			errors.email = "El email es obligatorio";
		} else if (!/\S+@\S+\.\S+/.test(values.email)) {
			errors.email = "El email no es válido";
		}
		if (!values.password) {
			errors.password = "La contraseña es obligatoria";
		} else if (values.password.length < 6) {
			errors.password = "La contraseña debe contener al menos 6 caracteres";
		}
		if (!values.nick) errors.nick = "El nick de usuario es obligatorio";

		return errors;
	};

	const handleSubmit = async e => {
		e.preventDefault();
		// Antes de enviar el formulario lo validamos y marcamos los campos como tocados para mostrar alerta si hay error
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
			try {
				const config = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formValues),
				};

				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_URL}/api/users`,
					config
				);

				if (!response.ok) {
					// Verifica si el estado de la respuesta indica un error
					const errorData = await response.json(); //
					throw new Error(errorData.msg || "Error al crear el usuario."); // Lanza el mensaje de error del backend o un mensaje por defecto
				}

				const data = await response.json();

				setCode(data.code); // Actualizamos el codigo de seguridad con la respuesta para mostrarlo en pantalla
				setAlert({
					msg: `${data.msg}`,
					error: false,
				});
				setTimeout(() => {
					setAlert({}); // Limpiamos la alerta
				}, 3000);
			} catch (error) {
				console.log(error);
				setAlert({
					msg: error.message, // Mostramos el mensaje de error del backen o el alternativo
					error: true,
				});
				setTimeout(() => {
					setAlert({}); // Limpiamos la alerta
				}, 3000);
			};
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