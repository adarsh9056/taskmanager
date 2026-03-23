const mongoose = require('mongoose');

const Task = require('../models/Task');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildTaskFilters = (userId, query) => {
  const filters = { user: userId };

  if (query.status) {
    filters.status = query.status;
  }

  if (query.search) {
    const searchRegex = new RegExp(escapeRegExp(query.search), 'i');

    filters.$or = [{ title: searchRegex }, { description: searchRegex }];
  }

  if (query.dueFrom || query.dueTo) {
    filters.dueDate = {};

    if (query.dueFrom) {
      filters.dueDate.$gte = new Date(query.dueFrom);
    }

    if (query.dueTo) {
      filters.dueDate.$lte = new Date(query.dueTo);
    }
  }

  return filters;
};

const buildSortConfig = (sortBy = 'createdAt', order = 'desc') => ({
  [sortBy]: order === 'asc' ? 1 : -1
});

const getTasks = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 6;
  const filters = buildTaskFilters(req.user.id, req.query);
  const sort = buildSortConfig(req.query.sortBy, req.query.order);

  const [tasks, total] = await Promise.all([
    Task.find(filters)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filters)
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  res.status(200).json({
    success: true,
    data: {
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    throw new AppError('Task not found.', 404, 'TASK_NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: {
      task
    }
  });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully.',
    data: {
      task
    }
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([, value]) => value !== undefined)
  );

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!task) {
    throw new AppError('Task not found.', 404, 'TASK_NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully.',
    data: {
      task
    }
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!task) {
    throw new AppError('Task not found.', 404, 'TASK_NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully.'
  });
});

const getTaskStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);

  const [statusBuckets, total, overdue, dueSoon] = await Promise.all([
    Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Task.countDocuments({ user: req.user.id }),
    Task.countDocuments({
      user: req.user.id,
      status: { $ne: 'completed' },
      dueDate: { $lt: now }
    }),
    Task.countDocuments({
      user: req.user.id,
      status: { $ne: 'completed' },
      dueDate: { $gte: now, $lte: sevenDaysFromNow }
    })
  ]);

  const summary = {
    total,
    todo: 0,
    'in-progress': 0,
    completed: 0,
    overdue,
    dueSoon
  };

  statusBuckets.forEach((bucket) => {
    summary[bucket._id] = bucket.count;
  });

  res.status(200).json({
    success: true,
    data: {
      stats: summary
    }
  });
});

module.exports = {
  createTask,
  deleteTask,
  getTaskById,
  getTaskStats,
  getTasks,
  updateTask
};
