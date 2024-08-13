// MainPane.tsx
import React, { useState, useEffect } from 'react';
import FusionArea from './components/FusionArea';
import MintPage from './components/MintPage';
import styled, { keyframes } from 'styled-components';
import combinationsData from './element_recipes_with_rarity.json';
import { useSignMessageHook } from '../../hooks/useSignMessageHook';
import { Spinner, useToast } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { AnimatedElement, ScrollToTopButton } from '../../components/UIComponents';
import BackgroundPattern from './BackgroundPattern';
type Element = {
  id: number;
  name: string;
  imagePath: string;
  rarity: string;
};

type Combination = {
  input: string[];
  output: string;
  rarity: string;
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  
`;




const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;



const Pane = styled.div`
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
`;

const LeftPane = styled(Pane)`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 2px solid #ccc;
  position: relative;
  overflow: hidden;
`;

const RightPane = styled(Pane)`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const MainPane = () => {
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [discoveredElements, setDiscoveredElements] = useState<Element[]>([]);
  const [result, setResult] = useState<{ success: boolean; element: Element | null } | null>(null);
  const { saveElements, loadElements } = useSignMessageHook();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    const savedElements = loadElements();
    setDiscoveredElements(savedElements);
  }, []);

  const handleElementClick = (element: Element) => {
    if (selectedElements.length < 2) {
      setSelectedElements([...selectedElements, element]);
    }
  };

  const handleElementRemove = (index: number) => {
    const newElements = [...selectedElements];
    newElements.splice(index, 1);
    setSelectedElements(newElements);
    setResult(null);
  };

  const checkCombination = () => {
    if (selectedElements.length === 2) {
      const inputs = selectedElements.map((el) => el.name.toLowerCase());
      const combination = combinationsData.find((combo: Combination) => {
        return (
          (combo.input[0] === inputs[0] && combo.input[1] === inputs[1]) ||
          (combo.input[0] === inputs[1] && combo.input[1] === inputs[0])
        );
      });
      if (combination) {
        const alreadyDiscovered = discoveredElements.some(el => el.name === combination.output);
        const newElement = {
          id: Date.now(),
          name: combination.output,
          imagePath: `/images/${combination.output}.png`,
          rarity: combination.rarity,
        };
        if (!alreadyDiscovered) {
          setDiscoveredElements([...discoveredElements, newElement]);
        }
        setResult({ success: true, element: newElement });
      } else {
        setResult({ success: false, element: null });
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    await saveElements(discoveredElements);
    setIsLoading(false);
    toast({
      title: "Elements saved",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  const handleScrollToTop = () => {
    document.querySelector('.right-pane')?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    checkCombination();
  }, [selectedElements]);


  return (
    <Container>
      <BackgroundPattern />
      <LeftPane>
        <FusionArea
          selectedElements={selectedElements}
          onElementRemove={handleElementRemove}
          result={result as { success: boolean; element: Element } | null}
          onSave={handleSave}
          discoveredElements={discoveredElements}
          onElementClick={handleElementClick}
        />
        {isLoading && <Spinner />}
      </LeftPane>
      <RightPane className="right-pane">
        <MintPage onElementClick={handleElementClick} discoveredElements={discoveredElements} />
        <ScrollToTopButton onClick={handleScrollToTop}>
          <ArrowUpIcon />
        </ScrollToTopButton>
      </RightPane>
    </Container>
  );
};

export default MainPane;
