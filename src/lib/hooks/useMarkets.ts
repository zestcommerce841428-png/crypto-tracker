"use client";

import useSWR from "swr";
import type { CoinMarket } from "@/lib/types/coin";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMarkets(params: {
  vsCurrency?: string;
  page?: number;
  perPage?: number;
  category?: string;
  order?: string;
  refreshMs?: number;
}) {
  const {
    vsCurrency = "usd",
    page = 1,
    perPage = 100,
    category,
    order = "market_cap_desc",
    refreshMs = 45000,
  } = params;

  const query = new URLSearchParams({
    vs_currency: vsCurrency,
    page: String(page),
    per_page: String(perPage),
    order,
    ...(category ? { category } : {}),
  });

  const { data, error, isLoading, mutate } = useSWR<CoinMarket[]>(
    `/api/markets?${query.toString()}`,
    fetcher,
    { refreshInterval: refreshMs, revalidateOnFocus: false }
  );

  return { coins: data ?? [], error, isLoading, mutate };
}
