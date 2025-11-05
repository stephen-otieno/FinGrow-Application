// backend/models/Saving.js

import mongoose from 'mongoose';

const savingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: { type: Number, required: true },
    mpesaTransactionId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Saving = mongoose.model('Saving', savingSchema);
export default Saving;