import { Router } from "express"
import { userController } from "../controllers/userController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { upload, deletePreviousImage, deleteImage } from "../middleware/multer.js";

const router = Router();

// Establecemos las diferentes rutas, con el middleware de autenticacion y las funciones correspondientes 
// El registro, login y recuperacion de password no estan protegidas por middleware ya que no se requiere estar autenticado para hacer la peticion
router.post('/', userController.signUp);
router.post('/login', userController.logIn);
router.post('/forgot-password', userController.forgotPassword);
router.put('/updateprofile/:id', checkAuth, upload.single('image'), deletePreviousImage, userController.updateProfile); // Borramos imagen previa de la carpeta uploads si existe y si se sube nueva imagen, subimos la nueva imagen y actualizamos el perfil
router.delete('/delete', checkAuth, deleteImage, userController.deleteUser); // Cuando eliminamos un usuario tambien eliminamos la imagen de uploads
router.post('/search', checkAuth, userController.searchUser);
router.get('/userprofile/:id', checkAuth, userController.getUserById);
router.get('/profile', checkAuth, userController.profile);

export default router;