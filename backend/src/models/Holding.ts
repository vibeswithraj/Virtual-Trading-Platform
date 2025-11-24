import mongoose, { Schema, Document } from 'mongoose';

export interface IHolding extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
}

const holdingSchema = new Schema<IHolding>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    avgBuyPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

holdingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.model<IHolding>('Holding', holdingSchema);
