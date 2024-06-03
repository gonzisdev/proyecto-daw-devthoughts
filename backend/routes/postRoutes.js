import express from "express";
import { postController } from "../controllers/postController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

// Establecemos las diferentes rutas, con el middleware de autenticacion y las funciones correspondientes
router.route('/')
      .get(checkAuth, postController.getAllPosts)
      .post(checkAuth, postController.createPost);
router.get('/post/:id', checkAuth, postController.getPostById);
router.delete('/delete', checkAuth, postController.removePost);
router.post('/liked', checkAuth, postController.getLikedPosts);
router.post('/profile-posts', checkAuth, postController.getProfilePosts);
router.post('/following-posts', checkAuth, postController.getFollowingPosts);

export default router;