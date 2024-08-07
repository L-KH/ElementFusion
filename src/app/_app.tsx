"use client";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import RootLayout from "./layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <RootLayout>
      
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
      <Analytics />

    </RootLayout>
  );
}

export default MyApp;
