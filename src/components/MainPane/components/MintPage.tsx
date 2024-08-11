import React from 'react';
import styled, { keyframes } from 'styled-components';

type Element = {
  id: number;
  name: string;
  imagePath: string;
  rarity: string;
};

const elements: Element[] = [
  { id: 1, name: 'Air', imagePath: '/images/air.webp', rarity: 'common' },
  { id: 2, name: 'Earth', imagePath: '/images/earth.webp', rarity: 'common' },
  { id: 3, name: 'Fire', imagePath: '/images/fire.webp', rarity: 'common' },
  { id: 4, name: 'Water', imagePath: '/images/water.webp', rarity: 'common' },
];

const rarityColors: { [key: string]: string } = {
  common: 'rgba(237, 237, 237, 0.8)',
  uncommon: 'rgba(0, 255, 0, 0.7)',
  rare: 'rgba(0, 0, 255, 0.7)',
  epic: 'rgba(255, 0, 255, 0.7)',
  legendary: 'rgba(255, 215, 0, 0.7)',
  hidden: 'rgba(0, 0, 0, 0.7)',

};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const ElementCard = styled.div<{ rarity: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 0 20px ${(props) => rarityColors[props.rarity]};
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  border: 0.5px solid black;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);

  &:hover {
    transform: scale(1.05);
    background-color: ${(props) => rarityColors[props.rarity]};
    box-shadow: 0 0 30px ${(props) => rarityColors[props.rarity]};
  }

  animation: ${fadeIn} 0.5s ease-out;
`;

const ElementImage = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
`;

const ElementName = styled.span`
  font-weight: bold;
`;

const MintPage = ({ onElementClick, discoveredElements }: { onElementClick: (element: Element) => void, discoveredElements: Element[] }) => {
  // Filter out basic elements from discoveredElements
  const nonBasicElements = discoveredElements.filter(element => 
    !elements.some(basicElement => basicElement.name.toLowerCase() === element.name.toLowerCase())
  );

  // Sort non-basic elements alphabetically
  const sortedNonBasicElements = nonBasicElements.sort((a, b) => a.name.localeCompare(b.name));

  // Combine basic elements and sorted non-basic elements
  const allElements = [...elements, ...sortedNonBasicElements];

  return (
    <div>
      <h2>Elements</h2>
      <Grid>
        {allElements.map((element) => (
          <ElementCard
            key={element.id}
            onClick={() => onElementClick(element)}
            rarity={element.rarity}
          >
            <ElementImage src={element.imagePath} alt={element.name} />
            <ElementName>{element.name}</ElementName>
          </ElementCard>
        ))}
      </Grid>
    </div>
  );
};

export default MintPage;
