import multer from "multer";
import fs from "fs";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from "../config/db.js";
import { generateUniqueId }from "../helpers/generateUniqueId.js";

// Configuramos el almacenamiento de la imagen y generamos un id unico con una funcion helper
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, `${generateUniqueId()}${extension}`);
  }
});

// Middleware de subida de imagenes
export const upload = multer({ storage: storage });

// Funcion para borrar la imagen previa en la actualizacion del perfil
// Seleccionamos la ref de la imagen de la BBDD y la borramos de la carpeta uploads
export const deletePreviousImage = async (req, res, next) => {
  try { 
    const [rows, fields] = await db.query('SELECT image FROM users WHERE id = ?', [req.user.id]); 
    if (rows.length > 0 && rows[0].image && req.file) { // Solo borramos la imagen previa si se sube una nueva
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const previousImageName = rows[0].image;
      const uploadPath = path.join(__dirname, '..', 'uploads', previousImageName);
      
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      } ;
    };
    next(); // Saltamos a la siguiente funcion
  } catch (error) {
    console.error('Error deleting the previous image:', error);
    next(error); 
  };
};

// Funcion para borrar la imagen de usuario al eliminar la cuenta
export const deleteImage = async (req, res, next) => {
  try { 
    const [rows, fields] = await db.query('SELECT image FROM users WHERE id = ?', [req.user.id]); 
    if (rows.length > 0 && rows[0].image) {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const previousImageName = rows[0].image;
      const uploadPath = path.join(__dirname, '..', 'uploads', previousImageName);
      
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      } ;
    };
    next(); // Saltamos a la siguiente funcion
  } catch (error) {
    console.error('Error deleting the previous image:', error);
    next(error); 
  };
};