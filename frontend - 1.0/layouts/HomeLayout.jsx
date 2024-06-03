import { Outlet, Navigate } from "react-router-dom";
import { Footer }from "../components/Footer";
import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { useRef } from "react";

// Layout de home o principial
// Colocamos un boton para ir arriba de la pagina, debido al scroll infinito y dar comodidad al usuario
export const HomeLayout = () => {
	
	const { auth } = useAuth();
	const mainHomeRef = useRef(null);

	return (
		<>
			{auth.id ? (
				<>
					<Header />
					<main className="main-home" ref={mainHomeRef}>
						<Outlet />
						<button
							className="to-top"
							onClick={() => {
								if (mainHomeRef.current) {
									mainHomeRef.current.scrollTo({ top: 0, behavior: "smooth" });
								}
							}}
						>
							<img src="/go-up.png" alt="Go to top" />
						</button>
					</main>
					<Footer />
				</>
			) : (
				<Navigate to="/" /> // Si el usuario no esta autenticado lo redirige al login
			)}
		</>
	);
};
