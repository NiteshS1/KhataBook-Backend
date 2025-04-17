import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Please add an item name'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      min: [0, 'Quantity cannot be negative'],
    },
    pricePerItem: {
      type: Number,
      required: [true, 'Please add price per item'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
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

export const Stock = mongoose.model('Stock', stockSchema); 