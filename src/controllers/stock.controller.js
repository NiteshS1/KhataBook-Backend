import { StockService } from '../services/stock.service.js';
import { logger } from '../utils/logger.js';
import { stockDto } from '../dto/stock.dto.js';

export class StockController {
  constructor() {
    this.stockService = new StockService();
  }

  async addStock(req, res) {
    try {
      const validatedData = stockDto.parse(req.body);
      const stock = await this.stockService.addStock(validatedData);
      
      res.status(201).json({
        success: true,
        data: stock
      });
    } catch (error) {
      logger.error('Add stock error:', error);
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

  async removeStock(req, res) {
    try {
      const { productName, quantity } = req.body;
      const stock = await this.stockService.removeStock(productName, quantity);
      
      res.json({
        success: true,
        data: stock
      });
    } catch (error) {
      logger.error('Remove stock error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getStocks(req, res) {
    try {
      const stocks = await this.stockService.find();
      
      res.json({
        success: true,
        data: stocks
      });
    } catch (error) {
      logger.error('Get stocks error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getLowStockProducts(req, res) {
    try {
      const threshold = parseInt(req.query.threshold) || 10;
      const products = await this.stockService.getLowStockProducts(threshold);
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Get low stock products error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getExpiredProducts(req, res) {
    try {
      const products = await this.stockService.getExpiredProducts();
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Get expired products error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 