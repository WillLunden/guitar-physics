"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface EqualTemperamentSimProps {
  className?: string;
}

// Just intonation ratios for common intervals
const JUST_RATIOS: Record<string, { ratio: number; name: string }> = {
  unison: { ratio: 1 / 1, name: "Unison" },
  minor2: { ratio: 16 / 15, name: "Minor 2nd" },
  major2: { ratio: 9 / 8, name: "Major 2nd" },
  minor3: { ratio: 6 / 5, name: "Minor 3rd" },
  major3: { ratio: 5 / 4, name: "Major 3rd" },
  perfect4: { ratio: 4 / 3, name: "Perfect 4th" },
  tritone: { ratio: 45 / 32, name: "Tritone" },
  perfect5: { ratio: 3 / 2, name: "Perfect 5th" },
  minor6: { ratio: 8 / 5, name: "Minor 6th" },
  major6: { ratio: 5 / 3, name: "Major 6th" },
  minor7: { ratio: 9 / 5, name: "Minor 7th" },
  major7: { ratio: 15 / 8, name: "Major 7th" },
  octave: { ratio: 2 / 1, name: "Octave" },
};

const INTERVAL_ORDER = [
  "unison", "minor2", "major2", "minor3", "major3", "perfect4",
  "tritone", "perfect5", "minor6", "major6", "minor7", "major7", "octave"
];

// Convert ratio to cents
const ratioToCents = (ratio: number) => 1200 * Math.log2(ratio);

// Equal temperament ratio for n semitones
const equalTempRatio = (semitones: number) => Math.pow(2, semitones / 12);

export default function EqualTemperamentSim({
  className = "",
}: EqualTemperamentSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedInterval, setSelectedInterval] = useState(7); // Perfect 5th
  const [showFrets, setShowFrets] = useState(true);
  const [highlightedFret, setHighlightedFret] = useState<number | null>(null);

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

    // === SECTION 1: INTERVAL COMPARISON BAR CHART ===
    const chartHeight = height * 0.45;
    const barChartY = 30;

    ctx.fillStyle = "#3f3f46";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Interval Comparison: Just Intonation vs Equal Temperament", width / 2, 20);

    const barWidth = (width - padding * 2) / 13 - 4;
    const maxCents = 1200;

    INTERVAL_ORDER.forEach((key, i) => {
      const just = JUST_RATIOS[key];
      const justCents = ratioToCents(just.ratio);
      const equalCents = i * 100; // Each semitone = 100 cents in ET
      const diff = justCents - equalCents;

      const x = padding + i * (barWidth + 4);
      const barMaxHeight = chartHeight - 60;

      // Just intonation bar (purple)
      const justHeight = (justCents / maxCents) * barMaxHeight;
      ctx.fillStyle = i === selectedInterval ? "#7c3aed" : "rgba(124, 58, 237, 0.5)";
      ctx.fillRect(x, barChartY + barMaxHeight - justHeight + 20, barWidth / 2 - 1, justHeight);

      // Equal temperament bar (orange)
      const equalHeight = (equalCents / maxCents) * barMaxHeight;
      ctx.fillStyle = i === selectedInterval ? "#f97316" : "rgba(249, 115, 22, 0.5)";
      ctx.fillRect(x + barWidth / 2 + 1, barChartY + barMaxHeight - equalHeight + 20, barWidth / 2 - 1, equalHeight);

      // Interval label
      ctx.fillStyle = i === selectedInterval ? "#18181b" : "#71717a";
      ctx.font = i === selectedInterval ? "bold 9px system-ui" : "9px system-ui";
      ctx.textAlign = "center";
      ctx.save();
      ctx.translate(x + barWidth / 2, barChartY + barMaxHeight + 35);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(just.name, 0, 0);
      ctx.restore();

      // Difference in cents (for selected)
      if (i === selectedInterval && i > 0) {
        ctx.fillStyle = diff > 0 ? "#dc2626" : diff < 0 ? "#2563eb" : "#16a34a";
        ctx.font = "bold 10px system-ui";
        ctx.textAlign = "center";
        const diffText = diff > 0 ? `+${diff.toFixed(1)}¢` : `${diff.toFixed(1)}¢`;
        ctx.fillText(diffText, x + barWidth / 2, barChartY + 15);
      }
    });

    // Legend
    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(padding, barChartY + chartHeight - 15, 12, 12);
    ctx.fillStyle = "#3f3f46";
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Just Intonation", padding + 16, barChartY + chartHeight - 5);

    ctx.fillStyle = "#f97316";
    ctx.fillRect(padding + 110, barChartY + chartHeight - 15, 12, 12);
    ctx.fillStyle = "#3f3f46";
    ctx.fillText("Equal Temperament", padding + 126, barChartY + chartHeight - 5);

    // === SECTION 2: FRETBOARD VISUALIZATION ===
    if (showFrets) {
      const fretboardY = chartHeight + 50;
      const fretboardHeight = height - fretboardY - 60;
      const fretboardWidth = width - padding * 2;

      ctx.fillStyle = "#3f3f46";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Guitar Fretboard: Fret Positions from Equal Temperament", width / 2, fretboardY - 10);

      // Nut
      ctx.fillStyle = "#e4e4e7";
      ctx.fillRect(padding - 5, fretboardY, 8, fretboardHeight);

      // Fretboard wood
      ctx.fillStyle = "#78716c";
      ctx.fillRect(padding, fretboardY, fretboardWidth, fretboardHeight);

      // Calculate and draw frets
      const scaleLength = fretboardWidth;
      const numFrets = 12;

      for (let fret = 1; fret <= numFrets; fret++) {
        // Fret position: distance from nut = L * (1 - 1/2^(n/12))
        const fretDistance = scaleLength * (1 - 1 / Math.pow(2, fret / 12));
        const fretX = padding + fretDistance;

        const isHighlighted = highlightedFret === fret || fret === selectedInterval;

        // Fret wire
        ctx.fillStyle = isHighlighted ? "#f97316" : "#d4d4d8";
        ctx.fillRect(fretX - 1.5, fretboardY, 3, fretboardHeight);

        // Fret number
        ctx.fillStyle = isHighlighted ? "#f97316" : "#71717a";
        ctx.font = isHighlighted ? "bold 11px system-ui" : "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${fret}`, fretX, fretboardY + fretboardHeight + 15);

        // Fret position as fraction
        if (isHighlighted) {
          const ratio = equalTempRatio(fret);
          ctx.fillStyle = "#f97316";
          ctx.font = "10px system-ui";
          ctx.fillText(`f × ${ratio.toFixed(4)}`, fretX, fretboardY - 25);
        }
      }

      // Fret markers (dots at 3, 5, 7, 9, 12)
      const markerFrets = [3, 5, 7, 9];
      markerFrets.forEach((fret) => {
        const prevFretDist = scaleLength * (1 - 1 / Math.pow(2, (fret - 1) / 12));
        const fretDist = scaleLength * (1 - 1 / Math.pow(2, fret / 12));
        const markerX = padding + (prevFretDist + fretDist) / 2;
        ctx.fillStyle = "#52525b";
        ctx.beginPath();
        ctx.arc(markerX, fretboardY + fretboardHeight / 2, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Double dot at 12
      const fret11Dist = scaleLength * (1 - 1 / Math.pow(2, 11 / 12));
      const fret12Dist = scaleLength * (1 - 1 / Math.pow(2, 12 / 12));
      const marker12X = padding + (fret11Dist + fret12Dist) / 2;
      ctx.fillStyle = "#52525b";
      ctx.beginPath();
      ctx.arc(marker12X, fretboardY + fretboardHeight / 3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(marker12X, fretboardY + (2 * fretboardHeight) / 3, 5, 0, Math.PI * 2);
      ctx.fill();

      // Strings
      const numStrings = 6;
      for (let s = 0; s < numStrings; s++) {
        const stringY = fretboardY + (s + 0.5) * (fretboardHeight / numStrings);
        const thickness = 1 + s * 0.3;
        ctx.strokeStyle = "#d4d4d8";
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(padding, stringY);
        ctx.lineTo(padding + fretboardWidth, stringY);
        ctx.stroke();
      }

      // Open string to 12th fret annotation
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const annotY = fretboardY + fretboardHeight + 35;
      ctx.beginPath();
      ctx.moveTo(padding, annotY);
      ctx.lineTo(padding + fret12Dist, annotY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#7c3aed";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("12th fret = ½ scale length (octave)", padding + fret12Dist / 2, annotY + 12);
    }
  }, [selectedInterval, showFrets, highlightedFret]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  const selectedJust = JUST_RATIOS[INTERVAL_ORDER[selectedInterval]];
  const justCents = ratioToCents(selectedJust.ratio);
  const equalCents = selectedInterval * 100;
  const diff = justCents - equalCents;

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-96"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const padding = 40;
            const fretboardWidth = width - padding * 2;
            const scaleLength = fretboardWidth;

            // Check if hovering over frets
            for (let fret = 1; fret <= 12; fret++) {
              const fretDistance = scaleLength * (1 - 1 / Math.pow(2, fret / 12));
              const fretX = padding + fretDistance;
              if (Math.abs(x - fretX) < 15) {
                setHighlightedFret(fret);
                return;
              }
            }
            setHighlightedFret(null);
          }}
          onMouseLeave={() => setHighlightedFret(null)}
          aria-label="Equal temperament visualization"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={showFrets}
                onChange={(e) => setShowFrets(e.target.checked)}
                className="rounded"
              />
              Show Fretboard
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-800 dark:text-zinc-400">
              Select Interval: <span className="font-medium text-zinc-900 dark:text-zinc-200">{selectedJust.name}</span>
            </label>
            <input
              type="range"
              min="0"
              max="12"
              value={selectedInterval}
              onChange={(e) => setSelectedInterval(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {selectedInterval > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-purple-600 dark:text-purple-400 text-xs">Just Ratio</div>
                <div className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                  {selectedJust.ratio === Math.floor(selectedJust.ratio)
                    ? `${selectedJust.ratio}/1`
                    : `${Math.round(selectedJust.ratio * 1000) / 1000}`
                  }
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="text-orange-600 dark:text-orange-400 text-xs">ET Ratio</div>
                <div className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                  2^({selectedInterval}/12)
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-purple-600 dark:text-purple-400 text-xs">Just (cents)</div>
                <div className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                  {justCents.toFixed(1)}¢
                </div>
              </div>
              <div className={`p-3 rounded-lg ${Math.abs(diff) < 5 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                <div className={`text-xs ${Math.abs(diff) < 5 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  Difference
                </div>
                <div className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                  {diff > 0 ? "+" : ""}{diff.toFixed(1)}¢
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
