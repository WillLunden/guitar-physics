"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TrueTemperamentSimProps {
  className?: string;
}

// String properties (gauge affects stiffness and required compensation)
const STRINGS = [
  { note: "E", gauge: 0.046, color: "#dc2626" },
  { note: "A", gauge: 0.036, color: "#ea580c" },
  { note: "D", gauge: 0.026, color: "#ca8a04" },
  { note: "G", gauge: 0.017, color: "#16a34a" },
  { note: "B", gauge: 0.013, color: "#2563eb" },
  { note: "e", gauge: 0.010, color: "#7c3aed" },
];

export default function TrueTemperamentSim({ className = "" }: TrueTemperamentSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTrueTemperament, setIsTrueTemperament] = useState(true);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const availableWidth = width - padding * 2;
    // Scale so 12th fret lands at right edge (12th fret = 50% of scale length)
    const scaleLength = availableWidth * 2;
    const fretboardHeight = height * 0.7;
    const fretboardTop = 50;
    const numFrets = 12;
    const numStrings = 6;

    // Title
    ctx.fillStyle = "#3f3f46";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      isTrueTemperament ? "True Temperament (Curved Frets)" : "Standard (Straight Frets)",
      width / 2,
      25
    );

    // Fretboard background (ends at 12th fret)
    ctx.fillStyle = "#78716c";
    ctx.fillRect(padding, fretboardTop, availableWidth, fretboardHeight);

    // Calculate fret positions (equal temperament)
    const getFretX = (fret: number) => {
      const ratio = 1 - 1 / Math.pow(2, fret / 12);
      return padding + ratio * scaleLength;
    };

    // Calculate True Temperament offset for each string at each fret
    // Thicker strings need more compensation, and it varies by position
    const getTTOffset = (stringIndex: number, fret: number) => {
      if (!isTrueTemperament) return 0;
      const gauge = STRINGS[stringIndex].gauge;
      // Compensation is larger for thicker strings and varies with fret position
      // The pattern creates the characteristic "squiggle" - exaggerated for visibility
      const baseOffset = gauge * 350; // Thicker = more offset (exaggerated)
      const fretFactor = Math.sin((fret / numFrets) * Math.PI * 0.9); // Varies along fretboard
      // Add some waviness that differs per string for more realistic squiggle
      const waviness = Math.sin(fret * 0.5 + stringIndex * 0.3) * gauge * 40;
      return baseOffset * fretFactor * (1 - stringIndex / numStrings * 0.4) + waviness;
    };

    // Draw frets
    for (let fret = 0; fret <= numFrets; fret++) {
      const baseX = getFretX(fret);

      ctx.strokeStyle = fret === 0 ? "#f5f5f4" : "#d4d4d8";
      ctx.lineWidth = fret === 0 ? 6 : 2;

      ctx.beginPath();

      if (isTrueTemperament && fret > 0) {
        // Draw curved fret
        for (let s = 0; s <= numStrings - 1; s++) {
          const stringY = fretboardTop + ((s + 0.5) / numStrings) * fretboardHeight;
          const offset = getTTOffset(s, fret);
          const x = baseX + offset;

          if (s === 0) {
            ctx.moveTo(x, stringY);
          } else {
            // Smooth curve between string positions
            const prevStringY = fretboardTop + ((s - 0.5) / numStrings) * fretboardHeight;
            const prevOffset = getTTOffset(s - 1, fret);
            const prevX = baseX + prevOffset;
            const midY = (prevStringY + stringY) / 2;
            ctx.quadraticCurveTo(prevX, midY, x, stringY);
          }
        }
      } else {
        // Straight fret
        ctx.moveTo(baseX, fretboardTop);
        ctx.lineTo(baseX, fretboardTop + fretboardHeight);
      }

      ctx.stroke();

      // Fret numbers
      if (fret > 0 && fret <= numFrets) {
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${fret}`, baseX, fretboardTop + fretboardHeight + 18);
      }
    }

    // Draw strings
    for (let s = 0; s < numStrings; s++) {
      const stringY = fretboardTop + ((s + 0.5) / numStrings) * fretboardHeight;
      const thickness = 1 + s * 0.5;

      ctx.strokeStyle = STRINGS[s].color;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(padding, stringY);
      ctx.lineTo(padding + availableWidth, stringY);
      ctx.stroke();

      // String labels
      ctx.fillStyle = STRINGS[s].color;
      ctx.font = "11px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(STRINGS[s].note, padding - 10, stringY + 4);
    }

    // Nut and 12th fret labels
    ctx.fillStyle = "#3f3f46";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Nut", padding, fretboardTop - 8);
    ctx.fillText("12th Fret", padding + availableWidth, fretboardTop - 8);
  }, [isTrueTemperament]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-64"
          aria-label="True Temperament fret visualization"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsTrueTemperament(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isTrueTemperament
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300"
              }`}
            >
              Standard Frets
            </button>
            <button
              onClick={() => setIsTrueTemperament(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isTrueTemperament
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300"
              }`}
            >
              True Temperament
            </button>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-500">
            Notice how the fret curves differently for each string. Thicker bass strings need more compensation than thin treble strings.
          </p>
        </div>
      </div>
    </div>
  );
}
