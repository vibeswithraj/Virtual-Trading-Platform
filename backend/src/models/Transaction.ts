import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    side: { type: String, enum: ['BUY', 'SELL'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
