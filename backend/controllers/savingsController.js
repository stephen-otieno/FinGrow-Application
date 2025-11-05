
import asyncHandler from 'express-async-handler';
import { initiateSTKPush } from '../utils/mpesa.js';

// @desc    Initiate an STK push for savings
// @route   POST /api/savings/deposit
// @access  Private
const initiateSaving = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const user = req.user;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  try {
    const phone = user.phone;
    const accountReference = user._id.toString(); // Use user ID as reference

    const response = await initiateSTKPush(phone, amount, accountReference);

    if (response.ResponseCode === '0') {
      res.json({
        message: 'STK push initiated. Please check your phone to complete payment.',
        checkoutRequestID: response.CheckoutRequestID,
      });
    } else {
      throw new Error(response.ResponseDescription);
    }
  } catch (error) {
    res.status(500);
    throw new Error(`M-Pesa STK Push failed: ${error.message}`);
  }
});

export { initiateSaving };