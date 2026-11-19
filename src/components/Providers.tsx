"use client";

import { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Filter non-critical third-party library warnings and standard Web3 user cancellations in development
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const msg = args
      .map((a) => (typeof a === "string" ? a : a instanceof Error ? a.message : ""))
      .join(" ");
    if (
      (msg.includes('Each child in a list should have a unique "key" prop') &&
        (msg.includes("xe") || msg.includes("Privy") || msg.includes("Fragment"))) ||
      msg.includes("User rejected the request") ||
      msg.includes("User denied transaction signature") ||
      msg.includes("denied transaction signature")
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
});

const rawAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
// Privy App IDs are standard 25-character CUIDs (e.g. clxxxxxxxxxxxxxxxxxxxxxxx)
const privyAppId =
  rawAppId && rawAppId.length === 25
    ? rawAppId
    : "cl00000000000000000000000";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#22c55e",
          showWalletLoginFirst: true,
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
