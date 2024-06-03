// Componente del spinner que utilizaremos en los perfiles y en las listas de seguidores, ya que hay diversas llamadas al backend 
// Una vez tengamos toda la informacion necesaria setearemos el estado del spinner a false

export const Spinner = () => {
  return (
		<div className="spinner">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};

