import { createUser, validateUser, updateUserProfile, deleteUser } from '../services/user.service.js';
import { findById } from '../repositories/user.repository.js';
import { generateToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
import { registerUserDto, loginUserDto, updateProfileDto, changePasswordDto } from '../dto/user.dto.js';

// Auth Controllers
export const register = async (req, res) => {
  try {
    const validatedData = registerUserDto.parse(req.body);
    const user = await createUser(validatedData);
    
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
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginUserDto.parse(req.body);
    const user = await validateUser(
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
};

// User Profile Controllers
export const getProfileController = async (req, res) => {
  try {
    const user = await findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const validatedData = updateProfileDto.parse(req.body);
    const user = await updateUserProfile(req.user._id, validatedData);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
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
};

export const deleteProfileController = async (req, res) => {
  try {
    await deleteUser(req.user._id);
    res.json({
      success: true,
      data: null
    });
  } catch (error) {
    logger.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const validatedData = changePasswordDto.parse(req.body);
    const user = await validateUser(req.user.email, validatedData.currentPassword);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    await updateUserProfile(req.user._id, { password: validatedData.newPassword });

    res.json({
      success: true,
      data: null
    });
  } catch (error) {
    logger.error('Change password error:', error);
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
}; 