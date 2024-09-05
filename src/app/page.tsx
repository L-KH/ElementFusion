"use client";
import { Box, Flex } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { Footer, Header } from "@/components";

// Dynamically import MainPane
const MainPane = dynamic(() => import("@/components/MainPane").then(mod => mod.MainPane), {
  loading: () => <Box>Loading...</Box>,
});

export default function Home() {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />

      <Box as="main" flex={1} p={4} overflowY="auto">
        <Suspense fallback={<Box>Loading main content...</Box>}>
          <MainPane />
        </Suspense>
      </Box>

      <Footer />
    </Flex>
  );
}
