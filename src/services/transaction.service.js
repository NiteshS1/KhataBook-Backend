import {
  create,
  find,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete
} from '../repositories/transaction.repository.js';
import { logger } from '../utils/logger.js';

export const createTransaction = async (data) => {
  try {
    const transaction = await create(data);
    return {
      success: true,
      data: transaction
    };
  } catch (error) {
    logger.error('Create transaction service error:', error);
    throw error;
  }
};

export const getTransactions = async (userId, startDate = null) => {
  try {
    const query = { userId };
    
    if (startDate) {
      query.date = { $gte: startDate };
    }

    const transactions = await find(query);
    return {
      success: true,
      data: transactions
    };
  } catch (error) {
    logger.error('Get transactions service error:', error);
    throw error;
  }
};

export const getTransaction = async (id) => {
  try {
    const transaction = await findById(id);
    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found'
      };
    }
    return {
      success: true,
      data: transaction
    };
  } catch (error) {
    logger.error('Get transaction service error:', error);
    throw error;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const transaction = await findByIdAndUpdate(id, data, { new: true });
    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found'
      };
    }
    return {
      success: true,
      data: transaction
    };
  } catch (error) {
    logger.error('Update transaction service error:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const transaction = await findByIdAndDelete(id);
    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found'
      };
    }
    return {
      success: true,
      data: transaction
    };
  } catch (error) {
    logger.error('Delete transaction service error:', error);
    throw error;
  }
};

export const getTransactionsByDateRange = async (userId, startDate, endDate) => {
  try {
    const transactions = await find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    return {
      success: true,
      data: transactions
    };
  } catch (error) {
    logger.error('Get transactions by date range service error:', error);
    throw error;
  }
};

export const getTransactionsByType = async (userId, type) => {
  try {
    const transactions = await find({
      userId,
      type
    });
    return {
      success: true,
      data: transactions
    };
  } catch (error) {
    logger.error('Get transactions by type service error:', error);
    throw error;
  }
};

export class TransactionService {
  async getUserTransactions(userId) {
    try {
      return this.repository.findByUserId(userId);
    } catch (error) {
      logger.error('Error getting user transactions:', error);
      throw error;
    }
  }

  async getTransactionsByDateRange(userId, startDate, endDate) {
    try {
      return this.repository.findByDateRange(userId, startDate, endDate);
    } catch (error) {
      logger.error('Error getting transactions by date range:', error);
      throw error;
    }
  }

  async getTransactionsByType(userId, type) {
    try {
      return this.repository.findByType(userId, type);
    } catch (error) {
      logger.error('Error getting transactions by type:', error);
      throw error;
    }
  }

  async getTotalAmountByType(userId, type) {
    try {
      return this.repository.getTotalAmount(userId, type);
    } catch (error) {
      logger.error('Error getting total amount by type:', error);
      throw error;
    }
  }

  async getTransactionSummary(userId) {
    try {
      const [paid, unpaid] = await Promise.all([
        this.getTotalAmountByType(userId, 'paid'),
        this.getTotalAmountByType(userId, 'unpaid')
      ]);

      return {
        paid,
        unpaid,
        balance: paid - unpaid
      };
    } catch (error) {
      logger.error('Error getting transaction summary:', error);
      throw error;
    }
  }
} 