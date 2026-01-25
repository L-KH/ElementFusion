"use client";
import { type FC } from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { FaTwitter, FaGithub, FaHome } from "react-icons/fa";

const Footer: FC = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const linkColor = useColorModeValue("purple.600", "purple.400");

  return (
    <Box 
      as="footer" 
      p={"1rem 2rem"} 
      borderTop="1px solid"
      borderColor={borderColor}
      bg={bgColor}
    >
      <HStack justifyContent="space-between" flexWrap="wrap" gap={4}>
        <HStack spacing={4}>
          <Link href="/">
            <HStack spacing={1} color={linkColor} _hover={{ opacity: 0.8 }} cursor="pointer">
              <FaHome />
              <Text fontSize="sm">Home</Text>
            </HStack>
          </Link>
          <Link href="/privacy">
            <Text fontSize="sm" color={textColor} _hover={{ color: linkColor }} cursor="pointer">
              Privacy
            </Text>
          </Link>
          <Link href="/terms">
            <Text fontSize="sm" color={textColor} _hover={{ color: linkColor }} cursor="pointer">
              Terms
            </Text>
          </Link>
        </HStack>

        <Text fontSize="sm" color={textColor}>
          © {new Date().getFullYear()} ElementFusion • Powered by Linea
        </Text>

        <HStack spacing={4}>
          <Link
            href="https://twitter.com/element_fusion_"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack spacing={1} color={linkColor} _hover={{ opacity: 0.8 }} cursor="pointer">
              <FaTwitter />
              <Text fontSize="sm">Twitter</Text>
            </HStack>
          </Link>
          <Link
            href="https://github.com/L-KH/ElementFusion"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack spacing={1} color={linkColor} _hover={{ opacity: 0.8 }} cursor="pointer">
              <FaGithub />
              <Text fontSize="sm">GitHub</Text>
            </HStack>
          </Link>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Footer;
