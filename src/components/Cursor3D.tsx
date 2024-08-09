'use client';

import React, { useEffect, useRef } from 'react';

const Cursor3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mouseX = 0;
    let mouseY = 0;
    const trail: { x: number; y: number; size: number; blur: number }[] = [];
    const trailLength = 30;

    // Generate 3 random colors
    const getRandomColor = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    };
    const colors = [getRandomColor(), getRandomColor(), getRandomColor()];
    
    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.push({ x: mouseX, y: mouseY, size: 50, blur: 15 });
      if (trail.length > trailLength) {
        trail.shift();
      }

      trail.forEach((point, index) => {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.size
        );
        const alpha = 0.7 * (1 - index / trailLength);
        const colorIndex = Math.floor(index / (trailLength / 3));
        const nextColorIndex = (colorIndex + 1) % 3;
        
        gradient.addColorStop(0, colors[colorIndex]);
        gradient.addColorStop(1, colors[nextColorIndex]);

        ctx.filter = `blur(${point.blur}px)`;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * (1 - index / trailLength), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        point.size *= 0.9;
        point.blur *= 0.9;
      });

      requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('mousemove', updateMousePosition);
    animate();

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default Cursor3D;
