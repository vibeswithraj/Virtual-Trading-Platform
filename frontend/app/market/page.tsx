'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MarketSymbol {
  symbol: string;
  name: string;
  lastPrice: number;
}

export default function MarketPage() {
  const [symbols, setSymbols] = useState<MarketSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/market/symbols'
        );
        if (!res.ok) throw new Error('Failed to load market');
        const json = (await res.json()) as MarketSymbol[];
        setSymbols(json);
      } catch (err) {
        console.error(err);
        setError('Failed to load market');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-sm text-slate-400">Loading market…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-4 text-sm">
      <h1 className="text-xl font-semibold">Market</h1>
      <div className="bg-slate-900 border border-slate-800 rounded p-4 overflow-x-auto">
        <table className="w-full text-xs md:text-sm">
          <thead className="text-slate-400 text-left">
            <tr>
              <th className="py-1">Symbol</th>
              <th className="py-1">Name</th>
              <th className="py-1 text-right">Last</th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((s) => (
              <tr
                key={s.symbol}
                className="border-t border-slate-800 hover:bg-slate-800/60"
              >
                <td className="py-1 font-medium">
                  <Link href={`/market/${s.symbol}`}>{s.symbol}</Link>
                </td>
                <td className="py-1 text-slate-300">{s.name}</td>
                <td className="py-1 text-right">{s.lastPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
