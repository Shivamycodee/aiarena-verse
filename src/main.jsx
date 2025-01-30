import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.jsx'
import "@rainbow-me/rainbowkit/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WalletContextProvider from "../context/walletContext.jsx";
import Layout from "./components/layout";

import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
darkTheme} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  bscTestnet,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, bscTestnet,optimism, arbitrum, base, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(

  
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider
      chains={chains}
      theme={darkTheme()}
      showRecentTransactions={true}
      coolMode
      >
      <WalletContextProvider>
        <Layout>
      <React.StrictMode>
        <App />
      </React.StrictMode>
        </Layout>
  </WalletContextProvider>
    </RainbowKitProvider>
  </WagmiConfig>

);
