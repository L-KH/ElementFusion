"use client";
import { type FC } from "react";
import { useEffect, useState } from 'react';
import { HStack, Heading, Text, Box, useColorModeValue } from "@chakra-ui/react";
import { keyframes } from '@emotion/react'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useQuests } from '../../hooks/WriteContract';
import { useAccount } from 'wagmi';
import logo from "../../../public/img/logo_transparent.png";
import { DarkModeButton } from "../DarkModeButton";

const rainbowAnimation = keyframes`
  0% { border-color: red; }
  14% { border-color: orange; }
  28% { border-color: #ffb300; }
  42% { border-color: green; }
  57% { border-color: blue; }
  71% { border-color: indigo; }
  85% { border-color: violet; }
  100% { border-color: red; }
`;

const Header: FC = () => {
  const { isTablet } = useWindowSize();
  const [userPoints, setUserPoints] = useState<bigint | null>(null);
  const { getUserPoints } = useQuests();
  const { address } = useAccount();

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (address) {
        try {
          const points = await getUserPoints();
          setUserPoints(points);
        } catch (error) {
          console.error("Error fetching user points:", error);
          setUserPoints(null);
        }
      } else {
        setUserPoints(null);
      }
    };

    fetchUserPoints();
  }, [getUserPoints, address]);

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      backdropFilter="blur(10px)"
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
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
          <Image src={logo.src} alt="logo" width={75} height={75} />
          {!isTablet && (
            <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
              ElementFusion
              <Text fontSize="0.8rem" color="gray.500" ml={1}>
                Mainnet
              </Text>
            </Heading>
          )}
        </HStack>

        <HStack spacing={4}>
          {userPoints !== null && (
            <Box
              borderRadius="0.375rem"
              padding="0.5rem 1rem"
              fontSize="0.875rem"
              fontWeight="600"
              color={textColor}
              position="relative"
              bg={bgColor}
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left:0,
                right: 0,
                bottom: 0,
                borderRadius: "0.5rem",
                border: "5px solid",
                borderColor: "red",
                animation: `${rainbowAnimation} 3s linear infinite`,
              }}
            >
              {userPoints.toString()} Points
            </Box>
          )}
          <ConnectButton />
          <DarkModeButton />
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;
