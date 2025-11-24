import Holding from '../models/Holding.js';
import User from '../models/User.js';
import { getMockPrice } from '../services/marketDataService.js';
export async function getPortfolio(req, res) {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User.findById(req.userId).lean();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const holdings = await Holding.find({ userId: req.userId }).lean();
    let totalHoldingsValue = 0;
    const holdingsWithPricing = holdings.map((h) => {
        const quote = getMockPrice(h.symbol.toUpperCase());
        const marketValue = h.quantity * quote.price;
        const costBasis = h.quantity * h.avgBuyPrice;
        const unrealizedPnl = marketValue - costBasis;
        totalHoldingsValue += marketValue;
        return {
            symbol: h.symbol,
            quantity: h.quantity,
            avgBuyPrice: h.avgBuyPrice,
            currentPrice: quote.price,
            marketValue,
            unrealizedPnl,
        };
    });
    const portfolioValue = user.cashBalance + totalHoldingsValue;
    res.json({
        cashBalance: user.cashBalance,
        holdings: holdingsWithPricing,
        portfolioValue,
    });
}
