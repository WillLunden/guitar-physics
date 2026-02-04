"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface StringModesSimProps {
  className?: string;
}

// Physical constants
const L = 0.66; // Length of the string in meters
const T = 1000.0; // Tension in Newtons
const MU = 0.01; // Linear mass density in kg/m
const N_MODES = 15; // Number of normal modes to consider
const NUM_POINTS = 500; // Spatial resolution

export default function StringModesSim({
  className = "",
}: StringModesSimProps) {
  const stringCanvasRef = useRef<HTMLCanvasElement>(null);
  const modesCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const initialShapeRef = useRef<Float64Array>(new Float64Array(NUM_POINTS));
  const isPlayingRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragPositionRef = useRef<{ x: number; y: number } | null>(null);
  const modeAmplitudesRef = useRef<number[]>(new Array(N_MODES).fill(0));

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [numModes, setNumModes] = useState(N_MODES);
  const [speed, setSpeed] = useState(1.0);
  const [damping, setDamping] = useState(0.01);

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

  // Calculate frequencies for each mode
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

  // Decompose initial shape into normal mode amplitudes
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

  // Calculate string displacement and mode amplitudes at time t
  const calculateState = useCallback(
    (
      t: number,
      initialAmplitudes: number[],
      nModes: number,
      dampingCoeff: number
    ): { displacement: Float64Array; currentAmplitudes: number[] } => {
      const y = new Float64Array(NUM_POINTS);
      const currentAmplitudes: number[] = [];
      const xPoints = getXPoints();
      const freqs = getFrequencies(nModes);

      for (let n = 0; n < nModes; n++) {
        const freq = freqs[n];
        const omega = 2 * Math.PI * freq;
        const dampingFactor = Math.exp(-dampingCoeff * t * omega);
        const timeComponent = Math.cos(omega * t) * dampingFactor;
        const modeAmplitude = initialAmplitudes[n] * timeComponent;
        currentAmplitudes.push(modeAmplitude);

        for (let i = 0; i < NUM_POINTS; i++) {
          const modeShape = Math.sin(((n + 1) * Math.PI * xPoints[i]) / L);
          y[i] += modeAmplitude * modeShape;
        }
      }
      return { displacement: y, currentAmplitudes };
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

  // Handle mouse down
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = stringCanvasRef.current;
      if (!canvas) return;

      if (isPlayingRef.current) {
        timeRef.current = 0;
        setIsPlaying(false);
        isPlayingRef.current = false;
        initialShapeRef.current = new Float64Array(NUM_POINTS);
        modeAmplitudesRef.current = new Array(numModesRef.current).fill(0);
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

  // Handle mouse move
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return;

      const canvas = stringCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      const physical = canvasToPhysical(canvasX, canvasY, canvas);

      const clampedX = Math.max(0.02, Math.min(L - 0.02, physical.x));
      const clampedY = Math.max(-0.3, Math.min(0.3, physical.y));

      dragPositionRef.current = { x: clampedX, y: clampedY };
      initialShapeRef.current = createPluckShape(clampedX, clampedY);
    },
    [canvasToPhysical, createPluckShape]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    const maxDisplacement = Math.max(
      ...Array.from(initialShapeRef.current).map(Math.abs)
    );
    if (maxDisplacement > 0.005) {
      timeRef.current = 0;
      setIsPlaying(true);
      isPlayingRef.current = true;
    }

    dragPositionRef.current = null;
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

  // Reset simulation
  const handleReset = useCallback(() => {
    timeRef.current = 0;
    initialShapeRef.current = new Float64Array(NUM_POINTS);
    modeAmplitudesRef.current = new Array(numModesRef.current).fill(0);
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
    const stringCanvas = stringCanvasRef.current;
    const modesCanvas = modesCanvasRef.current;
    if (!stringCanvas || !modesCanvas) return;

    const stringCtx = stringCanvas.getContext("2d");
    const modesCtx = modesCanvas.getContext("2d");
    if (!stringCtx || !modesCtx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      const stringRect = stringCanvas.getBoundingClientRect();
      stringCanvas.width = stringRect.width * dpr;
      stringCanvas.height = stringRect.height * dpr;
      stringCtx.setTransform(1, 0, 0, 1, 0, 0);
      stringCtx.scale(dpr, dpr);

      const modesRect = modesCanvas.getBoundingClientRect();
      modesCanvas.width = modesRect.width * dpr;
      modesCanvas.height = modesRect.height * dpr;
      modesCtx.setTransform(1, 0, 0, 1, 0, 0);
      modesCtx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // Detect dark mode and set colors accordingly
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? "#d4d4d8" : "#3f3f46";
      const mutedColor = isDark ? "#a1a1aa" : "#52525b";
      const axisColor = isDark ? "#71717a" : "#a1a1aa";

      const currentNumModes = numModesRef.current;
      const currentDamping = dampingRef.current;
      const currentSpeed = speedRef.current;
      const currentTime = timeRef.current;

      // Calculate state
      const initialAmplitudes = decompose(
        initialShapeRef.current,
        currentNumModes
      );

      let displacement: Float64Array;
      let currentAmplitudes: number[];

      if (isPlayingRef.current && !isDraggingRef.current) {
        const state = calculateState(
          currentTime,
          initialAmplitudes,
          currentNumModes,
          currentDamping
        );
        displacement = state.displacement;
        currentAmplitudes = state.currentAmplitudes;
      } else {
        displacement = initialShapeRef.current;
        currentAmplitudes = initialAmplitudes;
      }

      modeAmplitudesRef.current = currentAmplitudes;

      // Draw string canvas
      const stringRect = stringCanvas.getBoundingClientRect();
      const sw = stringRect.width;
      const sh = stringRect.height;

      stringCtx.clearRect(0, 0, sw, sh);

      const sPadding = 40;
      const sPlotWidth = sw - 2 * sPadding;
      const sPlotHeight = sh - 2 * sPadding;
      const sCenterY = sh / 2;

      // Draw axis
      stringCtx.strokeStyle = axisColor;
      stringCtx.lineWidth = 1;
      stringCtx.beginPath();
      stringCtx.moveTo(sPadding, sCenterY);
      stringCtx.lineTo(sw - sPadding, sCenterY);
      stringCtx.stroke();

      // Draw endpoints
      stringCtx.fillStyle = mutedColor;
      stringCtx.fillRect(sPadding - 4, sCenterY - 15, 8, 30);
      stringCtx.fillRect(sw - sPadding - 4, sCenterY - 15, 8, 30);

      // Labels
      stringCtx.fillStyle = textColor;
      stringCtx.font = "11px system-ui";
      stringCtx.textAlign = "center";
      stringCtx.fillText("0", sPadding, sh - 8);
      stringCtx.fillText(`${L.toFixed(2)} m`, sw - sPadding, sh - 8);

      // Draw string
      const gradient = stringCtx.createLinearGradient(
        sPadding,
        0,
        sw - sPadding,
        0
      );
      gradient.addColorStop(0, "#7c3aed");
      gradient.addColorStop(1, "#f97316");

      stringCtx.beginPath();
      stringCtx.strokeStyle = gradient;
      stringCtx.lineWidth = 3;
      stringCtx.lineCap = "round";

      const xPoints = getXPoints();
      for (let i = 0; i < NUM_POINTS; i++) {
        const canvasX = sPadding + (xPoints[i] / L) * sPlotWidth;
        const canvasY = sCenterY - (displacement[i] / 0.3) * (sPlotHeight / 2);

        if (i === 0) {
          stringCtx.moveTo(canvasX, canvasY);
        } else {
          stringCtx.lineTo(canvasX, canvasY);
        }
      }
      stringCtx.stroke();

      // Draw drag handle
      if (isDraggingRef.current && dragPositionRef.current) {
        const handleX =
          sPadding + (dragPositionRef.current.x / L) * sPlotWidth;
        const handleY =
          sCenterY - (dragPositionRef.current.y / 0.3) * (sPlotHeight / 2);

        stringCtx.beginPath();
        stringCtx.arc(handleX, handleY, 8, 0, Math.PI * 2);
        stringCtx.fillStyle = "rgba(249, 115, 22, 0.8)";
        stringCtx.fill();
        stringCtx.strokeStyle = "#f97316";
        stringCtx.lineWidth = 2;
        stringCtx.stroke();
      }

      // Draw modes canvas (bar chart)
      const modesRect = modesCanvas.getBoundingClientRect();
      const mw = modesRect.width;
      const mh = modesRect.height;

      modesCtx.clearRect(0, 0, mw, mh);

      const mPadding = 40;
      const mPlotWidth = mw - 2 * mPadding;
      const mPlotHeight = mh - 2 * mPadding;
      const mCenterY = mh / 2;

      // Draw zero line
      modesCtx.strokeStyle = axisColor;
      modesCtx.lineWidth = 1;
      modesCtx.beginPath();
      modesCtx.moveTo(mPadding, mCenterY);
      modesCtx.lineTo(mw - mPadding, mCenterY);
      modesCtx.stroke();

      // Draw bars
      const barWidth = mPlotWidth / currentNumModes - 4;
      const maxAmp = 0.3;
      const freqs = getFrequencies(currentNumModes);

      for (let n = 0; n < currentNumModes; n++) {
        const amp = currentAmplitudes[n] || 0;
        const barHeight = (amp / maxAmp) * (mPlotHeight / 2);

        const barX = mPadding + (n / currentNumModes) * mPlotWidth + 2;

        // Gradient color based on mode number
        const hue = 270 + (n / currentNumModes) * 60; // purple to orange
        const color = `hsl(${hue}, 70%, 55%)`;

        modesCtx.fillStyle = color;
        if (barHeight >= 0) {
          modesCtx.fillRect(barX, mCenterY - barHeight, barWidth, barHeight);
        } else {
          modesCtx.fillRect(barX, mCenterY, barWidth, -barHeight);
        }

        // Mode number label
        modesCtx.fillStyle = textColor;
        modesCtx.font = "10px system-ui";
        modesCtx.textAlign = "center";
        modesCtx.fillText(
          `${n + 1}`,
          barX + barWidth / 2,
          mh - 8
        );

        // Frequency label (only show for first few modes if space is tight)
        if (n < 8 || currentNumModes <= 10) {
          modesCtx.fillStyle = mutedColor;
          modesCtx.font = "8px system-ui";
          modesCtx.fillText(
            `${Math.round(freqs[n])}`,
            barX + barWidth / 2,
            12
          );
        }
      }

      // Y-axis labels
      modesCtx.fillStyle = textColor;
      modesCtx.font = "10px system-ui";
      modesCtx.textAlign = "right";
      modesCtx.fillText("Amplitude", mPadding - 8, mCenterY + 4);

      // Update time
      if (isPlayingRef.current && !isDraggingRef.current) {
        timeRef.current += 0.0007 * currentSpeed;

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
  }, [decompose, calculateState, getXPoints, getFrequencies]);

  return (
    <div className={`${className}`}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* String visualization */}
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <canvas
            ref={stringCanvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`w-full h-48 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            aria-label="String vibration visualization"
          />
        </div>

        {/* Mode amplitudes bar chart */}
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="px-4 pt-2">
            <p className="text-xs text-zinc-700 dark:text-zinc-500">
              Normal Mode Amplitudes (frequency in Hz shown above)
            </p>
          </div>
          <canvas
            ref={modesCanvasRef}
            className="w-full h-40"
            aria-label="Normal mode amplitudes bar chart"
          />
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
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
          </div>

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
                <span className="text-zinc-800 dark:text-zinc-400">
                  {(damping * 100).toFixed(0)}%
                </span>
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
                max="20"
                value={numModes}
                onChange={(e) => setNumModes(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            {isDragging
              ? "Release to pluck the string!"
              : "Drag the string to pluck. Watch how different modes contribute to the vibration."}
          </p>
        </div>
      </div>
    </div>
  );
}
