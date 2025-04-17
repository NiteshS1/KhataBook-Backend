import express from 'express';
import { TransactionController } from '../controllers/transaction.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const transactionController = new TransactionController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Transaction routes
router.post('/', transactionController.createTransaction.bind(transactionController));
router.get('/', transactionController.getTransactions.bind(transactionController));
router.get('/date-range', transactionController.getTransactionsByDateRange.bind(transactionController));
router.get('/type/:type', transactionController.getTransactionsByType.bind(transactionController));
router.get('/summary', transactionController.getTransactionSummary.bind(transactionController));

export default router; 