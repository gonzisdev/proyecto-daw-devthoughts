// Funcion  para convertir a fecha española + hora
export const convertToSpanishDate = (isoDateString) => {
	const date = new Date(isoDateString);
	const optionsDate = { year: "numeric", month: "long", day: "numeric" };
	const optionsTime = { hour: "numeric", minute: "numeric", second: "numeric" };

	const formattedDate = date.toLocaleDateString("es-ES", optionsDate);
	const formattedTime = date.toLocaleTimeString("es-ES", optionsTime);

	return `${formattedDate} a las ${formattedTime}`;
};

// Funcion helper para los usuarios (en seguidos y seguidores), en los cuales no requerimos la hora
export const convertToSpanishDateUser = (isoDateString) => {
	const date = new Date(isoDateString);
	const optionsDate = { year: "numeric", month: "long", day: "numeric" };

	const formattedDate = date.toLocaleDateString("es-ES", optionsDate);

	return formattedDate; 
};