"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TonewoodSimProps {
  className?: string;
}

type WoodType = "stiff" | "treble" | "bass";

const WOOD_PROPERTIES: Record<WoodType, { stiffness: number; label: string; description: string }> = {
  stiff: {
    stiffness: 50000,
    label: "Stiff (Maple)",
    description: "Minimal energy transfer to wood - sustain preserved",
  },
  treble: {
    stiffness: 8000,
    label: "Treble-absorbing (Soft Maple)",
    description: "Resonates with higher frequencies - absorbs treble",
  },
  bass: {
    stiffness: 2000,
    label: "Bass-absorbing (Mahogany)",
    description: "Resonates with lower frequencies - absorbs bass",
  },
};

export default function TonewoodSim({ className = "" }: TonewoodSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const velocityHistoryRef = useRef<number[]>([]);
  const woodHistoryRef = useRef<number[]>([]);
  const displacementHistoryRef = useRef<number[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [woodType, setWoodType] = useState<WoodType>("stiff");
  const [speed, setSpeed] = useState(0.5);
  const [hasPlucked, setHasPlucked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Simulation state refs
  const stringStateRef = useRef<{
    modeAmplitudes: number[];
    modeVelocities: number[];
    woodPosition: number;
    woodVelocity: number;
  }>({
    modeAmplitudes: [],
    modeVelocities: [],
    woodPosition: 0,
    woodVelocity: 0,
  });

  const pluckPositionRef = useRef({ x: 0.3, y: 0 });
  const isPlayingRef = useRef(isPlaying);
  const isDraggingRef = useRef(false);
  const woodTypeRef = useRef(woodType);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    woodTypeRef.current = woodType;
  }, [woodType]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Physics constants
  const L = 0.65; // String length (m)
  const T = 100; // String tension (N)
  const mu = 0.001; // Linear mass density (kg/m)
  const c = Math.sqrt(T / mu); // Wave speed
  const NUM_MODES = 12;
  const airDamping = 0.015; // Air resistance coefficient
  const woodDamping = airDamping * 3; // Wood damping is 3x air
  const woodMass = 0.05; // Effective mass of wood at coupling point (kg)

  // Get mode frequencies
  const getModeFreq = useCallback(
    (n: number) => {
      return (n * c) / (2 * L);
    },
    [c, L]
  );

  // Initialize pluck
  const initializePluck = useCallback(
    (pluckX: number, pluckY: number) => {
      const amplitudes: number[] = [];
      const velocities: number[] = [];

      // Decompose triangular pluck into Fourier modes
      for (let n = 1; n <= NUM_MODES; n++) {
        // Fourier coefficient for triangular pluck at position pluckX
        const coeff =
          ((2 * pluckY * L * L) / (n * n * Math.PI * Math.PI * pluckX * (L - pluckX))) *
          Math.sin((n * Math.PI * pluckX) / L);
        amplitudes.push(coeff);
        velocities.push(0);
      }

      stringStateRef.current = {
        modeAmplitudes: amplitudes,
        modeVelocities: velocities,
        woodPosition: 0,
        woodVelocity: 0,
      };
    },
    [L, NUM_MODES]
  );

  // Handle mouse interactions
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      const stringAreaWidth = rect.width * 0.55;
      const padding = 50;
      const stringY = 80;

      // Check if in string area
      if (canvasX < stringAreaWidth && Math.abs(canvasY - stringY) < 60) {
        if (isPlayingRef.current) {
          timeRef.current = 0;
          setIsPlaying(false);
          isPlayingRef.current = false;
        }

        const stringStartX = padding + 40; // After wood block
        const stringEndX = stringAreaWidth - padding;
        const stringPixelLength = stringEndX - stringStartX;

        const normalizedX = (canvasX - stringStartX) / stringPixelLength;
        if (normalizedX > 0.05 && normalizedX < 0.95) {
          isDraggingRef.current = true;
          setIsDragging(true);
          pluckPositionRef.current = {
            x: Math.max(0.05, Math.min(0.95, normalizedX)),
            y: -(canvasY - stringY) / 150,
          };
        }
      }
    },
    []
  );

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    const stringAreaWidth = rect.width * 0.55;
    const padding = 50;
    const stringY = 80;

    const stringStartX = padding + 40;
    const stringEndX = stringAreaWidth - padding;
    const stringPixelLength = stringEndX - stringStartX;

    const normalizedX = (canvasX - stringStartX) / stringPixelLength;
    pluckPositionRef.current = {
      x: Math.max(0.05, Math.min(0.95, normalizedX)),
      y: Math.max(-0.4, Math.min(0.4, -(canvasY - stringY) / 150)),
    };
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    if (Math.abs(pluckPositionRef.current.y) > 0.02) {
      initializePluck(pluckPositionRef.current.x * L, pluckPositionRef.current.y * 0.1);
      timeRef.current = 0;
      setIsPlaying(true);
      isPlayingRef.current = true;
      setHasPlucked(true);
    }
  }, [initializePluck, L]);

  const handleReset = useCallback(() => {
    timeRef.current = 0;
    stringStateRef.current = {
      modeAmplitudes: new Array(NUM_MODES).fill(0),
      modeVelocities: new Array(NUM_MODES).fill(0),
      woodPosition: 0,
      woodVelocity: 0,
    };
    pluckPositionRef.current = { x: 0.3, y: 0 };
    velocityHistoryRef.current = [];
    woodHistoryRef.current = [];
    displacementHistoryRef.current = [];
    setIsPlaying(false);
    isPlayingRef.current = false;
    setHasPlucked(false);
  }, [NUM_MODES]);

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

    const dt = 0.00005; // Small timestep for stability
    const stepsPerFrame = 20;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Detect dark mode and set colors accordingly
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? "#d4d4d8" : "#3f3f46";
      const mutedColor = isDark ? "#a1a1aa" : "#52525b";
      const lightLineColor = isDark ? "#52525b" : "#e4e4e7";

      const currentSpeed = speedRef.current;
      const currentWoodType = woodTypeRef.current;
      const woodStiffness = WOOD_PROPERTIES[currentWoodType].stiffness;

      // Physics simulation
      if (isPlayingRef.current) {
        const state = stringStateRef.current;

        for (let step = 0; step < stepsPerFrame; step++) {
          // Calculate force on wood from string (proportional to slope at x=0)
          let forceOnWood = 0;
          for (let n = 1; n <= NUM_MODES; n++) {
            // Slope of mode n at x=0: (nπ/L) * A_n * cos(0) = nπ/L * A_n
            const modeSlope = ((n * Math.PI) / L) * state.modeAmplitudes[n - 1];
            forceOnWood += T * modeSlope; // F = T * dy/dx
          }

          // Update wood position (damped harmonic oscillator)
          const woodAccel =
            (forceOnWood - woodStiffness * state.woodPosition - woodDamping * state.woodVelocity) /
            woodMass;
          state.woodVelocity += woodAccel * dt * currentSpeed;
          state.woodPosition += state.woodVelocity * dt * currentSpeed;

          // Update each string mode
          for (let n = 1; n <= NUM_MODES; n++) {
            const omega = 2 * Math.PI * getModeFreq(n);
            const idx = n - 1;

            // Mode is driven by wood motion at x=0
            // The mode shape at x=0 is sin(0) = 0, but the boundary condition
            // y(0,t) = woodPosition means we add a correction term
            // This couples the wood motion back to the string

            // Damping: air + energy loss to wood
            const totalDamping = airDamping * omega;

            // Simple coupled oscillator: mode feels restoring force + damping
            const modeAccel =
              -omega * omega * state.modeAmplitudes[idx] -
              totalDamping * state.modeVelocities[idx] +
              (omega * omega * state.woodPosition * 2) / (n * Math.PI); // Coupling term

            state.modeVelocities[idx] += modeAccel * dt * currentSpeed;
            state.modeAmplitudes[idx] += state.modeVelocities[idx] * dt * currentSpeed;
          }
        }

        timeRef.current += 0.016 * currentSpeed;

        // Stop after 15 seconds
        if (timeRef.current > 15) {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      }

      // Layout
      const stringAreaWidth = width * 0.55;
      const waveformAreaX = stringAreaWidth + 20;
      const waveformAreaWidth = width - waveformAreaX - 20;
      const padding = 50;

      // === DRAW STRING AND WOOD ===
      const stringY = 80;
      const woodBlockX = padding;
      const woodBlockWidth = 35;
      const stringStartX = woodBlockX + woodBlockWidth + 5;
      const stringEndX = stringAreaWidth - padding;
      const stringPixelLength = stringEndX - stringStartX;

      // Calculate string displacement
      const state = stringStateRef.current;
      const getStringDisplacement = (normalizedX: number) => {
        if (!isPlayingRef.current && isDraggingRef.current) {
          // Show pluck shape while dragging
          const pluckX = pluckPositionRef.current.x;
          const pluckY = pluckPositionRef.current.y * 0.1;
          if (normalizedX <= pluckX) {
            return (pluckY * normalizedX) / pluckX;
          } else {
            return (pluckY * (1 - normalizedX)) / (1 - pluckX);
          }
        }

        let displacement = state.woodPosition; // Boundary condition at nut
        for (let n = 1; n <= NUM_MODES; n++) {
          displacement += state.modeAmplitudes[n - 1] * Math.sin((n * Math.PI * normalizedX));
        }
        return displacement;
      };

      // Draw wood block (deforms based on woodPosition)
      const woodDeform = state.woodPosition * 800; // Exaggerate for visibility
      ctx.fillStyle = currentWoodType === "stiff" ? "#a3a3a3" : currentWoodType === "treble" ? "#d4a574" : "#8b5a2b";
      ctx.beginPath();
      ctx.moveTo(woodBlockX, stringY - 30);
      ctx.lineTo(woodBlockX + woodBlockWidth, stringY - 30 + woodDeform * 0.3);
      ctx.lineTo(woodBlockX + woodBlockWidth, stringY + 30 + woodDeform);
      ctx.lineTo(woodBlockX, stringY + 30);
      ctx.closePath();
      ctx.fill();

      // Wood grain lines
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const grainY = stringY - 20 + i * 12;
        ctx.beginPath();
        ctx.moveTo(woodBlockX + 3, grainY);
        ctx.quadraticCurveTo(
          woodBlockX + woodBlockWidth / 2,
          grainY + woodDeform * 0.5,
          woodBlockX + woodBlockWidth - 3,
          grainY + woodDeform * 0.7
        );
        ctx.stroke();
      }

      // Wood label
      ctx.fillStyle = textColor;
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Nut/Wood", woodBlockX + woodBlockWidth / 2, stringY + 50);

      // Draw bridge (fixed)
      ctx.fillStyle = mutedColor;
      ctx.fillRect(stringEndX - 3, stringY - 15, 8, 30);
      ctx.fillStyle = textColor;
      ctx.font = "10px system-ui";
      ctx.fillText("Bridge", stringEndX, stringY + 50);

      // Draw pickup (fixed, near bridge)
      const pickupX = stringStartX + stringPixelLength * 0.85;
      ctx.fillStyle = "#f97316";
      ctx.fillRect(pickupX - 12, stringY + 20, 24, 30);
      ctx.fillStyle = "#27272a";
      ctx.beginPath();
      ctx.arc(pickupX, stringY + 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = textColor;
      ctx.font = "10px system-ui";
      ctx.fillText("Pickup", pickupX, stringY + 65);

      // Draw string
      const stringGradient = ctx.createLinearGradient(stringStartX, 0, stringEndX, 0);
      stringGradient.addColorStop(0, "#7c3aed");
      stringGradient.addColorStop(1, "#f97316");
      ctx.strokeStyle = stringGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let i = 0; i <= 100; i++) {
        const normalizedX = i / 100;
        const x = stringStartX + normalizedX * stringPixelLength;
        const displacement = getStringDisplacement(normalizedX);
        const y = stringY - displacement * 600; // Scale for visibility

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Magnetic field lines from pickup to string
      const stringAtPickup = getStringDisplacement(0.85);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(pickupX + i * 5, stringY + 18);
        ctx.lineTo(pickupX + i * 3, stringY - stringAtPickup * 600 + 5);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // === DRAW WAVEFORMS ===
      const waveHeight = 50;
      const wave1Y = 60;
      const wave2Y = 160;
      const wave3Y = 260;

      // Calculate velocity at pickup (85% along string)
      const getVelocityAtPickup = () => {
        let velocity = state.woodVelocity; // Contribution from wood motion
        for (let n = 1; n <= NUM_MODES; n++) {
          velocity += state.modeVelocities[n - 1] * Math.sin(n * Math.PI * 0.85);
        }
        return velocity;
      };

      // Draw waveform helper
      const drawLabeledWaveform = (
        yCenter: number,
        label: string,
        dataFn: () => number,
        color: string,
        historyRef: React.MutableRefObject<number[]>
      ) => {
        ctx.fillStyle = textColor;
        ctx.font = "11px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(label, waveformAreaX, yCenter - waveHeight - 8);

        // Center line
        ctx.strokeStyle = lightLineColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(waveformAreaX, yCenter);
        ctx.lineTo(waveformAreaX + waveformAreaWidth, yCenter);
        ctx.stroke();

        // Update history
        if (isPlayingRef.current) {
          historyRef.current.push(dataFn());
          if (historyRef.current.length > 200) {
            historyRef.current.shift();
          }
        }

        // Draw waveform
        if (historyRef.current.length > 1) {
          const maxVal = Math.max(...historyRef.current.map(Math.abs), 0.001);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < historyRef.current.length; i++) {
            const x = waveformAreaX + (i / 200) * waveformAreaWidth;
            const y = yCenter - (historyRef.current[i] / maxVal) * waveHeight * 0.8;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      };

      drawLabeledWaveform(wave1Y, "Pickup Output (String Velocity)", getVelocityAtPickup, "#7c3aed", velocityHistoryRef);
      drawLabeledWaveform(wave2Y, "Wood Motion at Nut", () => state.woodPosition * 100, "#f97316", woodHistoryRef);
      drawLabeledWaveform(wave3Y, "String Displacement at Pickup", () => getStringDisplacement(0.85) * 10, "#22c55e", displacementHistoryRef);

      // Info box
      const boxY = height - 70;
      ctx.fillStyle = "rgba(124, 58, 237, 0.1)";
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(waveformAreaX, boxY, waveformAreaWidth, 55, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? "#a78bfa" : "#6d28d9";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      const woodInfo = WOOD_PROPERTIES[currentWoodType];
      ctx.fillText(woodInfo.label, waveformAreaX + waveformAreaWidth / 2, boxY + 18);
      ctx.fillStyle = textColor;
      ctx.font = "10px system-ui";
      ctx.fillText(woodInfo.description, waveformAreaX + waveformAreaWidth / 2, boxY + 35);
      ctx.fillText("Wood damping: 3x air resistance", waveformAreaX + waveformAreaWidth / 2, boxY + 48);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [getModeFreq, L, NUM_MODES, T, airDamping, woodDamping, woodMass]);

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
          aria-label="Tonewood simulation showing coupled string-wood oscillation"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span>Wood Type</span>
              <div className="flex gap-2">
                {(Object.keys(WOOD_PROPERTIES) as WoodType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWoodType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      woodType === type
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    }`}
                  >
                    {type === "stiff" ? "Stiff" : type === "treble" ? "Treble" : "Bass"}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Speed</span>
                <span className="text-zinc-800 dark:text-zinc-400">{speed}x</span>
              </span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            {isDragging
              ? "Release to pluck!"
              : "Drag the string to pluck. Watch how different wood stiffnesses affect which frequencies are absorbed."}
          </p>
        </div>
      </div>
    </div>
  );
}
