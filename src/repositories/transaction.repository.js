import { BaseRepository } from './base.repository.js';
import { Transaction } from '../models/transaction.model.js';

export class TransactionRepository extends BaseRepository {
  constructor() {
    super(Transaction);
  }

  async findByUserId(userId) {
    return this.find({ user: userId });
  }

  async findByDateRange(userId, startDate, endDate) {
    return this.find({
      user: userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
  }

  async findByType(userId, type) {
    return this.find({ user: userId, type });
  }

  async getTotalAmount(userId, type) {
    const transactions = await this.find({ user: userId, type });
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }
} 