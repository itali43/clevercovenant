import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Create connectors array based on available projectId
const connectors = [
  injected(),
  ...(projectId
    ? [
        walletConnect({
          projectId,
        }),
      ]
    : []),
];

// Create wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
});

// TypeScript: Register wagmi config for global type inference
// See: https://wagmi.sh/react/typescript

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
