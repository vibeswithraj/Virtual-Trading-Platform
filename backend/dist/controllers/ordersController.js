import mongoose from 'mongoose';
import Holding from '../models/Holding.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { getMockPrice } from '../services/marketDataService.js';
export async function placeOrder(req, res) {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { symbol, side, quantity } = req.body;
    if (!symbol || !side || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid order payload' });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(req.userId).session(session);
        if (!user) {
            throw new Error('User not found');
        }
        const quote = getMockPrice(symbol.toUpperCase());
        const totalValue = quote.price * quantity;
        let holding = await Holding.findOne({
            userId: req.userId,
            symbol: symbol.toUpperCase(),
        }).session(session);
        if (side === 'BUY') {
            if (user.cashBalance < totalValue) {
                await session.abortTransaction();
                return res.status(400).json({ error: 'Insufficient cash balance' });
            }
            const currentQty = holding?.quantity ?? 0;
            const currentAvg = holding?.avgBuyPrice ?? quote.price;
            const newQty = currentQty + quantity;
            const newAvg = (currentQty * currentAvg + quantity * quote.price) / newQty;
            if (!holding) {
                holding = new Holding({
                    userId: req.userId,
                    symbol: symbol.toUpperCase(),
                    quantity: newQty,
                    avgBuyPrice: newAvg,
                });
            }
            else {
                holding.quantity = newQty;
                holding.avgBuyPrice = newAvg;
            }
            user.cashBalance -= totalValue;
            await holding.save({ session });
            await user.save({ session });
        }
        else if (side === 'SELL') {
            if (!holding || holding.quantity < quantity) {
                await session.abortTransaction();
                return res.status(400).json({ error: 'Insufficient holdings' });
            }
            holding.quantity -= quantity;
            if (holding.quantity === 0) {
                await holding.deleteOne({ session });
            }
            else {
                await holding.save({ session });
            }
            user.cashBalance += totalValue;
            await user.save({ session });
        }
        const tx = await Transaction.create([
            {
                userId: req.userId,
                symbol: symbol.toUpperCase(),
                side,
                quantity,
                price: quote.price,
                totalValue,
            },
        ], { session });
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json(tx[0]);
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        return res.status(500).json({ error: 'Failed to place order' });
    }
}
export async function listOrders(req, res) {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const orders = await Transaction.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    res.json(orders);
}
