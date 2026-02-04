"use client";

import { useEffect, useRef } from "react";

interface StringAnimationProps {
  className?: string;
}

export default function StringAnimation({
  className = "",
}: StringAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Draw fixed endpoints
      const padding = 40;
      const stringY = height / 2;

      // Draw bridge and nut
      ctx.fillStyle = "#3f3f46";
      ctx.fillRect(padding - 4, stringY - 15, 8, 30);
      ctx.fillRect(width - padding - 4, stringY - 15, 8, 30);

      // Draw vibrating string with multiple harmonics
      const gradient = ctx.createLinearGradient(padding, 0, width - padding, 0);
      gradient.addColorStop(0, "#7c3aed");
      gradient.addColorStop(1, "#f97316");

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      const stringLength = width - 2 * padding;
      const amplitude1 = 25; // Fundamental
      const amplitude2 = 12; // 2nd harmonic
      const amplitude3 = 6; // 3rd harmonic

      const freq1 = 2;
      const freq2 = 3.5;
      const freq3 = 5;

      for (let x = 0; x <= stringLength; x++) {
        const normalizedX = x / stringLength;
        const pixelX = padding + x;

        // Superimpose harmonics with standing wave pattern
        const y1 =
          amplitude1 *
          Math.sin(Math.PI * normalizedX) *
          Math.sin(time * freq1);
        const y2 =
          amplitude2 *
          Math.sin(2 * Math.PI * normalizedX) *
          Math.sin(time * freq2 + 0.5);
        const y3 =
          amplitude3 *
          Math.sin(3 * Math.PI * normalizedX) *
          Math.sin(time * freq3 + 1);

        const totalY = stringY + y1 + y2 + y3;

        if (x === 0) {
          ctx.moveTo(pixelX, totalY);
        } else {
          ctx.lineTo(pixelX, totalY);
        }
      }

      ctx.stroke();

      // Draw faint harmonic node indicators
      ctx.fillStyle = "rgba(124, 58, 237, 0.3)";
      // 12th fret (middle)
      ctx.beginPath();
      ctx.arc(width / 2, stringY, 4, 0, Math.PI * 2);
      ctx.fill();

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-32 ${className}`}
      aria-label="Animated vibrating guitar string"
    />
  );
}
