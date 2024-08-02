'use client';

import styled from 'styled-components';

export const GlowingElement = styled.div`
  box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
  animation: glow 1.5s ease-in-out infinite alternate;

  @keyframes glow {
    from {
      box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff;
    }
    to {
      box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
    }
  }
`;

export const SmoothTransition = styled.div`
  transition: all 0.3s ease-in-out;
`;

export const HoverEffect = styled.div`
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;
