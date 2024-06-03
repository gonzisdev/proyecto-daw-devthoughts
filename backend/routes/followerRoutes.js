import express from "express";
import { followerController } from "../controllers/followerController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

// Establecemos las diferentes rutas, con el middleware de autenticacion y las funciones correspondientes
router.get('/:id', checkAuth, followerController.getFollowersAndFollowingById);
router.get('/followers/:id', checkAuth, followerController.getFollowers);
router.get('/following/:id', checkAuth, followerController.getFollowing);
router.post('/follow', checkAuth, followerController.follow);
router.delete('/unfollow', checkAuth, followerController.unfollow);

export default router;