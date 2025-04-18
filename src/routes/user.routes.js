import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  register,
  login,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  changePasswordController
} from '../controllers/user.controller.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (auth required)
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', getProfileController);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateProfileController);

// @route   DELETE /api/users/profile
// @desc    Delete user profile
// @access  Private
router.delete('/profile', deleteProfileController);

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', changePasswordController);

export default router; 