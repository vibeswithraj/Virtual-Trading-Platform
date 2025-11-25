'use client';

import { memo, useEffect, useRef } from 'react';
import '../app/globals.css';
interface TradingViewWidgetProps {
  /**
   * TradingView symbol identifier, e.g. "NASDAQ:AAPL" or "NSE:RELIANCE".
   * If you pass just a ticker like "AAPL", TradingView will resolve it on US exchanges.
   */
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `{
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": false,
      "hotlist": false,
      "interval": "D",
      "locale": "en",
      "save_image": true,
      "style": "1",
      "symbol": "${symbol}",
      "theme": "dark",
      "timezone": "Etc/UTC",
      "backgroundColor": "#0F0F0F",
      "gridColor": "rgba(242, 242, 242, 0.06)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [],
      "autosize": true
    }`;

    // Clear any previous widget instance before adding a new one
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {/* <div
        className="tradingview-widget-container__widget"
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      />
      <div className="tradingview-widget-copyright">
        <a
          href={`https://www.tradingview.com/symbols/${encodeURIComponent(
            symbol.replace(':', '-')
          )}/`}
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          <span className="blue-text">{symbol} chart</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div> */}
    </div>
  );
}

export default memo(TradingViewWidget);
