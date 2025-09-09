import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, lowercase: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plain) {
  const rounds = 10;
  return bcrypt.hash(plain, rounds);
};

export const User = mongoose.model('User', userSchema);
