import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const userController = new UserController();

// Apply authentication middleware to all routes
router.use(authenticate);

// User routes
router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));
router.delete('/profile', userController.deleteProfile.bind(userController));
router.put('/change-password', userController.changePassword.bind(userController));

export default router; 