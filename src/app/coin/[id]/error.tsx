"use client";

import RouteErrorFallback from "@/components/common/RouteErrorFallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback error={error} reset={reset} label="this coin's page" />;
}
