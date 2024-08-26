"use client";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import RootLayout from "./layout";
import Head from 'next/head';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
    <RootLayout>
      
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
      <Analytics />

    </RootLayout>
    </>
  );
}

export default MyApp;
