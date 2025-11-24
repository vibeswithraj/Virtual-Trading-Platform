import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  cashBalance: number;
  initialBalance: number;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    cashBalance: { type: Number, required: true, default: 100000 },
    initialBalance: { type: Number, required: true, default: 100000 },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
