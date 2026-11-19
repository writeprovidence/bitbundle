import { createConfig } from "@privy-io/wagmi";
import { mainnet, polygon, base } from "viem/chains";
import { http } from "viem";

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});
