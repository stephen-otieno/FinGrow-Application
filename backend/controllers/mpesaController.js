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
  // Safely log the body
  try { console.log(JSON.stringify(req.body, null, 2)); } catch (e) {}

  const body = req.body;
  
  // Check if body and stkCallback exist
  if (!body || !body.Body || !body.Body.stkCallback) {
    console.error('Invalid STK callback payload: Missing Body or stkCallback');
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  const checkoutRequestID = body.Body.stkCallback.CheckoutRequestID;
  const resultCode = body.Body.stkCallback.ResultCode;

  if (resultCode === 0) {
    // Payment was successful
    
    // Check for CallbackMetadata
    if (!body.Body.stkCallback.CallbackMetadata || !body.Body.stkCallback.CallbackMetadata.Item) {
      console.error('Invalid STK callback payload: Missing CallbackMetadata');
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }
    
    const metadata = body.Body.stkCallback.CallbackMetadata.Item;
    const amountItem = metadata.find(i => i.Name === 'Amount');
    const mpesaReceiptItem = metadata.find(i => i.Name === 'MpesaReceiptNumber');
    const phoneNumberItem = metadata.find(i => i.Name === 'PhoneNumber');

    // Check for essential items
    if (!amountItem || !mpesaReceiptItem || !phoneNumberItem) {
        console.error('STK Callback: Missing Amount, Receipt, or Phone Number in metadata');
        return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }
    
    const amount = amountItem.Value;
    const mpesaReceipt = mpesaReceiptItem.Value;
    const phoneNumber = phoneNumberItem.Value.toString(); // e.g., 254115598800

    // --- USER LOOKUP FIX ---
    // Get the last 9 digits of the phone number to handle 254 vs 07 formats
    const userPhone = phoneNumber.slice(-9); // e.g., 115598800
    
    // Find a user in the DB whose phone number *ends with* those 9 digits
    const user = await User.findOne({ phone: { $regex: userPhone + '$' } });

    if (!user) {
      console.error(`STK Callback: User not found with phone ending in ${userPhone} (Full number: ${phoneNumber})`);
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
        <p>Your deposit of <strong>Ksh ${amount}</strong> (Ref: ${mpesaReceipt}) was successful.</p>
        <p>Your new savings balance is <strong>Ksh ${user.totalSavings}</strong>.</p>
      `,
    });

    console.log(`Successfully processed saving for ${user.email}`);
  } else {
    // Payment failed or was cancelled
    const resultDesc = body.Body.stkCallback.ResultDesc;
    console.error(`STK Callback Failed: ${resultDesc}`);
  }

  // Respond to Safaricom
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// @desc    Callback for B2C (Loan Disbursement)
// @route   POST /api/mpesa/b2c/result
// @access  Public (from Safaricom)
const b2cResultCallback = asyncHandler(async (req, res) => {
  console.log('--- B2C Result Callback Received ---');
  try { console.log(JSON.stringify(req.body, null, 2)); } catch (e) {}

  const result = req.body.Result;

  // Check for valid result
  if (!result) {
    console.error('Invalid B2C callback payload');
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  const resultCode = result.ResultCode;

  if (resultCode === 0) {
    // --- SUCCESSFUL DISBURSEMENT ---
    
    // 1. Find the Loan ID from Remarks
    let loanId;
    if (result.ResultParameters && result.ResultParameters.ResultParameter) {
        const remarksParam = result.ResultParameters.ResultParameter.find(p => p.Key === 'Remarks');
        if (remarksParam) {
            const remarks = remarksParam.Value;
            const loanIdMatch = remarks.match(/\(ID: (.*)\)/);
            if (loanIdMatch && loanIdMatch[1]) {
                loanId = loanIdMatch[1];
            }
        }
    }

    if (!loanId) {
         console.error('B2C Callback: Could not parse Loan ID from remarks.');
         return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }
  
    const loan = await Loan.findById(loanId).populate('user');
    if (!loan) {
        console.error(`B2C Callback: Loan not found with ID ${loanId}`);
        return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    // 2. Get Transaction ID
    const transactionIDItem = result.ResultParameters.ResultParameter.find(p => p.Key === 'TransactionID');
    const transactionID = transactionIDItem ? transactionIDItem.Value : 'N/A';

    // 3. Update Loan Status
    loan.disbursed = true;
    await loan.save();

    // 4. Send email confirmation
    await sendEmail({
      email: loan.user.email,
      subject: 'FinGrow Loan Disbursed!',
      html: `
        <h1>Loan Disbursed!</h1>
        <p>Hi ${loan.user.name},</p>
        <p>Your loan request for <strong>Ksh ${loan.amount}</strong> has been successfully disbursed to your M-Pesa account.</p>
        <p>Transaction ID: ${transactionID}</p>
        <p>Your total outstanding loan (including interest) is <strong>Ksh ${loan.totalOwed}</strong>.</p>
      `,
    });
    console.log(`Successfully processed disbursement for loan ${loanId}`);
  } else {
    // Disbursement failed
    const resultDesc = result.ResultDesc;
    console.error(`B2C Callback Failed: ${resultDesc}`);
    
    // Note: We can't update the specific loan status easily on failure here 
    // because we don't have the Loan ID in the failure message metadata reliably.
    // In a production app, we would map OriginatorConversationID to the Loan ID in the database.
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
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
};

export { stkCallback, b2cResultCallback, b2cQueueCallback };