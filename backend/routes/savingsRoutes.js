
import express from 'express';
const router = express.Router();
import { initiateSaving } from '../controllers/savingsController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/deposit').post(protect, initiateSaving);

export default router;