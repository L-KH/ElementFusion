import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const spiralRotateToCenter = (startPosition: 'left' | 'right') => keyframes`
  0% {
    transform: ${startPosition === 'left' ? 'translateX(-150px)' : 'translateX(150px)'} scale(1.5) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: ${startPosition === 'left' ? 'translateX(-75px)' : 'translateX(75px)'} scale(1.25) rotate(${startPosition === 'left' ? '360deg' : '-360deg'});
    opacity: 0.5;
  }
  100% {
    transform: translateX(0) scale(1) rotate(${startPosition === 'left' ? '720deg' : '-720deg'});
    opacity: 0;
  }
`;

const appearFromCenter = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;
const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common': return '#cccccc';
    case 'uncommon': return '#1eff00';
    case 'rare': return '#0070dd';
    case 'epic': return '#a335ee';
    case 'legendary': return '#ff8000';
    default: return '#ffffff';
  }
};

const glowPulse = (color: string) => keyframes`
  0% { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px ${color}, 0 0 60px ${color}, 0 0 80px ${color}, 0 0 100px ${color}, 0 0 120px ${color}; }
  50% { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}, 0 0 50px ${color}, 0 0 60px ${color}; }
  100% { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px ${color}, 0 0 60px ${color}, 0 0 80px ${color}, 0 0 100px ${color}, 0 0 120px ${color}; }
`;

const traceEffect = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.1), 0 0 10px rgba(255, 255, 255, 0.1), 0 0 15px rgba(255, 255, 255, 0.1);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0), 0 0 10px rgba(255, 255, 255, 0), 0 0 15px rgba(255, 255, 255, 0);
  }
`;

const AnimationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
`;

const FusionArea = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ElementImage = styled.div<{ position: 'left' | 'right'; imagePath: string }>`
  width: 80px;
  height: 80px;
  background-image: url(${props => props.imagePath});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${props => props.position === 'left' ? 'translateX(-150px)' : 'translateX(150px)'} scale(1.5);
  animation: ${props => spiralRotateToCenter(props.position)} 2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards,
             ${traceEffect} 2s linear forwards;
  will-change: transform, opacity, box-shadow;
`;
const ResultElementContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResultElement = styled.img<{ rarity: string }>`
  width: 200px;
  height: 200px;
  animation: ${appearFromCenter} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 2s forwards,
             ${props => glowPulse(getRarityColor(props.rarity))} 1.5s ease-in-out 3.5s infinite;
  opacity: 0;
  will-change: transform, opacity;
`;

const ElementName = styled.div`
  font-size: 24px;
  color: #fff;
  opacity: 0;
  animation: ${appearFromCenter} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 2.5s forwards;
  margin-top: 10px;
`;


interface FusionAnimationProps {
  element1: { imagePath: string; name: string };
  element2: { imagePath: string; name: string };
  result: { imagePath: string; name: string; rarity: string };
  onAnimationEnd: () => void;
}

const FusionAnimation: React.FC<FusionAnimationProps> = ({ element1, element2, result, onAnimationEnd }) => {
  const animationRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  
  useEffect(() => {
    const animationDuration = 6000; // 6 seconds
    const timer = setTimeout(onAnimationEnd, animationDuration);

    // Create and play the audio
    audioRef.current = new Audio('/fusion.mp3'); // Adjust the path as needed
    audioRef.current.play().catch(error => console.error("Audio playback failed:", error));

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [onAnimationEnd]);

  return (
    <AnimationContainer ref={animationRef}>
      <FusionArea>
        <ElementImage imagePath={element1.imagePath} position="left" />
        <ElementImage imagePath={element2.imagePath} position="right" />
        <ResultElementContainer>
          <ResultElement src={result.imagePath} alt={result.name} rarity={result.rarity} />
          <ElementName>{result.name}</ElementName>
        </ResultElementContainer>
      </FusionArea>
    </AnimationContainer>
  );
};

export default FusionAnimation;