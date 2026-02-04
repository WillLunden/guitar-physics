"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface GainSimProps {
  className?: string;
}

export default function GainSim({ className = "" }: GainSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [gain, setGain] = useState(2.0);
  const [clipType, setClipType] = useState<"hard" | "soft">("hard");
  const [asymmetric, setAsymmetric] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const freq1 = 1.0; // Fundamental frequency

  // Calculate spectrum from clipped signal
  const calculateSpectrum = useCallback(() => {
    // Clipping thresholds (asymmetric uses different positive/negative thresholds)
    const thresholdPos = 1.0;
    const thresholdNeg = asymmetric ? 0.6 : 1.0;

    // Hard clipping function
    const hardClip = (x: number) => {
      if (x > thresholdPos) return thresholdPos;
      if (x < -thresholdNeg) return -thresholdNeg;
      return x;
    };

    // Soft clipping function (tanh-based)
    const softClip = (x: number) => {
      if (x >= 0) {
        return thresholdPos * Math.tanh(x / thresholdPos);
      } else {
        return -thresholdNeg * Math.tanh(-x / thresholdNeg);
      }
    };

    const numSamples = 512;
    const samples: number[] = [];

    // Generate samples of the clipped signal
    for (let i = 0; i < numSamples; i++) {
      const t = (i / numSamples) * Math.PI * 8;
      let signal = Math.sin(freq1 * t);
      signal *= gain;

      // Apply clipping
      if (clipType === "hard") {
        signal = hardClip(signal);
      } else {
        signal = softClip(signal);
      }
      samples.push(signal);
    }

    // Measure amplitudes for fundamental and harmonics
    const harmonics = [
      { multiplier: 1, label: "f" },
      { multiplier: 2, label: "2f" },
      { multiplier: 3, label: "3f" },
      { multiplier: 4, label: "4f" },
      { multiplier: 5, label: "5f" },
    ];

    const results: { freq: number; label: string; amplitude: number; type: string }[] = [];

    harmonics.forEach(({ multiplier, label }) => {
      const targetFreq = freq1 * multiplier;
      let real = 0, imag = 0;
      for (let i = 0; i < numSamples; i++) {
        const angle = (Math.PI * 8 * targetFreq * i) / numSamples;
        real += samples[i] * Math.cos(angle);
        imag += samples[i] * Math.sin(angle);
      }
      const amplitude = Math.sqrt(real * real + imag * imag) / numSamples * 2;
      results.push({
        freq: multiplier,
        label,
        amplitude,
        type: multiplier === 1 ? "fundamental" : "harmonic"
      });
    });

    return results;
  }, [gain, clipType, asymmetric]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clipping thresholds (asymmetric uses different positive/negative thresholds)
    const thresholdPos = 1.0;
    const thresholdNeg = asymmetric ? 0.6 : 1.0;

    // Hard clipping function
    const hardClip = (x: number) => {
      if (x > thresholdPos) return thresholdPos;
      if (x < -thresholdNeg) return -thresholdNeg;
      return x;
    };

    // Soft clipping function (tanh-based)
    const softClip = (x: number) => {
      if (x >= 0) {
        return thresholdPos * Math.tanh(x / thresholdPos);
      } else {
        return -thresholdNeg * Math.tanh(-x / thresholdNeg);
      }
    };

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const time = timeRef.current;

    ctx.clearRect(0, 0, width, height);

    // Detect dark mode and set colors accordingly
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? "#d4d4d8" : "#3f3f46";
    const mutedColor = isDark ? "#a1a1aa" : "#52525b";
    const axisLineColor = isDark ? "#71717a" : "#d4d4d8";
    const boxBgColor = isDark ? "#27272a" : "#f4f4f5";
    const boxBorderColor = isDark ? "#52525b" : "#d4d4d8";

    const padding = 20;
    const waveHeight = height * 0.35;
    const waveTop = 40;
    const spectrumTop = waveTop + waveHeight + 60;
    const spectrumHeight = height - spectrumTop - 30;

    // === WAVEFORM SECTION ===
    const sectionWidth = (width - padding * 2) / 3;
    const waveAmplitude = waveHeight * 0.4;

    // Section labels
    ctx.fillStyle = textColor;
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Input Signal", padding + sectionWidth * 0.5, 25);
    ctx.fillText("Gain Stage", padding + sectionWidth * 1.5, 25);
    ctx.fillText("Output Signal", padding + sectionWidth * 2.5, 25);

    // Draw gain stage box
    const boxX = padding + sectionWidth;
    const boxWidth = sectionWidth;
    ctx.fillStyle = boxBgColor;
    ctx.strokeStyle = boxBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX + 10, waveTop, boxWidth - 20, waveHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Gain label inside box
    ctx.fillStyle = textColor;
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`Gain: ${gain.toFixed(1)}×`, boxX + boxWidth / 2, waveTop + 25);

    // Clipping threshold lines in gain stage
    const clipY1 = waveTop + waveHeight / 2 - (thresholdPos / gain) * waveAmplitude;
    const clipY2 = waveTop + waveHeight / 2 + (thresholdNeg / gain) * waveAmplitude;

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(boxX + 20, clipY1);
    ctx.lineTo(boxX + boxWidth - 20, clipY1);
    ctx.moveTo(boxX + 20, clipY2);
    ctx.lineTo(boxX + boxWidth - 20, clipY2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Clip type label
    ctx.fillStyle = "#ef4444";
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";
    const clipLabel = (clipType === "hard" ? "Hard" : "Soft") + (asymmetric ? " (asym)" : "");
    ctx.fillText(clipLabel, boxX + 25, clipY1 - 5);

    // Draw input waveform
    const inputCenterY = waveTop + waveHeight / 2;
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < sectionWidth - 20; x++) {
      const t = (x / sectionWidth) * Math.PI * 4 - time;
      const y = Math.sin(freq1 * t);
      const plotY = inputCenterY - y * waveAmplitude * 0.8;
      const plotX = padding + 10 + x;

      if (x === 0) {
        ctx.moveTo(plotX, plotY);
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    ctx.stroke();

    // Draw waveform through gain stage (showing amplification)
    const gainCenterY = waveTop + waveHeight / 2;
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < boxWidth - 40; x++) {
      const t = ((x + sectionWidth) / sectionWidth) * Math.PI * 4 - time;
      let y = Math.sin(freq1 * t);
      // Gradually apply gain through the stage
      const progress = x / (boxWidth - 40);
      const localGain = 1 + (gain - 1) * progress;
      y *= localGain;

      const plotY = gainCenterY - y * waveAmplitude * 0.8 / gain;
      const plotX = boxX + 20 + x;

      if (x === 0) {
        ctx.moveTo(plotX, plotY);
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    ctx.stroke();

    // Draw output waveform (clipped)
    const outputCenterY = waveTop + waveHeight / 2;
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < sectionWidth - 20; x++) {
      const t = ((x + sectionWidth * 2) / sectionWidth) * Math.PI * 4 - time;
      let y = Math.sin(freq1 * t);
      y *= gain;

      // Apply clipping
      if (clipType === "hard") {
        y = hardClip(y);
      } else {
        y = softClip(y);
      }

      const plotY = outputCenterY - y * waveAmplitude * 0.8;
      const plotX = padding + sectionWidth * 2 + 10 + x;

      if (x === 0) {
        ctx.moveTo(plotX, plotY);
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    ctx.stroke();

    // Flow arrows
    ctx.fillStyle = mutedColor;
    ctx.font = "20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("→", padding + sectionWidth - 5, inputCenterY);
    ctx.fillText("→", padding + sectionWidth * 2 + 5, inputCenterY);

    // === SPECTRUM SECTION ===
    ctx.fillStyle = textColor;
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Output Frequency Spectrum", width / 2, spectrumTop - 10);

    const spectrum = calculateSpectrum();
    const numBars = spectrum.length;
    const totalBarSpace = width - padding * 2 - 60;
    const barWidth = totalBarSpace / numBars - 10;
    const barSpacing = totalBarSpace / numBars;

    // Find max amplitude for scaling (use at least 1.0 to keep scale consistent)
    const maxAmplitude = Math.max(...spectrum.map(s => s.amplitude), 1.0);

    // Draw frequency axis
    ctx.strokeStyle = axisLineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, spectrumTop + spectrumHeight);
    ctx.lineTo(width - padding, spectrumTop + spectrumHeight);
    ctx.stroke();

    // Draw spectrum bars (always show all harmonics)
    spectrum.forEach((s, i) => {
      const barX = padding + 30 + i * barSpacing;
      const barHeight = Math.max((s.amplitude / maxAmplitude) * (spectrumHeight - 30), 2);

      // Color: purple for fundamental, orange for odd harmonics, green for even harmonics
      let color;
      if (s.type === "fundamental") {
        color = "#7c3aed";
      } else if (s.freq % 2 === 0) {
        color = "#22c55e"; // Even harmonics in green
      } else {
        color = "#f97316"; // Odd harmonics in orange
      }

      ctx.fillStyle = color;
      ctx.fillRect(barX, spectrumTop + spectrumHeight - barHeight, barWidth, barHeight);

      // Frequency label below
      ctx.fillStyle = textColor;
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(s.label, barX + barWidth / 2, spectrumTop + spectrumHeight + 14);

      // Amplitude label above bar
      ctx.fillStyle = mutedColor;
      ctx.font = "10px system-ui";
      ctx.fillText(s.amplitude.toFixed(2), barX + barWidth / 2, spectrumTop + spectrumHeight - barHeight - 5);
    });

    // Legend
    const legendY = spectrumTop + 5;
    ctx.font = "10px system-ui";
    ctx.textAlign = "left";

    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(padding, legendY, 10, 10);
    ctx.fillStyle = textColor;
    ctx.fillText("Fundamental", padding + 15, legendY + 9);

    ctx.fillStyle = "#f97316";
    ctx.fillRect(padding + 90, legendY, 10, 10);
    ctx.fillStyle = textColor;
    ctx.fillText("Odd harmonics", padding + 105, legendY + 9);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(padding + 195, legendY, 10, 10);
    ctx.fillStyle = textColor;
    ctx.fillText("Even harmonics", padding + 210, legendY + 9);
  }, [gain, clipType, asymmetric, calculateSpectrum]);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.03 * speed;
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw, speed]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-96"
          aria-label="Gain and distortion visualization"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setClipType("hard")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                clipType === "hard"
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300"
              }`}
            >
              Hard Clipping
            </button>
            <button
              onClick={() => setClipType("soft")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                clipType === "soft"
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300"
              }`}
            >
              Soft Clipping
            </button>
            <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-400 ml-auto">
              <input
                type="checkbox"
                checked={asymmetric}
                onChange={(e) => setAsymmetric(e.target.checked)}
                className="rounded"
              />
              Asymmetric clipping
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Gain</span>
                <span className="text-zinc-800 dark:text-zinc-400">{gain.toFixed(1)}×</span>
              </span>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={gain}
                onChange={(e) => setGain(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Animation Speed</span>
                <span className="text-zinc-800 dark:text-zinc-400">{speed.toFixed(1)}×</span>
              </span>
              <input
                type="range"
                min="0.2"
                max="2"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <div className="text-xs text-zinc-700 dark:text-zinc-500 space-y-1">
            <p>
              <strong>Hard clipping:</strong> Signal is abruptly cut off at the threshold (transistor/op-amp style).
            </p>
            <p>
              <strong>Soft clipping:</strong> Signal is gradually compressed near the threshold (tube style).
            </p>
            <p>
              <strong>Asymmetric:</strong> Different clipping thresholds for positive and negative peaks. Introduces even harmonics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
