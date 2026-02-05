"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MultiscaleSimProps {
  className?: string;
}

// Standard tuning frequencies (Hz) for 8-string guitar (F#-B-E-A-D-G-B-E)
const STRING_TUNING = [
  { note: "F#1", freq: 46.25 },
  { note: "B1", freq: 61.74 },
  { note: "E2", freq: 82.41 },
  { note: "A2", freq: 110.0 },
  { note: "D3", freq: 146.83 },
  { note: "G3", freq: 196.0 },
  { note: "B3", freq: 246.94 },
  { note: "E4", freq: 329.63 },
];

// Common gauge sets (in inches) - 8-string extended range
const GAUGE_SETS = {
  "9": {
    label: "9-42 (Super Light)",
    // F#1,  B1,    E2,    A2,    D3,    G3,    B3,    E4
    gauges: [0.065, 0.054, 0.042, 0.032, 0.024, 0.016, 0.011, 0.009],
  },
  "10": {
    label: "10-46 (Regular)",
    gauges: [0.074, 0.059, 0.046, 0.036, 0.026, 0.017, 0.013, 0.010],
  },
  "11": {
    label: "11-49 (Medium)",
    gauges: [0.080, 0.064, 0.049, 0.038, 0.028, 0.018, 0.014, 0.011],
  },
} as const;

type GaugeSetKey = keyof typeof GAUGE_SETS;

// Calculate tension: T = 4 * L² * f² * μ
// μ (linear mass density) ≈ gauge² * constant for steel strings
const calculateTension = (scaleLength: number, frequency: number, gauge: number) => {
  // Scale length in meters, gauge in inches
  const L = scaleLength * 0.0254; // inches to meters
  const mu = Math.pow(gauge, 2) * 3.14; // Approximation for steel strings (kg/m)
  const T = 4 * L * L * frequency * frequency * mu;
  return T * 0.2248; // Convert to pounds
};

export default function MultiscaleSim({ className = "" }: MultiscaleSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMultiscale, setIsMultiscale] = useState(true);
  const [bassScale, setBassScale] = useState(28.0);
  const [trebleScale, setTrebleScale] = useState(25.5);
  const [standardScale, setStandardScale] = useState(25.5);
  const [gaugeSet, setGaugeSet] = useState<GaugeSetKey>("10");

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

    const padding = 30;

    // === FRETBOARD VISUALIZATION ===
    const fretboardHeight = height * 0.45;
    const fretboardTop = 20;
    const availableWidth = width - padding * 2;

    // Scale length is 2x so 12th fret lands at the edge (12th fret = half of scale)
    const numFrets = 12;
    const fret12Ratio = 1 - 1 / Math.pow(2, 12 / 12); // = 0.5

    // Calculate scale difference for title display
    const scaleDiff = bassScale - trebleScale;

    // Title
    ctx.fillStyle = "#3f3f46";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    const fanDirection = scaleDiff > 0.1 ? "(Normal Fan)" : scaleDiff < -0.1 ? "(Reverse Fan)" : "(Parallel)";
    ctx.fillText(
      isMultiscale ? `Multiscale / Fanned Frets ${fanDirection}` : "Standard Scale",
      width / 2,
      12
    );

    // Fretboard background
    ctx.fillStyle = "#78716c";
    ctx.beginPath();
    if (isMultiscale) {
      // For multiscale, calculate positions based on actual scale length ratio
      // Both scales share the same 12th fret position (perpendicular point)
      const center12thX = padding + availableWidth;

      // Calculate nut positions: nut is at 12th fret minus half the scale
      // Since 12th fret = 0.5 * scale, nut is at 12thFret - 0.5 * scalePixels
      const avgScale = (bassScale + trebleScale) / 2;
      const bassScalePixels = (bassScale / avgScale) * availableWidth * 2;
      const trebleScalePixels = (trebleScale / avgScale) * availableWidth * 2;

      const bassNutX = center12thX - fret12Ratio * bassScalePixels;
      const trebleNutX = center12thX - fret12Ratio * trebleScalePixels;
      const bass12thX = center12thX;
      const treble12thX = center12thX;

      ctx.moveTo(trebleNutX, fretboardTop);
      ctx.lineTo(bassNutX, fretboardTop + fretboardHeight);
      ctx.lineTo(bass12thX, fretboardTop + fretboardHeight);
      ctx.lineTo(treble12thX, fretboardTop);
      ctx.closePath();
    } else {
      const fretboardWidth = availableWidth; // 12th fret at right edge
      ctx.rect(padding, fretboardTop, fretboardWidth, fretboardHeight);
    }
    ctx.fill();

    // Draw frets
    for (let fret = 0; fret <= numFrets; fret++) {
      const fretRatio = 1 - 1 / Math.pow(2, fret / 12);

      if (isMultiscale) {
        // Calculate fret positions using same logic as fretboard background
        const center12thX = padding + availableWidth;
        const avgScale = (bassScale + trebleScale) / 2;
        const bassScalePixels = (bassScale / avgScale) * availableWidth * 2;
        const trebleScalePixels = (trebleScale / avgScale) * availableWidth * 2;

        const bassNutX = center12thX - fret12Ratio * bassScalePixels;
        const trebleNutX = center12thX - fret12Ratio * trebleScalePixels;

        const bassFretX = bassNutX + fretRatio * bassScalePixels;
        const trebleFretX = trebleNutX + fretRatio * trebleScalePixels;

        ctx.strokeStyle = fret === 0 ? "#e4e4e7" : "#d4d4d8";
        ctx.lineWidth = fret === 0 ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(trebleFretX, fretboardTop);
        ctx.lineTo(bassFretX, fretboardTop + fretboardHeight);
        ctx.stroke();

        // Fret number
        if (fret > 0) {
          ctx.fillStyle = "#52525b";
          ctx.font = "9px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(`${fret}`, (bassFretX + trebleFretX) / 2, fretboardTop + fretboardHeight + 12);
        }
      } else {
        // Standard scale: 12th fret at right edge of available width
        const scalePixels = availableWidth * 2;
        const fretX = padding + fretRatio * scalePixels;

        ctx.strokeStyle = fret === 0 ? "#e4e4e7" : "#d4d4d8";
        ctx.lineWidth = fret === 0 ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(fretX, fretboardTop);
        ctx.lineTo(fretX, fretboardTop + fretboardHeight);
        ctx.stroke();

        if (fret > 0) {
          ctx.fillStyle = "#52525b";
          ctx.font = "9px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(`${fret}`, fretX, fretboardTop + fretboardHeight + 12);
        }
      }
    }

    // Draw strings
    const numStrings = STRING_TUNING.length;
    for (let s = 0; s < numStrings; s++) {
      const stringY = fretboardTop + ((s + 0.5) / numStrings) * fretboardHeight;
      const thickness = 1 + s * 0.4;

      // Get scale length for this string
      const stringScale = isMultiscale
        ? trebleScale + (bassScale - trebleScale) * (s / (numStrings - 1))
        : standardScale;

      // Color based on tension (relative to ideal ~17 lbs)
      const gauge = GAUGE_SETS[gaugeSet].gauges[s];
      const tension = calculateTension(stringScale, STRING_TUNING[s].freq, gauge);
      const idealTension = 17;
      const tensionRatio = tension / idealTension;

      let color;
      if (tensionRatio < 0.8) {
        color = "#3b82f6"; // Too loose - blue
      } else if (tensionRatio > 1.2) {
        color = "#ef4444"; // Too tight - red
      } else {
        color = "#22c55e"; // Good range - green
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.beginPath();

      if (isMultiscale) {
        // Use same calculations as fretboard
        const center12thX = padding + availableWidth;
        const avgScale = (bassScale + trebleScale) / 2;
        const bassScalePixels = (bassScale / avgScale) * availableWidth * 2;
        const trebleScalePixels = (trebleScale / avgScale) * availableWidth * 2;

        const bassNutX = center12thX - fret12Ratio * bassScalePixels;
        const trebleNutX = center12thX - fret12Ratio * trebleScalePixels;
        const bass12thX = center12thX;
        const treble12thX = center12thX;

        const nutX = trebleNutX + (bassNutX - trebleNutX) * (s / (numStrings - 1));
        const endX = treble12thX + (bass12thX - treble12thX) * (s / (numStrings - 1));

        ctx.moveTo(nutX, stringY);
        ctx.lineTo(endX, stringY);
      } else {
        const scalePixels = availableWidth * 2;
        const fret12X = padding + fret12Ratio * scalePixels;
        ctx.moveTo(padding, stringY);
        ctx.lineTo(fret12X, stringY);
      }
      ctx.stroke();

      // String label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "10px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(STRING_TUNING[s].note, padding - 8, stringY + 4);
    }

    // Nut and 12th fret labels
    ctx.fillStyle = "#3f3f46";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    if (isMultiscale) {
      // Calculate nut positions for labels
      const center12thX = padding + availableWidth;
      const avgScale = (bassScale + trebleScale) / 2;
      const bassScalePixels = (bassScale / avgScale) * availableWidth * 2;
      const trebleScalePixels = (trebleScale / avgScale) * availableWidth * 2;
      const bassNutX = center12thX - fret12Ratio * bassScalePixels;
      const trebleNutX = center12thX - fret12Ratio * trebleScalePixels;

      ctx.fillText("Nut", (bassNutX + trebleNutX) / 2, fretboardTop - 5);
      ctx.fillText("12th fret", center12thX, fretboardTop - 5);
    } else {
      ctx.fillText("Nut", padding, fretboardTop - 5);
      ctx.fillText("12th fret", padding + availableWidth, fretboardTop - 5);
    }

    // === TENSION COMPARISON CHART ===
    const chartTop = fretboardTop + fretboardHeight + 40;
    const chartHeight = height - chartTop - 40;
    const barWidth = (width - padding * 2) / numStrings - 10;

    ctx.fillStyle = "#3f3f46";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("String Tension Comparison (lbs)", width / 2, chartTop - 5);

    // Ideal tension range indicator
    const maxTension = 25;
    const chartBottom = chartTop + chartHeight;
    const idealLow = 14;
    const idealHigh = 20;

    const idealLowY = chartBottom - (idealLow / maxTension) * chartHeight;
    const idealHighY = chartBottom - (idealHigh / maxTension) * chartHeight;

    ctx.fillStyle = "rgba(34, 197, 94, 0.1)";
    ctx.fillRect(padding, idealHighY, width - padding * 2, idealLowY - idealHighY);

    ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padding, idealHighY);
    ctx.lineTo(width - padding, idealHighY);
    ctx.moveTo(padding, idealLowY);
    ctx.lineTo(width - padding, idealLowY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#22c55e";
    ctx.font = "9px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Ideal range", padding + 5, idealHighY + 10);

    // Draw tension bars
    for (let s = 0; s < numStrings; s++) {
      const stringScale = isMultiscale
        ? trebleScale + (bassScale - trebleScale) * (s / (numStrings - 1))
        : standardScale;

      const gauge = GAUGE_SETS[gaugeSet].gauges[s];
      const tension = calculateTension(stringScale, STRING_TUNING[s].freq, gauge);
      const barHeight = (tension / maxTension) * chartHeight;
      const barX = padding + s * (barWidth + 10) + 5;

      // Bar color
      const idealTension = 17;
      const tensionRatio = tension / idealTension;
      let barColor;
      if (tensionRatio < 0.8) {
        barColor = "#3b82f6";
      } else if (tensionRatio > 1.2) {
        barColor = "#ef4444";
      } else {
        barColor = "#22c55e";
      }

      ctx.fillStyle = barColor;
      ctx.fillRect(barX, chartBottom - barHeight, barWidth, barHeight);

      // Tension value
      ctx.fillStyle = "#3f3f46";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${tension.toFixed(1)}`, barX + barWidth / 2, chartBottom - barHeight - 5);

      // String note
      ctx.fillText(STRING_TUNING[s].note, barX + barWidth / 2, chartBottom + 12);

      // Scale length for this string
      ctx.fillStyle = "#52525b";
      ctx.font = "9px system-ui";
      ctx.fillText(`${stringScale.toFixed(1)}"`, barX + barWidth / 2, chartBottom + 24);
    }

    // Y-axis
    ctx.strokeStyle = "#d4d4d8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, chartTop);
    ctx.lineTo(padding, chartBottom);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = "#52525b";
    ctx.font = "9px system-ui";
    ctx.textAlign = "right";
    for (let t = 0; t <= maxTension; t += 5) {
      const y = chartBottom - (t / maxTension) * chartHeight;
      ctx.fillText(`${t}`, padding - 5, y + 3);
    }
  }, [isMultiscale, bassScale, trebleScale, standardScale, gaugeSet]);

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
          className="w-full h-[480px]"
          aria-label="Multiscale guitar visualization"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsMultiscale(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isMultiscale
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300"
              }`}
            >
              Standard Scale
            </button>
            <button
              onClick={() => setIsMultiscale(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isMultiscale
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300"
              }`}
            >
              Multiscale
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">String Gauge:</span>
            {(Object.keys(GAUGE_SETS) as GaugeSetKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setGaugeSet(key)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  gaugeSet === key
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300"
                }`}
              >
                {GAUGE_SETS[key].label}
              </button>
            ))}
          </div>

          {isMultiscale ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
                <span className="flex justify-between">
                  <span>Bass Scale Length</span>
                  <span className="text-zinc-800 dark:text-zinc-400">{bassScale.toFixed(1)}&quot;</span>
                </span>
                <input
                  type="range"
                  min="24"
                  max="32"
                  step="0.25"
                  value={bassScale}
                  onChange={(e) => setBassScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
                <span className="flex justify-between">
                  <span>Treble Scale Length</span>
                  <span className="text-zinc-800 dark:text-zinc-400">{trebleScale.toFixed(1)}&quot;</span>
                </span>
                <input
                  type="range"
                  min="24"
                  max="30"
                  step="0.25"
                  value={trebleScale}
                  onChange={(e) => setTrebleScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </label>
            </div>
          ) : (
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Scale Length</span>
                <span className="text-zinc-800 dark:text-zinc-400">{standardScale.toFixed(1)}&quot;</span>
              </span>
              <input
                type="range"
                min="22"
                max="30"
                step="0.25"
                value={standardScale}
                onChange={(e) => setStandardScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
          )}

          <div className="flex gap-4 text-xs text-zinc-700 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500" /> Good tension
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500" /> Too loose
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500" /> Too tight
            </span>
          </div>

          {isMultiscale && (
            <p className="text-xs text-zinc-600 dark:text-zinc-500">
              {bassScale > trebleScale ? (
                <>
                  <strong>Normal fan:</strong> Longer bass scale increases tension on low strings.
                  Try setting treble {`>`} bass for a reverse fan.
                </>
              ) : bassScale < trebleScale ? (
                <>
                  <strong>Reverse fan:</strong> Longer treble scale (unusual). This would increase
                  tension on high strings instead.
                </>
              ) : (
                <>
                  <strong>Parallel frets:</strong> Both scales equal — same as standard straight frets.
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
