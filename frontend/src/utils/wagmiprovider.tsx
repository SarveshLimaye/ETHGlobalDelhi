// @ts-nocheck comment
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { Chain, sepolia, arbitrum } from "wagmi/chains";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const UnichainSepolia: Chain = {
  id: 1301,
  name: "Unichain Sepolia",
  network: "unichain-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.unichain.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Unichain Sepolia Block Explorer",
      url: "https://unichain-sepolia.blockscout.com",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [UnichainSepolia, arbitrum, sepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function WagmiConnect(props: any) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: "#1E88E5",
            borderRadius: "large",
            overlayBlur: "small",
          })}
          coolMode
        >
          {props.children}
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default WagmiConnect;
