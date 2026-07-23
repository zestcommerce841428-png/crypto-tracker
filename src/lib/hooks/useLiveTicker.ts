"use client";

import * as React from "react";
import { openBinanceCombinedTicker, binanceSymbolFor, type LiveTick } from "@/lib/api/binance";

export interface LiveTickerState {
  price: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

/**
 * Subscribes to live Binance ticker data for a set of coin symbols (e.g.
 * ["btc", "eth"]) over a single combined WebSocket connection. Returns a map
 * keyed by lowercase coin symbol, plus a connection status flag. Coins with
 * no Binance USDT pair simply never appear in the map — callers should fall
 * back to the REST/ISR price in that case.
 */
export function useLiveTicker(coinSymbols: string[]) {
  const [ticks, setTicks] = React.useState<Record<string, LiveTickerState>>({});
  const [status, setStatus] = React.useState<"connecting" | "open" | "closed" | "error">(
    "connecting"
  );

  const key = coinSymbols.join(",");

  React.useEffect(() => {
    if (coinSymbols.length === 0) return;
    const binanceSymbols = coinSymbols.map((s) => binanceSymbolFor(s));
    const symbolToCoin = new Map(
      binanceSymbols.map((bSym, i) => [bSym.toUpperCase(), coinSymbols[i].toLowerCase()])
    );

    setStatus("connecting");
    const close = openBinanceCombinedTicker(
      binanceSymbols,
      (tick: LiveTick) => {
        const coinSymbol = symbolToCoin.get(tick.symbol.toUpperCase());
        if (!coinSymbol) return;
        setTicks((prev) => ({
          ...prev,
          [coinSymbol]: {
            price: Number(tick.price),
            changePercent: Number(tick.changePercent),
            high: Number(tick.high),
            low: Number(tick.low),
            volume: Number(tick.volume),
          },
        }));
      },
      setStatus
    );

    return close;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { ticks, status };
}
