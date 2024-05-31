import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  is_active: { type: Boolean, default: false, select: false },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    select: false
  },
  activation_token_expire: { type: Date, select: false },
  activation_secret: { type: String, select: false },
  password_changed_at: { type: Date, select: false },
  password_reset_token: String,
  password_reset_expires_in: Date
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.password_changed_at = new Date(Date.now() - 1000);
  next();
});

const userModel = model<IUser>('User', userSchema);
export default userModel;
