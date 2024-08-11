import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ElementModal  from '../../ElementModal';
import FusionAnimation from '../../FusionAnimation';
import { useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useMint } from '../../../hooks/WriteContract';
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
  width: 140px;
  height: 140px;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin: 10px;
  background-color: #f0f0f0;
  transition: transform 0.3s ease, background-color 0.3s ease;
  cursor: pointer;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
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
  animation: ${props => glowAnimation(getGlowColor(props.rarity))} 2s infinite;
  overflow-y: auto;

  @media (max-width: 600px) {
    height: auto;
    max-height: 300px;
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

const FusionArea = ({ 
  selectedElements, 
  onElementRemove, 
  result, 
  onSave, 
  discoveredElements,
  onElementClick,
}: { 
  selectedElements: Element[], 
  onElementRemove: (index: number) => void, 
  result: { success: boolean, element?: Element } | null, 
  onSave: () => void, 
  discoveredElements: Element[],
  onElementClick: (element: Element) => void,
}) => {
  const [selectedModalElement, setSelectedModalElement] = useState<Element | null>(null);
  const [showFusionAnimation, setShowFusionAnimation] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const toast = useToast();
  const { isConnected } = useAccount();
  const { handleMint } = useMint();


  const categorizedElements = {
    common: discoveredElements.filter(e => e.rarity === 'common'),
    uncommon: discoveredElements.filter(e => e.rarity === 'uncommon'),
    rare: discoveredElements.filter(e => e.rarity === 'rare'),
    epic: discoveredElements.filter(e => e.rarity === 'epic'),
    legendary: discoveredElements.filter(e => e.rarity === 'legendary'),
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
  
      await tx.wait();
  
      toast({
        title: "Element minted successfully!",
        description: "Transaction confirmed.",
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
  return (
    <FusionAreaContainer>
      <SwitcherContainer>
        <SwitcherLabel>
          <SwitcherInput 
            type="checkbox" 
            checked={animationEnabled}
            onChange={handleAnimationToggle}
          />
          <SwitcherSlider />
          <SwitcherText>{animationEnabled ? 'Animation On' : 'Animation Off'}</SwitcherText>
        </SwitcherLabel>
      </SwitcherContainer>

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
      <SaveButton onClick={onSave}>Save My Progress</SaveButton>
      <h2>Discovered Elements</h2>
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
    </FusionAreaContainer>
  );
};

export default FusionArea;