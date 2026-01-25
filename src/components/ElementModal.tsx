
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GlowingElement, SmoothTransition, HoverEffect } from './StyledComponents';
import { useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useMint } from '../hooks/WriteContract';
import { Element } from '@/utils/types'; // Add this import
import { FaTwitter } from 'react-icons/fa'; // Import Twitter icon
import explanations from './MainPane/element_explanations.json';
import { parseBlockchainError, truncateHash } from '../utils/errorHandler';

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
const SmallTitle = styled.span`
  font-weight: bold;
  color: #333;
  margin-right: 5px;
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


const AIExplanation = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  margin-bottom: 20px;
  background-color: #f0f8ff;
  padding: 10px;
  border-radius: 5px;
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
  const [aiExplanation, setAIExplanation] = useState<string | null>(null);
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
    const explanation = getExplanation(element.combination?.split(' + ') || [], element.name);
    setAIExplanation(explanation);
  }, [element.name, element.combination]);
  const getExplanation = (inputs: string[], output: string) => {
    // First, try the exact match
    const exactKey = `${inputs.sort().join('-')}_${output}`;
    if (explanations[exactKey]) {
      return explanations[exactKey].explanation;
    }
  
    // If exact match fails, try finding a partial match
    const partialMatches = Object.keys(explanations).filter(key => 
      key.toLowerCase().includes(output.toLowerCase()));
  
    if (partialMatches.length > 0) {
      return explanations[partialMatches[0]].explanation;
    }
  
    return "No explanation available.";
  };
  
  const handleMintClick = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    setIsMinting(true);
  
    try {
      console.log("Minting element:", element);
      const rarityToNumber: { [key: string]: number } = {
        'common': 0,
        'uncommon': 1,
        'rare': 2,
        'epic': 3,
        'legendary': 4,
        'hidden': 5
      };
      const rarityNumber = rarityToNumber[element.rarity.toLowerCase()];
      const tx = await handleMint(element.name, rarityNumber);  
      toast({
        title: "Minting Started 🎨",
        description: `Transaction submitted (${truncateHash(tx)})`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
  
      console.log("Transaction hash:", tx);
  
      toast({
        title: "Minting Successful! 🎉",
        description: `${element.name} has been minted to your wallet!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error during minting:', error);
      const parsedError = parseBlockchainError(error);
      toast({
        title: parsedError.title,
        description: parsedError.description,
        status: parsedError.status,
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
        <ElementRarity>
          <SmallTitle>Rarity:</SmallTitle> {getRarityEmoji(element.rarity)}{element.rarity}{getRarityEmoji(element.rarity)}
        </ElementRarity>
        {element.combination && (
          <ElementCombination>
            <SmallTitle>Combination:</SmallTitle> {element.combination}
          </ElementCombination>
        )}
        <ElementDescription>
          <SmallTitle>Wikipedia:</SmallTitle> {description}
        </ElementDescription>
        {aiExplanation && (
          <AIExplanation>
            <SmallTitle>GPT Explanation:</SmallTitle> {aiExplanation}
          </AIExplanation>
        )}
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