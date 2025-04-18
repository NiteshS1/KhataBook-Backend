import { Stock } from '../models/stock.model.js';
import { logger } from '../utils/logger.js';

export const createStock = async (data) => {
  try {
    const stock = await Stock.create(data);
    return {
      success: true,
      data: stock
    };
  } catch (error) {
    logger.error('Create stock service error:', error);
    throw error;
  }
};

export const updateStock = async (id, data) => {
  try {
    const stock = await Stock.findByIdAndUpdate(id, data, { new: true });
    if (!stock) {
      return {
        success: false,
        error: 'Stock not found'
      };
    }
    return {
      success: true,
      data: stock
    };
  } catch (error) {
    logger.error('Update stock service error:', error);
    throw error;
  }
};

export const getStock = async (id) => {
  try {
    const stock = await Stock.findById(id);
    if (!stock) {
      return {
        success: false,
        error: 'Stock not found'
      };
    }
    return {
      success: true,
      data: stock
    };
  } catch (error) {
    logger.error('Get stock service error:', error);
    throw error;
  }
};

export const getAllStocks = async (userId) => {
  try {
    const stocks = await Stock.find({ user: userId });
    return {
      success: true,
      data: stocks
    };
  } catch (error) {
    logger.error('Get all stocks service error:', error);
    throw error;
  }
};

export const deleteStock = async (id) => {
  try {
    const stock = await Stock.findByIdAndDelete(id);
    if (!stock) {
      return {
        success: false,
        error: 'Stock not found'
      };
    }
    return {
      success: true,
      data: stock
    };
  } catch (error) {
    logger.error('Delete stock service error:', error);
    throw error;
  }
};

export const updateStockQuantity = async (id, quantity) => {
  try {
    const stock = await Stock.findById(id);
    if (!stock) {
      return {
        success: false,
        error: 'Stock not found'
      };
    }

    stock.quantity += quantity;
    if (stock.quantity < 0) {
      return {
        success: false,
        error: 'Insufficient stock quantity'
      };
    }

    await stock.save();
    return {
      success: true,
      data: stock
    };
  } catch (error) {
    logger.error('Update stock quantity service error:', error);
    throw error;
  }
}; 