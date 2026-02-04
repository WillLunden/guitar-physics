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
  const [selectedFret, setSelectedFret] = useState(5);
  const [showStretch, setShowStretch] = useState(true);

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
    const fretboardWidth = width - padding * 2;
    const fretboardHeight = height * 0.5;
    const fretboardTop = 60;
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

    // Fretboard background
    ctx.fillStyle = "#78716c";
    ctx.fillRect(padding, fretboardTop, fretboardWidth, fretboardHeight);

    // Calculate fret positions (equal temperament)
    const getFretX = (fret: number) => {
      const ratio = 1 - 1 / Math.pow(2, fret / 12);
      return padding + ratio * fretboardWidth;
    };

    // Calculate True Temperament offset for each string at each fret
    // Thicker strings need more compensation, and it varies by position
    const getTTOffset = (stringIndex: number, fret: number) => {
      if (!isTrueTemperament) return 0;
      const gauge = STRINGS[stringIndex].gauge;
      // Compensation is larger for thicker strings and varies with fret position
      // The pattern creates the characteristic "squiggle"
      const baseOffset = gauge * 150; // Thicker = more offset
      const fretFactor = Math.sin((fret / numFrets) * Math.PI * 0.8); // Varies along fretboard
      return baseOffset * fretFactor * (1 - stringIndex / numStrings * 0.3);
    };

    // Draw frets
    for (let fret = 0; fret <= numFrets; fret++) {
      const baseX = getFretX(fret);
      const isSelected = fret === selectedFret;

      ctx.strokeStyle = fret === 0 ? "#f5f5f4" : isSelected ? "#a855f7" : "#d4d4d8";
      ctx.lineWidth = fret === 0 ? 6 : isSelected ? 3 : 2;

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
        ctx.fillStyle = isSelected ? "#a855f7" : "#a1a1aa";
        ctx.font = isSelected ? "bold 11px system-ui" : "10px system-ui";
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
      ctx.lineTo(padding + fretboardWidth, stringY);
      ctx.stroke();

      // String labels
      ctx.fillStyle = STRINGS[s].color;
      ctx.font = "11px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(STRINGS[s].note, padding - 10, stringY + 4);
    }

    // Nut and Bridge labels
    ctx.fillStyle = "#3f3f46";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Nut", padding, fretboardTop - 8);
    ctx.fillText("12th Fret", padding + fretboardWidth, fretboardTop - 8);

    // === String stretch illustration ===
    if (showStretch && selectedFret > 0) {
      const illustrationTop = fretboardTop + fretboardHeight + 50;
      const illustrationHeight = height - illustrationTop - 20;

      ctx.fillStyle = "#3f3f46";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Why fretting raises pitch (exaggerated)", width / 2, illustrationTop);

      const stringRestY = illustrationTop + illustrationHeight * 0.3;
      const fretHeight = illustrationHeight * 0.4;
      const nutX = padding + 30;
      const fretX = padding + fretboardWidth * 0.4;
      const bridgeX = padding + fretboardWidth - 30;

      // Draw fret
      ctx.fillStyle = "#d4d4d8";
      ctx.fillRect(fretX - 3, stringRestY - 5, 6, fretHeight + 10);

      // Original string position (dashed)
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(nutX, stringRestY);
      ctx.lineTo(bridgeX, stringRestY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pressed string (stretched)
      const pressDepth = fretHeight * 0.6;
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nutX, stringRestY);
      ctx.lineTo(fretX, stringRestY + pressDepth); // Pressed down to fret
      ctx.stroke();

      ctx.strokeStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(fretX, stringRestY + pressDepth);
      ctx.lineTo(bridgeX, stringRestY); // Back up to bridge
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#3f3f46";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Nut", nutX, stringRestY - 15);
      ctx.fillText("Fret", fretX, stringRestY - 15);
      ctx.fillText("Bridge", bridgeX, stringRestY - 15);

      // Explanation
      ctx.fillStyle = "#52525b";
      ctx.font = "10px system-ui";
      const explanationY = stringRestY + pressDepth + 30;
      ctx.fillText("Pressing down stretches the string, raising its pitch slightly.", width / 2, explanationY);
      ctx.fillText(
        isTrueTemperament
          ? "Curved frets compensate by adjusting fret position per string."
          : "Straight frets cannot compensate for this per-string variation.",
        width / 2,
        explanationY + 14
      );
    }
  }, [isTrueTemperament, selectedFret, showStretch]);

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
          className="w-full h-80"
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
            <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-400 ml-auto">
              <input
                type="checkbox"
                checked={showStretch}
                onChange={(e) => setShowStretch(e.target.checked)}
                className="rounded"
              />
              Show stretch diagram
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
            <span className="flex justify-between">
              <span>Highlight Fret</span>
              <span className="text-zinc-800 dark:text-zinc-400">{selectedFret}</span>
            </span>
            <input
              type="range"
              min="1"
              max="12"
              value={selectedFret}
              onChange={(e) => setSelectedFret(parseInt(e.target.value))}
              className="w-full"
            />
          </label>

          <p className="text-xs text-zinc-700 dark:text-zinc-500">
            Notice how the fret curves differently for each string. Thicker bass strings need more compensation than thin treble strings.
          </p>
        </div>
      </div>
    </div>
  );
}
