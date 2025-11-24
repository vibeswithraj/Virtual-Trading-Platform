import mongoose, { Schema } from 'mongoose';
const holdingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    avgBuyPrice: { type: Number, required: true },
}, { timestamps: true });
holdingSchema.index({ userId: 1, symbol: 1 }, { unique: true });
export default mongoose.model('Holding', holdingSchema);
