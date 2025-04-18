import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import { config } from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/error.middleware.js';
import userRoutes from './routes/user.routes.js';
import stockRoutes from './routes/stock.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import { logger } from './utils/logger.js';

// Load environment variables
config();

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeMiddlewares() {
    // Security middleware
    this.app.use(helmet()); // Set security HTTP headers
    this.app.use(xss()); // Sanitize request data
    
    // CORS configuration
    this.app.use(cors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      maxAge: 600 // Cache preflight request for 10 minutes
    }));
    
    this.app.use(express.json());
    this.app.use(morgan('dev'));
  }

  initializeRoutes() {
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/stocks', stockRoutes);
    this.app.use('/api/transactions', transactionRoutes);
  }

  initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  async start() {
    try {
      await connectDB();
      this.app.listen(this.port, () => {
        logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${this.port}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new App();
app.start(); 