import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, { dbName: 'nyuc_task_manager' });
  console.log('MongoDB connected');
}
