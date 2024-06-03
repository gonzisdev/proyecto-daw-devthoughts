import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';
import { HomeNav } from '../components/HomeNav';
import { Alert } from '../components/Alert';

export const EditProfile = () => {
	
	const params = useParams();
	const { auth, alert, updateUser, deleteUser, logout } = useAuth();
	const { logoutPosts } = useApp();

	const [formData, setFormData] = useState({
		nick: auth.nick || '',
		description: auth.description ||	'',
		image: null, // Iniciamos el campo vacio aunque en la vista mostramos la imagen actual, pero no es obligatorio subirla
	});
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const handleChange = e => {
		const { name, value, files } = e.target;
		setFormData({ ...formData, [name]: files ? files[0] : value });// Para el campo de imagen guardamos el archivo en los otros el valor
		setTouched({ image: true }); // Tocamos la imagen, cuando cambie el campo (este campo no valida con blur, lo hacemos con onchange)
	};

	const handleBlur = e => { // Cuando se pierde el foco actualiza touched y valida el campo
		const { name } = e.target;
		setTouched({ ...touched, [name]: true }); // Tocamos el resto de campos
		validateField(name);
	};

	const validateField = name => { // Aqui validamos un campo en especifico y actualizamos el estado de errores
		const value = formData[name];
		let error = '';
		if (name === 'nick' && !value) {
		error = 'El nick de usuario es obligatorio';
		} else if (name === 'description' && !value) {
		error = 'La descripción es obligatoria';
		} else if (name === 'image' && value && !['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(value.type)) {
		error = 'Solo se permiten archivos de imagen (png, jpeg, jpg, gif)';
		};
		setErrors({ ...errors, [name]: error });
		return error;
	};

	const validateForm = () => { // Validacion de todo el formulario antes de enviarlo
		const formErrors = Object.keys(formData).reduce((acc, key) => {
		const error = validateField(key); // Cada campo individualmente
		if (error) acc[key] = error; // Si hay error lo añadimos al acumulador
		return acc;
		}, {});
		setErrors(formErrors);
		return Object.keys(formErrors).length === 0; // Devuelve true si no hay errores o false si los hay
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setTouched({
			nick: true,
			description: true,
			image: true
		});
		if (!validateForm()) return; // Si hay errores paramos el envio del formulario
		await updateUser(params, formData)
	};
	
	const { msg } = alert; // Object destructuring, si existe msg es que hay una alerta
	
	const handleDelete = async () => { 
		const confirmed = confirm('¿Estás seguro de que deseas eliminar tu cuenta y todos tus datos?'); // Mostraremos un confirm por si acaso el usuario le ha dado sin querer o se arrepiente de eliminar su cuenta
		if (confirmed) {
			await Promise.all([
				deleteUser(auth.id), 
				// Limpiamos los estados y localStorage en la eliminacion del usuario
				logout(), // Desde AppContext (estados de la app (posts, perfil, etc))
				logoutPosts() // Desde AuthContext (token de localstorage y auth)
			]);
		};
	};

	return (
		<>
			{auth.id === parseInt(params.id) ? ( // Proteccion: Si el usuario autenticado no coincide con los parametros de la url sera redireccionado
				<>
					<HomeNav />
					<div className="alert-container">
						 {msg && <Alert alert={alert} />} {/* Mostramos la alerta si existe */}
					</div>
					<div className="container container-edit-profile">
						<form encType="multipart/form-data" onSubmit={handleSubmit}>
							<div className="container-title">
								<h2>Editar perfil</h2>
							</div>
							<div className="card">
								<label htmlFor="nick">Nick</label>
								<input
									type="text"
									name="nick"
									id="nick"
									placeholder="Tu nick"
									value={formData.nick}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{touched.nick && errors.nick ? (
									<div className="form-error">
										<p>{errors.nick}</p> {/* Div con los errores de validacion */}
									</div>
								) : null}
							</div>
							<div className="card">
								<label htmlFor="description">Descripción</label>
								<input
									type="text"
									name="description"
									id="description"
									placeholder="Tu descripción"
									value={formData.description}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{touched.description && errors.description ? (
									<div className="form-error">
										<p>{errors.description}</p>  {/* Div con los errores de validacion */}
									</div>
								) : null}
							</div>
							<div className="card">
								<label htmlFor="image">Imagen</label>
								<div className="container-avatar avatar-edit-profile">
									{auth.image === null ? (
										<img src="/avatar.jpg" alt="Default avatar" />
									) : (
										<img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${auth.image}`} alt="User avatar" /> /* Si el usuario no tiene imagen mostramos una por defecto */
									)}
								</div>
								<input
									type="file"
									name="image"
									id="image"
									accept="image/png,.jpeg,.jpg,image/gif"
									onChange={handleChange}
								/>
								{touched.image && errors.image ? (
									<div className="form-error">
										<p>{errors.image}</p>  {/* Div con los errores de validacion */}
									</div>
								) : null}
							</div>
							<div className="button-container">
								<button className="button" type="submit">
									Guardar cambios
								</button>
								<button className="delete" type="button" onClick={handleDelete}>Eliminar el perfil</button>
							</div>
						</form>
					</div>
				</>
			) : (
				<Navigate to="/" />
			)}
		</>
	);
};