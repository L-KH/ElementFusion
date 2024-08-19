"use client";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import type { Transport } from "viem";
import { type Chain } from 'viem'
import { createConfig, http } from "wagmi";

const walletConnectProjectId = '51d5d824bfd42cd4f17cfb3dcec82da9';
import { sepolia } from 'viem/chains'
import taiko_logo from "../public/img/taiko_logo.png"
if (!walletConnectProjectId) {
  throw new Error(
    "WalletConnect project ID is not defined. Please check your environment variables.",
  );
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        ledgerWallet,
        rabbyWallet,
        coinbaseWallet,
        argentWallet,
        safeWallet,
      ],
    },
  ],
  { appName: "ImaginAIryNFTs", projectId: walletConnectProjectId },
);
const taikokaltatestnet2: Chain = {
  id: 0x28c61, // Chain ID for Berachain Testnet
  name: 'Taiko Hekla Testnet',
  nativeCurrency: {
    name: 'Taiko Hekla Token',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.hekla.taiko.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Taiko Hekla Explorer', url: 'https://hekla.taikoscan.network' },
  },
  testnet: true,
}; 

// Fix missing icons
const customTaiko2 = { ...taikokaltatestnet2, iconUrl: taiko_logo.src };
const transports: Record<number, Transport> = {
  [customTaiko2.id]: http(), // Add Berachain Testnet transport
  [sepolia.id]: http(), // Add Berachain Testnet transport
};
export const wagmiConfig = createConfig({
  chains: [
  customTaiko2,
  sepolia
  ],
  connectors,
  transports,
  ssr: true,
});
