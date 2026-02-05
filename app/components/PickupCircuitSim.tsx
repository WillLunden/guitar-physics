"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PickupCircuitSimProps {
  className?: string;
}

export default function PickupCircuitSim({
  className = "",
}: PickupCircuitSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inductance, setInductance] = useState(2.5); // Henries
  const [capacitance, setCapacitance] = useState(120); // picoFarads
  const [resistance, setResistance] = useState(6); // kOhms
  const [includeFaraday, setIncludeFaraday] = useState(false); // Include V_emf ∝ f

  // Calculate resonant frequency
  const getResonantFreq = useCallback(() => {
    const L = inductance;
    const C = capacitance * 1e-12; // Convert pF to F
    return 1 / (2 * Math.PI * Math.sqrt(L * C));
  }, [inductance, capacitance]);

  // Calculate transfer function magnitude |H(jω)|
  // Models pickup as voltage source with series R,L and parallel C
  // H(jω) = 1 / (1 - ω²LC + jωRC)
  // Optionally includes Faraday's law factor (V_emf ∝ f)
  const getFrequencyResponse = useCallback(
    (f: number) => {
      const L = inductance;
      const C = capacitance * 1e-12;
      const R = resistance * 1000;

      const f0 = getResonantFreq();
      const Q = (1 / R) * Math.sqrt(L / C); // Quality factor

      // |H(jω)| = 1 / √((1 - ω²LC)² + (ωRC)²)
      // In normalized form: 1 / √((1 - fNorm²)² + (fNorm/Q)²)
      const fNorm = f / f0;
      const denominator = Math.sqrt(
        Math.pow(1 - fNorm * fNorm, 2) + Math.pow(fNorm / Q, 2)
      );

      const transferFn = 1 / denominator;

      // If including Faraday's law, multiply by f (normalized to 1kHz for scaling)
      if (includeFaraday) {
        return transferFn * (f / 1000);
      }
      return transferFn;
    },
    [inductance, capacitance, resistance, includeFaraday, getResonantFreq]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Layout
      const circuitWidth = width * 0.4;
      const plotWidth = width * 0.55;
      const plotX = circuitWidth + 20;

      // === DRAW CIRCUIT SCHEMATIC ===
      const circuitCenterX = circuitWidth / 2;
      const circuitTop = 40;

      // Title
      ctx.fillStyle = "#3f3f46";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Equivalent Circuit", circuitCenterX, 20);

      // EMF source (circle with sine wave)
      const emfX = circuitCenterX - 60;
      const emfY = circuitTop + 30;
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(emfX, emfY, 15, 0, Math.PI * 2);
      ctx.stroke();

      // Sine wave inside
      ctx.beginPath();
      ctx.moveTo(emfX - 8, emfY);
      for (let x = -8; x <= 8; x++) {
        ctx.lineTo(emfX + x, emfY - 5 * Math.sin((x / 8) * Math.PI));
      }
      ctx.stroke();

      ctx.fillStyle = "#3f3f46";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("V_emf", emfX, emfY + 30);
      ctx.fillText("(∝ f)", emfX, emfY + 42);

      // Wire from EMF to resistor
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(emfX + 15, emfY);
      ctx.lineTo(emfX + 35, emfY);
      ctx.stroke();

      // Resistor (zigzag)
      const rX = emfX + 55;
      const rY = emfY;
      ctx.strokeStyle = "#71717a";
      ctx.beginPath();
      ctx.moveTo(rX - 20, rY);
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(rX - 15 + i * 6, rY + (i % 2 === 0 ? -6 : 6));
      }
      ctx.lineTo(rX + 20, rY);
      ctx.stroke();

      ctx.fillStyle = "#3f3f46";
      ctx.font = "11px system-ui";
      ctx.fillText("R", rX, rY - 15);
      ctx.font = "10px system-ui";
      ctx.fillText(`${resistance}kΩ`, rX, rY + 20);

      // Wire to inductor
      ctx.beginPath();
      ctx.moveTo(rX + 20, rY);
      ctx.lineTo(rX + 40, rY);
      ctx.stroke();

      // Inductor (loops)
      const lX = rX + 60;
      const lY = rY;
      ctx.strokeStyle = "#71717a";
      ctx.beginPath();
      ctx.moveTo(lX - 20, lY);
      for (let i = 0; i < 4; i++) {
        ctx.arc(lX - 12 + i * 8, lY, 4, Math.PI, 0, false);
      }
      ctx.lineTo(lX + 20, lY);
      ctx.stroke();

      ctx.fillStyle = "#3f3f46";
      ctx.font = "11px system-ui";
      ctx.fillText("L", lX, lY - 15);
      ctx.font = "10px system-ui";
      ctx.fillText(`${inductance}H`, lX, lY + 20);

      // Wire down to capacitor
      const junctionX = lX + 30;
      ctx.beginPath();
      ctx.moveTo(lX + 20, lY);
      ctx.lineTo(junctionX, lY);
      ctx.lineTo(junctionX, lY + 40);
      ctx.stroke();

      // Capacitor (parallel plates)
      const cX = junctionX;
      const cY = lY + 55;
      ctx.beginPath();
      ctx.moveTo(cX - 10, cY - 8);
      ctx.lineTo(cX + 10, cY - 8);
      ctx.moveTo(cX - 10, cY + 8);
      ctx.lineTo(cX + 10, cY + 8);
      ctx.stroke();

      ctx.fillStyle = "#3f3f46";
      ctx.font = "11px system-ui";
      ctx.fillText("C", cX + 20, cY);
      ctx.font = "10px system-ui";
      ctx.fillText(`${capacitance}pF`, cX + 22, cY + 14);

      // Wire from capacitor to ground and back
      ctx.beginPath();
      ctx.moveTo(cX, cY + 8);
      ctx.lineTo(cX, cY + 30);
      ctx.lineTo(emfX, cY + 30);
      ctx.lineTo(emfX, emfY + 15);
      ctx.stroke();

      // Ground symbol
      const gndY = cY + 35;
      ctx.beginPath();
      ctx.moveTo(cX - 10, gndY);
      ctx.lineTo(cX + 10, gndY);
      ctx.moveTo(cX - 6, gndY + 4);
      ctx.lineTo(cX + 6, gndY + 4);
      ctx.moveTo(cX - 3, gndY + 8);
      ctx.lineTo(cX + 3, gndY + 8);
      ctx.stroke();

      // Output arrow
      ctx.strokeStyle = "#f97316";
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(junctionX, lY);
      ctx.lineTo(junctionX + 25, lY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(junctionX + 25, lY);
      ctx.lineTo(junctionX + 20, lY - 4);
      ctx.lineTo(junctionX + 20, lY + 4);
      ctx.closePath();
      ctx.fill();

      ctx.font = "10px system-ui";
      ctx.textAlign = "left";
      ctx.fillText("V_out", junctionX + 28, lY + 4);

      // Formulas
      const formulaY = height - 80;
      ctx.fillStyle = "#3f3f46";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";

      const f0 = getResonantFreq();
      ctx.fillText("Resonant Frequency:", circuitCenterX, formulaY);
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = "#7c3aed";
      ctx.fillText(`f₀ = 1/(2π√LC)`, circuitCenterX, formulaY + 18);
      ctx.fillText(`= ${(f0 / 1000).toFixed(1)} kHz`, circuitCenterX, formulaY + 36);

      // === DRAW FREQUENCY RESPONSE PLOT ===
      const plotHeight = height - 80;
      const plotTop = 40;
      const plotBottom = plotTop + plotHeight - 40;
      const plotLeft = plotX + 30;
      const plotRight = plotX + plotWidth - 20;
      const plotW = plotRight - plotLeft;
      const plotH = plotBottom - plotTop;

      // Title
      ctx.fillStyle = "#3f3f46";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      const plotTitle = includeFaraday
        ? "Output: |V_out| ∝ f·|H(jω)|"
        : "Transfer Function |H(jω)|";
      ctx.fillText(plotTitle, plotX + plotWidth / 2, 20);

      // Axes
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plotLeft, plotTop);
      ctx.lineTo(plotLeft, plotBottom);
      ctx.lineTo(plotRight, plotBottom);
      ctx.stroke();

      // X-axis labels (log scale from 100 Hz to 20 kHz)
      ctx.fillStyle = "#3f3f46";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";

      const freqLabels = [100, 1000, 10000];
      const minLogF = Math.log10(100);
      const maxLogF = Math.log10(20000);

      freqLabels.forEach((f) => {
        const x =
          plotLeft + ((Math.log10(f) - minLogF) / (maxLogF - minLogF)) * plotW;
        ctx.fillText(f >= 1000 ? `${f / 1000}k` : `${f}`, x, plotBottom + 15);

        // Grid line
        ctx.strokeStyle = "#e4e4e7";
        ctx.beginPath();
        ctx.moveTo(x, plotTop);
        ctx.lineTo(x, plotBottom);
        ctx.stroke();
      });

      ctx.fillText("Frequency (Hz)", plotLeft + plotW / 2, plotBottom + 30);

      // Y-axis label
      ctx.save();
      ctx.translate(plotLeft - 25, plotTop + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillText("|H| (dB)", 0, 0);
      ctx.restore();

      // Plot the frequency response (absolute magnitude)
      const gradient = ctx.createLinearGradient(plotLeft, 0, plotRight, 0);
      gradient.addColorStop(0, "#7c3aed");
      gradient.addColorStop(1, "#f97316");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      // Y-axis scale: -10 dB to +40 dB (50 dB range)
      const dbMin = -10;
      const dbMax = 40;
      const dbRange = dbMax - dbMin;

      let firstPoint = true;
      for (let logF = minLogF; logF <= maxLogF; logF += 0.02) {
        const f = Math.pow(10, logF);
        const response = getFrequencyResponse(f);
        const dB = 20 * Math.log10(response);
        const clampedDB = Math.max(dbMin, Math.min(dbMax, dB));

        const x = plotLeft + ((logF - minLogF) / (maxLogF - minLogF)) * plotW;
        const y = plotTop + ((dbMax - clampedDB) / dbRange) * plotH;

        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Mark resonant frequency
      const f0LogPos =
        plotLeft + ((Math.log10(f0) - minLogF) / (maxLogF - minLogF)) * plotW;

      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(f0LogPos, plotTop);
      ctx.lineTo(f0LogPos, plotBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#f97316";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`f₀`, f0LogPos, plotTop - 5);

      // Y-axis dB labels
      ctx.fillStyle = "#3f3f46";
      ctx.textAlign = "right";
      const dbLabels = [40, 30, 20, 10, 0, -10];
      dbLabels.forEach((db) => {
        const y = plotTop + ((dbMax - db) / dbRange) * plotH;
        ctx.fillText(`${db}`, plotLeft - 5, y + 4);

        ctx.strokeStyle = "#e4e4e7";
        ctx.beginPath();
        ctx.moveTo(plotLeft, y);
        ctx.lineTo(plotRight, y);
        ctx.stroke();
      });

      // Annotations
      ctx.font = "10px system-ui";

      if (includeFaraday) {
        ctx.fillStyle = "#22c55e";
        ctx.textAlign = "left";
        ctx.fillText("↑ V ∝ f (Faraday)", plotLeft + 10, plotTop + 20);
      }

      ctx.fillStyle = "#7c3aed";
      ctx.textAlign = "center";
      ctx.fillText("Peak at f₀", f0LogPos, plotBottom - 10);

      ctx.fillStyle = "#ef4444";
      ctx.textAlign = "right";
      ctx.fillText("LC rolloff ↓", plotRight - 10, plotTop + 20);
    };

    draw();
    window.addEventListener("resize", draw);

    return () => {
      window.removeEventListener("resize", draw);
    };
  }, [inductance, capacitance, resistance, includeFaraday, getResonantFreq, getFrequencyResponse]);

  return (
    <div className={className}>
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-72"
          aria-label="Pickup equivalent circuit and frequency response"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Inductance (L)</span>
                <span className="text-zinc-800 dark:text-zinc-400">{inductance} H</span>
              </span>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={inductance}
                onChange={(e) => setInductance(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Capacitance (C)</span>
                <span className="text-zinc-800 dark:text-zinc-400">{capacitance} pF</span>
              </span>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={capacitance}
                onChange={(e) => setCapacitance(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Resistance (R)</span>
                <span className="text-zinc-800 dark:text-zinc-400">{resistance} kΩ</span>
              </span>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={includeFaraday}
              onChange={(e) => setIncludeFaraday(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600"
            />
            <span>
              Include Faraday&apos;s law (V<sub>emf</sub> ∝ f) — shows actual
              pickup output
            </span>
          </label>

          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            Try increasing L or C to see the resonant peak shift lower (darker tone).
            Higher R reduces the peak height (lower Q).
          </p>
        </div>
      </div>
    </div>
  );
}
