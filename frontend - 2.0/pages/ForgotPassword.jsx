import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../hooks/useApp";

export const ForgotPassword = () => {
	
  	const { changePassword } = useApp();

	const [values, setValues] = useState({ // Iniciamos con los campos vacios
		unique_code: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const handleChange = e => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value }); // Actualiza el valor del campo modificado
	};

	const handleBlur = e => {
		const { name } = e.target;
		setTouched({ ...touched, [name]: true }); // Marca como tocado
		const validationErrors = validate(values); // Valida los valores
		setErrors(validationErrors); // Establece errores si hay
	};

	const validate = values => { // Validacion 
		let errors = {};
		if (!values.unique_code) {
			errors.unique_code = "El código de seguridad es obligatorio";
		}
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
		return errors; // Devolvemos el objeto de errores
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const validationErrors = validate(values); // Valida los valores antes de enviar el formulario

		if (Object.keys(validationErrors).length > 0) { // Si hay errores marcamos todo como tocado
			setTouched({
				unique_code: true,
				email: true,
				password: true,
			});
		};
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) { // Si no hay errores hacemos la peticion
			await changePassword(values)
		};
	};

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<div className="card">
					<label htmlFor="unique_code">Código</label>
					<input
						type="text"
						name="unique_code"
						id="unique_code"
						placeholder="Tu código de seguridad"
						value={values.unique_code}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{touched.unique_code && errors.unique_code && (
						<div className="form-error">
							<p>{errors.unique_code}</p>
						</div>
					)}
				</div>
				<div className="card">
					<label htmlFor="unique_code">Email</label>
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
					{touched.email && errors.email && (
						<div className="form-error">
							<p>{errors.email}</p>
						</div>
					)}
				</div>
				<div className="card">
					<label htmlFor="unique_code">Contraseña</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Tu nueva contraseña"
						autoComplete="off"
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{touched.password && errors.password && (
						<div className="form-error">
							<p>{errors.password}</p>
						</div>
					)}
				</div>
				<div className="button-container">
					<button className="button" type="submit" >
						Cambiar contraseña
					</button>
				</div>
			</form>
			<div className="form-links">
				<Link to={"/"} className="form-link">
					Ir a iniciar sesión
				</Link>
			</div>
		</div>
	);
};