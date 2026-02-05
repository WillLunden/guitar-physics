"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface EqualTemperamentSimProps {
  className?: string;
}

// Just intonation ratios for intervals (semitones 0-12)
const JUST_RATIOS = [
  { ratio: 1, name: "Unison" },
  { ratio: 16 / 15, name: "Minor 2nd" },
  { ratio: 9 / 8, name: "Major 2nd" },
  { ratio: 6 / 5, name: "Minor 3rd" },
  { ratio: 5 / 4, name: "Major 3rd" },
  { ratio: 4 / 3, name: "Perfect 4th" },
  { ratio: 45 / 32, name: "Tritone" },
  { ratio: 3 / 2, name: "Perfect 5th" },
  { ratio: 8 / 5, name: "Minor 6th" },
  { ratio: 5 / 3, name: "Major 6th" },
  { ratio: 9 / 5, name: "Minor 7th" },
  { ratio: 15 / 8, name: "Major 7th" },
  { ratio: 2, name: "Octave" },
];

// Guitar strings with their tuning relative to low E using just intervals
// Standard tuning: E A D G B E
const STRINGS = [
  { name: "E", label: "Low E", justRatio: 1, semitones: 0 },
  { name: "A", label: "A", justRatio: 4 / 3, semitones: 5 }, // Perfect 4th
  { name: "D", label: "D", justRatio: (4 / 3) * (4 / 3), semitones: 10 }, // Two P4ths
  { name: "G", label: "G", justRatio: (4 / 3) * (4 / 3) * (4 / 3), semitones: 15 }, // Three P4ths
  { name: "B", label: "B", justRatio: (4 / 3) * (4 / 3) * (4 / 3) * (5 / 4), semitones: 19 }, // + M3rd
  { name: "e", label: "High E", justRatio: (4 / 3) * (4 / 3) * (4 / 3) * (5 / 4) * (4 / 3), semitones: 24 }, // + P4th
];

// Convert ratio to cents
const ratioToCents = (ratio: number) => 1200 * Math.log2(ratio);

// Equal temperament ratio for n semitones
const equalTempRatio = (semitones: number) => Math.pow(2, semitones / 12);

// Get fret position ratio based on tuning mode
const getFretRatio = (fret: number, useJust: boolean) => {
  if (useJust) {
    return JUST_RATIOS[fret].ratio;
  }
  return equalTempRatio(fret);
};

export default function EqualTemperamentSim({
  className = "",
}: EqualTemperamentSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tuningMode, setTuningMode] = useState<"ET" | number>("ET"); // "ET" or string index (0-5)
  const [selectedString, setSelectedString] = useState(0); // Which string to analyze
  const [selectedInterval, setSelectedInterval] = useState(7); // Perfect 5th
  const [highlightedFret, setHighlightedFret] = useState<number | null>(null);

  const useJust = tuningMode !== "ET";
  const referenceString = typeof tuningMode === "number" ? tuningMode : 0;

  // Calculate the interval deviation for a given string and fret
  const getIntervalDeviation = useCallback(
    (stringIndex: number, fret: number) => {
      if (fret === 0) return 0;

      // The fret position determines the ratio we GET
      const fretRatio = getFretRatio(fret, useJust);

      // The ratio we WANT is the just ratio for this interval
      const wantRatio = JUST_RATIOS[fret].ratio;

      // In ET mode, deviation is simply ET vs Just
      if (!useJust) {
        return ratioToCents(fretRatio) - ratioToCents(wantRatio);
      }

      // In Just mode, we need to account for string tuning differences
      // If viewing the reference string, frets are perfect
      if (stringIndex === referenceString) {
        return 0;
      }

      // For other strings, calculate the cumulative error
      // The string is tuned using just intervals from low E
      // But the frets are positioned for the reference string
      const stringJustRatio = STRINGS[stringIndex].justRatio;
      const refStringJustRatio = STRINGS[referenceString].justRatio;

      // The note we get: string open * fret ratio
      // The note we want: would need fret at just ratio position relative to THIS string
      // But frets are positioned for the reference string

      // Calculate what ratio we actually get vs what we want
      // The deviation comes from the difference in how intervals stack
      const stringOffsetFromRef = stringJustRatio / refStringJustRatio;
      const stringOffsetET = equalTempRatio(
        STRINGS[stringIndex].semitones - STRINGS[referenceString].semitones
      );

      // The error accumulates from the string tuning difference
      const tuningError = ratioToCents(stringOffsetFromRef / stringOffsetET);

      return tuningError;
    },
    [useJust, referenceString]
  );

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

    const modeLabel = useJust
      ? `Just Intonation (ref: ${STRINGS[referenceString].label})`
      : "Equal Temperament";
    const stringLabel = STRINGS[selectedString].label;

    ctx.fillStyle = "#3f3f46";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      `Intervals on ${stringLabel} String — ${modeLabel}`,
      width / 2,
      20
    );

    const barWidth = (width - padding * 2) / 13 - 4;
    const maxCents = 1200;

    // Calculate string tuning deviation for display
    const stringDeviation = getIntervalDeviation(selectedString, 1) !== 0
      ? getIntervalDeviation(selectedString, 7) // Use P5 as reference
      : 0;

    JUST_RATIOS.forEach((interval, i) => {
      const justCents = ratioToCents(interval.ratio);
      const gotRatio = getFretRatio(i, useJust);
      const gotCents = ratioToCents(gotRatio);

      // Calculate effective deviation for this string
      const baseDeviation = gotCents - justCents;
      const stringTuningError =
        useJust && selectedString !== referenceString
          ? getIntervalDeviation(selectedString, i)
          : 0;
      const totalDeviation = baseDeviation + stringTuningError;

      const x = padding + i * (barWidth + 4);
      const barMaxHeight = chartHeight - 60;

      // Just intonation bar (purple) - what we WANT
      const justHeight = (justCents / maxCents) * barMaxHeight;
      ctx.fillStyle =
        i === selectedInterval ? "#7c3aed" : "rgba(124, 58, 237, 0.5)";
      ctx.fillRect(
        x,
        barChartY + barMaxHeight - justHeight + 20,
        barWidth / 2 - 1,
        justHeight
      );

      // Actual bar (orange/green) - what we GET
      const actualCents = justCents + totalDeviation;
      const actualHeight = (Math.max(0, actualCents) / maxCents) * barMaxHeight;
      const isClose = Math.abs(totalDeviation) < 5;
      ctx.fillStyle =
        i === selectedInterval
          ? isClose
            ? "#22c55e"
            : "#f97316"
          : isClose
          ? "rgba(34, 197, 94, 0.5)"
          : "rgba(249, 115, 22, 0.5)";
      ctx.fillRect(
        x + barWidth / 2 + 1,
        barChartY + barMaxHeight - actualHeight + 20,
        barWidth / 2 - 1,
        actualHeight
      );

      // Interval label
      ctx.fillStyle = i === selectedInterval ? "#18181b" : "#71717a";
      ctx.font = i === selectedInterval ? "bold 9px system-ui" : "9px system-ui";
      ctx.textAlign = "center";
      ctx.save();
      ctx.translate(x + barWidth / 2, barChartY + barMaxHeight + 35);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(interval.name, 0, 0);
      ctx.restore();

      // Difference in cents (for selected)
      if (i === selectedInterval && i > 0) {
        ctx.fillStyle =
          Math.abs(totalDeviation) < 2
            ? "#16a34a"
            : totalDeviation > 0
            ? "#dc2626"
            : "#2563eb";
        ctx.font = "bold 10px system-ui";
        ctx.textAlign = "center";
        const diffText =
          totalDeviation > 0
            ? `+${totalDeviation.toFixed(1)}¢`
            : `${totalDeviation.toFixed(1)}¢`;
        ctx.fillText(diffText, x + barWidth / 2, barChartY + 15);
      }
    });

    // Legend
    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(padding, barChartY + chartHeight - 15, 12, 12);
    ctx.fillStyle = "#3f3f46";
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Target (Just)", padding + 16, barChartY + chartHeight - 5);

    ctx.fillStyle = "#f97316";
    ctx.fillRect(padding + 100, barChartY + chartHeight - 15, 12, 12);
    ctx.fillStyle = "#3f3f46";
    ctx.fillText("Actual", padding + 116, barChartY + chartHeight - 5);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(padding + 170, barChartY + chartHeight - 15, 12, 12);
    ctx.fillStyle = "#3f3f46";
    ctx.fillText("< 5¢ error", padding + 186, barChartY + chartHeight - 5);

    // === SECTION 2: FRETBOARD VISUALIZATION ===
    const fretboardY = chartHeight + 50;
    const fretboardHeight = height - fretboardY - 60;
    const availableWidth = width - padding * 2;

    // Scale length is 2x the visible fretboard so 12th fret lands at the edge
    const scaleLength = availableWidth * 2;
    const fret12Pos = scaleLength * (1 - 1 / getFretRatio(12, useJust));
    const fretboardWidth = scaleLength * (1 - 1 / 2); // Always show to 12th fret position

    ctx.fillStyle = "#3f3f46";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(
      `Fretboard: ${useJust ? "Just Intonation" : "Equal Temperament"} Fret Positions`,
      width / 2,
      fretboardY - 10
    );

    // Nut
    ctx.fillStyle = "#e4e4e7";
    ctx.fillRect(padding - 5, fretboardY, 8, fretboardHeight);

    // Fretboard wood
    ctx.fillStyle = "#78716c";
    ctx.fillRect(padding, fretboardY, fretboardWidth, fretboardHeight);

    // Calculate and draw frets
    const numFrets = 12;

    for (let fret = 1; fret <= numFrets; fret++) {
      // Fret position based on tuning mode
      const fretRatio = getFretRatio(fret, useJust);
      const fretDistance = scaleLength * (1 - 1 / fretRatio);
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

      // Show ratio for highlighted fret
      if (isHighlighted) {
        ctx.fillStyle = "#f97316";
        ctx.font = "10px system-ui";
        const ratioText = useJust
          ? `${JUST_RATIOS[fret].name}`
          : `2^(${fret}/12)`;
        ctx.fillText(ratioText, fretX, fretboardY - 25);
      }
    }

    // Fret markers (dots at 3, 5, 7, 9)
    const markerFrets = [3, 5, 7, 9];
    markerFrets.forEach((fret) => {
      const prevFretRatio = getFretRatio(fret - 1, useJust);
      const fretRatio = getFretRatio(fret, useJust);
      const prevFretDist = scaleLength * (1 - 1 / prevFretRatio);
      const fretDist = scaleLength * (1 - 1 / fretRatio);
      const markerX = padding + (prevFretDist + fretDist) / 2;
      ctx.fillStyle = "#52525b";
      ctx.beginPath();
      ctx.arc(markerX, fretboardY + fretboardHeight / 2, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Double dot at 12
    const fret11Ratio = getFretRatio(11, useJust);
    const fret12Ratio = getFretRatio(12, useJust);
    const fret11Dist = scaleLength * (1 - 1 / fret11Ratio);
    const fret12Dist = scaleLength * (1 - 1 / fret12Ratio);
    const marker12X = padding + (fret11Dist + fret12Dist) / 2;
    ctx.fillStyle = "#52525b";
    ctx.beginPath();
    ctx.arc(marker12X, fretboardY + fretboardHeight / 3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(marker12X, fretboardY + (2 * fretboardHeight) / 3, 5, 0, Math.PI * 2);
    ctx.fill();

    // Strings with highlighting for selected string
    const numStrings = 6;
    for (let s = 0; s < numStrings; s++) {
      const stringY = fretboardY + (s + 0.5) * (fretboardHeight / numStrings);
      const thickness = 1 + s * 0.3;
      const isSelected = s === selectedString;
      ctx.strokeStyle = isSelected ? "#f97316" : "#d4d4d8";
      ctx.lineWidth = isSelected ? thickness + 1 : thickness;
      ctx.beginPath();
      ctx.moveTo(padding, stringY);
      ctx.lineTo(padding + fretboardWidth, stringY);
      ctx.stroke();

      // String label
      ctx.fillStyle = isSelected ? "#f97316" : "#71717a";
      ctx.font = isSelected ? "bold 10px system-ui" : "10px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(STRINGS[s].name, padding - 12, stringY + 4);
    }

    // Annotation
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
    const annotText = useJust
      ? "12th fret = octave (2:1 ratio)"
      : "12th fret = ½ scale length (2^(12/12) = 2)";
    ctx.fillText(annotText, padding + fret12Dist / 2, annotY + 12);
  }, [
    selectedInterval,
    highlightedFret,
    useJust,
    referenceString,
    selectedString,
    getIntervalDeviation,
  ]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  const selectedJust = JUST_RATIOS[selectedInterval];
  const justCents = ratioToCents(selectedJust.ratio);
  const gotRatio = getFretRatio(selectedInterval, useJust);
  const gotCents = ratioToCents(gotRatio);
  const stringError =
    useJust && selectedString !== referenceString
      ? getIntervalDeviation(selectedString, selectedInterval)
      : 0;
  const totalDiff = gotCents - justCents + stringError;

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-[500px]"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const padding = 40;
            const availableWidth = width - padding * 2;
            const scaleLength = availableWidth * 2;

            for (let fret = 1; fret <= 12; fret++) {
              const fretRatio = getFretRatio(fret, useJust);
              const fretDistance = scaleLength * (1 - 1 / fretRatio);
              const fretX = padding + fretDistance;
              if (Math.abs(x - fretX) < 15) {
                setHighlightedFret(fret);
                return;
              }
            }
            setHighlightedFret(null);
          }}
          onMouseLeave={() => setHighlightedFret(null)}
          aria-label="Temperament comparison visualization"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-400">
                Tuning System
              </label>
              <select
                value={tuningMode === "ET" ? "ET" : `just-${tuningMode}`}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "ET") {
                    setTuningMode("ET");
                  } else {
                    setTuningMode(parseInt(val.replace("just-", "")));
                  }
                }}
                className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm"
              >
                <option value="ET">Equal Temperament</option>
                <optgroup label="Just Intonation (reference string)">
                  {STRINGS.map((s, i) => (
                    <option key={i} value={`just-${i}`}>
                      Just — {s.label} string
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-400">
                View String
              </label>
              <select
                value={selectedString}
                onChange={(e) => setSelectedString(parseInt(e.target.value))}
                className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm"
              >
                {STRINGS.map((s, i) => (
                  <option key={i} value={i}>
                    {s.label} string
                    {useJust && i === referenceString && " (reference)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-800 dark:text-zinc-400">
              Select Interval:{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {selectedJust.name}
              </span>
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
                <div className="text-purple-600 dark:text-purple-400 text-xs">
                  Target (Just)
                </div>
                <div className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                  {justCents.toFixed(1)}¢
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="text-orange-600 dark:text-orange-400 text-xs">
                  Fret Position
                </div>
                <div className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                  {gotCents.toFixed(1)}¢
                </div>
              </div>
              {useJust && selectedString !== referenceString && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <div className="text-yellow-600 dark:text-yellow-400 text-xs">
                    String Tuning Error
                  </div>
                  <div className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                    {stringError > 0 ? "+" : ""}
                    {stringError.toFixed(1)}¢
                  </div>
                </div>
              )}
              <div
                className={`p-3 rounded-lg ${
                  Math.abs(totalDiff) < 5
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div
                  className={`text-xs ${
                    Math.abs(totalDiff) < 5
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Total Deviation
                </div>
                <div className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
                  {totalDiff > 0 ? "+" : ""}
                  {totalDiff.toFixed(1)}¢
                </div>
              </div>
            </div>
          )}

          {useJust && selectedString !== referenceString && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> The {STRINGS[selectedString].label} string
              is tuned using just intervals from {STRINGS[referenceString].label}
              , but the frets are positioned for the {STRINGS[referenceString].label}{" "}
              string. This creates tuning errors on other strings — the
              fundamental problem with just intonation on fretted instruments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
