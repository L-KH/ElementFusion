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
import { sepolia , scrollSepolia, lineaSepolia, arbitrum, linea, taiko} from 'viem/chains'
import taiko_logo from "../public/img/taiko_logo.png"
import edu_logo from "../public/img/edu.png"
import monad_logo from "../public/img/monad_logo.png"

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
const monad: Chain = {
  id: 0x279f, // Chain ID for Berachain Testnet
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad Network',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
};

const ink: Chain = {
  id: 0xdef1, // Chain ID 57073 for Ink
  name: 'Ink',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-qnd.inkonchain.com'] },
  },
  blockExplorers: {
    default: { name: 'Ink Explorer', url: 'https://explorer.inkonchain.com' },
  },
  testnet: false,
}; 
// Fix missing icons
const customTaiko2 = { ...taikokaltatestnet2, iconUrl: taiko_logo.src };
const customEDU = { ...OpenCampusCodex, iconUrl: edu_logo.src };
const custommonad = { ...monad, iconUrl: monad_logo.src };

const transports: Record<number, Transport> = {
  [customEDU.id]: http(),
  [customTaiko2.id]: http(), // Add Berachain Testnet transport
  [custommonad.id]: http(), 
  [ink.id]: http(),
  [sepolia.id]: http(), // Add Berachain Testnet transport
  [scrollSepolia.id]: http(),
  [lineaSepolia.id]: http(),
  //[arbitrum.id]: http(),
  [linea.id]: http(),
  [taiko.id]: http()
};
export const wagmiConfig = createConfig({
  chains: [
  //taiko,
  //custommonad,
  linea,
  ink,
  ],
  connectors,
  transports,
  ssr: true,
});
