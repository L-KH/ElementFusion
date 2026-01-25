import type { ReactNode } from "react";
import { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Analytics } from '@vercel/analytics/next';

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElementFusion | Web3 Alchemy Game on Linea",
  applicationName: "ElementFusion",
  description: "Combine, Create, Collect in a Web3 world! Discover new elements and unlock blockchain magic with every fusion. Built on Linea blockchain.",
  keywords: ["Web3", "blockchain game", "NFT", "Linea", "alchemy", "element fusion", "ConsenSys", "GameFi"],
  authors: {
    name: "ElementFusion",
    url: "https://elementfusion.tech",
  },
  icons: "favicon.ico",
  manifest: "site.webmanifest",
  openGraph: {
    title: "ElementFusion - Combine, Create, Collect",
    description: "The pioneering Web3 alchemy game on Linea blockchain. Fuse elements, unlock discoveries, mint NFTs.",
    type: "website",
    url: "https://www.elementfusion.tech/",
    siteName: "ElementFusion",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElementFusion | Web3 Alchemy Game",
    description: "Combine elements, discover concepts, mint NFTs. Learn blockchain and science through play.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={open_sans.className}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: -1,
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
        }}>
          <Providers>{children}</Providers>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
