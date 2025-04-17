# Khatabook Backend API

A Node.js backend API for Khatabook application with MongoDB, JWT authentication, and three-tier architecture.

## Features

- User Authentication (Register, Login)
- User Profile Management
- Stock Management
- Transaction Management
- JWT Authentication
- Input Validation using Zod
- Error Handling
- Logging

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT
- Zod
- Winston (Logging)
- Bcryptjs

## Project Structure

```
Backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── dto/           # Data Transfer Objects (Validation)
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── app.js         # Main application file
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### User
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- DELETE /api/users/profile - Delete user profile
- PUT /api/users/change-password - Change password

### Stock
- POST /api/stocks - Create new stock
- GET /api/stocks - Get all stocks
- GET /api/stocks/:id - Get stock by ID
- PUT /api/stocks/:id - Update stock
- DELETE /api/stocks/:id - Delete stock

### Transaction
- POST /api/transactions - Create new transaction
- GET /api/transactions - Get all transactions
- GET /api/transactions/:id - Get transaction by ID
- PUT /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction
- GET /api/transactions/summary - Get transaction summary

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/khatabook
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   LOG_LEVEL=debug
   LOG_FILE=logs/app.log
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Development

- Run in development mode:
  ```bash
  npm run dev
  ```

- Run tests:
  ```bash
  npm test
  ```

## Security

- JWT Authentication
- Password Hashing
- Input Validation
- Error Handling
- Secure Headers

## Error Handling

The API uses a centralized error handling system that:
- Logs errors
- Returns appropriate HTTP status codes
- Provides meaningful error messages
- Includes stack traces in development mode

## Logging

The application uses Winston for logging:
- Error logs are stored in logs/error.log
- Combined logs are stored in logs/combined.log
- Console logging in development mode 