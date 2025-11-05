// backend/models/Loan.js

import mongoose from 'mongoose';

const loanSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'declined', 'under review'],
      default: 'pending',
    },
    interest: {
      type: Number, // 5% of the amount
      default: 0,
    },
    totalOwed: {
      type: Number, // amount + interest
      default: 0,
    },
    disbursed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;