import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    createTransactionController,
    getAllTransactionsController,
    getTransactionByIdController,
    updateTransactionController,
    deleteTransactionController,
    getTransactionsByDateRangeController,
    getTransactionsByTypeController
} from '../controllers/transaction.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Create a new transaction
router.post('/', createTransactionController);

// Get all transactions
router.get('/', getAllTransactionsController);

// Get transaction by ID
router.get('/:id', getTransactionByIdController);

// Update a transaction
router.put('/:id', updateTransactionController);

// Delete a transaction
router.delete('/:id', deleteTransactionController);

// Get transactions by date range
router.get('/date-range', getTransactionsByDateRangeController);

// Get transactions by type
router.get('/type/:type', getTransactionsByTypeController);

export default router; 