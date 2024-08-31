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
import { sepolia , scrollSepolia} from 'viem/chains'
import taiko_logo from "../public/img/taiko_logo.png"
import edu_logo from "../public/img/edu.png"

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
  { appName: "ElementFusion", projectId: walletConnectProjectId },
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
const OpenCampusCodex: Chain = {
  id: 0xa045c, // Chain ID for OpenCampusCodex
  name: 'Open Campus Codex Sepolia by dRPC',
  nativeCurrency: {
    name: 'EDU Token',
    symbol: 'EDU',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://open-campus-codex-sepolia.drpc.org'] },
  },
  blockExplorers: {
    default: { name: 'Open Campus Explorer', url: 'https://opencampus-codex.blockscout.com' },
  },
  testnet: true,
}; 
// Fix missing icons
const customTaiko2 = { ...taikokaltatestnet2, iconUrl: taiko_logo.src };
const customEDU = { ...OpenCampusCodex, iconUrl: edu_logo.src };

const transports: Record<number, Transport> = {
  [customEDU.id]: http(),
  [customTaiko2.id]: http(), // Add Berachain Testnet transport
  [sepolia.id]: http(), // Add Berachain Testnet transport
  [scrollSepolia.id]: http()
};
export const wagmiConfig = createConfig({
  chains: [
  customEDU,
  customTaiko2,
  sepolia,
  scrollSepolia
  ],
  connectors,
  transports,
  ssr: true,
});
