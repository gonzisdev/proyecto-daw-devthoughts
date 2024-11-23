import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Cargamos la variables de entorno

export const db = await mysql.createConnection({ // Creamos la conexion
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});
