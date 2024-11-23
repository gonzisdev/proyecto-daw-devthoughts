import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Spinner } from "../components/Spinner";

// Layout del login
export const AuthLayout = () => {

	const { auth, loading } = useAuth();

	if (auth.id) return <Navigate to="/home" />; // Si existe un usuario logueado, redireccionamos a home
	
	return (
		<>
			<Header />
			<main className="main">
				{loading ? <Spinner/> : <Outlet />}
			</main>
			<Footer />
		</>
	);
};