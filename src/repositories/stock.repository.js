import { BaseRepository } from './base.repository.js';
import { Stock } from '../models/stock.model.js';

export class StockRepository extends BaseRepository {
  constructor() {
    super(Stock);
  }

  async findByProductName(productName) {
    return this.findOne({ productName });
  }

  async findLowStock(threshold = 10) {
    return this.find({ quantity: { $lt: threshold } });
  }

  async updateStockQuantity(id, quantity) {
    return this.update(id, { quantity });
  }

  async findExpiredProducts() {
    return this.find({ expiryDate: { $lt: new Date() } });
  }
} 