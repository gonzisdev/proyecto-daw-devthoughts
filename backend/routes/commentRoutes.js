import { Router } from "express"
import { commentController } from "../controllers/commentController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

// Establecemos las diferentes rutas, con el middleware de autenticacion y las funciones correspondientes
router.route('/').post(checkAuth, commentController.createComment);
router.route('/delete').delete(checkAuth, commentController.removeComment);

export default router;