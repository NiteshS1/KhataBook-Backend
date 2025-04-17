import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { logger } from '../utils/logger.js';

export class AuthService {
  static async register(userData) {
    try {
      const user = await User.create(userData);
      const token = this.generateToken(user._id);

      return {
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      };
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      const token = this.generateToken(user._id);

      return {
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      };
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }
} 