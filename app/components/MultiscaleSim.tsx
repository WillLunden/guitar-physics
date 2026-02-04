"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MultiscaleSimProps {
  className?: string;
}

// Standard tuning frequencies (Hz) for 6-string guitar
const STRING_FREQUENCIES = [
  { note: "E2", freq: 82.41, gauge: 0.046 },
  { note: "A2", freq: 110.0, gauge: 0.036 },
  { note: "D3", freq: 146.83, gauge: 0.026 },
  { note: "G3", freq: 196.0, gauge: 0.017 },
  { note: "B3", freq: 246.94, gauge: 0.013 },
  { note: "E4", freq: 329.63, gauge: 0.010 },
];

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
  const [bassScale, setBassScale] = useState(27.0);
  const [trebleScale, setTrebleScale] = useState(25.5);
  const [standardScale, setStandardScale] = useState(25.5);

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
    const fretboardWidth = width - padding * 2;

    // Title
    ctx.fillStyle = "#3f3f46";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      isMultiscale ? "Multiscale / Fanned Frets" : "Standard Scale",
      width / 2,
      12
    );

    // Fretboard background
    ctx.fillStyle = "#78716c";
    ctx.beginPath();
    if (isMultiscale) {
      // Fanned shape
      const bassNutX = padding + 20;
      const trebleNutX = padding;
      const bassBridgeX = padding + fretboardWidth;
      const trebleBridgeX = padding + fretboardWidth - 30;

      ctx.moveTo(trebleNutX, fretboardTop);
      ctx.lineTo(bassNutX, fretboardTop + fretboardHeight);
      ctx.lineTo(bassBridgeX, fretboardTop + fretboardHeight);
      ctx.lineTo(trebleBridgeX, fretboardTop);
      ctx.closePath();
    } else {
      ctx.rect(padding, fretboardTop, fretboardWidth, fretboardHeight);
    }
    ctx.fill();

    // Draw frets
    const numFrets = 12;
    for (let fret = 0; fret <= numFrets; fret++) {
      if (isMultiscale) {
        // Calculate fret positions for each string
        const bassNutX = padding + 20;
        const trebleNutX = padding;
        const bassScalePixels = fretboardWidth - 20;
        const trebleScalePixels = fretboardWidth - 30;

        const bassFretRatio = 1 - 1 / Math.pow(2, fret / 12);
        const trebleFretRatio = 1 - 1 / Math.pow(2, fret / 12);

        const bassFretX = bassNutX + bassFretRatio * bassScalePixels;
        const trebleFretX = trebleNutX + trebleFretRatio * trebleScalePixels;

        ctx.strokeStyle = fret === 0 ? "#e4e4e7" : "#d4d4d8";
        ctx.lineWidth = fret === 0 ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(trebleFretX, fretboardTop);
        ctx.lineTo(bassFretX, fretboardTop + fretboardHeight);
        ctx.stroke();

        // Fret number
        if (fret > 0 && fret <= 12) {
          ctx.fillStyle = "#52525b";
          ctx.font = "9px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(`${fret}`, (bassFretX + trebleFretX) / 2, fretboardTop + fretboardHeight + 12);
        }
      } else {
        const fretRatio = 1 - 1 / Math.pow(2, fret / 12);
        const fretX = padding + fretRatio * fretboardWidth;

        ctx.strokeStyle = fret === 0 ? "#e4e4e7" : "#d4d4d8";
        ctx.lineWidth = fret === 0 ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(fretX, fretboardTop);
        ctx.lineTo(fretX, fretboardTop + fretboardHeight);
        ctx.stroke();

        if (fret > 0 && fret <= 12) {
          ctx.fillStyle = "#52525b";
          ctx.font = "9px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(`${fret}`, fretX, fretboardTop + fretboardHeight + 12);
        }
      }
    }

    // Draw strings
    const numStrings = 6;
    for (let s = 0; s < numStrings; s++) {
      const stringY = fretboardTop + ((s + 0.5) / numStrings) * fretboardHeight;
      const thickness = 1 + s * 0.4;

      // Get scale length for this string
      const stringScale = isMultiscale
        ? trebleScale + (bassScale - trebleScale) * (s / (numStrings - 1))
        : standardScale;

      // Color based on tension (relative to ideal ~17 lbs)
      const tension = calculateTension(stringScale, STRING_FREQUENCIES[s].freq, STRING_FREQUENCIES[s].gauge);
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
        const bassNutX = padding + 20;
        const trebleNutX = padding;
        const bassBridgeX = padding + fretboardWidth;
        const trebleBridgeX = padding + fretboardWidth - 30;

        const nutX = trebleNutX + (bassNutX - trebleNutX) * (s / (numStrings - 1));
        const bridgeX = trebleBridgeX + (bassBridgeX - trebleBridgeX) * (s / (numStrings - 1));

        ctx.moveTo(nutX, stringY);
        ctx.lineTo(bridgeX, stringY);
      } else {
        ctx.moveTo(padding, stringY);
        ctx.lineTo(padding + fretboardWidth, stringY);
      }
      ctx.stroke();

      // String label
      ctx.fillStyle = "#3f3f46";
      ctx.font = "10px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(STRING_FREQUENCIES[s].note, padding - 8, stringY + 4);
    }

    // Nut and Bridge labels
    ctx.fillStyle = "#3f3f46";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    if (isMultiscale) {
      ctx.fillText("Nut", padding + 10, fretboardTop - 5);
      ctx.fillText("Bridge", width - padding - 15, fretboardTop - 5);
    } else {
      ctx.fillText("Nut", padding, fretboardTop - 5);
      ctx.fillText("Bridge", width - padding, fretboardTop - 5);
    }

    // === TENSION COMPARISON CHART ===
    const chartTop = fretboardTop + fretboardHeight + 40;
    const chartHeight = height - chartTop - 40;
    const barWidth = (width - padding * 2) / 6 - 10;

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

      const tension = calculateTension(stringScale, STRING_FREQUENCIES[s].freq, STRING_FREQUENCIES[s].gauge);
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
      ctx.fillText(STRING_FREQUENCIES[s].note, barX + barWidth / 2, chartBottom + 12);

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
  }, [isMultiscale, bassScale, trebleScale, standardScale]);

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
          className="w-full h-96"
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

          {isMultiscale ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
                <span className="flex justify-between">
                  <span>Bass Scale Length</span>
                  <span className="text-zinc-800 dark:text-zinc-400">{bassScale.toFixed(1)}&quot;</span>
                </span>
                <input
                  type="range"
                  min="25"
                  max="30"
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
                  max="27"
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
                min="24"
                max="27"
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
        </div>
      </div>
    </div>
  );
}
