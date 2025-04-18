import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createStockController,
  updateStockController,
  getStockController,
  getAllStocksController,
  deleteStockController,
  updateStockQuantityController
} from '../controllers/stock.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// @route   POST /api/stocks
// @desc    Create a new stock
// @access  Private
router.post('/', createStockController);

// @route   GET /api/stocks
// @desc    Get all stocks
// @access  Private
router.get('/', getAllStocksController);

// @route   GET /api/stocks/:id
// @desc    Get stock by ID
// @access  Private
router.get('/:id', getStockController);

// @route   PUT /api/stocks/:id
// @desc    Update stock
// @access  Private
router.put('/:id', updateStockController);

// @route   DELETE /api/stocks/:id
// @desc    Delete stock
// @access  Private
router.delete('/:id', deleteStockController);

// @route   PATCH /api/stocks/:id/quantity
// @desc    Update stock quantity
// @access  Private
router.patch('/:id/quantity', updateStockQuantityController);

export default router; 