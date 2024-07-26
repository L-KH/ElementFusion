import React from 'react';
import styled from 'styled-components';

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
  justify-content: center;
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
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const FusionArea = ({ selectedElements, onElementRemove, result, onSave }: { selectedElements: Element[], onElementRemove: (index: number) => void, result: { success: boolean, element: Element } | null, onSave: () => void }) => {
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
            <img src={result.element.imagePath} alt={result.element.name} />
          ) : result && !result.success ? (
            <InvalidSign>X</InvalidSign>
          ) : null}
        </FusionElement>
      </FusionBox>
      <SaveButton onClick={onSave}>Save My Progress</SaveButton>
    </FusionAreaContainer>
  );
};

export default FusionArea;
