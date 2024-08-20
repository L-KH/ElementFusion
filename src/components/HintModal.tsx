import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import elementRecipes from './MainPane/element_recipes_with_rarity.json';
import { useToast } from '@chakra-ui/react';
import { FaLightbulb, FaFlask, FaMagic } from 'react-icons/fa'; // Import icons
import { useHintPurchase } from '../hooks/WriteContract';
import { ethers } from 'ethers';
//----
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const IconWrapper = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px; // Adjust this value as needed
`;


const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;


const CloseButton = styled.button`
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d32f2f;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

//--------------------------------------------------


const glowAnimation = keyframes`
  0% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.3), 0 0 40px rgba(255, 165, 0, 0.2), 0 0 60px rgba(255, 255, 0, 0.1); }
  33% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 255, 0.2), 0 0 60px rgba(0, 0, 255, 0.1); }
  66% { box-shadow: 0 0 20px rgba(75, 0, 130, 0.3), 0 0 40px rgba(143, 0, 255, 0.2), 0 0 60px rgba(255, 0, 255, 0.1); }
  100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.3), 0 0 40px rgba(255, 165, 0, 0.2), 0 0 60px rgba(255, 255, 0, 0.1); }
`;

const ModalContent = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 30px;
  border-radius: 15px;
  width: 95%;
  max-width: 900px;
  animation: ${glowAnimation} 10s ease-in-out infinite;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;




const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 20px;
`;



const Card = styled.div<{ isActive: boolean; color: string }>`
  flex: 1;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  background-color: ${props => props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 300px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${props => props.color === 'white' && `
    background-color: ${props.isActive ? '#f0f0f0' : 'white'};
    backdrop-filter: none;
    border: none;
    color: #333; // Dark text for white background
  `}

  ${props => props.color !== 'white' && `
    background-color: ${props.color};
    color: white;
  `}

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const CardPrice = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const CardDescription = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const CardButton = styled.button<{ color: string }>`
  padding: 10px 20px;
  background-color: ${props => props.color === 'white' ? '#2196F3' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.color === 'white' ? '#1976D2' : 'rgba(255, 255, 255, 0.3)'};
  }
`;
const ModalHeader = styled.h2`
  color: white;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  font-weight: bold;
`;
//-------------------------------------------------
const HintModal = ({ onClose }: { onClose: () => void }) => {

    const [activeCard, setActiveCard] = useState(0);
    const [freeHint, setFreeHint] = useState('');
    const [lastHintTime, setLastHintTime] = useState<number | null>(null);
    const [purchasedHints, setPurchasedHints] = useState<string[]>([]);
    const toast = useToast();
    const { handleHintPurchase } = useHintPurchase();
    const [isLoading, setIsLoading] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);

    useEffect(() => {
      const storedLastHintTime = localStorage.getItem('lastHintTime');
      if (storedLastHintTime) {
        setLastHintTime(parseInt(storedLastHintTime, 10));
      }
    }, []);
    // useEffect(() => {
    //     const storedHints = localStorage.getItem('purchasedHints');
    //     const hintsDownloaded = localStorage.getItem('hintsDownloaded');
    //     if (storedHints && !hintsDownloaded) {
    //       const parsedHints = JSON.parse(storedHints);
    //       console.log("Stored hints:", parsedHints);
    //       setPurchasedHints(parsedHints);
    //     } else {
    //       setPurchasedHints([]);
    //       localStorage.removeItem('purchasedHints');
    //     }
    //   }, []);
      
    let debounceTimeout;
    const handleFreeHintClick = () => {
      if (debounceTimeout) return; // Prevent multiple calls within the debounce period
      
      debounceTimeout = setTimeout(() => {
        debounceTimeout = null; // Reset the debounceTimeout after the delay
      }, 1000); // Set debounce delay (e.g., 1 second)
    
      const currentTime = Date.now();
      if (lastHintTime && currentTime - lastHintTime < 3 * 60 * 60 * 1000) {
        const remainingTime = Math.ceil((3 * 60 * 60 * 1000 - (currentTime - lastHintTime)) / (60 * 1000));
        toast({
          title: "Free hint not available",
          description: `You can get another free hint in ${remainingTime} minutes`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    
      const randomRecipe = elementRecipes[Math.floor(Math.random() * elementRecipes.length)];
      setFreeHint(`${randomRecipe.input[0]} + ${randomRecipe.input[1]} = ${randomRecipe.output}`);
      setLastHintTime(currentTime);
      localStorage.setItem('lastHintTime', currentTime.toString());
    };
  
    const handleCardClick = (cardIndex: number) => {
        setActiveCard(cardIndex);
        if (cardIndex === 0) {
          handleFreeHintClick();
        }
      };
      const generateRandomHints = (count: number) => {
        const allHints = elementRecipes.map(recipe => {
          return `${recipe.input[0]} + ${recipe.input[1]} = ${recipe.output}`;
        });
        
        const randomHints: string[] = [];
        for (let i = 0; i < count; i++) {
          if (allHints.length > 0) {
            const randomIndex = Math.floor(Math.random() * allHints.length);
            randomHints.push(allHints[randomIndex]);
            // Remove the used hint to avoid duplicates
            allHints.splice(randomIndex, 1);
          }
        }
        return randomHints;
      };
      
      
      
      const handlePurchase = async (isPremium: boolean) => {
        setIsLoading(true);
        try {
          const tx = await handleHintPurchase(isPremium);      
          // Wait for transaction confirmation
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.waitForTransaction(tx);
          const hintCount = isPremium ? 25 : 10;
          const newHints = generateRandomHints(hintCount);      
          if (newHints.length === 0) {
            throw new Error("Failed to generate hints");
          }
          setPurchasedHints(newHints);
         // localStorage.setItem('purchasedHints', JSON.stringify(newHints));
          setActiveCard(isPremium ? 2 : 1);
          toast({
            title: "Purchase successful",
            description: `You've unlocked ${hintCount} new hints!`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setShowHintModal(true);
                    // Clear localStorage
            localStorage.removeItem('purchasedHints');
            localStorage.removeItem('hintsDownloaded');
        } catch (error) {
          console.error("Error during purchase:", error);
          toast({
            title: "Purchase failed",
            description: error instanceof Error ? error.message : "An unknown error occurred",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      
      
      
      
      
      const HintDisplayModal = ({ hints, onClose }) => {
        const downloadHints = () => {
          const hintText = hints.join('\n');
          const blob = new Blob([hintText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'my_alchemy_hints.txt';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };
      
        return (
            <ModalBackground onClick={onClose}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>Your Purchased Hints</ModalHeader>
                {hints && hints.length > 0 ? (
                  <ul style={{ color: 'white', listStyleType: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
                    {hints.map((hint, index) => (
                      <li key={index} style={{ marginBottom: '10px', fontSize: '16px' }}>{hint}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'white', fontSize: '16px' }}>No hints available. Please try purchasing again.</p>
                )}
                <CardButton color="blue" onClick={downloadHints} style={{ marginRight: '10px' }}>Download Hints</CardButton>
                <CardButton color="blue" onClick={onClose}>Close</CardButton>
              </ModalContent>
            </ModalBackground>
          );
        };
      
      
      
  
      // const downloadHints = () => {
      //   const hintText = purchasedHints.join('\n');
      //   const blob = new Blob([hintText], { type: 'text/plain' });
      //   const url = URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   a.href = url;
      //   a.download = 'my_alchemy_hints.txt';
      //   document.body.appendChild(a);
      //   a.click();
      //   document.body.removeChild(a);
      //   URL.revokeObjectURL(url);
      //   localStorage.setItem('hintsDownloaded', 'true');
      //   setPurchasedHints([]);
      // };
      
  
      
  
      return (
        <ModalBackground onClick={onClose}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>Unlock the Secrets of Alchemy!</ModalHeader>
            <CardContainer>
                <Card isActive={activeCard === 0} color="white" onClick={() => handleCardClick(0)}>
                    <CardTitle>Novice Alchemist</CardTitle>
                    <IconWrapper><FaLightbulb /></IconWrapper>
                    <CardPrice>Free</CardPrice>
                    <CardDescription>{freeHint || 'One random hint every 3 hours'}</CardDescription>
                    <CardButton color="white" onClick={handleFreeHintClick}>Get Hint</CardButton>
                </Card>
                <Card isActive={activeCard === 1} color="rgba(33, 150, 243, 0.3)" onClick={() => handleCardClick(1)}>
                    <CardTitle>Alchemist Apprentice</CardTitle>
                    <IconWrapper><FaFlask /></IconWrapper>
                    <CardPrice>0.001 ETH</CardPrice>
                    <CardDescription>10 random hints to boost your progress</CardDescription>
                    <CardButton color="blue" onClick={() => handlePurchase(false)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Purchase'}
                    </CardButton>
                    </Card>

                    <Card isActive={activeCard === 2} color="rgba(156, 39, 176, 0.3)" onClick={() => handleCardClick(2)}>
                    <CardTitle>Master Alchemist</CardTitle>
                    <IconWrapper><FaMagic /></IconWrapper>
                    <CardPrice>0.002 ETH</CardPrice>
                    <CardDescription>25 random hints to unlock advanced elements</CardDescription>
                    <CardButton color="purple" onClick={() => handlePurchase(true)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Purchase'}
                    </CardButton>
                    </Card>
                </CardContainer>

            {purchasedHints.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                </div>
                )}

            <CloseButton onClick={onClose}>Close</CloseButton>
          </ModalContent>
          {showHintModal && (
            <HintDisplayModal 
                hints={purchasedHints} 
                onClose={() => setShowHintModal(false)} 
            />
            )}
        </ModalBackground>
    );
};

export default HintModal;