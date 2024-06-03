import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {

	const { setAlert, setAuth } = useAuth();
	const navigate = useNavigate();

	const [values, setValues] = useState({
		email: "",
		password: "",
	});

	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const handleChange = e => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const handleBlur = e => {
		const { name } = e.target;
		setTouched({
			...touched,
			[name]: true,
		});
		const validationErrors = validate(values);
		setErrors(validationErrors);
	};

	const validate = (values) => {
		// Reglas de validacion
		const errors = {};
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
		return errors;
	};

	const handleSubmit = async e => { // Antes de enviarlo lo validamos y marcamos los campos como tocados para mostrar alerta si hay error
		e.preventDefault();
		const validationErrors = validate(values);
		setErrors(validationErrors);
		setTouched({
			email: true,
			password: true,
		});
		if (Object.keys(validationErrors).length === 0) {
			try {
				const config = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				};
				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
					config
				);
				if (!response.ok) {
					const errorData = await response.json(); 
					throw new Error(errorData.msg || "Error al iniciar sesión.");
				}
				const data = await response.json();
				localStorage.setItem("token", data.token); // Guardamos el token generado al hacer login en localStorage
				setAuth(data);
				navigate("/home"); // Redireccionamos 
			} catch (error) {
				console.log(error);
				setAlert({
					msg: error.message, // Usamos el mensaje del error lanzado o el mensaje por defecto
					error: true,
				});
				setTimeout(() => {
					setAlert({});
				}, 3000);
			};
		};
	};

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<div className="container-title">
					<h2>Iniciar Sesión</h2>
				</div>
				<div className="card">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						placeholder="Tu email"
						autoComplete="email"
						value={values.email}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{errors.email && touched.email && (
						<div className="form-error">
							<p>{errors.email}</p>
						</div>
					)}
				</div>
				<div className="card">
					<label htmlFor="password">Contraseña</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Tu contraseña"
						autoComplete="current-password"
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{errors.password && touched.password && (
						<div className="form-error">
							<p>{errors.password}</p>
						</div>
					)}
				</div>
				<div className="button-container">
					<button className="button" type="submit">
						Iniciar Sesión
					</button>
				</div>
			</form>
			<div className="form-links">
				<Link to={"/signup"} className="form-link">
					¿No tienes una cuenta? Regístrate
				</Link>
				<Link to={"/forgot-password"} className="form-link">
					He olvidado mi contraseña
				</Link>
			</div>
		</div>
	);
};
