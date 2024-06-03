import { useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Spinner } from "../components/Spinner";

// Layout de home o principial
export const HomeLayout = () => {
	
	const { auth, loading } = useAuth();
	const mainHomeRef = useRef(null);

	return (
		<>
			<Header />
			<main className="main-home" ref={mainHomeRef}>
				{loading ? (
					<Spinner />
				) : !auth || !auth.id ? ( // Si no existe usuario logueado, redireccionamos a la pagina principal, evitando que se pueda acceder a las rutas protegidas
					<Navigate to="/" />
				) : (	
					<Outlet />
				)}
				<button // Colocamos un boton para ir arriba de la pagina, debido al scroll infinito y dar comodidad al usuario
					className="to-top"
					onClick={() => mainHomeRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
				>
					<img src="/go-up.png" alt="Go to top" />
				</button>
			</main>
			<Footer />
		</>
	);
};
