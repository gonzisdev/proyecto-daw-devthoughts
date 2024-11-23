import express from "express";
import "dotenv/config";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import cors from "cors";
import { corsOptions } from "./config/cors.js"
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import followerRoutes from "./routes/followerRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";

// Importamos Express para crear y configurar el servidor
const app = express();

// Configurar la ruta para archivos estaticos. Determinamos el directorio actual
// usando __dirname y luego se sirven archivos estaticos desde el subdirectorio 'uploads'
const __dirname = dirname(fileURLToPath(import.meta.url)); // Al usar modulos ES para obtener una funcionalidad similar a __dirname usaremos una combinación de dirname, fileURLToPath e import.meta.url
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// import.meta.url: Proporciona la URL del archivo actual en el formato file://.
// fileURLToPath(import.meta.url): Convierte la URL del archivo de formato file:// a una ruta de archivo. 
// Es necesario porque las operaciones con archivos en Node esperan rutas de archivos, no URLs

// Configuramos CORS 
app.use(cors(corsOptions));

// Habilitamos el middleware para parsear JSON y que la app pueda recibir datos en este formato
app.use(express.json());

// Configuracion de las rutas. Se define la base de la URL para cada grupo 
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/likes', likeRoutes);

export default app;

