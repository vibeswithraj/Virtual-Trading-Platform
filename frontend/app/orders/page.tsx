'use client';

import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
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
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load orders');
        const json = (await res.json()) as Order[];
        setOrders(json);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-sm text-slate-400">Loading orders…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-4 text-sm">
      <h1 className="text-xl font-semibold">Orders</h1>
      <div className="bg-slate-900 border border-slate-800 rounded p-4 overflow-x-auto">
        {orders.length === 0 ? (
          <p className="text-slate-400 text-sm">No orders yet.</p>
        ) : (
          <table className="w-full text-xs md:text-sm">
            <thead className="text-slate-400 text-left">
              <tr>
                <th className="py-1">Time</th>
                <th className="py-1">Side</th>
                <th className="py-1">Symbol</th>
                <th className="py-1 text-right">Qty</th>
                <th className="py-1 text-right">Price</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-slate-800">
                  <td className="py-1 text-xs text-slate-400">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td
                    className={`py-1 font-medium ${
                      o.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {o.side}
                  </td>
                  <td className="py-1">{o.symbol}</td>
                  <td className="py-1 text-right">{o.quantity}</td>
                  <td className="py-1 text-right">{o.price.toFixed(2)}</td>
                  <td className="py-1 text-right">{o.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
