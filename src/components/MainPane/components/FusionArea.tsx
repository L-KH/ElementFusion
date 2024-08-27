import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import ElementModal  from '../../ElementModal';
import FusionAnimation from '../../FusionAnimation';
import { useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useMint } from '../../../hooks/WriteContract';
import HintModal from '../../HintModal'; // New import
import { FaCog, FaTimes } from 'react-icons/fa';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Switch, Text, VStack, Flex  } from '@chakra-ui/react';
import { useAudioManager } from '../../useAudioManager'; // Add this import
import ModeSwitchComponent from '../../ModeSwitch'; // Adjust the path as needed
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Box } from '@chakra-ui/react';
import { InfoIcon, WarningIcon } from '@chakra-ui/icons';
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
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const FusionElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  min-width: 100px;
  min-height: 100px;
  border: 2px solid rgba(204, 204, 204, 0.9);
  border-radius: 5px;
  margin: 0 10px;
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
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    z-index: 1;
  }

  @media (min-width: 768px) {
    width: 180px;
    height: 180px;
    min-width: 120px;
    min-height: 120px;
  }
`;

const FusionSign = styled.div`
  font-size: 24px;
  margin: 0 5px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    font-size: 36px;
    margin: 0 10px;
  }
`;


const EmptyBox = styled(FusionElement)`
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 16px;

  @media (min-width: 768px) {
    font-size: 24px;
  }
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
  height: auto;
  max-height: 300px;
  padding: 10px;
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
      @media (min-width: 768px) {
    height: 400px;
    padding: 15px;
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


//----------------------------------end switcher-------------------------------------
//----------------Hints
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }
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
      @media (min-width: 768px) {
    padding: 12px 20px;
    font-size: 16px;
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
// ---------------------- switcher
// ------------------------- tutorial image
const InfoIconWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 20px; 
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const StyledModalContent = styled(ModalContent)`
  width: 100%;
  height: 100%;
  max-width: 1600px;
  max-height: 1200px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  animation: glow 2s infinite alternate;

  @keyframes glow {
    from {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }
    to {
      box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
    }
  }
`;

const TutorialImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
`;
const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  padding: 8px;
  background-color: rgba(255, 165, 0, 0.2);
  border-radius: 4px;
  font-size: 14px;
  color: #FFA500;
  max-width: 400px;
  text-align: center;
`;

//-----------------------------------------------------------------



const FusionArea = ({ 
  selectedElements, 
  onElementRemove, 
  result, 
  onSave, 
  discoveredElements,
  onElementClick,
  backgroundPatternEnabled,
  setBackgroundPatternEnabled,
  currentMode,
  setCurrentMode,
}: { 
  selectedElements: Element[], 
  onElementRemove: (index: number) => void, 
  result: { success: boolean, element?: Element } | null, 
  onSave: () => void, 
  discoveredElements: Element[],
  onElementClick: (element: Element) => void,
  backgroundPatternEnabled: boolean,
  setBackgroundPatternEnabled: React.Dispatch<React.SetStateAction<boolean>>,
  currentMode: 'normal' | 'web3',
  setCurrentMode: React.Dispatch<React.SetStateAction<'normal' | 'web3'>>,
}) => {
  const [selectedModalElement, setSelectedModalElement] = useState<Element | null>(null);
  const [showFusionAnimation, setShowFusionAnimation] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const toast = useToast();
  const { isConnected } = useAccount();
  const { handleMint } = useMint();
  const [isMinting, setIsMinting] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { musicOption, setMusicOption } = useAudioManager();
  const [showTutorial, setShowTutorial] = useState(false);
  const handleInfoClick = () => {
    setShowTutorial(true);
  };
  
  
  const categorizedElements = {
    common: discoveredElements.filter(e => e.rarity === 'common'),
    uncommon: discoveredElements.filter(e => e.rarity === 'uncommon'),
    rare: discoveredElements.filter(e => e.rarity === 'rare'),
    epic: discoveredElements.filter(e => e.rarity === 'epic'),
    legendary: discoveredElements.filter(e => e.rarity === 'legendary'),
  };
  const handleModeSwitch = (newMode: 'normal' | 'web3') => {
    setCurrentMode(newMode);
    // Reset the selected elements
    onElementRemove(0);
    onElementRemove(1);
    // Refresh the page with the new mode
    //window.location.href = `/?mode=${newMode}`;
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
        <InfoIconWrapper onClick={handleInfoClick}>
          <InfoIcon boxSize={6} color="#2196F3" />
        </InfoIconWrapper>

        <Modal isOpen={showTutorial} onClose={() => setShowTutorial(false)} isCentered>
          <ModalOverlay />
          <StyledModalContent>
            <ModalCloseButton color="white" />
            <ModalBody p={0}>
              <TutorialImage src="tutorial-image.png" alt="Tutorial" onClick={() => setShowTutorial(false)} />
            </ModalBody>
          </StyledModalContent>
        </Modal>


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


      <ModeSwitchComponent currentMode={currentMode} handleModeSwitch={handleModeSwitch} />

      {/* <h2>Fusion Area</h2> */}
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
      <WarningMessage>
        <WarningIcon mr={2} />
        Warning: Save your progress before refreshing or switching models to avoid losing elements!
      </WarningMessage>
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