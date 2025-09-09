import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, noContent, notFound, ok } from '../utils/responses.js';

export const createTask = asyncHandler(async (req, res) => {
  const doc = await Task.create({ ...req.body, user: req.user.id });
  return created(res, doc);
});

export const listTasks = asyncHandler(async (req, res) => {
  const { status, q, page = 1, limit = 20 } = req.query;
  const filter = { user: req.user.id };
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Task.countDocuments(filter)
  ]);
  return ok(res, { items, total, page: Number(page), limit: Number(limit) });
});

export const getTask = asyncHandler(async (req, res) => {
  const doc = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!doc) return notFound(res, 'Task not found');
  return ok(res, doc);
});

export const updateTask = asyncHandler(async (req, res) => {
  const doc = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!doc) return notFound(res, 'Task not found');
  return ok(res, doc);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const doc = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!doc) return notFound(res, 'Task not found');
  return noContent(res);
});
