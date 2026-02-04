"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PickupPlacementSimProps {
  className?: string;
}

const L = 0.66; // String length
const NUM_POINTS = 500;
const N_MODES = 12;

export default function PickupPlacementSim({
  className = "",
}: PickupPlacementSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const initialShapeRef = useRef<Float64Array>(new Float64Array(NUM_POINTS));
  const velocityHistoryRef = useRef<number[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [pickupPosition, setPickupPosition] = useState(0.85); // 0-1 normalized
  const [isDragging, setIsDragging] = useState(false);
  const [hasPlucked, setHasPlucked] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  const pickupPositionRef = useRef(pickupPosition);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    pickupPositionRef.current = pickupPosition;
  }, [pickupPosition]);

  // Get x points
  const getXPoints = useCallback(() => {
    const points: number[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      points.push((i * L) / (NUM_POINTS - 1));
    }
    return points;
  }, []);

  // Decompose shape into modes
  const decompose = useCallback(
    (shape: Float64Array): number[] => {
      const amplitudes: number[] = [];
      const xPoints = getXPoints();
      const dx = L / (NUM_POINTS - 1);

      for (let n = 1; n <= N_MODES; n++) {
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

  // Create pluck shape
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

  // Calculate mode sensitivity at pickup position
  // This is the derivative of the mode shape (velocity sensitivity)
  const getModeSensitivity = useCallback((n: number, pickupX: number) => {
    // Mode shape: sin(nπx/L)
    // Derivative: (nπ/L) * cos(nπx/L)
    // The pickup sees velocity, which is proportional to this derivative
    return Math.abs(Math.sin((n * Math.PI * pickupX) / L));
  }, []);

  // Calculate velocity at pickup position
  const getVelocityAtPickup = useCallback(
    (t: number, amplitudes: number[], pickupX: number, damping: number) => {
      let velocity = 0;

      for (let n = 1; n <= N_MODES; n++) {
        const freq = (n * Math.sqrt(1000 / 0.01)) / (2 * L);
        const omega = 2 * Math.PI * freq;
        const dampingFactor = Math.exp(-damping * t * omega);

        // Velocity is derivative of displacement w.r.t. time
        // y_n = A_n * sin(nπx/L) * cos(ωt)
        // dy/dt = -A_n * sin(nπx/L) * ω * sin(ωt)
        const modeShape = Math.sin((n * Math.PI * pickupX) / L);
        velocity +=
          -amplitudes[n - 1] * modeShape * omega * Math.sin(omega * t) * dampingFactor;
      }

      return velocity;
    },
    []
  );

  // Handle string drag
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      const height = rect.height;
      const stringAreaHeight = height * 0.35;
      const padding = 40;
      const plotWidth = rect.width - 2 * padding;

      // Check if clicking in string area
      if (canvasY < stringAreaHeight) {
        // Reset if playing
        if (isPlayingRef.current) {
          timeRef.current = 0;
          setIsPlaying(false);
          isPlayingRef.current = false;
          velocityHistoryRef.current = [];
        }

        const physicalX = ((canvasX - padding) / plotWidth) * L;

        if (physicalX > 0.02 && physicalX < L - 0.02) {
          isDraggingRef.current = true;
          setIsDragging(true);

          const centerY = stringAreaHeight / 2;
          const plotHeight = stringAreaHeight - 40;
          const physicalY = -((canvasY - centerY) / (plotHeight / 2)) * 0.3;
          const clampedY = Math.max(-0.3, Math.min(0.3, physicalY));

          initialShapeRef.current = createPluckShape(physicalX, clampedY);
        }
      }
    },
    [createPluckShape]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      const stringAreaHeight = rect.height * 0.35;
      const padding = 40;
      const plotWidth = rect.width - 2 * padding;

      const physicalX = Math.max(0.02, Math.min(L - 0.02, ((canvasX - padding) / plotWidth) * L));
      const centerY = stringAreaHeight / 2;
      const plotHeight = stringAreaHeight - 40;
      const physicalY = -((canvasY - centerY) / (plotHeight / 2)) * 0.3;
      const clampedY = Math.max(-0.3, Math.min(0.3, physicalY));

      initialShapeRef.current = createPluckShape(physicalX, clampedY);
    },
    [createPluckShape]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    const maxDisplacement = Math.max(
      ...Array.from(initialShapeRef.current).map(Math.abs)
    );
    if (maxDisplacement > 0.005) {
      timeRef.current = 0;
      velocityHistoryRef.current = [];
      setIsPlaying(true);
      isPlayingRef.current = true;
      setHasPlucked(true);
    }
  }, []);

  const handleReset = useCallback(() => {
    timeRef.current = 0;
    initialShapeRef.current = new Float64Array(NUM_POINTS);
    velocityHistoryRef.current = [];
    setIsPlaying(false);
    isPlayingRef.current = false;
    setHasPlucked(false);
  }, []);

  // Main animation loop
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

      const padding = 40;
      const pickupX = pickupPositionRef.current * L;
      const amplitudes = decompose(initialShapeRef.current);

      // Layout: String (35%), Mode sensitivity (30%), Output waveform (35%)
      const stringAreaHeight = height * 0.35;
      const sensitivityAreaHeight = height * 0.30;
      const waveformAreaHeight = height * 0.35;

      // === STRING VISUALIZATION ===
      const stringCenterY = stringAreaHeight / 2;
      const stringPlotWidth = width - 2 * padding;
      const stringPlotHeight = stringAreaHeight - 40;

      // Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, width, stringAreaHeight);

      // Axis
      ctx.strokeStyle = "#d4d4d8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, stringCenterY);
      ctx.lineTo(width - padding, stringCenterY);
      ctx.stroke();

      // Endpoints
      ctx.fillStyle = "#52525b";
      ctx.fillRect(padding - 4, stringCenterY - 15, 8, 30);
      ctx.fillRect(width - padding - 4, stringCenterY - 15, 8, 30);

      // Calculate current displacement
      const xPoints = getXPoints();
      const displacement = new Float64Array(NUM_POINTS);

      if (isPlayingRef.current) {
        const t = timeRef.current;
        for (let n = 1; n <= N_MODES; n++) {
          const freq = (n * Math.sqrt(1000 / 0.01)) / (2 * L);
          const omega = 2 * Math.PI * freq;
          const dampingFactor = Math.exp(-0.01 * t * omega);
          const timeComponent = Math.cos(omega * t) * dampingFactor;

          for (let i = 0; i < NUM_POINTS; i++) {
            const modeShape = Math.sin((n * Math.PI * xPoints[i]) / L);
            displacement[i] += amplitudes[n - 1] * modeShape * timeComponent;
          }
        }
      } else {
        for (let i = 0; i < NUM_POINTS; i++) {
          displacement[i] = initialShapeRef.current[i];
        }
      }

      // Draw string
      const gradient = ctx.createLinearGradient(padding, 0, width - padding, 0);
      gradient.addColorStop(0, "#7c3aed");
      gradient.addColorStop(1, "#f97316");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < NUM_POINTS; i++) {
        const canvasX = padding + (xPoints[i] / L) * stringPlotWidth;
        const canvasY = stringCenterY - (displacement[i] / 0.3) * (stringPlotHeight / 2);
        if (i === 0) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
      }
      ctx.stroke();

      // Draw pickup position
      const pickupCanvasX = padding + (pickupX / L) * stringPlotWidth;
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pickupCanvasX, stringCenterY - 25);
      ctx.lineTo(pickupCanvasX, stringCenterY + 25);
      ctx.stroke();

      // Pickup icon
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(pickupCanvasX, stringCenterY + 30, 8, 0, Math.PI * 2);
      ctx.fill();

      // Labels
      ctx.fillStyle = "#3f3f46";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Nut", padding, stringAreaHeight - 5);
      ctx.fillText("Bridge", width - padding, stringAreaHeight - 5);
      ctx.fillStyle = "#f97316";
      ctx.fillText("Pickup", pickupCanvasX, stringAreaHeight - 5);

      // === MODE SENSITIVITY BARS ===
      const sensitivityTop = stringAreaHeight;
      const sensitivityPlotHeight = sensitivityAreaHeight - 30;
      const barWidth = (width - 2 * padding) / N_MODES - 4;

      ctx.fillStyle = "#3f3f46";
      ctx.font = "11px system-ui";
      ctx.textAlign = "left";
      ctx.fillText("Harmonic sensitivity at pickup position:", padding, sensitivityTop + 15);

      for (let n = 1; n <= N_MODES; n++) {
        const sensitivity = getModeSensitivity(n, pickupX);
        const barHeight = sensitivity * (sensitivityPlotHeight - 20);

        const barX = padding + ((n - 1) / N_MODES) * (width - 2 * padding) + 2;
        const barY = sensitivityTop + sensitivityPlotHeight - barHeight;

        // Color based on harmonic number
        const hue = 270 + ((n - 1) / N_MODES) * 60;
        ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Mode number
        ctx.fillStyle = "#3f3f46";
        ctx.font = "9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${n}`, barX + barWidth / 2, sensitivityTop + sensitivityPlotHeight + 10);
      }

      // Zero nodes indicator
      const nodePositions: number[] = [];
      for (let n = 1; n <= N_MODES; n++) {
        // Nodes at x = k*L/n for k = 1, 2, ..., n-1
        for (let k = 1; k < n; k++) {
          nodePositions.push((k * L) / n);
        }
      }

      // === OUTPUT WAVEFORM ===
      const waveformTop = stringAreaHeight + sensitivityAreaHeight;
      const waveformPlotHeight = waveformAreaHeight - 30;
      const waveformCenterY = waveformTop + waveformPlotHeight / 2;

      // Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, waveformTop, width, waveformAreaHeight);

      // Label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "11px system-ui";
      ctx.textAlign = "left";
      ctx.fillText("Pickup output signal (velocity at pickup position):", padding, waveformTop + 15);

      // Center line
      ctx.strokeStyle = "#d4d4d8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, waveformCenterY);
      ctx.lineTo(width - padding, waveformCenterY);
      ctx.stroke();

      // Update velocity history
      if (isPlayingRef.current) {
        const velocity = getVelocityAtPickup(timeRef.current, amplitudes, pickupX, 0.01);
        velocityHistoryRef.current.push(velocity);
        if (velocityHistoryRef.current.length > 400) {
          velocityHistoryRef.current.shift();
        }
      }

      // Draw waveform
      if (velocityHistoryRef.current.length > 1) {
        const history = velocityHistoryRef.current;
        const maxVel = Math.max(...history.map(Math.abs), 1000);

        const waveGradient = ctx.createLinearGradient(padding, 0, width - padding, 0);
        waveGradient.addColorStop(0, "#7c3aed");
        waveGradient.addColorStop(1, "#f97316");
        ctx.strokeStyle = waveGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < history.length; i++) {
          const x = padding + (i / 400) * (width - 2 * padding);
          const y = waveformCenterY - (history[i] / maxVel) * (waveformPlotHeight / 2 - 10);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Update time
      if (isPlayingRef.current) {
        timeRef.current += 0.0003;
        if (timeRef.current > 5) {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [decompose, getXPoints, getModeSensitivity, getVelocityAtPickup]);

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full h-96 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          aria-label="Pickup placement simulation"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                if (hasPlucked) {
                  setIsPlaying(!isPlaying);
                  isPlayingRef.current = !isPlaying;
                }
              }}
              disabled={!hasPlucked}
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

          <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
            <span className="flex justify-between">
              <span>Pickup Position</span>
              <span className="text-zinc-800 dark:text-zinc-400">
                {pickupPosition < 0.75
                  ? "Unrealistic"
                  : pickupPosition < 0.78
                  ? "Neck"
                  : pickupPosition < 0.88
                  ? "Middle"
                  : "Bridge"}{" "}
                ({(pickupPosition * 100).toFixed(0)}% from nut)
              </span>
            </span>
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.01"
              value={pickupPosition}
              onChange={(e) => setPickupPosition(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="flex justify-between text-xs text-zinc-800 dark:text-zinc-400">
              <span>← Explore full range</span>
              <span>Realistic positions →</span>
            </span>
          </label>

          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            {isDragging
              ? "Release to pluck!"
              : "Drag the string to pluck, then move the pickup slider to hear how position affects tone."}
          </p>
        </div>
      </div>
    </div>
  );
}
