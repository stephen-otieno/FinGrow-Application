
// import express from 'express';
// const router = express.Router();
// import {
//   requestLoan,
//   updateLoanStatus,
// } from '../controllers/loanController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

// router.route('/').get(protect, admin, getAllLoans);
// router.route('/request').post(protect, requestLoan);
// router.route('/myloans').get(protect, getMyLoans);
// router.route('/:id/status').put(protect, admin, updateLoanStatus);

// export default router;

import express from 'express';
const router = express.Router();

// Import ALL controller functions explicitly
import {
  requestLoan,
  getAllLoans,   // <--- This was missing or not imported correctly
  getMyLoans,
  getLoanById,
  updateLoanStatus
} from '../controllers/loanController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

// Admin routes
// checks: protect (logged in), admin (is admin role), then calls getAllLoans
router.route('/').get(protect, admin, getAllLoans);

// Update status (Approve/Decline)
router.route('/:id/status').put(protect, admin, updateLoanStatus);

// User routes
// Request a loan
router.route('/request').post(protect, requestLoan);

// Get my specific loans
router.route('/myloans').get(protect, getMyLoans);

// Get details of a single loan (by ID)
router.route('/:id').get(protect, getLoanById);

export default router;