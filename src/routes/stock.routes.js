import express from 'express';
import { StockController } from '../controllers/stock.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const stockController = new StockController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Stock routes
router.post('/', stockController.addStock.bind(stockController));
router.post('/remove', stockController.removeStock.bind(stockController));
router.get('/', stockController.getStocks.bind(stockController));
router.get('/low-stock', stockController.getLowStockProducts.bind(stockController));
router.get('/expired', stockController.getExpiredProducts.bind(stockController));

export default router; 