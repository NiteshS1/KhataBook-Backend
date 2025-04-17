import { BaseService } from './base.service.js';
import { TransactionRepository } from '../repositories/transaction.repository.js';
import { logger } from '../utils/logger.js';

export class TransactionService extends BaseService {
  constructor() {
    super(new TransactionRepository());
  }

  async createTransaction(transactionData) {
    try {
      return this.create(transactionData);
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }

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
      const [income, expense] = await Promise.all([
        this.getTotalAmountByType(userId, 'income'),
        this.getTotalAmountByType(userId, 'expense')
      ]);

      return {
        income,
        expense,
        balance: income - expense
      };
    } catch (error) {
      logger.error('Error getting transaction summary:', error);
      throw error;
    }
  }
} 