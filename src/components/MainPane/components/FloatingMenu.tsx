// components/FloatingMenu.tsx
// eslint-disable-next-line import/order
import type { FC } from 'react';
import { useState } from 'react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, IconButton, VStack, useDisclosure, Collapse } from '@chakra-ui/react';

const FloatingMenu: FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [rotate, setRotate] = useState(false);

  const handleToggle = () => {
    setRotate(!rotate);
    onToggle();
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex="tooltip">
      <IconButton
        onClick={handleToggle}
        icon={rotate ? <CloseIcon /> : <HamburgerIcon />}
        isRound={true}
        size="lg"
        colorScheme="teal"
        aria-label="Open Menu"
      />
      <Collapse in={isOpen} animateOpacity>
        <VStack mt={2}>
          {/* Replace these Boxes with actual navigational components or links */}
          <Box as="button" p={2} bg="teal.500" color="white" w="full" borderRadius="md" onClick={() => {/* navigate to your mint page */}}>
            My AINFTs [Soon]
          </Box>
          {/* Add more options as needed */}
        </VStack>
      </Collapse>
    </Box>
  );
};

export default FloatingMenu;