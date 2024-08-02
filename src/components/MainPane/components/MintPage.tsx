import React from 'react';
import styled from 'styled-components';

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
};

const ElementsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding-top: 20px;
`;

const ElementDiv = styled.div<{ rarity: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 10px;
  cursor: pointer;
  width: 100%; /* Full width */
  text-align: center;
  font-size: 18px;
  box-shadow: 0 0 20px ${(props) => rarityColors[props.rarity]};
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  border: 0.5px solid black; /* Add a border */

  &:hover {
    transform: scale(1.05);
    background-color: ${(props) => rarityColors[props.rarity]};
    box-shadow: 0 0 30px ${(props) => rarityColors[props.rarity]};
  }

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  span {
    flex-grow: 1;
  }
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
      <ElementsList>
        {allElements.map((element) => (
          <ElementDiv
            key={element.id}
            onClick={() => onElementClick(element)}
            rarity={element.rarity}
          >
            <img src={element.imagePath} alt={element.name} />
            <span>{element.name}</span>
          </ElementDiv>
        ))}
      </ElementsList>
    </div>
  );
};

export default MintPage;