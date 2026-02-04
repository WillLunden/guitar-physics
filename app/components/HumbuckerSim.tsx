"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface HumbuckerSimProps {
  className?: string;
}

export default function HumbuckerSim({ className = "" }: HumbuckerSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [coilTapped, setCoilTapped] = useState(false); // true = single coil mode
  const [humAmplitude, setHumAmplitude] = useState(50); // 0-100%
  const [speed, setSpeed] = useState(1); // playback speed multiplier

  const isPlayingRef = useRef(isPlaying);
  const coilTappedRef = useRef(coilTapped);
  const humAmplitudeRef = useRef(humAmplitude);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    coilTappedRef.current = coilTapped;
  }, [coilTapped]);

  useEffect(() => {
    humAmplitudeRef.current = humAmplitude;
  }, [humAmplitude]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Draw a single pickup/coil
  const drawCoil = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      polarity: "N" | "S",
      active: boolean,
      label: string
    ) => {
      const width = 28;
      const height = 40;

      // Magnet body
      const magnetGradient = ctx.createLinearGradient(x - width / 2, y, x - width / 2, y + height);
      if (polarity === "N") {
        magnetGradient.addColorStop(0, active ? "#ef4444" : "#78716c");
        magnetGradient.addColorStop(1, active ? "#71717a" : "#57534e");
      } else {
        magnetGradient.addColorStop(0, active ? "#71717a" : "#57534e");
        magnetGradient.addColorStop(1, active ? "#3b82f6" : "#78716c");
      }
      ctx.fillStyle = magnetGradient;
      ctx.fillRect(x - width / 2, y, width, height);

      // Pole piece
      ctx.fillStyle = active ? "#27272a" : "#52525b";
      ctx.beginPath();
      ctx.arc(x, y - 3, 5, 0, Math.PI * 2);
      ctx.fill();

      // Polarity label
      ctx.fillStyle = "white";
      ctx.font = "bold 10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(polarity, x, y + 15);

      // Coil windings
      ctx.strokeStyle = active ? "#b45309" : "#78716c";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(x, y + 20 + i * 7, width / 2 + 4, 3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Winding direction indicator (dots and crosses for into/out of page)
      ctx.fillStyle = active ? "#f97316" : "#a1a1aa";
      ctx.font = "12px system-ui";
      // Left side - into page (X)
      ctx.fillText("×", x - width / 2 - 8, y + 25);
      // Right side - out of page (dot)
      ctx.beginPath();
      ctx.arc(x + width / 2 + 8, y + 22, 3, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y + height + 15);

      if (!active) {
        // Draw X over inactive coil
        ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 20, y - 5);
        ctx.lineTo(x + 20, y + height + 5);
        ctx.moveTo(x + 20, y - 5);
        ctx.lineTo(x - 20, y + height + 5);
        ctx.stroke();
      }
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

      if (isPlayingRef.current) {
        timeRef.current += 0.016 * speedRef.current;
      }
      const t = timeRef.current;

      const coilTapped = coilTappedRef.current;
      const humAmp = humAmplitudeRef.current / 100;
      const stringFreq = 3; // Fixed frequency for visualization

      // Layout
      const pickupAreaWidth = width * 0.45;
      const waveformAreaX = pickupAreaWidth + 20;
      const waveformAreaWidth = width - waveformAreaX - 20;

      const centerY = height * 0.4;

      // === PICKUP VISUALIZATION ===

      // String
      const stringY = centerY - 50;
      const stringStartX = 30;
      const stringEndX = pickupAreaWidth - 30;

      // Draw vibrating string
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const x = stringStartX + (i / 60) * (stringEndX - stringStartX);
        const normalizedX = i / 60;
        const displacement = 15 * Math.sin(Math.PI * normalizedX) * Math.cos(2 * Math.PI * stringFreq * t);
        const y = stringY + displacement;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // String endpoints
      ctx.fillStyle = "#52525b";
      ctx.fillRect(stringStartX - 3, stringY - 10, 6, 20);
      ctx.fillRect(stringEndX - 3, stringY - 10, 6, 20);

      // Two coils positioned under string
      const coil1X = stringStartX + (stringEndX - stringStartX) * 0.35;
      const coil2X = stringStartX + (stringEndX - stringStartX) * 0.65;
      const coilY = centerY + 10;

      // Draw coils
      drawCoil(ctx, coil1X, coilY, "N", true, "Coil 1 (N-up)");
      drawCoil(ctx, coil2X, coilY, "S", !coilTapped, coilTapped ? "Coil 2 (OFF)" : "Coil 2 (S-up)");

      // Magnetic field lines from coils to string
      ctx.setLineDash([3, 3]);
      const stringDisp1 = 15 * Math.sin(Math.PI * 0.35) * Math.cos(2 * Math.PI * stringFreq * t);
      const stringDisp2 = 15 * Math.sin(Math.PI * 0.65) * Math.cos(2 * Math.PI * stringFreq * t);

      // Coil 1 field lines
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 1;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(coil1X + i * 5, coilY - 3);
        ctx.lineTo(coil1X + i * 3, stringY + stringDisp1 + 5);
        ctx.stroke();
      }

      // Coil 2 field lines (if active)
      if (!coilTapped) {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(coil2X + i * 5, coilY - 3);
          ctx.lineTo(coil2X + i * 3, stringY + stringDisp2 + 5);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      // 60Hz hum visualization (horizontal wavy lines representing EM interference)
      if (humAmp > 0.01) {
        const humPhase = 2 * Math.PI * 1.5 * t; // Slowed down for visibility (actual 60Hz too fast)
        ctx.strokeStyle = `rgba(234, 179, 8, ${0.3 + humAmp * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);

        for (let row = 0; row < 3; row++) {
          const rowY = coilY - 20 + row * 25;
          ctx.beginPath();
          for (let i = 0; i <= 40; i++) {
            const x = 10 + (i / 40) * (pickupAreaWidth - 20);
            const y = rowY + humAmp * 8 * Math.sin(humPhase + i * 0.3);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Hum label
        ctx.fillStyle = "#eab308";
        ctx.font = "10px system-ui";
        ctx.textAlign = "left";
        ctx.fillText("60Hz EMI", 10, coilY - 30);
      }

      // === WAVEFORM VISUALIZATION ===

      const waveHeight = 35;
      const waveY1 = 50; // Coil 1 output
      const waveY2 = 130; // Coil 2 output
      const waveY3 = 210; // Combined output

      // Calculate signals
      const getCoil1Signal = (phase: number) => {
        // String signal + hum (both positive for N-up coil)
        const stringSignal = Math.sin(phase);
        const humSignal = humAmp * 0.8 * Math.sin(phase * 0.2); // 60Hz is slower
        return stringSignal + humSignal;
      };

      const getCoil2Signal = (phase: number) => {
        // String signal same phase (magnets opposite, windings opposite = same)
        // Hum signal opposite phase (windings opposite only)
        const stringSignal = Math.sin(phase);
        const humSignal = -humAmp * 0.8 * Math.sin(phase * 0.2);
        return stringSignal + humSignal;
      };

      // Draw waveform helper
      const drawWaveform = (
        yCenter: number,
        label: string,
        signalFn: (phase: number) => number,
        color: string,
        active: boolean = true
      ) => {
        // Label
        ctx.fillStyle = active ? "#71717a" : "#a1a1aa";
        ctx.font = "11px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(label, waveformAreaX, yCenter - waveHeight - 5);

        // Center line
        ctx.strokeStyle = "#e4e4e7";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(waveformAreaX, yCenter);
        ctx.lineTo(waveformAreaX + waveformAreaWidth, yCenter);
        ctx.stroke();

        // Waveform
        ctx.strokeStyle = active ? color : "#a1a1aa";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const x = waveformAreaX + (i / 100) * waveformAreaWidth;
          const phase = (i / 100) * Math.PI * 6 - t * 10;
          const signal = signalFn(phase) * waveHeight * 0.8;
          const y = yCenter - (active ? signal : 0);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      // Coil 1 output
      drawWaveform(waveY1, "Coil 1: String + Hum", getCoil1Signal, "#ef4444");

      // Coil 2 output
      drawWaveform(
        waveY2,
        coilTapped ? "Coil 2: (Disabled)" : "Coil 2: String − Hum",
        getCoil2Signal,
        "#3b82f6",
        !coilTapped
      );

      // Plus/equals symbols
      ctx.fillStyle = "#3f3f46";
      ctx.font = "16px system-ui";
      ctx.textAlign = "center";
      const symbolX = waveformAreaX + waveformAreaWidth + 15;
      ctx.fillText("+", symbolX, (waveY1 + waveY2) / 2 + 5);
      ctx.fillText("=", symbolX, (waveY2 + waveY3) / 2 + 5);

      // Combined output
      const getCombinedSignal = (phase: number) => {
        if (coilTapped) {
          return getCoil1Signal(phase);
        }
        // Both coils: string doubles, hum cancels
        return getCoil1Signal(phase) + getCoil2Signal(phase);
      };

      drawWaveform(
        waveY3,
        coilTapped ? "Output: String + Hum (no cancellation)" : "Combined: 2×String + 0×Hum",
        getCombinedSignal,
        "#7c3aed"
      );

      // Explanation box
      const boxY = waveY3 + 50;
      ctx.fillStyle = coilTapped ? "rgba(234, 179, 8, 0.1)" : "rgba(34, 197, 94, 0.1)";
      ctx.strokeStyle = coilTapped ? "#eab308" : "#22c55e";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(waveformAreaX, boxY, waveformAreaWidth, 45, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = coilTapped ? "#ca8a04" : "#16a34a";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      if (coilTapped) {
        ctx.fillText("Single Coil Mode: Full 60Hz hum audible", waveformAreaX + waveformAreaWidth / 2, boxY + 18);
        ctx.fillText("Brighter tone, but more noise", waveformAreaX + waveformAreaWidth / 2, boxY + 34);
      } else {
        ctx.fillText("Humbucker Mode: 60Hz hum cancelled!", waveformAreaX + waveformAreaWidth / 2, boxY + 18);
        ctx.fillText("String signal doubled, warmer tone", waveformAreaX + waveformAreaWidth / 2, boxY + 34);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [drawCoil]);

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-96"
          aria-label="Humbucker pickup simulation showing hum cancellation"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              onClick={() => setCoilTapped(!coilTapped)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                coilTapped
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {coilTapped ? "Coil Split (Single)" : "Humbucker (Both)"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>60Hz Hum Level</span>
                <span className="text-zinc-800 dark:text-zinc-400">{humAmplitude}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={humAmplitude}
                onChange={(e) => setHumAmplitude(parseInt(e.target.value))}
                className="w-full"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Speed</span>
                <span className="text-zinc-800 dark:text-zinc-400">{speed}x</span>
              </span>
              <input
                type="range"
                min="0.25"
                max="2"
                step="0.25"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            Toggle between humbucker and single-coil modes to see how the second coil cancels 60Hz electromagnetic interference while preserving the string signal.
          </p>
        </div>
      </div>
    </div>
  );
}
