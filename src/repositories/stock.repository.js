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

export const create = async (data) => {
  try {
    return await Stock.create(data);
  } catch (error) {
    throw new Error(`Error creating stock: ${error.message}`);
  }
};

export const find = async (query = {}) => {
  try {
    return await Stock.find(query);
  } catch (error) {
    throw new Error(`Error finding stocks: ${error.message}`);
  }
};

export const findById = async (id) => {
  try {
    return await Stock.findById(id);
  } catch (error) {
    throw new Error(`Error finding stock by id: ${error.message}`);
  }
};

export const findByIdAndUpdate = async (id, data) => {
  try {
    return await Stock.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error(`Error updating stock: ${error.message}`);
  }
};

export const findByIdAndDelete = async (id) => {
  try {
    return await Stock.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting stock: ${error.message}`);
  }
}; 