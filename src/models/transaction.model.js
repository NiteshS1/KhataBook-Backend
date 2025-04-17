import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Please add customer name'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add amount'],
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: [true, 'Please specify transaction type'],
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model('Transaction', transactionSchema); 