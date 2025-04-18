import User from '../models/user.model.js';

export const create = async (data) => {
  return await User.create(data);
};

export const findOne = async (query, select = '') => {
  return await User.findOne(query).select(select);
};

export const findById = async (id, select = '') => {
  return await User.findById(id).select(select);
};

export const findByIdAndUpdate = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const find = async (query) => {
  return await User.find(query);
};

export const findOneAndUpdate = async (query, data) => {
  return await User.findOneAndUpdate(query, data, { new: true });
};

export const findByEmail = async (email) => {
  try {
    return await User.findOne({ email }).select('+password');
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

export const updatePassword = async (id, hashedPassword) => {
  return User.update(id, { password: hashedPassword });
}; 