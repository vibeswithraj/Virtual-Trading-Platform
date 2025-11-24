'use client';

import { useEffect, useState } from 'react';

interface Holding {
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
}

interface PortfolioResponse {
  cashBalance: number;
  holdings: Holding[];
  portfolioValue: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/portfolio',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error('Failed to load portfolio');
        }
        const json = (await res.json()) as PortfolioResponse;
        setData(json);
      } catch (err) {
        console.error(err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <p className="text-sm text-slate-400">Loading dashboard…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return null;

  const { cashBalance, portfolioValue, holdings } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-slate-400 mb-1">Portfolio value</div>
          <div className="text-2xl font-semibold">
            {portfolioValue.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-slate-400 mb-1">Cash balance</div>
          <div className="text-2xl font-semibold">{cashBalance.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-slate-400 mb-1">Total holdings</div>
          <div className="text-2xl font-semibold">{holdings.length}</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded p-4 text-sm">
        <div className="flex justify-between mb-3">
          <div className="font-medium">Holdings</div>
        </div>
        {holdings.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No holdings yet. Go to Market to place your first trade.
          </p>
        ) : (
          <table className="w-full text-xs md:text-sm">
            <thead className="text-slate-400 text-left">
              <tr>
                <th className="py-1">Symbol</th>
                <th className="py-1 text-right">Qty</th>
                <th className="py-1 text-right">Avg buy</th>
                <th className="py-1 text-right">Last</th>
                <th className="py-1 text-right">Value</th>
                <th className="py-1 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.symbol} className="border-t border-slate-800">
                  <td className="py-1 font-medium">{h.symbol}</td>
                  <td className="py-1 text-right">{h.quantity}</td>
                  <td className="py-1 text-right">
                    {h.avgBuyPrice.toFixed(2)}
                  </td>
                  <td className="py-1 text-right">
                    {h.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-1 text-right">
                    {h.marketValue.toFixed(2)}
                  </td>
                  <td
                    className={`py-1 text-right ${
                      h.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {h.unrealizedPnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
