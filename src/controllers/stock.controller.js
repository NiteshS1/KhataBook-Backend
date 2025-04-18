import {
  createStock,
  getAllStocks,
  getStock,
  updateStock,
  deleteStock,
  updateStockQuantity
} from '../services/stock.service.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const stockDto = z.object({
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.number().min(0, 'Quantity must be a positive number'),
  price: z.number().min(0, 'Price must be a positive number'),
  description: z.string().optional()
});

export const createStockController = async (req, res) => {
  try {
    const validatedData = stockDto.parse(req.body);
    const result = await createStock({
      ...validatedData,
      user: req.user.id
    });
    res.status(201).json(result);
  } catch (error) {
    logger.error('Create stock error:', error);
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
};

export const getStocksController = async (req, res) => {
  try {
    const result = await getStocks();
    res.json(result);
  } catch (error) {
    logger.error('Get stocks error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getStockController = async (req, res) => {
  try {
    const result = await getStock(req.params.id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    logger.error('Get stock error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateStockController = async (req, res) => {
  try {
    const validatedData = stockDto.parse(req.body);
    const result = await updateStock(req.params.id, validatedData);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    logger.error('Update stock error:', error);
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
};

export const getAllStocksController = async (req, res) => {
  try {
    const result = await getAllStocks(req.user.id);
    res.json(result);
  } catch (error) {
    logger.error('Get all stocks error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteStockController = async (req, res) => {
  try {
    const result = await deleteStock(req.params.id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    logger.error('Delete stock error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateStockQuantityController = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be a number'
      });
    }
    const result = await updateStockQuantity(req.params.id, quantity);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    logger.error('Update stock quantity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

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