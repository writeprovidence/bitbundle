import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, polygon } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Use environment variable if configured, otherwise fallback to Reown's public sample ID for localhost development
export const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";

if (!process.env.NEXT_PUBLIC_REOWN_PROJECT_ID && typeof window !== "undefined") {
  console.warn(
    "[Bitbundle] NEXT_PUBLIC_REOWN_PROJECT_ID is not set in .env.local. Using fallback project ID for localhost. Get your own project ID at https://dashboard.reown.com"
  );
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, polygon];

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  ssr: true,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
