import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByDateRange,
  getTransactionsByType
} from '../services/transaction.service.js';
import { logger } from '../utils/logger.js';
import { createTransactionSchema, updateTransactionSchema, getTransactionsByDateRangeSchema } from '../dto/transaction.dto.js';
import Transaction from '../models/transaction.model.js';
import { Stock } from '../models/stock.model.js';

export const createTransactionController = async (req, res) => {
  try {
    const { error } = createTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // If transaction has items, check stock availability
    if (req.body.items && req.body.items.length > 0) {
      // Check if all items are available in stock
      for (const item of req.body.items) {
        const stock = await Stock.findOne({ 
          productName: item.name,
          user: req.user._id 
        });

        if (!stock) {
          return res.status(400).json({ 
            error: `Item "${item.name}" not found in stock` 
          });
        }

        if (stock.quantity < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient quantity for item "${item.name}". Available: ${stock.quantity}, Requested: ${item.quantity}` 
          });
        }
      }

      // Update stock quantities
      for (const item of req.body.items) {
        await Stock.findOneAndUpdate(
          { productName: item.name, user: req.user._id },
          { $inc: { quantity: -item.quantity } }
        );
      }
    }

    const transactionData = {
      ...req.body,
      userId: req.user._id
    };

    const result = await createTransaction(transactionData);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json(result.data);
  } catch (error) {
    logger.error('Create transaction error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllTransactionsController = async (req, res) => {
  try {
    const { days } = req.query;
    let startDate = null;
    
    if (days) {
      const daysNum = parseInt(days);
      if (isNaN(daysNum) || daysNum < 1) {
        return res.status(400).json({ error: 'Days must be a positive number' });
      }
      startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);
    }

    const result = await getTransactions(req.user._id, startDate);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionByIdController = async (req, res) => {
  try {
    const result = await getTransaction(req.params.id);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const { error } = updateTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await updateTransaction(req.params.id, req.body);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const result = await deleteTransaction(req.params.id);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsByDateRangeController = async (req, res) => {
  try {
    const { error } = getTransactionsByDateRangeSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { startDate, endDate } = req.query;
    const result = await getTransactionsByDateRange(req.user._id, new Date(startDate), new Date(endDate));
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsByTypeController = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['paid', 'unpaid'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    const result = await getTransactionsByType(req.user._id, type);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 