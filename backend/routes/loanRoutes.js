
import express from 'express';
const router = express.Router();
import {
  requestLoan,
  getAllLoans,
  getMyLoans,
  updateLoanStatus,
} from '../controllers/loanController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getAllLoans);
router.route('/request').post(protect, requestLoan);
router.route('/myloans').get(protect, getMyLoans);
router.route('/:id/status').put(protect, admin, updateLoanStatus);

export default router;