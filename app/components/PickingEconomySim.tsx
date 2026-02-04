"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PickingEconomySimProps {
  className?: string;
}

const HISTORY_LENGTH = 300; // Number of frames to keep in history

interface Pendulum {
  angle: number;
  velocity: number;
  amplitude: number; // Max angle
  history: number[];
  color: string;
  label: string;
}

export default function PickingEconomySim({
  className = "",
}: PickingEconomySimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const pendulum1Ref = useRef<Pendulum>({
    angle: 0,
    velocity: 0,
    amplitude: Math.PI / 6, // ~30 degrees - inefficient
    history: [],
    color: "#ef4444",
    label: "Wide Motion",
  });
  const pendulum2Ref = useRef<Pendulum>({
    angle: 0,
    velocity: 0,
    amplitude: Math.PI / 18, // ~10 degrees - efficient
    history: [],
    color: "#22c55e",
    label: "Economy of Motion",
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [bpm, setBpm] = useState(180); // Picks per minute (alternate picking = 2x note rate)
  const [amplitude1, setAmplitude1] = useState(30); // degrees
  const [amplitude2, setAmplitude2] = useState(10); // degrees

  const isPlayingRef = useRef(isPlaying);
  const bpmRef = useRef(bpm);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    pendulum1Ref.current.amplitude = (amplitude1 * Math.PI) / 180;
  }, [amplitude1]);

  useEffect(() => {
    pendulum2Ref.current.amplitude = (amplitude2 * Math.PI) / 180;
  }, [amplitude2]);

  // Calculate required velocity for a given amplitude and frequency
  const getRequiredVelocity = useCallback((amplitude: number, frequency: number) => {
    // To complete a full cycle (up and down) at frequency f,
    // the pick travels 4 * amplitude in time 1/f
    // Average velocity = 4 * amplitude * frequency
    // Peak velocity for sinusoidal motion = π/2 * average ≈ amplitude * 2π * frequency
    return amplitude * 2 * Math.PI * frequency;
  }, []);

  // Calculate kinetic energy (proportional to v²)
  const getKineticEnergy = useCallback((velocity: number) => {
    // KE = 0.5 * m * v², we'll use normalized units (m=1)
    return 0.5 * velocity * velocity;
  }, []);

  // Reset simulation
  const handleReset = useCallback(() => {
    timeRef.current = 0;
    pendulum1Ref.current.angle = pendulum1Ref.current.amplitude;
    pendulum1Ref.current.history = [];
    pendulum2Ref.current.angle = pendulum2Ref.current.amplitude;
    pendulum2Ref.current.history = [];
  }, []);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize pendulum positions
    pendulum1Ref.current.angle = pendulum1Ref.current.amplitude;
    pendulum2Ref.current.angle = pendulum2Ref.current.amplitude;

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

      const currentBpm = bpmRef.current;
      const frequency = currentBpm / 60; // picks per second

      // Update pendulums
      if (isPlayingRef.current) {
        const dt = 0.016; // ~60fps
        timeRef.current += dt;

        // Simple harmonic motion for each pendulum
        const phase = (timeRef.current * 2 * Math.PI * frequency) % (2 * Math.PI);

        pendulum1Ref.current.angle = pendulum1Ref.current.amplitude * Math.cos(phase);
        pendulum1Ref.current.velocity = -pendulum1Ref.current.amplitude * 2 * Math.PI * frequency * Math.sin(phase);

        pendulum2Ref.current.angle = pendulum2Ref.current.amplitude * Math.cos(phase);
        pendulum2Ref.current.velocity = -pendulum2Ref.current.amplitude * 2 * Math.PI * frequency * Math.sin(phase);

        // Update history
        pendulum1Ref.current.history.push(Math.sin(pendulum1Ref.current.angle));
        pendulum2Ref.current.history.push(Math.sin(pendulum2Ref.current.angle));

        if (pendulum1Ref.current.history.length > HISTORY_LENGTH) {
          pendulum1Ref.current.history.shift();
        }
        if (pendulum2Ref.current.history.length > HISTORY_LENGTH) {
          pendulum2Ref.current.history.shift();
        }
      }

      // Layout
      const pendulumAreaHeight = height * 0.5;
      const historyAreaHeight = height * 0.35;

      // Draw pendulum area
      const pendulumY = pendulumAreaHeight * 0.3;
      const pendulumScale = pendulumAreaHeight * 0.5;
      const pendulum1X = width * 0.3;
      const pendulum2X = width * 0.7;

      // Draw string line (where pick crosses)
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, pendulumY);
      ctx.lineTo(width, pendulumY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label the string
      ctx.fillStyle = "#3f3f46";
      ctx.font = "12px system-ui";
      ctx.textAlign = "left";
      ctx.fillText("String", 10, pendulumY - 8);

      // Draw pendulum 1 (inefficient)
      const p1 = pendulum1Ref.current;
      const p1EndX = pendulum1X + pendulumScale * Math.sin(p1.angle);
      const p1EndY = pendulumY + pendulumScale * Math.cos(p1.angle);

      // Arm
      ctx.strokeStyle = p1.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pendulum1X, pendulumY);
      ctx.lineTo(p1EndX, p1EndY);
      ctx.stroke();

      // Pivot
      ctx.beginPath();
      ctx.arc(pendulum1X, pendulumY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3f3f46";
      ctx.fill();

      // Pick (mass)
      ctx.beginPath();
      ctx.arc(p1EndX, p1EndY, 10, 0, Math.PI * 2);
      ctx.fillStyle = p1.color;
      ctx.fill();

      // Label
      ctx.fillStyle = p1.color;
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(p1.label, pendulum1X, pendulumAreaHeight - 10);

      // Draw pendulum 2 (efficient)
      const p2 = pendulum2Ref.current;
      const p2EndX = pendulum2X + pendulumScale * Math.sin(p2.angle);
      const p2EndY = pendulumY + pendulumScale * Math.cos(p2.angle);

      // Arm
      ctx.strokeStyle = p2.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pendulum2X, pendulumY);
      ctx.lineTo(p2EndX, p2EndY);
      ctx.stroke();

      // Pivot
      ctx.beginPath();
      ctx.arc(pendulum2X, pendulumY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3f3f46";
      ctx.fill();

      // Pick (mass)
      ctx.beginPath();
      ctx.arc(p2EndX, p2EndY, 10, 0, Math.PI * 2);
      ctx.fillStyle = p2.color;
      ctx.fill();

      // Label
      ctx.fillStyle = p2.color;
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(p2.label, pendulum2X, pendulumAreaHeight - 10);

      // Draw history area
      const historyTop = pendulumAreaHeight + 10;
      const historyBottom = pendulumAreaHeight + historyAreaHeight - 10;
      const historyMid = (historyTop + historyBottom) / 2;
      const historyHeight = historyBottom - historyTop;

      // Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(20, historyTop, width - 40, historyHeight);

      // Center line (string position)
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(20, historyMid);
      ctx.lineTo(width - 20, historyMid);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw history traces
      const drawHistory = (history: number[], color: string) => {
        if (history.length < 2) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < history.length; i++) {
          const x = 20 + (i / HISTORY_LENGTH) * (width - 40);
          const y = historyMid - history[i] * (historyHeight / 2) * 0.8;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      };

      drawHistory(pendulum1Ref.current.history, p1.color);
      drawHistory(pendulum2Ref.current.history, p2.color);

      // Label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "12px system-ui";
      ctx.textAlign = "left";
      ctx.fillText("Pick Position Over Time", 25, historyTop + 15);

      // Draw stats area
      const statsTop = pendulumAreaHeight + historyAreaHeight;

      // Calculate energies
      const v1 = getRequiredVelocity(p1.amplitude, frequency);
      const v2 = getRequiredVelocity(p2.amplitude, frequency);
      const ke1 = getKineticEnergy(v1);
      const ke2 = getKineticEnergy(v2);
      const energyRatio = ke1 / ke2;

      // Energy comparison bars
      const barMaxWidth = width * 0.35;
      const barHeight = 20;
      const bar1Width = barMaxWidth;
      const bar2Width = barMaxWidth / energyRatio;

      // Bar 1
      ctx.fillStyle = p1.color;
      ctx.fillRect(20, statsTop + 15, bar1Width, barHeight);

      // Bar 2
      ctx.fillStyle = p2.color;
      ctx.fillRect(20, statsTop + 45, bar2Width, barHeight);

      // Labels
      ctx.fillStyle = "#3f3f46";
      ctx.font = "12px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(
        `Wide: ${ke1.toFixed(1)} energy units`,
        30 + bar1Width,
        statsTop + 30
      );
      ctx.fillText(
        `Efficient: ${ke2.toFixed(1)} energy units`,
        30 + barMaxWidth,
        statsTop + 60
      );

      // Ratio
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(
        `${energyRatio.toFixed(1)}x more energy wasted!`,
        width - 20,
        statsTop + 45
      );

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [getRequiredVelocity, getKineticEnergy]);

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-96"
          aria-label="Picking economy of motion simulation"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          {/* Playback controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Parameter controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Tempo</span>
                <span className="text-zinc-800 dark:text-zinc-400">{bpm} BPM</span>
              </span>
              <input
                type="range"
                min="60"
                max="300"
                step="10"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="flex justify-between text-red-500">
                <span>Wide Motion</span>
                <span>{amplitude1}°</span>
              </span>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={amplitude1}
                onChange={(e) => setAmplitude1(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="flex justify-between text-green-500">
                <span>Economy Motion</span>
                <span>{amplitude2}°</span>
              </span>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={amplitude2}
                onChange={(e) => setAmplitude2(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            Both picks cross the string at the same rate, but wider motion requires more energy.
            Try increasing the tempo to see the energy difference grow!
          </p>
        </div>
      </div>
    </div>
  );
}
