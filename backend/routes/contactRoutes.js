// backend/routes/contactRoutes.js

import express from 'express';
const router = express.Router();
import { submitContactForm } from '../controllers/contactController.js';

// This is a public route, so no 'protect' middleware is needed
router.route('/').post(submitContactForm);

export default router;