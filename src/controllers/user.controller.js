import { UserService } from '../services/user.service.js';
import { logger } from '../utils/logger.js';
import { updateUserDto } from '../dto/auth.dto.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getProfile(req, res) {
    try {
      const user = await this.userService.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Remove sensitive data
      const { password, ...userData } = user.toObject();
      
      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const validatedData = updateUserDto.parse(req.body);
      const user = await this.userService.updateUserProfile(req.user.id, validatedData);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Remove sensitive data
      const { password, ...userData } = user.toObject();
      
      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async deleteProfile(req, res) {
    try {
      const user = await this.userService.delete(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Delete profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password and new password are required'
        });
      }

      const user = await this.userService.validateUser(req.user.email, currentPassword);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      await this.userService.updatePassword(req.user.id, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 