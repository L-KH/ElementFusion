import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(10px); }
  100% { transform: translateY(0px); }
`;

const SVGContainer = styled.svg`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const AnimatedGroup = styled.g<{ delay: number }>`
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const emojis = [
  '🌍', '🌪️', '🌬️', '🌊', '⛰️', '🪨', '💨', '☁️', '⚡', '🌞', 
  '🌙', '🌱', '🍃', '🔥', '💧', '⛅', '❄️', '🌋', '🌑', '💥', 
  '🪴', '🌾', '🌕', '🌈', '⚒️', '🪵', '⚗️', '🌡️', '⚙️'
];

const BackgroundPattern: React.FC = () => {
  const patternElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    const gridSize = 100;
    const cols = 10;
    const rows = 10;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * gridSize + (i % 2 === 0 ? 0 : gridSize / 2);
        const y = i * gridSize * 0.866; // 0.866 is approximately sin(60°)

        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const size = 20 + Math.random() * 30; // Random size between 20 and 50
        const opacity = 0.2 + Math.random() * 0.3; // Random opacity between 0.2 and 0.5

        elements.push(
          <AnimatedGroup key={`${i}-${j}`} delay={Math.random() * 6}>
            <text
              x={x}
              y={y}
              fontSize={size}
              fill={`rgba(255,255,255,${opacity})`}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {emoji}
            </text>
          </AnimatedGroup>
        );
      }
    }
    return elements;
  }, []);

  return (
    <SVGContainer>
      <defs>
        <pattern id="elementPattern" x="0" y="0" width="1000" height="866" patternUnits="userSpaceOnUse">
          {patternElements}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#elementPattern)" />
    </SVGContainer>
  );
};

export default BackgroundPattern;
