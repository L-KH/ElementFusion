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
    const trail: { x: number; y: number; size: number }[] = [];
    const trailLength = 20;

    // Generate random colors for the gradient
    const color1 = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
    const color2 = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;

    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.push({ x: mouseX, y: mouseY, size: 30 });
      if (trail.length > trailLength) {
        trail.shift();
      }

      trail.forEach((point, index) => {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.size
        );
        const alpha1 = 1.7 * (1 - index / trailLength);
        const alpha2 = 1.5 * (1 - index / trailLength);
        gradient.addColorStop(0, color1.replace('rgb', 'rgba').replace(')', `,${alpha1})`));
        gradient.addColorStop(1, color2.replace('rgb', 'rgba').replace(')', `,${alpha2})`));

        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * (1 - index / trailLength), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        point.size *= 0.95;
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
