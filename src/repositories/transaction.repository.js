import Transaction from '../models/transaction.model.js';

export const create = async (data) => {
  return await Transaction.create(data);
};

export const find = async (query) => {
  return await Transaction.find(query);
};

export const findById = async (id) => {
  return await Transaction.findById(id);
};

export const findByIdAndUpdate = async (id, data) => {
  return await Transaction.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

export const findByUserId = async (userId) => {
  return await Transaction.find({ user: userId });
};

export const findByDateRange = async (userId, startDate, endDate) => {
  return await Transaction.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

export const findByType = async (userId, type) => {
  return await Transaction.find({ user: userId, type });
};

export const getTotalAmount = async (userId, type) => {
  const result = await Transaction.aggregate([
    { $match: { user: userId, type } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result[0]?.total || 0;
}; 