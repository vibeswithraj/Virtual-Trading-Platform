// Simple mock market data service with deterministic random-walk style prices.

const BASE_PRICES: Record<string, number> = {
  AAPL: 180,
  GOOG: 140,
  MSFT: 330,
  TSLA: 240,
  RELIANCE: 2600,
  TCS: 3800,
};

export const SYMBOLS = Object.keys(BASE_PRICES);

export function listAllSymbols() {
  return SYMBOLS.map((s) => ({ symbol: s, name: s }));
}

export function getMockPrice(symbol: string) {
  const base = BASE_PRICES[symbol as keyof typeof BASE_PRICES] ?? 100;
  const now = Date.now();
  const noise =
    (Math.sin(now / 60000 + symbol.length) + Math.random() - 0.5) * 2;
  const price = Math.max(1, base + noise);
  return {
    symbol,
    price: Number(price.toFixed(2)),
    change: Number((price - base).toFixed(2)),
    changePct: Number((((price - base) / base) * 100).toFixed(2)),
    asOf: new Date().toISOString(),
  };
}
