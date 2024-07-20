import React, { useState, useEffect } from 'react';
import FusionArea from './components/FusionArea';
import MintPage from './components/MintPage';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const LeftPane = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 2px solid #ccc;
  position: relative;
  overflow: hidden;
`;

const RightPane = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const MainPane = () => {
  const [selectedElements, setSelectedElements] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [discoveredElements, setDiscoveredElements] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/combinations.json')
      .then((res) => res.json())
      .then((data) => setCombinations(data));
  }, []);

  const handleElementClick = (element) => {
    if (selectedElements.length < 2) {
      setSelectedElements([...selectedElements, element]);
    }
  };

  const handleElementRemove = (index) => {
    const newElements = [...selectedElements];
    newElements.splice(index, 1);
    setSelectedElements(newElements);
    setResult(null);
  };

  const checkCombination = () => {
    if (selectedElements.length === 2) {
      const inputs = selectedElements.map((el) => el.name.toLowerCase());
      const combination = combinations.find((combo) => {
        return (
          (combo.input[0] === inputs[0] && combo.input[1] === inputs[1]) ||
          (combo.input[0] === inputs[1] && combo.input[1] === inputs[0])
        );
      });
      if (combination) {
        const alreadyDiscovered = discoveredElements.some(el => el.name === combination.output);
        const newElement = { id: Date.now(), name: combination.output, imagePath: `/images/${combination.output}.webp` };
        if (!alreadyDiscovered) {
          setDiscoveredElements([...discoveredElements, newElement]);
        }
        setResult({ success: true, element: newElement });
      } else {
        setResult({ success: false });
      }
    }
  };

  useEffect(() => {
    checkCombination();
  }, [selectedElements]);

  return (
    <Container>
      <LeftPane>
        <FusionArea selectedElements={selectedElements} onElementRemove={handleElementRemove} result={result} />
      </LeftPane>
      <RightPane>
        <MintPage onElementClick={handleElementClick} discoveredElements={discoveredElements} />
      </RightPane>
    </Container>
  );
};

export default MainPane;
