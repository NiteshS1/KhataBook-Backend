import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Please add stock name'],
      trim: true,
      unique: true
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      min: 0
    },
    price: {
      type: Number,
      required: [true, 'Please add price'],
      min: 0
    },
    description: {
      type: String,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Stock = mongoose.model('Stock', stockSchema); 