import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const DividerContainer = styled.div`
  width: 10px;
  background-color: #ccc;
  cursor: col-resize;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DividerLine = styled.div`
  width: 2px;
  height: 20px;
  background-color: #888;
`;

interface ResizableDividerProps {
  onResize: (newLeftWidth: number) => void;
}

const ResizableDivider: React.FC<ResizableDividerProps> = ({ onResize }) => {
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    onResize(e.clientX);
  }, [onResize]);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  return (
    <DividerContainer onMouseDown={handleMouseDown}>
      <DividerLine />
    </DividerContainer>
  );
};

export default ResizableDivider;
