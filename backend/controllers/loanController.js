import asyncHandler from 'express-async-handler';
import Loan from '../models/Loan.js';
import User from '../models/User.js';
import sendEmail from '../utils/emailService.js';
import { calculateLoanInterest } from '../utils/interestCalculator.js';
import { initiateB2C } from '../utils/mpesa.js';

// @desc    Create a new loan request
// @route   POST /api/loans/request
// @access  Private
const requestLoan = asyncHandler(async (req, res) => {
  const { amount, phone, repaymentPeriod, loanPurpose } = req.body;
  const user = req.user;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid loan amount');
  }

  if (!phone) {
    res.status(400);
    throw new Error('Disbursement phone number is required');
  }

  // Create the loan
  const newLoan = await Loan.create({
    user: user._id,
    amount,
    disbursementPhone: phone,
    repaymentPeriod,
    loanPurpose,
    status: 'pending',
  });

  // Send email to user
  await sendEmail({
    email: user.email,
    subject: 'FinGrow Loan Request Received',
    html: `
      <h1>Loan Request Received</h1>
      <p>Hi ${user.name},</p>
      <p>We have received your loan request for <strong>Ksh ${amount}</strong>.</p>
      <p>It will be disbursed to <strong>${phone}</strong> upon approval.</p>
      <p>Your request is now pending approval. You will be notified of any status changes.</p>
    `,
  });

  res.status(201).json(newLoan);
});

// @desc    Get all loans (Admin)
// @route   GET /api/loans
// @access  Private/Admin
const getAllLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({}).populate('user', 'name email phone');
  res.json(loans);
});

// @desc    Get loans for the logged-in user
// @route   GET /api/loans/myloans
// @access  Private
const getMyLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({ user: req.user._id });
  res.json(loans);
});

// @desc    Get loan by ID
// @route   GET /api/loans/:id
// @access  Private
const getLoanById = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('user', 'name email');

  if (loan && (loan.user._id.equals(req.user._id) || req.user.role === 'admin')) {
    res.json(loan);
  } else {
    res.status(404);
    throw new Error('Loan not found');
  }
});

// @desc    Update loan status (Admin)
// @route   PUT /api/loans/:id/status
// @access  Private/Admin
const updateLoanStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved', 'declined', 'under review'
  const loan = await Loan.findById(req.params.id).populate('user');

  if (!loan) {
    res.status(404);
    throw new Error('Loan not found');
  }

  loan.status = status;
  let emailSubject = '';
  let emailHtml = '';

  if (status === 'approved') {
    // Calculate interest
    const { interest, totalOwed } = calculateLoanInterest(loan.amount);
    loan.interest = interest;
    loan.totalOwed = totalOwed;

    // --- INITIATE B2C DISBURSEMENT ---
    try {
      // Fallback to registered phone if specific disbursement phone is missing
      const phone = loan.disbursementPhone || loan.user.phone;
      const amount = loan.amount; 
      
      const b2cResponse = await initiateB2C(phone, amount, loan._id.toString());
      
      if (b2cResponse.ResponseCode === '0') {
        console.log('B2C Disbursement initiated:', b2cResponse.ConversationID);
        emailSubject = 'FinGrow Loan Approved!';
        emailHtml = `
          <h1>Loan Approved!</h1>
          <p>Hi ${loan.user.name},</p>
          <p>Your loan request for <strong>Ksh ${loan.amount}</strong> has been <strong>APPROVED</strong>.</p>
          <p>We are processing the disbursement to your M-Pesa account (<strong>${phone}</strong>).</p>
          <p>You will receive a final confirmation once the funds are sent.</p>
          <p>Interest (5%): Ksh ${interest}<br>Total Owed: Ksh ${totalOwed}</p>
        `;
      } else {
        throw new Error(b2cResponse.ResponseDescription || 'Failed to initiate B2C');
      }

    } catch (error) {
      console.error('B2C INITIATION FAILED:', error.message);
      // If B2C initiation fails, revert status
      loan.status = 'pending'; 
      res.status(500);
      throw new Error(`Loan approval failed: M-Pesa disbursement could not be initiated. ${error.message}`);
    }
    
  } else if (status === 'declined') {
    emailSubject = 'FinGrow Loan Request Update';
    emailHtml = `
      <h1>Loan Request Declined</h1>
      <p>Hi ${loan.user.name},</p>
      <p>We regret to inform you that your loan request for <strong>Ksh ${loan.amount}</strong> has been <strong>DECLINED</strong>.</p>
    `;
  } else {
    // 'under review' or other status
    emailSubject = 'FinGrow Loan Request Update';
    emailHtml = `
      <h1>Loan Status Update</h1>
      <p>Hi ${loan.user.name},</p>
      <p>The status of your loan request (Ksh ${loan.amount}) has been updated to <strong>${status}</strong>.</p>
    `;
  }

  const updatedLoan = await loan.save();

  // Send notification email
  try {
    await sendEmail({
      email: loan.user.email,
      subject: emailSubject,
      html: emailHtml,
    });
  } catch (emailError) {
    console.error('Loan status update email failed:', emailError);
  }

  res.json(updatedLoan);
});

// Ensure all functions are exported
export { requestLoan, getAllLoans, getMyLoans, updateLoanStatus, getLoanById };