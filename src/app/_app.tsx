"use client";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import RootLayout from "./layout";
import Head from 'next/head';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
    <RootLayout>
      
    <ChakraProvider>
      <main className={inter.className}>
              <Component {...pageProps} />
      </main>
    </ChakraProvider>
      <Analytics />

    </RootLayout>
    </>
  );
}

export default MyApp;
