import { z } from 'zod';

export const transactionDto = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'Transaction type is required',
    invalid_type_error: 'Transaction type must be either income or expense'
  }),
  amount: z.number().min(0, 'Amount must be a positive number'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  category: z.string().optional(),
  date: z.date().optional(),
  tags: z.array(z.string()).optional()
});

export const createTransactionDto = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  type: z.enum(['credit', 'debit'], {
    required_error: 'Transaction type is required',
    invalid_type_error: 'Transaction type must be either credit or debit',
  }),
  description: z.string().optional(),
  date: z.date().optional(),
});

export const updateTransactionDto = z.object({
  customerName: z.string().min(1, 'Customer name is required').optional(),
  amount: z.number().min(0, 'Amount cannot be negative').optional(),
  type: z.enum(['credit', 'debit']).optional(),
  description: z.string().optional(),
  date: z.date().optional(),
}); 