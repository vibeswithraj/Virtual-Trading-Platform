'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import TradingViewWidget from '../../../components/TradingViewWidget';

interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
}

export default function SymbolPage() {
  const params = useParams<{ symbol: string }>();
  const symbol = params.symbol;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + `/market/symbols/${symbol}/quote`
        );
        if (!res.ok) throw new Error('Failed to load quote');
        const json = (await res.json()) as Quote;
        setQuote(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (symbol) load();
  }, [symbol]);

  async function handleOrder(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol, side, quantity: Number(quantity) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Order failed');
        return;
      }
      setMessage('Order placed successfully');
    } catch (err) {
      console.error(err);
      setMessage('Unexpected error');
    } finally {
      setPlacing(false);
    }
  }

  if (loading || !quote)
    return <p className="text-sm text-slate-400">Loading {symbol}…</p>;

  const changeColor = quote.change >= 0 ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{quote.symbol}</h1>
          <p className="text-xs text-slate-400">
            Paper trading only · demo data
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold">{quote.price.toFixed(2)}</div>
          <div className={changeColor}>
            {quote.change.toFixed(2)} ({quote.changePct.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded p-3">
        <TradingViewWidget symbol={quote.symbol} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded p-4 md:col-span-2 text-xs text-slate-300">
          <div className="font-medium mb-2">About this symbol</div>
          <p>
            This is a demo symbol using mock price data. Integrate with a real
            market data API for production use.
          </p>
        </div>
        <form
          onSubmit={handleOrder}
          className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3 text-xs"
        >
          <div className="font-medium mb-1">Place order</div>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`flex-1 border rounded py-1 ${
                side === 'BUY'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-slate-700'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`flex-1 border rounded py-1 ${
                side === 'SELL'
                  ? 'border-red-500 text-red-400'
                  : 'border-slate-700'
              }`}
            >
              Sell
            </button>
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-1 text-slate-300">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs outline-none focus:border-sky-500"
              required
            />
          </div>
          {quote && (
            <div className="text-slate-400">
              Est. notional: {(quote.price * Number(quantity || 0)).toFixed(2)}
            </div>
          )}
          {message && <div className="text-xs text-slate-200">{message}</div>}
          <button
            type="submit"
            disabled={placing}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-xs font-medium py-2 rounded"
          >
            {placing ? 'Placing…' : `${side} ${symbol}`}
          </button>
        </form>
      </div>
    </div>
  );
}
