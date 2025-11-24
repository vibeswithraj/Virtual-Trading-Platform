import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    cashBalance: { type: Number, required: true, default: 100000 },
    initialBalance: { type: Number, required: true, default: 100000 },
}, { timestamps: true });
export default mongoose.model('User', userSchema);
