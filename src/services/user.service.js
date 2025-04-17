import { BaseService } from './base.service.js';
import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

export class UserService extends BaseService {
  constructor() {
    super(new UserRepository());
  }

  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.create({
        ...userData,
        password: hashedPassword
      });
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async validateUser(email, password) {
    try {
      const user = await this.repository.findByEmail(email);
      if (!user) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      logger.error('Error validating user:', error);
      throw error;
    }
  }

  async updateUserProfile(id, updateData) {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      return this.update(id, updateData);
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async getProfile(userId) {
    try {
      const user = await this.repository.findById(userId).select('-password');

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      logger.error(`Get profile error: ${error.message}`);
      throw error;
    }
  }

  static async updateProfile(userId, userData) {
    try {
      const user = await this.repository.findByIdAndUpdate(
        userId,
        userData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      logger.error(`Update profile error: ${error.message}`);
      throw error;
    }
  }

  static async deleteProfile(userId) {
    try {
      const user = await this.repository.findByIdAndDelete(userId);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      logger.error(`Delete profile error: ${error.message}`);
      throw error;
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await this.repository.findById(userId).select('+password');

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const isMatch = await user.matchPassword(currentPassword);

      if (!isMatch) {
        return {
          success: false,
          message: 'Current password is incorrect',
        };
      }

      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      logger.error(`Change password error: ${error.message}`);
      throw error;
    }
  }
} 