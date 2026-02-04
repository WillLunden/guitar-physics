"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface WaveEquationSimProps {
  className?: string;
}

// Physical constants
const L = 0.66; // Length of the string in meters
const T = 1000.0; // Tension in Newtons
const MU = 0.01; // Linear mass density in kg/m
const N_MODES = 15; // Number of normal modes to consider
const NUM_POINTS = 500; // Spatial resolution

export default function WaveEquationSim({
  className = "",
}: WaveEquationSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const initialShapeRef = useRef<Float64Array>(new Float64Array(NUM_POINTS));
  const isPlayingRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragPositionRef = useRef<{ x: number; y: number } | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showModes, setShowModes] = useState(false);
  const [numModes, setNumModes] = useState(N_MODES);
  const [speed, setSpeed] = useState(1.0);
  const [damping, setDamping] = useState(0.01);

  // Refs for values that need to be accessed in animation loop without causing re-renders
  const speedRef = useRef(speed);
  const dampingRef = useRef(damping);
  const numModesRef = useRef(numModes);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    dampingRef.current = damping;
  }, [damping]);

  useEffect(() => {
    numModesRef.current = numModes;
  }, [numModes]);

  // Calculate frequencies for each mode: f_n = n * sqrt(T/μ) / (2L)
  const getFrequencies = useCallback((nModes: number) => {
    const freqs: number[] = [];
    for (let n = 1; n <= nModes; n++) {
      freqs.push((n * Math.sqrt(T / MU)) / (2 * L));
    }
    return freqs;
  }, []);

  // Spatial points along the string
  const getXPoints = useCallback(() => {
    const points: number[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      points.push((i * L) / (NUM_POINTS - 1));
    }
    return points;
  }, []);

  // Decompose initial shape into normal mode amplitudes using Fourier coefficients
  const decompose = useCallback(
    (shape: Float64Array, nModes: number): number[] => {
      const amplitudes: number[] = [];
      const xPoints = getXPoints();
      const dx = L / (NUM_POINTS - 1);

      for (let n = 1; n <= nModes; n++) {
        let sum = 0;
        for (let i = 0; i < NUM_POINTS; i++) {
          const modeShape = Math.sin((n * Math.PI * xPoints[i]) / L);
          sum += shape[i] * modeShape * dx;
        }
        amplitudes.push((2 * sum) / L);
      }
      return amplitudes;
    },
    [getXPoints]
  );

  // Create pluck shape (triangular)
  const createPluckShape = useCallback(
    (pluckX: number, pluckHeight: number): Float64Array => {
      const shape = new Float64Array(NUM_POINTS);
      const xPoints = getXPoints();

      for (let i = 0; i < NUM_POINTS; i++) {
        if (xPoints[i] <= pluckX) {
          shape[i] = (pluckHeight * xPoints[i]) / pluckX;
        } else {
          shape[i] = (pluckHeight * (L - xPoints[i])) / (L - pluckX);
        }
      }
      return shape;
    },
    [getXPoints]
  );

  // Calculate string displacement at time t
  const calculateDisplacement = useCallback(
    (
      t: number,
      amplitudes: number[],
      nModes: number,
      dampingCoeff: number
    ): Float64Array => {
      const y = new Float64Array(NUM_POINTS);
      const xPoints = getXPoints();
      const freqs = getFrequencies(nModes);

      for (let n = 0; n < nModes; n++) {
        const freq = freqs[n];
        const omega = 2 * Math.PI * freq;
        const dampingFactor = Math.exp(-dampingCoeff * t * omega);
        const timeComponent = Math.cos(omega * t) * dampingFactor;

        for (let i = 0; i < NUM_POINTS; i++) {
          const modeShape = Math.sin(((n + 1) * Math.PI * xPoints[i]) / L);
          y[i] += amplitudes[n] * modeShape * timeComponent;
        }
      }
      return y;
    },
    [getXPoints, getFrequencies]
  );

  // Convert canvas coordinates to physical coordinates
  const canvasToPhysical = useCallback(
    (
      canvasX: number,
      canvasY: number,
      canvas: HTMLCanvasElement
    ): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const padding = 40;
      const plotWidth = width - 2 * padding;
      const plotHeight = height - 2 * padding;
      const centerY = height / 2;

      const physicalX = ((canvasX - padding) / plotWidth) * L;
      const physicalY = -((canvasY - centerY) / (plotHeight / 2)) * 0.3;

      return { x: physicalX, y: physicalY };
    },
    []
  );

  // Handle mouse down - start dragging (auto-reset if already playing)
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Auto-reset if currently playing
      if (isPlayingRef.current) {
        timeRef.current = 0;
        setIsPlaying(false);
        isPlayingRef.current = false;
        initialShapeRef.current = new Float64Array(NUM_POINTS);
      }

      const rect = canvas.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      const physical = canvasToPhysical(canvasX, canvasY, canvas);

      if (physical.x > 0.02 && physical.x < L - 0.02) {
        isDraggingRef.current = true;
        setIsDragging(true);
        dragPositionRef.current = physical;

        const clampedY = Math.max(-0.3, Math.min(0.3, physical.y));
        initialShapeRef.current = createPluckShape(physical.x, clampedY);
      }
    },
    [canvasToPhysical, createPluckShape]
  );

  // Handle mouse move - update drag position
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      const physical = canvasToPhysical(canvasX, canvasY, canvas);

      // Clamp x to valid range
      const clampedX = Math.max(0.02, Math.min(L - 0.02, physical.x));
      const clampedY = Math.max(-0.3, Math.min(0.3, physical.y));

      dragPositionRef.current = { x: clampedX, y: clampedY };
      initialShapeRef.current = createPluckShape(clampedX, clampedY);
    },
    [canvasToPhysical, createPluckShape]
  );

  // Handle mouse up - release string
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    // Only start playing if we have a meaningful displacement
    const maxDisplacement = Math.max(...Array.from(initialShapeRef.current).map(Math.abs));
    if (maxDisplacement > 0.005) {
      timeRef.current = 0;
      setIsPlaying(true);
      isPlayingRef.current = true;
    }

    dragPositionRef.current = null;
  }, []);

  // Handle mouse leave - cancel drag
  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

  // Reset simulation
  const handleReset = useCallback(() => {
    timeRef.current = 0;
    initialShapeRef.current = new Float64Array(NUM_POINTS);
    setIsPlaying(false);
    isPlayingRef.current = false;
    isDraggingRef.current = false;
    setIsDragging(false);
    dragPositionRef.current = null;
  }, []);

  // Toggle play/pause
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => {
      isPlayingRef.current = !prev;
      return !prev;
    });
  }, []);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
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
      const axisColor = isDark ? "#52525b" : "#a1a1aa";

      const padding = 40;
      const plotWidth = width - 2 * padding;
      const plotHeight = height - 2 * padding;
      const centerY = height / 2;

      // Draw axes
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, centerY);
      ctx.lineTo(width - padding, centerY);
      ctx.stroke();

      // Draw fixed endpoints (bridge and nut)
      ctx.fillStyle = axisColor;
      ctx.fillRect(padding - 4, centerY - 20, 8, 40);
      ctx.fillRect(width - padding - 4, centerY - 20, 8, 40);

      // Labels
      ctx.fillStyle = textColor;
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("0", padding, height - 10);
      ctx.fillText(`${L.toFixed(2)} m`, width - padding, height - 10);
      ctx.fillText("Position along string", width / 2, height - 10);

      // Get current values from refs
      const currentNumModes = numModesRef.current;
      const currentDamping = dampingRef.current;
      const currentSpeed = speedRef.current;

      // Calculate current displacement
      const amplitudes = decompose(initialShapeRef.current, currentNumModes);
      const currentTime = timeRef.current;
      const displacement =
        isPlayingRef.current && !isDraggingRef.current
          ? calculateDisplacement(
              currentTime,
              amplitudes,
              currentNumModes,
              currentDamping
            )
          : initialShapeRef.current;

      // Draw individual modes if enabled
      if (showModes && isPlayingRef.current && !isDraggingRef.current) {
        const xPoints = getXPoints();
        const freqs = getFrequencies(currentNumModes);
        const modeColors = [
          "rgba(239, 68, 68, 0.5)",
          "rgba(34, 197, 94, 0.5)",
          "rgba(59, 130, 246, 0.5)",
          "rgba(168, 85, 247, 0.5)",
          "rgba(249, 115, 22, 0.5)",
        ];

        for (let n = 0; n < Math.min(5, currentNumModes); n++) {
          const freq = freqs[n];
          const omega = 2 * Math.PI * freq;
          const dampingFactor = Math.exp(-currentDamping * currentTime * omega);
          const timeComponent = Math.cos(omega * currentTime) * dampingFactor;

          ctx.beginPath();
          ctx.strokeStyle = modeColors[n % modeColors.length];
          ctx.lineWidth = 1.5;

          for (let i = 0; i < NUM_POINTS; i++) {
            const modeShape = Math.sin(((n + 1) * Math.PI * xPoints[i]) / L);
            const y = amplitudes[n] * modeShape * timeComponent;

            const canvasX = padding + (xPoints[i] / L) * plotWidth;
            const canvasY = centerY - (y / 0.3) * (plotHeight / 2);

            if (i === 0) {
              ctx.moveTo(canvasX, canvasY);
            } else {
              ctx.lineTo(canvasX, canvasY);
            }
          }
          ctx.stroke();
        }
      }

      // Draw string
      const gradient = ctx.createLinearGradient(
        padding,
        0,
        width - padding,
        0
      );
      gradient.addColorStop(0, "#7c3aed");
      gradient.addColorStop(1, "#f97316");

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      const xPoints = getXPoints();
      for (let i = 0; i < NUM_POINTS; i++) {
        const canvasX = padding + (xPoints[i] / L) * plotWidth;
        const canvasY = centerY - (displacement[i] / 0.3) * (plotHeight / 2);

        if (i === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      }
      ctx.stroke();

      // Draw drag handle when dragging
      if (isDraggingRef.current && dragPositionRef.current) {
        const handleX =
          padding + (dragPositionRef.current.x / L) * plotWidth;
        const handleY =
          centerY - (dragPositionRef.current.y / 0.3) * (plotHeight / 2);

        // Draw handle circle
        ctx.beginPath();
        ctx.arc(handleX, handleY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 115, 22, 0.8)";
        ctx.fill();
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw vertical guide line
        ctx.beginPath();
        ctx.strokeStyle = "rgba(249, 115, 22, 0.3)";
        ctx.setLineDash([5, 5]);
        ctx.moveTo(handleX, padding);
        ctx.lineTo(handleX, height - padding);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Update time and auto-stop after 10 seconds
      if (isPlayingRef.current && !isDraggingRef.current) {
        timeRef.current += 0.0007 * currentSpeed;

        // Auto-stop after 10 seconds of simulation time
        if (timeRef.current >= 10) {
          isPlayingRef.current = false;
          setIsPlaying(false);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    decompose,
    calculateDisplacement,
    getXPoints,
    getFrequencies,
    showModes,
  ]);

  return (
    <div className={`${className}`}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`w-full h-64 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          aria-label="Interactive wave equation simulation - drag the string to pluck it"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          {/* Playback controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handlePlayPause}
              disabled={isDragging}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={showModes}
                onChange={(e) => setShowModes(e.target.checked)}
                className="rounded"
              />
              Show first 5 modes
            </label>
          </div>

          {/* Parameter controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Speed</span>
                <span className="text-zinc-800 dark:text-zinc-400">{speed.toFixed(1)}x</span>
              </span>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Air Resistance</span>
                <span className="text-zinc-800 dark:text-zinc-400">{(damping * 100).toFixed(0)}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.002"
                value={damping}
                onChange={(e) => setDamping(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Modes</span>
                <span className="text-zinc-800 dark:text-zinc-400">{numModes}</span>
              </span>
              <input
                type="range"
                min="1"
                max="30"
                value={numModes}
                onChange={(e) => setNumModes(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            {isDragging
              ? "Release to pluck the string!"
              : "Drag the string to pull it into position, then release to pluck."}
          </p>
        </div>
      </div>
    </div>
  );
}
