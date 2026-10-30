"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { wagmiAdapter, wagmiConfig, networks, projectId } from "@/lib/wagmi";
import { AuthProvider } from "@/contexts/AuthContext";

// Suppress non-critical third-party telemetry/analytics fetch errors on localhost
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const isTelemetryError =
      reason?.message?.includes("Failed to fetch") ||
      reason?.context === "AnalyticsSDKApiError" ||
      reason?.name === "AnalyticsSDKApiError" ||
      (typeof reason === "string" && reason.includes("Analytics SDK"));

    if (isTelemetryError) {
      event.preventDefault();
    }
  });

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const firstStr = typeof args[0] === "string" ? args[0] : "";
    const isTelemetryError =
      firstStr.includes("Analytics SDK") ||
      firstStr.includes("Failed to fetch usage") ||
      args.some(
        (arg: any) =>
          arg?.context === "AnalyticsSDKApiError" ||
          (arg instanceof TypeError && arg.message === "Failed to fetch"),
      );

    if (isTelemetryError) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "https://bitbundle.xyz");

// Create the AppKit instance (singleton, outside component)
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata: {
    name: "Bitbundle",
    description: "Pay with crypto. Get airtime in seconds.",
    url: appUrl,
    icons: [`${appUrl}/icon.png`],
  },
  enableBaseAccount: false,
  enableCoinbase: false,
  features: {
    analytics: false,
    email: false,
    socials: [],
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#22c55e",
    "--w3m-border-radius-master": "12px",
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
