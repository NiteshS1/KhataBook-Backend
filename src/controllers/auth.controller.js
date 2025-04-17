import { UserService } from '../services/user.service.js';
import { generateToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
import { registerUserDto, loginUserDto } from '../dto/auth.dto.js';

export class AuthController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res) {
    try {
      const validatedData = registerUserDto.parse(req.body);
      const user = await this.userService.createUser(validatedData);
      
      const token = generateToken(user._id);
      
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          token
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
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

  async login(req, res) {
    try {
      const validatedData = loginUserDto.parse(req.body);
      const user = await this.userService.validateUser(
        validatedData.email,
        validatedData.password
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          token
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
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
} 