"use client";
import { type FC } from "react";

import { Box } from "@chakra-ui/react";
import Link from "next/link";

const Footer: FC = () => {
  return (
    <Box as="footer" p={"1rem"} position="sticky" bottom={0} zIndex={10} textAlign={"center"}>
      <Link
        href="https://x.com/element_fusion_"
        target="_blank"
        rel="noopener noreferrer"
      >
        ⭐️ Follow us on Twitter ⭐️
      </Link>
    </Box>
  );
};

export default Footer;
