import { Router } from "express"
import { likeController} from "../controllers/likeController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

// Establecemos las diferentes rutas, con el middleware de autenticacion y las funciones correspondientes
router.post('/', checkAuth, likeController.addLike);
router.delete('/delete', checkAuth, likeController.removeLike);

export default router;