"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PickupOperationSimProps {
  className?: string;
}

export default function PickupOperationSim({
  className = "",
}: PickupOperationSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [frequency, setFrequency] = useState(2); // Hz for visualization
  const [amplitude, setAmplitude] = useState(15); // pixels

  const isPlayingRef = useRef(isPlaying);
  const frequencyRef = useRef(frequency);
  const amplitudeRef = useRef(amplitude);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);

  useEffect(() => {
    amplitudeRef.current = amplitude;
  }, [amplitude]);

  // Draw a curved magnetic field line
  const drawFieldLine = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      stringY: number,
      stringOffset: number,
      intensity: number
    ) => {
      const midX = (startX + endX) / 2;

      // Field lines bend toward the string (magnetic material)
      const bendFactor = 0.3 + 0.4 * intensity;
      const stringInfluence = Math.max(0, 1 - Math.abs(stringY - startY) / 100);
      const bendTowardString = stringInfluence * stringOffset * bendFactor;

      ctx.beginPath();
      ctx.moveTo(startX, startY);

      // Quadratic curve that bends based on string position
      const controlY = startY - 30 - Math.abs(bendTowardString) * 0.5;
      const controlX = midX + bendTowardString;

      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();
    },
    []
  );

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

      // Detect dark mode and set colors accordingly
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? "#d4d4d8" : "#3f3f46";
      const mutedColor = isDark ? "#a1a1aa" : "#52525b";
      const lightLineColor = isDark ? "#52525b" : "#d4d4d8";
      const bgOverlay = isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)";

      const currentFreq = frequencyRef.current;
      const currentAmp = amplitudeRef.current;

      // Update time
      if (isPlayingRef.current) {
        timeRef.current += 0.016;
      }

      const t = timeRef.current;

      // Layout - split into pickup view and waveform view
      const pickupWidth = width * 0.55;
      const waveformWidth = width * 0.45;
      const pickupCenterX = pickupWidth / 2;
      const pickupCenterY = height / 2;

      // String position (sinusoidal motion)
      const stringRestY = pickupCenterY - 60;
      const stringDisplacement = currentAmp * Math.sin(2 * Math.PI * currentFreq * t);
      const stringY = stringRestY + stringDisplacement;

      // Velocity (derivative of position) - this is what the pickup sees!
      const velocity = currentAmp * 2 * Math.PI * currentFreq * Math.cos(2 * Math.PI * currentFreq * t);
      const maxVelocity = currentAmp * 2 * Math.PI * currentFreq;

      // === DRAW PICKUP CROSS-SECTION ===

      // Background for pickup area
      ctx.fillStyle = bgOverlay;
      ctx.fillRect(0, 0, pickupWidth, height);

      // Draw coil (behind magnet)
      const coilWidth = 70;
      const coilHeight = 80;
      const coilX = pickupCenterX - coilWidth / 2;
      const coilY = pickupCenterY - 10;

      // Coil windings (left side)
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const y = coilY + i * (coilHeight / 12);
        ctx.beginPath();
        ctx.arc(coilX, y, 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Coil windings (right side)
      for (let i = 0; i < 12; i++) {
        const y = coilY + i * (coilHeight / 12);
        ctx.beginPath();
        ctx.arc(coilX + coilWidth, y, 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw permanent magnet
      const magnetWidth = 30;
      const magnetHeight = 50;
      const magnetX = pickupCenterX - magnetWidth / 2;
      const magnetY = pickupCenterY + 10;

      // Magnet body
      const magnetGradient = ctx.createLinearGradient(
        magnetX,
        magnetY,
        magnetX,
        magnetY + magnetHeight
      );
      magnetGradient.addColorStop(0, "#dc2626"); // N pole (red)
      magnetGradient.addColorStop(0.5, "#71717a");
      magnetGradient.addColorStop(1, "#3b82f6"); // S pole (blue)
      ctx.fillStyle = magnetGradient;
      ctx.fillRect(magnetX, magnetY, magnetWidth, magnetHeight);

      // Pole labels
      ctx.fillStyle = "white";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("N", pickupCenterX, magnetY + 15);
      ctx.fillText("S", pickupCenterX, magnetY + magnetHeight - 5);

      // Draw magnetic field lines
      const numFieldLines = 7;
      const fieldLineSpacing = 12;

      for (let i = 0; i < numFieldLines; i++) {
        const offsetX = (i - (numFieldLines - 1) / 2) * fieldLineSpacing;
        const intensity = 1 - Math.abs(offsetX) / (fieldLineSpacing * 3);

        // Field line color based on proximity to string
        const distToString = Math.abs(stringY - magnetY);
        const fieldStrength = Math.max(0.3, 1 - distToString / 150);
        ctx.strokeStyle = `rgba(124, 58, 237, ${0.3 + fieldStrength * 0.4})`;
        ctx.lineWidth = 1 + fieldStrength;

        // Draw field line from N pole up toward string
        const startX = pickupCenterX + offsetX * 0.5;
        const startY = magnetY;
        const endX = pickupCenterX + offsetX * 1.5;
        const endY = stringY + 10;

        drawFieldLine(
          ctx,
          startX,
          startY,
          endX,
          endY,
          stringY,
          stringDisplacement,
          intensity
        );
      }

      // Draw string
      ctx.strokeStyle = mutedColor;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(20, stringY);
      ctx.lineTo(pickupWidth - 20, stringY);
      ctx.stroke();

      // String core (steel)
      ctx.strokeStyle = lightLineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, stringY);
      ctx.lineTo(pickupWidth - 20, stringY);
      ctx.stroke();

      // Highlight the string section above the magnet
      ctx.strokeStyle = velocity > 0 ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(pickupCenterX - 25, stringY);
      ctx.lineTo(pickupCenterX + 25, stringY);
      ctx.stroke();

      // Draw velocity arrow
      const arrowLength = (velocity / maxVelocity) * 30;
      if (Math.abs(arrowLength) > 2) {
        ctx.strokeStyle = velocity > 0 ? "#22c55e" : "#ef4444";
        ctx.fillStyle = velocity > 0 ? "#22c55e" : "#ef4444";
        ctx.lineWidth = 2;

        const arrowX = pickupCenterX + 50;
        const arrowStartY = stringY;
        const arrowEndY = stringY + arrowLength;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowStartY);
        ctx.lineTo(arrowX, arrowEndY);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowEndY);
        ctx.lineTo(arrowX - 4, arrowEndY - Math.sign(arrowLength) * 6);
        ctx.lineTo(arrowX + 4, arrowEndY - Math.sign(arrowLength) * 6);
        ctx.closePath();
        ctx.fill();

        ctx.font = "10px system-ui";
        ctx.textAlign = "left";
        ctx.fillText("v", arrowX + 8, stringY + 4);
      }

      // Labels
      ctx.fillStyle = textColor;
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Steel String", pickupCenterX, stringRestY - currentAmp - 15);
      ctx.fillText("Magnet", pickupCenterX, magnetY + magnetHeight + 20);
      ctx.fillText("Coil", coilX - 15, coilY + coilHeight / 2);

      // === DRAW WAVEFORM AREA ===
      const waveX = pickupWidth + 20;
      const waveWidth = waveformWidth - 40;
      const waveHeight = height - 60;
      const waveCenterY = height / 2;

      // Waveform background
      ctx.fillStyle = bgOverlay;
      ctx.fillRect(waveX - 10, 20, waveWidth + 20, waveHeight + 20);

      // Center line
      ctx.strokeStyle = lightLineColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(waveX, waveCenterY);
      ctx.lineTo(waveX + waveWidth, waveCenterY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw position waveform (what we see)
      ctx.strokeStyle = mutedColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < waveWidth; x++) {
        const waveT = t - (waveWidth - x) * 0.01;
        const y =
          waveCenterY -
          currentAmp * Math.sin(2 * Math.PI * currentFreq * waveT) * 2;
        if (x === 0) {
          ctx.moveTo(waveX + x, y);
        } else {
          ctx.lineTo(waveX + x, y);
        }
      }
      ctx.stroke();

      // Draw EMF/voltage waveform (derivative - what pickup outputs)
      const emfGradient = ctx.createLinearGradient(waveX, 0, waveX + waveWidth, 0);
      emfGradient.addColorStop(0, "#7c3aed");
      emfGradient.addColorStop(1, "#f97316");
      ctx.strokeStyle = emfGradient;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < waveWidth; x++) {
        const waveT = t - (waveWidth - x) * 0.01;
        // EMF is proportional to velocity (derivative of position)
        const emf =
          currentAmp *
          2 *
          Math.PI *
          currentFreq *
          Math.cos(2 * Math.PI * currentFreq * waveT);
        const y = waveCenterY - emf * 2 * (1 / (2 * Math.PI)); // Scale for display
        if (x === 0) {
          ctx.moveTo(waveX + x, y);
        } else {
          ctx.lineTo(waveX + x, y);
        }
      }
      ctx.stroke();

      // Legend
      ctx.font = "11px system-ui";
      ctx.textAlign = "left";

      ctx.fillStyle = mutedColor;
      ctx.fillRect(waveX, 30, 12, 3);
      ctx.fillStyle = textColor;
      ctx.fillText("String Position", waveX + 18, 34);

      ctx.fillStyle = "#7c3aed";
      ctx.fillRect(waveX, 48, 12, 3);
      ctx.fillStyle = textColor;
      ctx.fillText("Output Voltage (∝ velocity)", waveX + 18, 52);

      // Phase relationship note
      ctx.fillStyle = textColor;
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Voltage leads position by 90°", waveX + waveWidth / 2, height - 25);

      // Current values
      ctx.textAlign = "right";
      ctx.font = "11px system-ui";
      const normalizedVoltage = (velocity / maxVelocity) * 100;
      ctx.fillStyle = normalizedVoltage > 0 ? "#22c55e" : "#ef4444";
      ctx.fillText(
        `EMF: ${normalizedVoltage.toFixed(0)}%`,
        waveX + waveWidth,
        height - 25
      );

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [drawFieldLine]);

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-80"
          aria-label="Pickup operation animation showing magnetic field and EMF generation"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Vibration Frequency</span>
                <span className="text-zinc-800 dark:text-zinc-400">{frequency} Hz</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Amplitude</span>
                <span className="text-zinc-800 dark:text-zinc-400">{amplitude} px</span>
              </span>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={amplitude}
                onChange={(e) => setAmplitude(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            Watch how the output voltage (colored) is the derivative of string position (gray).
            Higher frequency = faster motion = stronger signal.
          </p>
        </div>
      </div>
    </div>
  );
}
