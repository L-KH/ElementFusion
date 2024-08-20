import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ModeSwitchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ModeSwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 292px;
  height: 70px;
  background: linear-gradient(145deg, #f0f0f0, #e6e6e6);
  border-radius: 35px;
  box-shadow: 
    8px 8px 16px #d1d1d1,
    -8px -8px 16px #ffffff;
  cursor: pointer;
  overflow: hidden;
`;

const ModeSwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span:before {
    transform: translateX(140px);
  }
`;

const ModeSwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.4s;
  border-radius: 35px;

  &:before {
    position: absolute;
    content: "";
    height: 62px;
    width: 144px;
    left: 5px;
    bottom: 4px;
    background: linear-gradient(45deg, #2196F3, #21CBF3);
    background-size: 400% 400%;
    animation: ${slideBackground} 3s ease infinite;
    transition: 0.4s;
    border-radius: 31px;
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
  }
`;

const SliderText = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: 0.4s;
`;

const ModeText = styled.span<{ $isActive: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.$isActive ? '#ffffff' : '#757575'};
  transition: 0.4s;
  z-index: 1;
  text-shadow: ${props => props.$isActive ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'};
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ModeSwitchProps {
  currentMode: 'normal' | 'web3';
  handleModeSwitch: (mode: 'normal' | 'web3') => void;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ currentMode, handleModeSwitch }) => {
  return (
    <ModeSwitchContainer>
      <ModeSwitchLabel>
        <ModeSwitchInput 
          type="checkbox" 
          checked={currentMode === 'web3'}
          onChange={() => handleModeSwitch(currentMode === 'normal' ? 'web3' : 'normal')}
        />
        <ModeSwitchSlider>
          <SliderText>
            <ModeText $isActive={currentMode === 'normal'}>Normal</ModeText>
            <ModeText $isActive={currentMode === 'web3'}>Web3</ModeText>
          </SliderText>
        </ModeSwitchSlider>
      </ModeSwitchLabel>
    </ModeSwitchContainer>
  );
};

export default ModeSwitch;
