import { z } from 'zod';

export const stockDto = z.object({
  productName: z.string().min(2, 'Product name must be at least 2 characters'),
  quantity: z.number().min(0, 'Quantity must be a positive number'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().optional(),
  expiryDate: z.date().optional(),
  description: z.string().optional(),
});

export const createStockDto = z.object({
  itemName: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  pricePerItem: z.number().min(0, 'Price cannot be negative'),
  description: z.string().optional(),
});

export const updateStockDto = z.object({
  itemName: z.string().min(1, 'Item name is required').optional(),
  quantity: z.number().min(0, 'Quantity cannot be negative').optional(),
  pricePerItem: z.number().min(0, 'Price cannot be negative').optional(),
  description: z.string().optional(),
}); 