import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const useApp = () => useContext(AppContext); // Creamos un hook propio con nuestro context, para mayor comodidad a la hora de programar y acceder al provider