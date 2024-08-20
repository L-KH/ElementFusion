import React, { useState, useEffect,useMemo  } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
type Element = {
  id: number;
  name: string;
  imagePath: string;
  rarity: string;
};


const ElementImage = styled(LazyLoadImage)`
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
`;
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
  box-shadow: 0 0 10px ${(props) => rarityColors[props.rarity]};
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  border: 0.5px solid black;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);

  &:hover {
    background-color: ${(props) => rarityColors[props.rarity]};
    box-shadow: 0 0 30px ${(props) => rarityColors[props.rarity]};
  }

  animation: ${fadeIn} 0.5s ease-out;
`;


const ElementName = styled.span`
  font-weight: bold;
`;
//-------------------------------- Search CSS -----------------------

const SearchContainer = styled.div`
  position: relative;
  margin: 20px auto;
  width: 100%;
  max-width: 300px;
  display: block; // Ensure it's displayed as a block element
`;



const SearchBar = styled.input`
  width: 50px;
  padding: 10px 40px 10px 15px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  width: 100%; // Start with full width
  border: 1px solid; // Add a border to make it visible
  &:focus {
    width: 100%;
    outline: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    
  }

`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;
//----------------------------- End Search CSS -----------------------------------
//----------------------------- Optimisation function  -----------------------------------

const MemoizedElementCard = React.memo(({ element, onElementClick, rarity }: { element: Element; onElementClick: (element: Element) => void; rarity: string }) => (
  <ElementCard
    onClick={() => onElementClick(element)}
    rarity={rarity}
  >
    <ElementImage
      src={element.imagePath}
      alt={element.name}
      effect="blur"
      height={60}
      width={60}
    />
    <ElementName>{element.name}</ElementName>
  </ElementCard>
));

MemoizedElementCard.displayName = 'MemoizedElementCard';


const MintPage = ({ 
  onElementClick, 
  normalModeDiscoveredElements, 
  web3ModeDiscoveredElements, 
  currentMode 
}: { 
  onElementClick: (element: Element) => void, 
  normalModeDiscoveredElements: Element[],
  web3ModeDiscoveredElements: Element[],
  currentMode: 'normal' | 'web3'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredElements, setFilteredElements] = useState<Element[]>([]);

  const initialElements: { [key: string]: Element[] } = {
    normal: [
      { id: 1, name: 'Air', imagePath: '/images/air.webp', rarity: 'common' },
      { id: 2, name: 'Earth', imagePath: '/images/earth.webp', rarity: 'common' },
      { id: 3, name: 'Fire', imagePath: '/images/fire.webp', rarity: 'common' },
      { id: 4, name: 'Water', imagePath: '/images/water.webp', rarity: 'common' },
    ],
    web3: [
      { id: 1, name: 'Code', imagePath: '/images2/code.png', rarity: 'common' },
      { id: 2, name: 'Network', imagePath: '/images2/network.png', rarity: 'common' },
      { id: 3, name: 'Cryptography', imagePath: '/images2/cryptography.png', rarity: 'common' },
      { id: 4, name: 'Consensus', imagePath: '/images2/consensus.png', rarity: 'common' },
    ]
  };

  useEffect(() => {
    const currentInitialElements = initialElements[currentMode];
    const currentDiscoveredElements = currentMode === 'normal' ? normalModeDiscoveredElements : web3ModeDiscoveredElements;

    // Combine initial elements with discovered elements for the current mode only
    const allElements = [...currentInitialElements, ...currentDiscoveredElements];

    // Remove duplicates (in case a discovered element is also an initial element)
    const uniqueElements = allElements.filter((element, index, self) =>
      index === self.findIndex((e) => e.name === element.name)
    );

    // Sort elements: initial elements first, then alphabetically
    const sortedElements = uniqueElements.sort((a, b) => {
      const aIsInitial = currentInitialElements.some(el => el.name === a.name);
      const bIsInitial = currentInitialElements.some(el => el.name === b.name);
      if (aIsInitial && !bIsInitial) return -1;
      if (!aIsInitial && bIsInitial) return 1;
      return a.name.localeCompare(b.name);
    });

    // Filter elements based on search term
    const filtered = sortedElements.filter(element =>
      element.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredElements(filtered);
  }, [normalModeDiscoveredElements, web3ModeDiscoveredElements, currentMode, searchTerm]);

  const memoizedFilteredElements = useMemo(() => filteredElements, [filteredElements]);

  return (
    <div>
      <SearchContainer>
        <SearchBar
          type="text"
          placeholder="Search elements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon />
      </SearchContainer>
      <Grid>
        {memoizedFilteredElements.map((element) => (
          <MemoizedElementCard
            key={element.id}
            element={element}
            onElementClick={onElementClick}
            rarity={element.rarity}
          />
        ))}
      </Grid>
    </div>
  );
};

export default MintPage;
