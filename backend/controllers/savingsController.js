import asyncHandler from 'express-async-handler';
import { initiateSTKPush } from '../utils/mpesa.js';

// @desc    Initiate an STK push for savings
// @route   POST /api/savings/deposit
// @access  Private
const initiateSaving = asyncHandler(async (req, res) => {
  const { amount, phone } = req.body; // 1. Extract phone from body
  const user = req.user;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  try {
    // 2. Use provided phone OR fallback to registered phone
    const phoneToUse = phone || user.phone; 
    
    if (!phoneToUse) {
        res.status(400);
        throw new Error('Phone number is required');
    }

    const accountReference = user._id.toString(); 
    const transactionDesc = 'FinGrow Savings Deposit';
    
    const callbackURL = process.env.MPESA_CALLBACK_URL; 
    if (!callbackURL) {
        throw new Error('MPESA_CALLBACK_URL not defined in .env');
    }

    const response = await initiateSTKPush(phoneToUse, amount, accountReference, transactionDesc, callbackURL);

    if (response.ResponseCode === '0') {
      res.json({
        message: 'STK push initiated. Please check your phone to complete payment.',
        checkoutRequestID: response.CheckoutRequestID,
      });
    } else {
      throw new Error(response.ResponseDescription);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error(`M-Pesa STK Push failed: ${error.message}`);
  }
});

export { initiateSaving };