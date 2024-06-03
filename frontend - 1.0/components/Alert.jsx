// Componente de alerta reutilizable via props, recibe un msg y un boolean indicando si hay error o no

export const Alert = ({ alert }) => {
	return (
		<div className={`alert ${alert.error ? "danger" : "success"}`}>
			{alert.msg}
		</div>
	);
};
