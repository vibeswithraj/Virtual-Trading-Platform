import mongoose, { Schema } from 'mongoose';
const transactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    side: { type: String, enum: ['BUY', 'SELL'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalValue: { type: Number, required: true },
}, { timestamps: true });
export default mongoose.model('Transaction', transactionSchema);
