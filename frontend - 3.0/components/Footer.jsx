// Componente del footer con fecha dinamica gracias a JS y el metodo getFullYear()
export const Footer = () => {
	return (
		<div className="footer">
			<p>
				<span>DevThoughts</span> - Todos los derechos reservados &copy;
				{new Date().getFullYear()}
			</p>
		</div>
	);
};

