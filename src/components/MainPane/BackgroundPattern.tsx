import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(5px); }
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
  animation: ${float} 8s ease-in-out infinite;
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
    const gridSize = 150; // Increase grid size to reduce the number of elements
    const cols = 8; // Reduce number of columns
    const rows = 8; // Reduce number of rows

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * gridSize + (i % 2 === 0 ? 0 : gridSize / 2);
        const y = i * gridSize * 0.866;

        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const size = 30 + Math.random() * 20; // Slightly larger emojis, but fewer
        const opacity = 0.3 + Math.random() * 0.2; // Opacity range is reduced

        elements.push(
          <AnimatedGroup key={`${i}-${j}`} delay={Math.random() * 8}> 
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
        <pattern id="elementPattern" x="0" y="0" width="1200" height="1039" patternUnits="userSpaceOnUse">
          {patternElements}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#elementPattern)" />
    </SVGContainer>
  );
};

export default BackgroundPattern;
