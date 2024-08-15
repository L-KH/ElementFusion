"use client";
import { type FC } from "react";

import { HStack, Heading, Text, Box } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

import { useWindowSize } from "@/hooks/useWindowSize";

import logo from "../../../public/img/logo_transparent.png";
import { DarkModeButton } from "../DarkModeButton";

const Header: FC = () => {
  const { isTablet } = useWindowSize();

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      background="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
      border="1px solid rgba(255, 255, 255, 0.3)"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
        filter: "blur(5px)",
        zIndex: -1,
      }}
    >
      <HStack
        p={"1.5rem"}
        justifyContent={"space-between"}
      >
        <HStack>
          <Image src={logo.src} alt="logo" width={55} height={55} />
          {!isTablet && (
            <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
              ElementFusion
              <Text fontSize="0.8rem" color="gray.500" ml={1}>
                Testnet
              </Text>
            </Heading>
          )}
        </HStack>

        <HStack>
          <ConnectButton />
          <DarkModeButton />
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;
