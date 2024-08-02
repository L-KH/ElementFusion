import React from 'react';
import styled, { keyframes } from 'styled-components';

type Element = {
  id: number;
  name: string;
  imagePath: string;
  rarity: string;
};

const FusionAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-height: 280vh; // Adjust this value as needed
  overflow-y: auto;
  padding: 20px;
`;



const FusionBox = styled.div<{ invalid?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  border: ${(props) => (props.invalid ? '2px solid red' : 'none')};
`;

const FusionElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin: 0 10px;
  background-color: #f0f0f0;
  transition: transform 0.3s ease, background-color 0.3s ease;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FusionSign = styled.div`
  font-size: 24px;
  color: #333;
  margin: 0 10px;
`;

const EmptyBox = styled.div`
  width: 150px;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  margin: 0 10px;
  background-color: #f0f0f0;
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
  width: 300px;
  height: 400px; // Set a fixed height
  padding: 15px;
  border-radius: 10px;
  background: ${props => getRarityGradient(props.rarity)};
  animation: ${props => glowAnimation(getGlowColor(props.rarity))} 2s infinite;
  overflow-y: auto; // Enable vertical scrolling
`;


const CategoryTitle = styled.h3`

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  text-align: center;
`;

const ElementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 5px;
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
    width: 40px;
    height: 40px;
    object-fit: cover;
  }

  p {
    font-size: 8px;
    margin: 2px 0;
  }
`;


//text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
const ElementCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  height: 80px; // Add a fixed height
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


const FusionArea = ({ 
  selectedElements, 
  onElementRemove, 
  result, 
  onSave, 
  discoveredElements,
  onElementClick
}: { 
  selectedElements: Element[], 
  onElementRemove: (index: number) => void, 
  result: { success: boolean, element?: Element } | null, 
  onSave: () => void, 
  discoveredElements: Element[],
  onElementClick: (element: Element) => void
}) => {
  const categorizedElements = {
    common: discoveredElements.filter(e => e.rarity === 'common'),
    uncommon: discoveredElements.filter(e => e.rarity === 'uncommon'),
    rare: discoveredElements.filter(e => e.rarity === 'rare'),
    epic: discoveredElements.filter(e => e.rarity === 'epic'),
    legendary: discoveredElements.filter(e => e.rarity === 'legendary'),
  };

  return (
    <FusionAreaContainer>
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
                    <ElementCard onClick={() => onElementClick(element)}>
                      <img src={element.imagePath} alt={element.name} />
                      <p>{element.name}</p>
                      <MintButton rarity={category}>Mint</MintButton>
                    </ElementCard>
                  </ElementItem>
                ))}
              </ElementsGrid>

            </CategoryCard>
          )
        ))}
      </DiscoveredElementsContainer>
    </FusionAreaContainer>
  );
};

export default FusionArea;