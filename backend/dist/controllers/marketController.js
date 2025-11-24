import { listAllSymbols, getMockPrice } from '../services/marketDataService.js';
export function listSymbols(_req, res) {
    const symbols = listAllSymbols().map((s) => ({
        ...s,
        lastPrice: getMockPrice(s.symbol).price,
    }));
    res.json(symbols);
}
export function getSymbol(req, res) {
    const { symbol } = req.params;
    const all = listAllSymbols();
    const found = all.find((s) => s.symbol === symbol.toUpperCase());
    if (!found) {
        return res.status(404).json({ error: 'Symbol not found' });
    }
    res.json(found);
}
export function getQuote(req, res) {
    const { symbol } = req.params;
    const quote = getMockPrice(symbol.toUpperCase());
    res.json(quote);
}
