
import express from 'express';
const router = express.Router();
import {
  stkCallback,
  b2cResultCallback,
  b2cQueueCallback,
} from '../controllers/mpesaController.js';

// STK Push (Savings) Callback
router.post('/stk/callback', stkCallback);

// B2C (Disbursement) Callbacks
router.post('/b2c/result', b2cResultCallback);
router.post('/b2c/queue', b2cQueueCallback);

export default router;