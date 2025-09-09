import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['Pending', 'In-Progress', 'Completed'], default: 'Pending', index: true },
    deadline: { type: Date }
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
