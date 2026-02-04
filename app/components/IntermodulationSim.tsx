"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface IntermodulationSimProps {
  className?: string;
}

// Musical intervals as frequency ratios
const INTERVALS = [
  { label: "Unison (1:1)", ratio: 1.0, description: "Same note" },
  { label: "Perfect Fifth (3:2)", ratio: 1.5, description: "Power chord interval" },
  { label: "Perfect Fourth (4:3)", ratio: 4/3, description: "Inverted fifth" },
  { label: "Major Third (5:4)", ratio: 1.25, description: "Major chord interval" },
  { label: "Minor Second (16:15)", ratio: 16/15, description: "Dissonant semitone" },
];

export default function IntermodulationSim({ className = "" }: IntermodulationSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [gain, setGain] = useState(2.5);
  const [intervalIndex, setIntervalIndex] = useState(1); // Default to perfect fifth
  const [speed, setSpeed] = useState(1.0);

  const freq1 = 1.0; // Base frequency (arbitrary units)
  const freq2 = freq1 * INTERVALS[intervalIndex].ratio;

  // Soft clipping (sigmoid-like, similar to the Python example)
  const softClip = (x: number) => {
    // Attempt to match tanh behavior for sigmoid-style soft clip
    return Math.tanh(x);
  };

  // Calculate spectrum from clipped signal
  const calculateSpectrum = useCallback(() => {
    const numSamples = 1024;
    const samples: number[] = [];

    // Generate samples of the clipped signal
    for (let i = 0; i < numSamples; i++) {
      const t = (i / numSamples) * Math.PI * 16;
      const signal = gain * (Math.sin(freq1 * t) + Math.sin(freq2 * t));
      const clipped = softClip(signal);
      samples.push(clipped);
    }

    // Frequencies to measure (fundamentals and intermodulation products)
    const frequencies: { freq: number; label: string; amplitude: number; type: string }[] = [];

    const measureFreq = (targetFreq: number, label: string, type: string) => {
      if (targetFreq <= 0) return;
      let real = 0, imag = 0;
      for (let i = 0; i < numSamples; i++) {
        const angle = (Math.PI * 16 * targetFreq * i) / numSamples;
        real += samples[i] * Math.cos(angle);
        imag += samples[i] * Math.sin(angle);
      }
      const amplitude = Math.sqrt(real * real + imag * imag) / numSamples * 2;
      if (amplitude > 0.005) {
        frequencies.push({ freq: targetFreq, label, amplitude, type });
      }
    };

    // Fundamentals
    measureFreq(freq1, "f₁", "fundamental");
    if (intervalIndex > 0) {
      measureFreq(freq2, "f₂", "fundamental");
    }

    // Harmonics
    measureFreq(freq1 * 2, "2f₁", "harmonic");
    measureFreq(freq1 * 3, "3f₁", "harmonic");
    if (intervalIndex > 0) {
      measureFreq(freq2 * 2, "2f₂", "harmonic");
    }

    // Intermodulation products (only if two different tones)
    if (intervalIndex > 0) {
      measureFreq(freq2 - freq1, "f₂-f₁", "intermod");
      measureFreq(freq1 + freq2, "f₁+f₂", "intermod");
      measureFreq(2 * freq1 - freq2, "2f₁-f₂", "intermod");
      measureFreq(2 * freq2 - freq1, "2f₂-f₁", "intermod");
      measureFreq(Math.abs(2 * freq1 - freq2), "|2f₁-f₂|", "intermod");
    }

    // Remove duplicates and sort
    const seen = new Set<string>();
    const unique = frequencies.filter(f => {
      const key = f.freq.toFixed(3);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => a.freq - b.freq);
  }, [gain, freq2, intervalIndex]);

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
    const time = timeRef.current;

    ctx.clearRect(0, 0, width, height);

    // Detect dark mode and set colors accordingly
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? "#d4d4d8" : "#3f3f46";
    const mutedColor = isDark ? "#a1a1aa" : "#52525b";
    const lightLineColor = isDark ? "#52525b" : "#e4e4e7";
    const axisLineColor = isDark ? "#71717a" : "#d4d4d8";

    const padding = 20;
    const waveHeight = height * 0.28;
    const waveTop = 35;
    const spectrumTop = waveTop + waveHeight * 2 + 50;
    const spectrumHeight = height - spectrumTop - 30;

    // === INPUT WAVEFORM ===
    ctx.fillStyle = textColor;
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Input: Two Tones Combined", width / 2, 20);

    const inputCenterY = waveTop + waveHeight / 2;

    // Draw zero line
    ctx.strokeStyle = lightLineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, inputCenterY);
    ctx.lineTo(width - padding, inputCenterY);
    ctx.stroke();

    // Draw input waveform
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const waveWidth = width - padding * 2;
    for (let x = 0; x < waveWidth; x++) {
      const t = (x / waveWidth) * Math.PI * 8 - time;
      const y = gain * (Math.sin(freq1 * t) + (intervalIndex > 0 ? Math.sin(freq2 * t) : 0));
      const normalized = y / (gain * 2); // Normalize for display
      const plotY = inputCenterY - normalized * waveHeight * 0.4;
      const plotX = padding + x;

      if (x === 0) {
        ctx.moveTo(plotX, plotY);
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    ctx.stroke();

    // Amplitude indicator
    ctx.fillStyle = mutedColor;
    ctx.font = "10px system-ui";
    ctx.textAlign = "right";
    ctx.fillText(`Amplitude: ±${(gain * 2).toFixed(1)}`, width - padding, waveTop + 15);

    // === OUTPUT WAVEFORM ===
    const outputTop = waveTop + waveHeight + 25;
    const outputCenterY = outputTop + waveHeight / 2;

    ctx.fillStyle = textColor;
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Output: After Soft Clipping (tanh)", width / 2, outputTop - 8);

    // Draw zero line
    ctx.strokeStyle = lightLineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, outputCenterY);
    ctx.lineTo(width - padding, outputCenterY);
    ctx.stroke();

    // Draw clipping threshold indicators
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const clipLevel = waveHeight * 0.35;
    ctx.beginPath();
    ctx.moveTo(padding, outputCenterY - clipLevel);
    ctx.lineTo(width - padding, outputCenterY - clipLevel);
    ctx.moveTo(padding, outputCenterY + clipLevel);
    ctx.lineTo(width - padding, outputCenterY + clipLevel);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw output waveform
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < waveWidth; x++) {
      const t = (x / waveWidth) * Math.PI * 8 - time;
      const input = gain * (Math.sin(freq1 * t) + (intervalIndex > 0 ? Math.sin(freq2 * t) : 0));
      const output = softClip(input);
      const plotY = outputCenterY - output * waveHeight * 0.4;
      const plotX = padding + x;

      if (x === 0) {
        ctx.moveTo(plotX, plotY);
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    ctx.stroke();

    // === SPECTRUM ===
    ctx.fillStyle = textColor;
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Frequency Spectrum (Output)", width / 2, spectrumTop - 8);

    const spectrum = calculateSpectrum();

    if (spectrum.length > 0) {
      const maxFreq = Math.max(...spectrum.map(s => s.freq)) * 1.15;
      const minFreq = Math.min(...spectrum.map(s => s.freq)) * 0.5;
      const maxAmplitude = Math.max(...spectrum.map(s => s.amplitude), 0.5);
      const chartLeft = padding + 30;
      const chartRight = width - padding - 20;
      const chartWidth = chartRight - chartLeft;
      const labelAreaHeight = 50; // Space for labels below axis
      const barAreaHeight = spectrumHeight - labelAreaHeight - 25;
      const axisY = spectrumTop + barAreaHeight + 20;

      // Draw frequency axis
      ctx.strokeStyle = axisLineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartLeft, axisY);
      ctx.lineTo(chartRight, axisY);
      ctx.stroke();

      // Draw axis label
      ctx.fillStyle = mutedColor;
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Frequency →", chartLeft + chartWidth / 2, axisY + 45);

      // Draw tick marks at key frequencies
      const tickFreqs = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
      ctx.strokeStyle = lightLineColor;
      ctx.fillStyle = mutedColor;
      ctx.font = "9px system-ui";
      tickFreqs.forEach(tf => {
        if (tf >= minFreq && tf <= maxFreq) {
          const tickX = chartLeft + ((tf - minFreq) / (maxFreq - minFreq)) * chartWidth;
          ctx.beginPath();
          ctx.moveTo(tickX, axisY);
          ctx.lineTo(tickX, axisY + 4);
          ctx.stroke();
        }
      });

      // Draw spectrum bars - frequency-proportional positioning
      const barWidth = 28;

      spectrum.forEach((s) => {
        const barCenterX = chartLeft + ((s.freq - minFreq) / (maxFreq - minFreq)) * chartWidth;
        const barX = barCenterX - barWidth / 2;
        const barHeight = Math.max((s.amplitude / maxAmplitude) * barAreaHeight, 4);

        // Color by type
        let color;
        if (s.type === "fundamental") {
          color = "#7c3aed";
        } else if (s.type === "harmonic") {
          color = "#f97316";
        } else {
          color = "#ef4444"; // intermodulation
        }

        // Draw bar with rounded top
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(barX, axisY - barHeight, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();

        // Frequency label below axis (rotated for space)
        ctx.save();
        ctx.translate(barCenterX, axisY + 14);
        ctx.rotate(-Math.PI / 6); // 30 degree angle
        ctx.fillStyle = textColor;
        ctx.font = "bold 13px system-ui";
        ctx.textAlign = "right";
        ctx.fillText(s.label, 0, 0);
        ctx.restore();

        // Amplitude above bar
        ctx.fillStyle = mutedColor;
        ctx.font = "9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(s.amplitude.toFixed(2), barCenterX, axisY - barHeight - 4);
      });
    }

    // Legend - positioned at top right of spectrum area
    const legendY = spectrumTop + 5;
    const legendX = width - padding - 250;
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";

    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.roundRect(legendX, legendY, 12, 12, 2);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText("Fundamental", legendX + 16, legendY + 10);

    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.roundRect(legendX + 90, legendY, 12, 12, 2);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText("Harmonic", legendX + 106, legendY + 10);

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.roundRect(legendX + 175, legendY, 12, 12, 2);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText("Intermod", legendX + 191, legendY + 10);
  }, [gain, freq2, intervalIndex, calculateSpectrum]);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.02 * speed;
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
          className="w-full h-[32rem]"
          aria-label="Intermodulation distortion visualization"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {INTERVALS.map((interval, i) => (
              <button
                key={i}
                onClick={() => setIntervalIndex(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  intervalIndex === i
                    ? "bg-purple-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300"
                }`}
              >
                {interval.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Gain (Distortion Amount)</span>
                <span className="text-zinc-800 dark:text-zinc-400">{gain.toFixed(1)}×</span>
              </span>
              <input
                type="range"
                min="0.5"
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

          <p className="text-xs text-zinc-700 dark:text-zinc-500">
            <strong>Selected interval:</strong> {INTERVALS[intervalIndex].description}.
            {intervalIndex === 1 && " Notice how f₂-f₁ creates a tone one octave below the root."}
            {intervalIndex === 3 && " Notice the dense cluster of intermodulation products."}
            {intervalIndex === 4 && " The close frequencies create many beating intermodulation products."}
          </p>
        </div>
      </div>
    </div>
  );
}
