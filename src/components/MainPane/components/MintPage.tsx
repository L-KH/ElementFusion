import React from 'react';
import styled from 'styled-components';
import { rarityColors } from '../rarityColors';

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

  &:hover {
    transform: scale(1.05);
    background-color: #4411;
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
  const allElements = [...elements, ...discoveredElements];
  return (
    <div>
      <h2>Elements</h2>
      <ElementsList>
        {allElements.map((element) => (
          <ElementDiv
            key={element.id}
            rarity={element.rarity}
            onClick={() => onElementClick(element)}
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
