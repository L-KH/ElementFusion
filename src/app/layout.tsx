import type { ReactNode } from "react";
import { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Cursor3D from '../components/Cursor3D';

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wizardry",
  applicationName: "Wizardry",
  description: "Your Prompt, Your art, Your NFT",
  authors: {
    name: "Wizardry",
    url: "",
  },
  icons: "favicon.ico",
  manifest: "site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={open_sans.className}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.1)', // White with 10% opacity
          zIndex: -1,
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
        }}>
          {/* <Cursor3D /> */}
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
