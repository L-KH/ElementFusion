import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import ElementModal  from '../../ElementModal';
import FusionAnimation from '../../FusionAnimation';
import { useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useMint } from '../../../hooks/WriteContract';
import HintModal from '../../HintModal'; // New import
import { FaCog, FaTimes } from 'react-icons/fa';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverCloseButton, Switch, Text, VStack, Flex ,Select } from '@chakra-ui/react';
import { useAudioManager } from '../../useAudioManager'; // Add this import

type Element = {
  id: number;
  name: string;
  imagePath: string;
  rarity: string;
  combination?: string;
};

const FusionAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-height: 100vh;
  overflow-y: auto;
  padding: 20px;
  width: 100%;
`;

const FusionBox = styled.div<{ invalid?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  border: ${(props) => (props.invalid ? '2px solid red' : 'none')};
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const FusionElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border: 2px solid rgba(204, 204, 204, 0.9);
  border-radius: 5px;
  margin: 10px;
  background-color: rgba(240, 240, 240, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: inherit;
    filter: blur(10px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);

    &::before {
      opacity: 1;
    }
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    z-index: 1;
  }

  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
  }
`;

const FusionSign = styled.div`
  font-size: 54px;
  margin: 0 10px;

  @media (max-width: 600px) {
    margin: 5px 0;
  }
`;

const EmptyBox = styled(FusionElement)`
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 24px;
`;

const InvalidSign = styled.span`
  color: red;
  font-size: 48px;
`;
const DiscoveredElementsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
`;
// ....................................................................................................
const getGlowColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'rgba(192, 192, 192, 0.8)'; // Silver
    case 'uncommon':
      return 'rgba(0, 255, 0, 0.8)'; // Green
    case 'rare':
      return 'rgba(0, 0, 255, 0.8)'; // Blue
    case 'epic':
      return 'rgba(255, 0, 255, 0.8)'; // Purple
    case 'legendary':
      return 'rgba(255, 215, 0, 0.8)'; // Gold
    default:
      return 'rgba(255, 255, 255, 0.8)'; // White
  }
};

const glowAnimation = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 5px ${color};
  }
  50% {
    box-shadow: 0 0 20px ${color};
  }
  100% {
    box-shadow: 0 0 5px ${color};
  }
`;

//......................................................................................................

const CategoryCard = styled.div<{ rarity: string }>`
  width: 100%;
  max-width: 300px;
  height: 400px;
  padding: 15px;
  border-radius: 10px;
  background: ${props => getRarityGradient(props.rarity)};
  
  overflow-y: auto;

  @media (max-width: 600px) {
    height: auto;
    max-height: 300px;
  }
      &:hover {
    animation: ${props => glowAnimation(getGlowColor(props.rarity))} 2s infinite;
  }
`;

const ElementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
  justify-items: center;
`;

const ElementItem = styled.div`
  cursor: pointer;
  transition: transform 0.3s ease;
  margin: 5px;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  p {
    font-size: 8px;
    margin: 2px 0;
    text-align: center;
  }
`;

const ElementCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
`;


const CategoryTitle = styled.h3`

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  text-align: center;
`;


const MintButton = styled.button<{ rarity: string }>`
  background-color: ${props => getGlowColor(props.rarity)};
  border: none;
  color: white;
  padding: 3px 6px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin: 2px 0;
  cursor: pointer;
  border-radius: 3px;
`;


const getRarityGradient = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'linear-gradient(135deg, rgba(128, 128, 128, 0.3), rgba(192, 192, 192, 0.3))';
    case 'uncommon':
      return 'linear-gradient(135deg, rgba(0, 128, 0, 0.3), rgba(0, 255, 0, 0.3))';
    case 'rare':
      return 'linear-gradient(135deg, rgba(0, 0, 128, 0.3), rgba(0, 0, 255, 0.3))';
    case 'epic':
      return 'linear-gradient(135deg, rgba(128, 0, 128, 0.3), rgba(255, 0, 255, 0.3))';
    case 'legendary':
      return 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 255, 0, 0.3))';
    default:
      return 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(128, 128, 128, 0.3))';
  }
};

//-------------------------------- switcher-------------------------------

const SwitcherContainer = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;
  display: flex;
  align-items: center;
`;

const SwitcherLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SwitcherInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitcherSlider = styled.span`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  background-color: #ccc;
  border-radius: 34px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }

  ${SwitcherInput}:checked + & {
    background-color: #2196F3;
  }

  ${SwitcherInput}:checked + &:before {
    transform: translateX(26px);
  }

  ${SwitcherInput}:focus + & {
    box-shadow: 0 0 1px #2196F3;
  }
`;

const SwitcherText = styled.span`
  margin-left: 10px;
  font-size: 14px;
`;

//----------------------------------end switcher-------------------------------------
//----------------Hints
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
`;

const StyledButton = styled.button`
  flex: 1;
  max-width: 200px;
  padding: 12px 20px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const SaveButton = styled(StyledButton)`
  background-color: #4caf50;

  &:hover {
    background-color: #45a049;
  }
`;

const HintButton = styled(StyledButton)`
  background-color: #f0ad4e;

  &:hover {
    background-color: #ec971f;
  }
`;
const SectionHeader = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-top: 40px; // This adds space above the header
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  font-weight: bold;
`;
//---------------endHints
const OptionsGear = styled(FaCog)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  color: #2196F3;
  cursor: pointer;
`;
const MusicOption = styled.button<{ isSelected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #2196F3;
  background-color: ${props => props.isSelected ? '#2196F3' : 'transparent'};
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isSelected ? 'white' : '#2196F3'};
  font-size: 12px;
  font-weight: bold;
`;
const CustomCloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  z-index: 1000;
  &:hover {
    background: #e0e0e0;
    color: #000;
  }
`;



const FusionArea = ({ 
  selectedElements, 
  onElementRemove, 
  result, 
  onSave, 
  discoveredElements,
  onElementClick,
  backgroundPatternEnabled,
  setBackgroundPatternEnabled,
}: { 
  selectedElements: Element[], 
  onElementRemove: (index: number) => void, 
  result: { success: boolean, element?: Element } | null, 
  onSave: () => void, 
  discoveredElements: Element[],
  onElementClick: (element: Element) => void,
  backgroundPatternEnabled: boolean,
  setBackgroundPatternEnabled: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
  const [selectedModalElement, setSelectedModalElement] = useState<Element | null>(null);
  const [showFusionAnimation, setShowFusionAnimation] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const toast = useToast();
  const { isConnected } = useAccount();
  const { handleMint } = useMint();
  const [isMinting, setIsMinting] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { musicOption, setMusicOption } = useAudioManager();

  const categorizedElements = {
    common: discoveredElements.filter(e => e.rarity === 'common'),
    uncommon: discoveredElements.filter(e => e.rarity === 'uncommon'),
    rare: discoveredElements.filter(e => e.rarity === 'rare'),
    epic: discoveredElements.filter(e => e.rarity === 'epic'),
    legendary: discoveredElements.filter(e => e.rarity === 'legendary'),
  };

  const AudioStream = ({ src, playing }: { src: string; playing: boolean }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
  
    useEffect(() => {
      if (playing) {
        audioRef.current?.play();
      } else {
        audioRef.current?.pause();
      }
    }, [playing]);
  
    return <audio ref={audioRef} src={src} preload="none" loop />;
  };
  

  
  const handleMintClick = async (element: Element) => {
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
      const rarityToNumber = {
        'common': 0,
        'uncommon': 1,
        'rare': 2,
        'epic': 3,
        'legendary': 4
      };
      const rarityNumber = rarityToNumber[element.rarity.toLowerCase()];
      const txHash = await handleMint(element.name, rarityNumber);
  
      toast({
        title: "Element minting initiated",
        description: `Transaction submitted. Hash: ${txHash}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
  
  
      // Remove the await tx.wait() line
  
      toast({
        title: "Element minting transaction submitted",
        description: `Transaction hash: ${txHash}`,
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
  


  
  useEffect(() => {
    if (selectedElements.length === 2 && result && result.success) {
      setShowFusionAnimation(true);
    }
  }, [selectedElements, result]);

  const handleElementClick = (element: Element) => {
    setSelectedModalElement(element);
  };

  const closeModal = () => {
    setSelectedModalElement(null);
  };

  const handleAnimationEnd = () => {
    setShowFusionAnimation(false);
  };
const handleAnimationToggle = () => {
    setAnimationEnabled(!animationEnabled);
  };
  //----- hint
  const handleHintClick = () => {
    setShowHintModal(true);
  };

  const closeHintModal = () => {
    setShowHintModal(false);
  };
  return (
    <FusionAreaContainer>

      <Popover 
        isOpen={isPopoverOpen} 
        onClose={() => setIsPopoverOpen(false)} 
        placement="bottom-start"
      >
        <PopoverTrigger>
          <OptionsGear onClick={() => setIsPopoverOpen(true)} />
        </PopoverTrigger>
        <PopoverContent position="relative" padding="30px 15px 15px">
          <CustomCloseButton onClick={() => setIsPopoverOpen(false)}>
            <FaTimes />
          </CustomCloseButton>


          <PopoverBody>

            <VStack align="start" spacing={4}>
              <Flex align="center" justify="space-between" width="100%">
                <Text>Animation</Text>
                <Switch
                  isChecked={animationEnabled}
                  onChange={() => setAnimationEnabled(!animationEnabled)}
                />
              </Flex>
              <Flex align="center" justify="space-between" width="100%">
                <Text>Background Pattern</Text>
                <Switch
                  isChecked={backgroundPatternEnabled}
                  onChange={() => setBackgroundPatternEnabled(!backgroundPatternEnabled)}
                />
              </Flex>
              <Flex align="center" justify="space-between" width="100%">
                <Text>Music</Text>
                <Flex>
                  <MusicOption 
                    isSelected={musicOption === 'off'} 
                    onClick={() => setMusicOption('off')}
                  >
                    Off
                  </MusicOption>
                  <MusicOption 
                    isSelected={musicOption === 'music1'} 
                    onClick={() => setMusicOption('music1')}
                  >
                    1
                  </MusicOption>
                  <MusicOption 
                    isSelected={musicOption === 'music2'} 
                    onClick={() => setMusicOption('music2')}
                  >
                    2
                  </MusicOption>
                </Flex>
              </Flex>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <h2>Fusion Area</h2>
      <FusionBox invalid={!!(result && !result.success)}>
        {selectedElements[0] ? (
          <FusionElement onClick={() => onElementRemove(0)}>
            <img src={selectedElements[0].imagePath} alt={selectedElements[0].name} />
          </FusionElement>
        ) : (
          <EmptyBox />
        )}
        <FusionSign>+</FusionSign>
        {selectedElements[1] ? (
          <FusionElement onClick={() => onElementRemove(1)}>
            <img src={selectedElements[1].imagePath} alt={selectedElements[1].name} />
          </FusionElement>
        ) : (
          <EmptyBox />
        )}
        <FusionSign>=</FusionSign>
        <FusionElement>
          {result && result.success ? (
            <img src={result.element?.imagePath} alt={result.element?.name} />
          ) : result && !result.success ? (
            <InvalidSign>X</InvalidSign>
          ) : null}
        </FusionElement>
      </FusionBox>
      <ButtonContainer>
        <SaveButton onClick={onSave}>Save My Progress</SaveButton>
        <HintButton onClick={handleHintClick}>Show Hint</HintButton>
      </ButtonContainer>
      <SectionHeader>Discovered Elements:</SectionHeader>
      <DiscoveredElementsContainer>
        {Object.entries(categorizedElements).map(([category, elements]) => (
          elements.length > 0 && (
            <CategoryCard key={category} rarity={category}>
              <CategoryTitle>{category.charAt(0).toUpperCase() + category.slice(1)}</CategoryTitle>
              <ElementsGrid>
                {elements.map((element) => (
                  <ElementItem key={element.id}>
                    <ElementCard onClick={() => handleElementClick(element)}>
                      <img 
                        src={element.imagePath} 
                        alt={element.name} 

                      />
                      <p>{element.name}</p>
                      <MintButton 
                        rarity={category}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMintClick(element);
                        }}
                      >
                        Mint
                      </MintButton>
                    </ElementCard>
                  </ElementItem>
                ))}
              </ElementsGrid>
            </CategoryCard>
          )
        ))}
      </DiscoveredElementsContainer>
      {selectedModalElement && (
        <ElementModal 
          element={selectedModalElement} 
          onClose={closeModal} 
        />
      )}
       {showFusionAnimation && animationEnabled && selectedElements.length === 2 && result && result.success && (
        <FusionAnimation
          element1={selectedElements[0]}
          element2={selectedElements[1]}
          result={result.element!}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
      {showHintModal && (
        <HintModal onClose={closeHintModal} />
      )}
    </FusionAreaContainer>
  );
};

export default FusionArea;