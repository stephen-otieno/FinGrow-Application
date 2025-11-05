
import express from 'express';
const router = express.Router();
import { getUserProfile, getAllUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getAllUsers);
router.route('/profile').get(protect, getUserProfile);

export default router;