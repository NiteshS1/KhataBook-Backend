import { BaseService } from './base.service.js';
import { StockRepository } from '../repositories/stock.repository.js';
import { logger } from '../utils/logger.js';

export class StockService extends BaseService {
  constructor() {
    super(new StockRepository());
  }

  async addStock(stockData) {
    try {
      const existingStock = await this.repository.findByProductName(stockData.productName);
      
      if (existingStock) {
        // Update existing stock
        return this.repository.updateStockQuantity(
          existingStock._id,
          existingStock.quantity + stockData.quantity
        );
      }
      
      // Create new stock entry
      return this.create(stockData);
    } catch (error) {
      logger.error('Error adding stock:', error);
      throw error;
    }
  }

  async removeStock(productName, quantity) {
    try {
      const stock = await this.repository.findByProductName(productName);
      
      if (!stock) {
        throw new Error('Product not found in stock');
      }
      
      if (stock.quantity < quantity) {
        throw new Error('Insufficient stock quantity');
      }
      
      return this.repository.updateStockQuantity(
        stock._id,
        stock.quantity - quantity
      );
    } catch (error) {
      logger.error('Error removing stock:', error);
      throw error;
    }
  }

  async getLowStockProducts(threshold = 10) {
    try {
      return this.repository.findLowStock(threshold);
    } catch (error) {
      logger.error('Error getting low stock products:', error);
      throw error;
    }
  }

  async getExpiredProducts() {
    try {
      return this.repository.findExpiredProducts();
    } catch (error) {
      logger.error('Error getting expired products:', error);
      throw error;
    }
  }
} 