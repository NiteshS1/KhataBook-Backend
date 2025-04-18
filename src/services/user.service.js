import { create, findOne, findById, findByIdAndUpdate, findByIdAndDelete } from '../repositories/user.repository.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';

export const createUser = async (userData) => {
  try {
    const user = await create(userData);
    return user;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

export const validateUser = async (email, password) => {
  try {
    const user = await findOne({ email }, '+password');
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  } catch (error) {
    logger.error('Error validating user:', error);
    throw error;
  }
};

export const updateUserProfile = async (id, updateData) => {
  try {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return await findByIdAndUpdate(id, updateData);
  } catch (error) {
    logger.error('Error updating user profile:', error);
    throw error;
  }
};

export const getProfile = async (userId) => {
  try {
    const user = await findById(userId).select('-password');

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
};

export const updateProfile = async (userId, userData) => {
  try {
    const user = await findByIdAndUpdate(
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
};

export const deleteProfile = async (userId) => {
  try {
    const user = await findByIdAndDelete(userId);

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
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await findById(userId).select('+password');

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
};

export const getUserById = async (id) => {
  try {
    const user = await findById(id);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    return {
      success: true,
      data: user
    };
  } catch (error) {
    logger.error('Error getting user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const user = await findByIdAndDelete(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      data: null
    };
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}; 