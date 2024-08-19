import { useState, useEffect, useRef } from 'react';

export const useAudioManager = () => {
  const [musicOption, setMusicOption] = useState('off');
  const audioRef1 = useRef<HTMLAudioElement | null>(null);
  const audioRef2 = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef1.current = new Audio('/music1.mp3');
    audioRef2.current = new Audio('/music2.mp3');
    audioRef1.current.loop = true;
    audioRef2.current.loop = true;

    return () => {
      audioRef1.current?.pause();
      audioRef2.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (musicOption === 'music1') {
      audioRef1.current?.play();
      audioRef2.current?.pause();
    } else if (musicOption === 'music2') {
      audioRef1.current?.pause();
      audioRef2.current?.play();
    } else {
      audioRef1.current?.pause();
      audioRef2.current?.pause();
    }
  }, [musicOption]);

  return { musicOption, setMusicOption };
};
