// This handles the callbacks from Safaricom

import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Saving from '../models/Saving.js';
import Loan from '../models/Loan.js';
import sendEmail from '../utils/emailService.js';

// @desc    Callback for STK Push (Savings)
// @route   POST /api/mpesa/stk/callback
// @access  Public (from Safaricom)
const stkCallback = asyncHandler(async (req, res) => {
  console.log('--- STK Callback Received ---');
  console.log(JSON.stringify(req.body, null, 2));

  const body = req.body;
  const checkoutRequestID = body.Body.stkCallback.CheckoutRequestID;
  const resultCode = body.Body.stkCallback.ResultCode;

  if (resultCode === 0) {
    // Payment was successful
    const metadata = body.Body.stkCallback.CallbackMetadata.Item;
    const amount = metadata.find(i => i.Name === 'Amount').Value;
    const mpesaReceipt = metadata.find(i => i.Name === 'MpesaReceiptNumber').Value;
    const phoneNumber = metadata.find(i => i.Name === 'PhoneNumber').Value;

    // The AccountReference from the STK push initiation is not in the callback.
    // We must find the user by phone number.
    // NOTE: This assumes phone numbers are unique identifiers.
    const user = await User.findOne({ phone: phoneNumber.toString().slice(-9) }); // Find user by last 9 digits

    if (!user) {
      console.error(`STK Callback: User not found with phone ${phoneNumber}`);
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    // 1. Create Saving record
    const newSaving = await Saving.create({
      user: user._id,
      amount: amount,
      mpesaTransactionId: mpesaReceipt,
    });

    // 2. Update User's totalSavings
    user.totalSavings += Number(amount);
    await user.save();

    // 3. Send email confirmation
    await sendEmail({
      email: user.email,
      subject: 'FinGrow Deposit Confirmation',
      html: `
        <h1>Deposit Successful!</h1>
        <p>Hi ${user.name},</p>
        <p>Your deposit of **Ksh ${amount}** (Ref: ${mpesaReceipt}) was successful.</p>
        <p>Your new savings balance is **Ksh ${user.totalSavings}**.</p>
      `,
    });

    console.log(`Successfully processed saving for ${user.email}`);
  } else {
    // Payment failed or was cancelled
    const resultDesc = body.Body.stkCallback.ResultDesc;
    console.error(`STK Callback Failed: ${resultDesc}`);
    // Optionally, send an email to the user about the failed transaction
  }

  // Respond to Safaricom
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// @desc    Callback for B2C (Loan Disbursement)
// @route   POST /api/mpesa/b2c/result
// @access  Public (from Safaricom)
const b2cResultCallback = asyncHandler(async (req, res) => {
  console.log('--- B2C Result Callback Received ---');
  console.log(JSON.stringify(req.body, null, 2));

  const result = req.body.Result;
  const resultCode = result.ResultCode;

  // Get ConversationID to find the loan
  const conversationID = result.ConversationID;
  // We should ideally store this ConversationID when we initiate B2C, 
  // but for simplicity, we'll get the loan ID from remarks.

  const remarks = result.ResultParameters.ResultParameter.find(
    p => p.Key === 'Remarks'
  ).Value;

  // Extract loan ID from remarks "FinGrow Loan Disbursement (ID: 60...)"
  const loanIdMatch = remarks.match(/\(ID: (.*)\)/);

  if (!loanIdMatch || !loanIdMatch[1]) {
     console.error('B2C Callback: Could not parse Loan ID from remarks:', remarks);
     return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  const loanId = loanIdMatch[1];
  const loan = await Loan.findById(loanId).populate('user');

  if (!loan) {
    console.error(`B2C Callback: Loan not found with ID ${loanId}`);
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  if (resultCode === 0) {
    // Disbursement was successful
    const transactionID = result.ResultParameters.ResultParameter.find(
      p => p.Key === 'TransactionID'
    ).Value;

    loan.disbursed = true;
    // Optionally save the B2C transaction ID to the loan model
    // loan.disbursementTransactionId = transactionID;
    await loan.save();

    // Send email confirmation
    await sendEmail({
      email: loan.user.email,
      subject: 'FinGrow Loan Disbursed!',
      html: `
        <h1>Loan Disbursed!</h1>
        <p>Hi ${loan.user.name},</p>
        <p>Your loan request for **Ksh ${loan.amount}** has been successfully disbursed to your M-Pesa account.</p>
        <p>Transaction ID: ${transactionID}</p>
        <p>Your total outstanding loan (including interest) is **Ksh ${loan.totalOwed}**.</p>
      `,
    });
    console.log(`Successfully processed disbursement for loan ${loanId}`);
  } else {
    // Disbursement failed
    const resultDesc = result.ResultDesc;
    console.error(`B2C Callback Failed for Loan ${loanId}: ${resultDesc}`);

    // Mark loan as approved but not disbursed, or 'failed_disbursement'
    loan.status = 'approved'; // It's still approved, but...
    loan.disbursed = false; // ...failed to send.
    await loan.save();

    // Notify admin and user that disbursement failed
    await sendEmail({
       email: loan.user.email,
       subject: 'FinGrow Loan Disbursement FAILED',
       html: `<p>Hi ${loan.user.name}, We apologize, but the disbursement for your approved loan (ID: ${loanId}) failed. Please contact support.</p>`,
    });
    // TODO: Notify admin as well
  }

  // Respond to Safaricom
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// @desc    Timeout URL for B2C
// @route   POST /api/mpesa/b2c/queue
// @access  Public
const b2cQueueCallback = (req, res) => {
  console.log('--- B2C Queue Timeout Received ---');
  console.log(JSON.stringify(req.body, null, 2));
  // Log this for debugging, but no major action needed
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
};

export { stkCallback, b2cResultCallback, b2cQueueCallback };