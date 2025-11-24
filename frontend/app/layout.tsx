import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Paper Trading Platform',
  description: 'Demo paper stock trading platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen flex">
          <aside className="w-56 bg-slate-900 border-r border-slate-800 p-4 hidden md:flex flex-col gap-4">
            <div className="text-lg font-semibold">PaperTrade</div>
            <nav className="flex flex-col gap-2 text-sm">
              <a href="/dashboard" className="hover:text-sky-400">
                Dashboard
              </a>
              <a href="/market" className="hover:text-sky-400">
                Market
              </a>
              <a href="/portfolio" className="hover:text-sky-400">
                Portfolio
              </a>
              <a href="/orders" className="hover:text-sky-400">
                Orders
              </a>
            </nav>
          </aside>
          <main className="flex-1 flex flex-col min-h-screen">
            <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 text-sm">
              <div className="md:hidden font-semibold">PaperTrade</div>
              <div className="text-slate-400">
                Paper trading only · No real money
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <a href="/auth/login" className="hover:text-sky-400">
                  Login
                </a>
                <a href="/auth/register" className="hover:text-sky-400">
                  Sign up
                </a>
              </div>
            </header>
            <div className="flex-1 p-4 md:p-6 max-w-6xl w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
