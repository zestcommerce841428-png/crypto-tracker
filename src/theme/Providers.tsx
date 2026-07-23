"use client";

import * as React from "react";
import { SWRConfig } from "swr";
import EmotionRegistry from "./EmotionRegistry";
import ThemeModeProvider from "./ThemeModeProvider";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ThemeModeProvider>
        <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
          {children}
        </SWRConfig>
      </ThemeModeProvider>
    </EmotionRegistry>
  );
}
