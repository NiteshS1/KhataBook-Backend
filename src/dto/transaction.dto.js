import { z } from 'zod';
import Joi from 'joi';

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be a positive number')
});

export const transactionDto = z.object({
  type: z.enum(['paid', 'unpaid'], {
    required_error: 'Transaction type is required',
    invalid_type_error: 'Transaction type must be either paid or unpaid'
  }),
  amount: z.number().min(0, 'Amount must be a positive number'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  category: z.string().optional(),
  date: z.date().optional(),
  tags: z.array(z.string()).optional(),
  items: z.array(itemSchema).optional()
});

export const createTransactionDto = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  type: z.enum(['paid', 'unpaid'], {
    required_error: 'Transaction type is required',
    invalid_type_error: 'Transaction type must be either paid or unpaid',
  }),
  description: z.string().optional(),
  date: z.date().optional(),
  items: z.array(itemSchema).optional()
});

export const updateTransactionDto = z.object({
  customerName: z.string().min(1, 'Customer name is required').optional(),
  amount: z.number().min(0, 'Amount cannot be negative').optional(),
  type: z.enum(['paid', 'unpaid']).optional(),
  description: z.string().optional(),
  date: z.date().optional(),
  items: z.array(itemSchema).optional()
});

const createTransactionSchema = Joi.object({
    amount: Joi.number().required().min(0),
    type: Joi.string().valid('paid', 'unpaid').required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    customerName: Joi.string().required(),
    date: Joi.date().default(Date.now),
    items: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            quantity: Joi.number().required().min(1),
            price: Joi.number().required().min(0)
        })
    ).optional()
});

const updateTransactionSchema = Joi.object({
    amount: Joi.number().min(0),
    type: Joi.string().valid('paid', 'unpaid'),
    description: Joi.string(),
    category: Joi.string(),
    customerName: Joi.string(),
    date: Joi.date(),
    items: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            quantity: Joi.number().required().min(1),
            price: Joi.number().required().min(0)
        })
    ).optional()
});

const getTransactionsByDateRangeSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
});

export {
    createTransactionSchema,
    updateTransactionSchema,
    getTransactionsByDateRangeSchema
}; 