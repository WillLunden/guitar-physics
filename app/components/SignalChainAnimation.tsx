"use client";

import { useEffect, useRef } from "react";

interface SignalChainAnimationProps {
  className?: string;
}

export default function SignalChainAnimation({
  className = "",
}: SignalChainAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      timeRef.current += 0.016;
      const t = timeRef.current;

      const centerY = height / 2 - 10;
      const padding = 20;

      // Frequencies for the wave
      const f1 = 2.5;
      const f2 = 5;
      const f3 = 7.5;

      // === CONTINUOUS LAYOUT ===
      // String spans ~35% with pickup underneath near bridge end
      const stringStart = padding;
      const stringEnd = width * 0.32;
      const stringLength = stringEnd - stringStart;

      // Pickup positioned at ~85% along string (near bridge)
      const pickupX = stringStart + stringLength * 0.82;

      // Rest of signal chain
      const wire1Start = stringEnd + 15;
      const wire1End = width * 0.42;
      const gainX = width * 0.48;
      const wire2Start = width * 0.54;
      const wire2End = width * 0.68;
      const speakerX = width * 0.74;
      const airStart = width * 0.80;
      const airEnd = width - padding;

      // === 1. VIBRATING STRING ===
      // Fixed endpoints (nut and bridge)
      ctx.fillStyle = "#52525b";
      ctx.fillRect(stringStart - 3, centerY - 15, 6, 30);
      ctx.fillRect(stringEnd - 3, centerY - 15, 6, 30);

      // Nut/Bridge labels
      ctx.fillStyle = "#52525b";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Nut", stringStart, centerY - 22);
      ctx.fillText("Bridge", stringEnd, centerY - 22);

      // Draw vibrating string
      const stringGradient = ctx.createLinearGradient(stringStart, 0, stringEnd, 0);
      stringGradient.addColorStop(0, "#7c3aed");
      stringGradient.addColorStop(1, "#9333ea");
      ctx.strokeStyle = stringGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let i = 0; i <= 80; i++) {
        const x = stringStart + (i / 80) * stringLength;
        const normalizedX = i / 80;
        // Standing wave with harmonics
        const displacement =
          20 * Math.sin(Math.PI * normalizedX) * Math.cos(2 * Math.PI * f1 * t) +
          9 * Math.sin(2 * Math.PI * normalizedX) * Math.cos(2 * Math.PI * f2 * t) +
          5 * Math.sin(3 * Math.PI * normalizedX) * Math.cos(2 * Math.PI * f3 * t);
        const y = centerY - displacement;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // === 2. PICKUP (directly under string near bridge) ===
      const pickupWidth = 28;
      const pickupHeight = 32;
      const pickupTop = centerY + 28;

      // Magnet body
      const magnetGradient = ctx.createLinearGradient(
        pickupX - pickupWidth / 2,
        pickupTop,
        pickupX - pickupWidth / 2,
        pickupTop + pickupHeight
      );
      magnetGradient.addColorStop(0, "#ef4444");
      magnetGradient.addColorStop(1, "#71717a");
      ctx.fillStyle = magnetGradient;
      ctx.fillRect(pickupX - pickupWidth / 2, pickupTop, pickupWidth, pickupHeight);

      // Pole piece
      ctx.fillStyle = "#3f3f46";
      ctx.beginPath();
      ctx.arc(pickupX, pickupTop - 2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Coil windings
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(pickupX, pickupTop + 8 + i * 8, pickupWidth / 2 + 3, 3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Magnetic field lines (animated, reaching up to string)
      const pickupNormalizedX = 0.82;
      const stringAtPickup = centerY - (
        20 * Math.sin(Math.PI * pickupNormalizedX) * Math.cos(2 * Math.PI * f1 * t) +
        9 * Math.sin(2 * Math.PI * pickupNormalizedX) * Math.cos(2 * Math.PI * f2 * t) +
        5 * Math.sin(3 * Math.PI * pickupNormalizedX) * Math.cos(2 * Math.PI * f3 * t)
      );

      ctx.strokeStyle = "rgba(124, 58, 237, 0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(pickupX + i * 5, pickupTop - 2);
        ctx.lineTo(pickupX + i * 3, stringAtPickup + 4);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Pickup", pickupX, height - 6);

      // === 3. WIRE FROM PICKUP TO GAIN (with signal) ===
      // Wire path from pickup
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pickupX + pickupWidth / 2, pickupTop + pickupHeight / 2);
      ctx.lineTo(wire1Start - 5, pickupTop + pickupHeight / 2);
      ctx.quadraticCurveTo(wire1Start, pickupTop + pickupHeight / 2, wire1Start, centerY + 15);
      ctx.lineTo(wire1Start, centerY);
      ctx.lineTo(wire1End, centerY);
      ctx.stroke();

      // Signal on wire (small waveform along wire)
      const wireSignalY = centerY;
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const x = wire1Start + 5 + (i / 40) * (wire1End - wire1Start - 10);
        const phase = (i / 40) * Math.PI * 3 - t * 10;
        const signal = 8 * Math.sin(phase) + 3 * Math.sin(2 * phase);
        const y = wireSignalY + signal;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // === 4. GAIN BLOCK ===
      const gainSize = 40;

      // Box
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 2;
      ctx.strokeRect(gainX - gainSize / 2, centerY - gainSize / 2, gainSize, gainSize);

      // Triangle symbol
      ctx.beginPath();
      ctx.moveTo(gainX - 12, centerY - 12);
      ctx.lineTo(gainX - 12, centerY + 12);
      ctx.lineTo(gainX + 12, centerY);
      ctx.closePath();
      ctx.stroke();

      // Input dot
      ctx.fillStyle = "#7c3aed";
      ctx.beginPath();
      ctx.arc(gainX - gainSize / 2, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Output dot
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(gainX + gainSize / 2, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Gain", gainX, height - 8);

      // === 5. WIRE FROM GAIN TO SPEAKER (with clipped signal) ===
      // Wire path
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gainX + gainSize / 2, centerY);
      ctx.lineTo(wire2End, centerY);
      ctx.stroke();

      // Clipped signal on wire
      const clipLevel = 15;
      const wire2Gradient = ctx.createLinearGradient(wire2Start, 0, wire2End, 0);
      wire2Gradient.addColorStop(0, "#7c3aed");
      wire2Gradient.addColorStop(1, "#f97316");
      ctx.strokeStyle = wire2Gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const x = wire2Start + (i / 60) * (wire2End - wire2Start);
        const phase = (i / 60) * Math.PI * 4 - t * 10;
        // Amplified signal
        let signal = 25 * Math.sin(phase) + 12 * Math.sin(2 * phase) + 6 * Math.sin(3 * phase);
        // Hard clipping
        signal = Math.max(-clipLevel, Math.min(clipLevel, signal));
        const y = centerY + signal;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Clipping level indicators (dashed lines)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(wire2Start, centerY - clipLevel);
      ctx.lineTo(wire2End, centerY - clipLevel);
      ctx.moveTo(wire2Start, centerY + clipLevel);
      ctx.lineTo(wire2End, centerY + clipLevel);
      ctx.stroke();
      ctx.setLineDash([]);

      // === 6. SPEAKER ===
      const speakerSize = 35;

      // Cabinet
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 2;
      ctx.strokeRect(speakerX - speakerSize / 2, centerY - speakerSize / 2, speakerSize, speakerSize);

      // Cone
      ctx.fillStyle = "#27272a";
      ctx.beginPath();
      ctx.arc(speakerX, centerY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Dust cap (animated)
      const coneMove = 3 * Math.sin(2 * Math.PI * f1 * t * 3);
      ctx.fillStyle = "#52525b";
      ctx.beginPath();
      ctx.arc(speakerX + coneMove * 0.3, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Surround
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(speakerX, centerY, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Speaker", speakerX, height - 8);

      // === 7. AIR WAVES ===
      // Pressure waves emanating
      const numWaves = 6;
      for (let i = 0; i < numWaves; i++) {
        const wavePhase = (t * 1.5 + i * 0.4) % 2.4;
        const waveX = speakerX + speakerSize / 2 + wavePhase * 40;
        const opacity = Math.max(0, 1 - wavePhase / 2.4);

        if (waveX < airEnd) {
          ctx.strokeStyle = `rgba(249, 115, 22, ${opacity * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(waveX, centerY, 15 + wavePhase * 10, -Math.PI / 2.5, Math.PI / 2.5);
          ctx.stroke();
        }
      }

      // Sound wave visualization
      if (airEnd - airStart > 30) {
        const soundGradient = ctx.createLinearGradient(airStart, 0, airEnd, 0);
        soundGradient.addColorStop(0, "rgba(249, 115, 22, 0.8)");
        soundGradient.addColorStop(1, "rgba(249, 115, 22, 0.2)");
        ctx.strokeStyle = soundGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i <= 50; i++) {
          const x = airStart + (i / 50) * (airEnd - airStart);
          const phase = (i / 50) * Math.PI * 3 - t * 10;
          const envelope = 1 - (i / 50) * 0.6; // Fade out
          // Clipped waveform shape propagates to air
          let signal = 18 * Math.sin(phase) + 8 * Math.sin(2 * phase) + 4 * Math.sin(3 * phase);
          signal = Math.max(-12, Math.min(12, signal)); // Still shows clipping character
          const y = centerY + signal * envelope;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Sound", (airStart + airEnd) / 2, height - 8);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      aria-label="Signal chain: vibrating string over pickup, through gain stage with clipping, to speaker and sound waves"
    />
  );
}
