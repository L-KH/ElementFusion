// ElementModal.tsx
// sk-rnZJRAX0BlvSsHgLn8X-f2iXvHmtgUwlmkKOlnMTe1T3BlbkFJ3HfMscGBsSeUK3xKzGCAQEtW3cqNEdG2Uj-YpDEpsA
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GlowingElement, SmoothTransition, HoverEffect } from './StyledComponents';
import { useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useMint } from '../hooks/WriteContract';
import { Element } from '@/utils/types'; // Add this import
import { FaTwitter } from 'react-icons/fa'; // Import Twitter icon


const ModalBackground = styled.div<{ rarity: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => getRarityColor(props.rarity)};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(GlowingElement)`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 15px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'rgba(211, 211, 211, 0.7)'; // Light gray
      case 'uncommon':
        return 'rgba(0, 128, 0, 0.7)'; // Green
      case 'rare':
        return 'rgba(0, 0, 255, 0.7)'; // Blue
      case 'epic':
        return 'rgba(128, 0, 128, 0.7)'; // Purple
      case 'legendary':
        return 'rgba(255, 215, 0, 0.7)'; // Gold
      default:
        return 'rgba(0, 0, 0, 0.7)'; // Default black
    }
  };
const ElementImageWrapper = styled(SmoothTransition)`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  border-radius: 50%;
  overflow: hidden;
`;

const ElementImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ElementTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const ElementRarity = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  color: #666;
`;

const ElementDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  margin-bottom: 20px;
`;

const MintButton = styled(HoverEffect)<{ disabled?: boolean }>`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;

  ${({ disabled }) =>
    disabled &&
    `
      background-color: #9e9e9e;
      cursor: not-allowed;
  `}
`;


const ElementCombination = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  color: #666;
`;
const ShareButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  color: #1DA1F2;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const TwitterIcon = styled(FaTwitter)`
  margin-right: 5px;
`;

interface ElementModalProps {
  element: Element;
  onClose: () => void;
}
const ElementModal: React.FC<ElementModalProps> = ({ element, onClose }) => {
  const [description, setDescription] = useState('Loading...');
  const [isMinting, setIsMinting] = useState(false);
  const toast = useToast();
  const { isConnected } = useAccount();
  const { handleMint } = useMint();

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(element.name)}`);
        const data = await response.json();
        setDescription(data.extract || 'No description available.');
      } catch (error) {
        setDescription('Description not available.');
      }
    };

    fetchDescription();
  }, [element.name]);

  const handleMintClick = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    setIsMinting(true);
  
    try {
      console.log("Minting element:", element);
      const rarityToNumber = {
        'common': 0,
        'uncommon': 1,
        'rare': 2,
        'epic': 3,
        'legendary': 4
      };
      const rarityNumber = rarityToNumber[element.rarity.toLowerCase()];
      const tx = await handleMint(element.name, rarityNumber);  
      toast({
        title: "Element minting initiated",
        description: "Transaction submitted. Please wait for confirmation.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
  
      // Instead of waiting for the transaction, we'll just log it
      console.log("Transaction hash:", tx);
  
      toast({
        title: "Element minting transaction submitted",
        description: `Transaction hash: ${tx}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error during minting:', error);
      toast({
        title: "Minting failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsMinting(false);
    }
  };
  const getRarityEmoji = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return '⚪'; // White circle
      case 'uncommon':
        return '🟢'; // Green circle
      case 'rare':
        return '🔵'; // Blue circle
      case 'epic':
        return '🟣'; // Purple circle
      case 'legendary':
        return '🟡'; // Yellow circle
      default:
        return '⚫'; // Black circle
    }
  };

  const generateTweetText = () => {
    const rarityEmoji = getRarityEmoji(element.rarity);
    return encodeURIComponent(`🔮  Elemental Wisdom: I've discovered the ${element.rarity} "${element.name}" in Alchemist!

What element would YOU combine with "${rarityEmoji} ${element.name} ${rarityEmoji}" to create something new? 🤔

Share your ideas below! ⬇️

#Alchemist #NFT #CreativeElements`);
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${generateTweetText()}`;


  
return (
    <ModalBackground rarity={element.rarity} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ElementImageWrapper>
          <ElementImage src={element.imagePath} alt={element.name} />
        </ElementImageWrapper>
        <ElementTitle>{element.name}</ElementTitle>
        <ElementRarity>Rarity: {element.rarity}</ElementRarity>
        {element.combination && (
          <ElementCombination>Combination: {element.combination}</ElementCombination>
        )}
        <ElementDescription>{description}</ElementDescription>
        <MintButton onClick={handleMintClick} disabled={isMinting || !isConnected}>
          {isMinting ? 'Minting...' : (isConnected ? 'Mint' : 'Connect Wallet')}
        </MintButton>
        <ShareButton href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
          <TwitterIcon /> Share on X
        </ShareButton>
      </ModalContent>
    </ModalBackground>
  );
};

export default ElementModal;