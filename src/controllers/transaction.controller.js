import { TransactionService } from '../services/transaction.service.js';
import { logger } from '../utils/logger.js';
import { transactionDto } from '../dto/transaction.dto.js';

export class TransactionController {
  constructor() {
    this.transactionService = new TransactionService();
  }

  async createTransaction(req, res) {
    try {
      const validatedData = transactionDto.parse(req.body);
      const transaction = await this.transactionService.createTransaction({
        ...validatedData,
        user: req.user.id
      });
      
      res.status(201).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      logger.error('Create transaction error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getTransactions(req, res) {
    try {
      const transactions = await this.transactionService.getUserTransactions(req.user.id);
      
      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      logger.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getTransactionsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const transactions = await this.transactionService.getTransactionsByDateRange(
        req.user.id,
        new Date(startDate),
        new Date(endDate)
      );
      
      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      logger.error('Get transactions by date range error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getTransactionsByType(req, res) {
    try {
      const { type } = req.params;
      const transactions = await this.transactionService.getTransactionsByType(
        req.user.id,
        type
      );
      
      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      logger.error('Get transactions by type error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getTransactionSummary(req, res) {
    try {
      const summary = await this.transactionService.getTransactionSummary(req.user.id);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      logger.error('Get transaction summary error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 