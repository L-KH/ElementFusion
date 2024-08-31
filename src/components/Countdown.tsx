import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CountdownWrapper = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #2ecc71;
`;

interface CountdownProps {
  endTime: bigint;
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = BigInt(Math.floor(Date.now() / 1000));
      const diff = Number(endTime - now);

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return <CountdownWrapper>{timeLeft}</CountdownWrapper>;
};

export default Countdown;
