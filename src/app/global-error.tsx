"use client";

import * as React from "react";

// Only fires if the root layout itself throws (very rare — e.g. a provider
// crashing during render). Must render its own <html>/<body> since the
// layout that would normally provide them is what failed.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#0b0e17",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
            CryptoTracker hit a snag
          </h1>
          <p style={{ color: "#a0a0b0", marginBottom: 20 }}>
            Something went wrong loading the app. Reloading usually fixes it.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#3861fb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
