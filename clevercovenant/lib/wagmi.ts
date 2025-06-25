import { http, createConfig } from "wagmi";
import {
  mainnet,
  sepolia,
  base,
  arbitrum,
  optimism,
  polygon,
  avalanche,
} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { createStorage } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Create a singleton instance of the WalletConnect connector
const getWalletConnectConnector = (() => {
  let connector: ReturnType<typeof walletConnect> | null = null;
  return () => {
    if (!connector && projectId) {
      connector = walletConnect({
        projectId,
        metadata: {
          name: "Clever Covenant",
          description: "Smart Contract ABI Reader and Interaction Tool",
          url:
            typeof window !== "undefined"
              ? window.location.origin
              : "http://localhost:3000",
          icons: [
            typeof window !== "undefined"
              ? `${window.location.origin}/favicon.ico`
              : "",
          ],
        },
      });
    }
    return connector;
  };
})();

// Create connectors array
const connectors = [
  injected(),
  ...(projectId && getWalletConnectConnector()
    ? [getWalletConnectConnector()!]
    : []),
];

// Create storage that persists to client-side only when window is available
const storage =
  typeof window !== "undefined"
    ? createStorage({ storage: window.localStorage })
    : createStorage({
        storage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        },
      });

// Create wagmi config
export const config = createConfig({
  chains: [
    mainnet,
    base,
    arbitrum,
    optimism,
    polygon,
    avalanche,
    sepolia, // Keep testnet at the end
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [avalanche.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
  storage,
});

// TypeScript: Register wagmi config for global type inference
// See: https://wagmi.sh/react/typescript

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
