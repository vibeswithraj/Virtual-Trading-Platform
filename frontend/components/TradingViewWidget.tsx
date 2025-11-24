'use client';

import { useEffect, useRef } from 'react';

interface Props {
  symbol: string;
}

export default function TradingViewWidget({ symbol }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: '30',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      calendar: false,
    });

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="h-80 w-full">
      <div className="tradingview-widget-container h-full" ref={containerRef} />
    </div>
  );
}
