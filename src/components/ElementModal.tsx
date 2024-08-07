// ElementModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GlowingElement, SmoothTransition, HoverEffect } from './StyledComponents';

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

const MintButton = styled(HoverEffect)`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
`;

const ElementCombination = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  color: #666;
`;

const ElementModal = ({ element, onClose }) => {
    const [description, setDescription] = useState('Loading...');
  
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
          <MintButton onClick={() => alert('Minting functionality will be added later')}>Mint</MintButton>
        </ModalContent>
      </ModalBackground>
    );
  };
  
  export default ElementModal;
  