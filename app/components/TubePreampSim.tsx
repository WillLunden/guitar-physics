"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TubePreampSimProps {
  className?: string;
}

interface Electron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
}

export default function TubePreampSim({ className = "" }: TubePreampSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const electronsRef = useRef<Electron[]>([]);

  const [inputLevel, setInputLevel] = useState(1.5);
  const [cathodeR, setCathodeR] = useState(1.5); // Cathode resistor in kΩ

  // Soft clipping function (tube-style)
  const softClip = useCallback((x: number, threshold: number = 1.0) => {
    return threshold * Math.tanh(x / threshold);
  }, []);

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
    const wireColor = isDark ? "#a1a1aa" : "#52525b";
    const componentColor = isDark ? "#9ca3af" : "#71717a";
    const tubeGlassColor = isDark ? "#64748b" : "#94a3b8";
    const tubeGlassFill = isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(241, 245, 249, 0.3)";

    // Layout
    const padding = 20;
    const waveWidth = 100;
    const waveHeight = 120;
    const circuitCenterX = width / 2;
    const circuitCenterY = height / 2 - 20;

    // Tube dimensions
    const tubeWidth = 120;
    const tubeHeight = 160;
    const tubeTop = circuitCenterY - tubeHeight / 2;

    // Calculate bias from cathode resistor (V = I * R, assuming ~1mA quiescent current)
    const biasVoltage = -cathodeR * 1.0; // Approximation: 1mA * Rk(kΩ) = bias in volts

    // Clipping threshold depends on bias - higher Rk = more headroom before clipping
    const clipThreshold = cathodeR / 1.5; // Rk=1.5kΩ gives threshold=1.0

    // Current input signal value (for animation)
    const inputSignal = Math.sin(time * 2);
    const gridVoltage = inputSignal * inputLevel; // Grid voltage from input
    const effectiveGridVoltage = gridVoltage + biasVoltage;

    // Electron flow is controlled by grid voltage (more negative = less flow)
    const electronFlowRate = Math.max(0, 1 + effectiveGridVoltage * 0.4);

    // === LABELS ===
    ctx.fillStyle = textColor;
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Triode Preamp Stage", circuitCenterX, 20);

    // === INPUT WAVEFORM ===
    const inputWaveX = padding + 20;
    const inputWaveY = circuitCenterY;

    ctx.fillStyle = textColor;
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Input", inputWaveX + waveWidth / 2, inputWaveY - waveHeight / 2 - 8);

    // Draw input waveform box
    ctx.strokeStyle = lightLineColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(inputWaveX, inputWaveY - waveHeight / 2, waveWidth, waveHeight);

    // Draw input zero line
    ctx.strokeStyle = lightLineColor;
    ctx.beginPath();
    ctx.moveTo(inputWaveX, inputWaveY);
    ctx.lineTo(inputWaveX + waveWidth, inputWaveY);
    ctx.stroke();

    // Draw input waveform
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < waveWidth; x++) {
      const t = (x / waveWidth) * Math.PI * 4 - time * 2;
      const y = Math.sin(t) * inputLevel;
      const plotY = inputWaveY - (y / 3) * (waveHeight / 2 - 5);
      if (x === 0) ctx.moveTo(inputWaveX + x, plotY);
      else ctx.lineTo(inputWaveX + x, plotY);
    }
    ctx.stroke();

    // Input level indicator
    ctx.fillStyle = mutedColor;
    ctx.font = "9px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`${inputLevel.toFixed(1)}V`, inputWaveX + 5, inputWaveY - waveHeight / 2 + 12);

    // === OUTPUT WAVEFORMS ===
    const outputWaveX = width - padding - waveWidth - 20;
    const plateWaveY = circuitCenterY - 35; // Plate voltage (with DC)
    const acWaveY = circuitCenterY + 45; // AC output (DC removed)
    const smallWaveHeight = 50;

    // --- Plate Voltage (before coupling cap) ---
    ctx.fillStyle = textColor;
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Plate Voltage", outputWaveX + waveWidth / 2, plateWaveY - smallWaveHeight / 2 - 8);

    // Draw plate waveform box
    ctx.strokeStyle = lightLineColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(outputWaveX, plateWaveY - smallWaveHeight / 2, waveWidth, smallWaveHeight);

    // DC offset level indicator (plate sits at ~150V typically)
    const dcOffsetY = plateWaveY - smallWaveHeight * 0.15; // Show DC level
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(outputWaveX, dcOffsetY);
    ctx.lineTo(outputWaveX + waveWidth, dcOffsetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // DC label
    ctx.fillStyle = "#ef4444";
    ctx.font = "8px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("~150V DC", outputWaveX + 3, dcOffsetY - 3);

    // Draw plate waveform (inverted, clipped, riding on DC offset)
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < waveWidth; x++) {
      const t = (x / waveWidth) * Math.PI * 4 - time * 2;
      const input = Math.sin(t) * inputLevel;
      const output = softClip(-input * 0.7, clipThreshold);
      // Signal rides on top of DC offset
      const plotY = dcOffsetY - output * (smallWaveHeight * 0.35);
      if (x === 0) ctx.moveTo(outputWaveX + x, plotY);
      else ctx.lineTo(outputWaveX + x, plotY);
    }
    ctx.stroke();

    // --- Arrow showing C2 removes DC ---
    ctx.fillStyle = textColor;
    ctx.font = "9px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("C2 blocks DC", outputWaveX + waveWidth / 2, plateWaveY + smallWaveHeight / 2 + 14);
    ctx.fillText("↓", outputWaveX + waveWidth / 2, plateWaveY + smallWaveHeight / 2 + 24);

    // --- AC Output (after coupling cap) ---
    ctx.fillStyle = textColor;
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("AC Output", outputWaveX + waveWidth / 2, acWaveY - smallWaveHeight / 2 - 8);

    // Draw AC output waveform box
    ctx.strokeStyle = lightLineColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(outputWaveX, acWaveY - smallWaveHeight / 2, waveWidth, smallWaveHeight);

    // Draw zero line (now centered since DC is removed)
    ctx.strokeStyle = isDark ? "#52525b" : "#d4d4d8";
    ctx.beginPath();
    ctx.moveTo(outputWaveX, acWaveY);
    ctx.lineTo(outputWaveX + waveWidth, acWaveY);
    ctx.stroke();

    // Zero label
    ctx.fillStyle = mutedColor;
    ctx.font = "8px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("0V", outputWaveX + 3, acWaveY - 3);

    // Draw AC output waveform (same shape, but centered on zero)
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < waveWidth; x++) {
      const t = (x / waveWidth) * Math.PI * 4 - time * 2;
      const input = Math.sin(t) * inputLevel;
      const output = softClip(-input * 0.7, clipThreshold);
      const plotY = acWaveY - output * (smallWaveHeight * 0.35);
      if (x === 0) ctx.moveTo(outputWaveX + x, plotY);
      else ctx.lineTo(outputWaveX + x, plotY);
    }
    ctx.stroke();

    // === CIRCUIT SCHEMATIC ===

    // Input coupling capacitor
    const capX = inputWaveX + waveWidth + 25;
    const capY = inputWaveY;

    // Wire from input to cap
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(inputWaveX + waveWidth, inputWaveY);
    ctx.lineTo(capX - 8, capY);
    ctx.stroke();

    // Coupling capacitor symbol
    ctx.strokeStyle = componentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(capX - 8, capY - 10);
    ctx.lineTo(capX - 8, capY + 10);
    ctx.moveTo(capX - 3, capY - 10);
    ctx.lineTo(capX - 3, capY + 10);
    ctx.stroke();

    ctx.fillStyle = mutedColor;
    ctx.font = "8px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("C1", capX - 5, capY - 15);

    // Grid resistor (to ground for bias)
    const gridResX = capX + 20;
    const gridResY = capY + 40;

    // Wire from cap to grid resistor junction
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(capX - 3, capY);
    ctx.lineTo(gridResX, capY);
    ctx.lineTo(gridResX, gridResY - 15);
    ctx.stroke();

    // Grid resistor symbol
    ctx.strokeStyle = componentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gridResX, gridResY - 15);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(gridResX + (i % 2 === 0 ? 6 : -6), gridResY - 15 + (i + 1) * 7);
    }
    ctx.lineTo(gridResX, gridResY + 15);
    ctx.stroke();

    ctx.fillStyle = mutedColor;
    ctx.font = "8px system-ui";
    ctx.fillText("Rg", gridResX + 12, gridResY);

    // Ground symbol for grid resistor
    ctx.strokeStyle = componentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gridResX, gridResY + 15);
    ctx.lineTo(gridResX, gridResY + 25);
    ctx.moveTo(gridResX - 8, gridResY + 25);
    ctx.lineTo(gridResX + 8, gridResY + 25);
    ctx.moveTo(gridResX - 5, gridResY + 29);
    ctx.lineTo(gridResX + 5, gridResY + 29);
    ctx.moveTo(gridResX - 2, gridResY + 33);
    ctx.lineTo(gridResX + 2, gridResY + 33);
    ctx.stroke();

    // === VACUUM TUBE ===

    // Tube envelope (glass)
    ctx.strokeStyle = tubeGlassColor;
    ctx.lineWidth = 2;
    ctx.fillStyle = tubeGlassFill;
    ctx.beginPath();
    ctx.ellipse(circuitCenterX, tubeTop + 20, tubeWidth / 2 - 10, 20, 0, Math.PI, 0);
    ctx.lineTo(circuitCenterX + tubeWidth / 2 - 10, tubeTop + tubeHeight - 20);
    ctx.ellipse(circuitCenterX, tubeTop + tubeHeight - 20, tubeWidth / 2 - 10, 15, 0, 0, Math.PI);
    ctx.lineTo(circuitCenterX - tubeWidth / 2 + 10, tubeTop + 20);
    ctx.fill();
    ctx.stroke();

    // Tube base
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.ellipse(circuitCenterX, tubeTop + tubeHeight - 15, tubeWidth / 2 + 5, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cathode (heated element at bottom)
    const cathodeY = tubeTop + tubeHeight - 50;
    const cathodeWidth = 30;

    // Heater glow
    const glowIntensity = 0.4 + Math.sin(time * 10) * 0.1;
    const gradient = ctx.createRadialGradient(
      circuitCenterX, cathodeY, 0,
      circuitCenterX, cathodeY, 30
    );
    gradient.addColorStop(0, `rgba(255, 100, 50, ${glowIntensity})`);
    gradient.addColorStop(1, "rgba(255, 100, 50, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(circuitCenterX - 30, cathodeY - 20, 60, 40);

    // Cathode element
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(circuitCenterX - cathodeWidth / 2, cathodeY);
    ctx.lineTo(circuitCenterX + cathodeWidth / 2, cathodeY);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = "9px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Cathode", circuitCenterX + tubeWidth / 2 - 5, cathodeY + 4);

    // Grid (wire mesh in middle)
    const gridY = tubeTop + tubeHeight / 2 - 10;
    const gridWidth = 40;

    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 7; i++) {
      const gx = circuitCenterX - gridWidth / 2 + i * (gridWidth / 6);
      ctx.beginPath();
      ctx.moveTo(gx, gridY - 15);
      ctx.lineTo(gx, gridY + 15);
      ctx.stroke();
    }

    ctx.fillStyle = textColor;
    ctx.font = "9px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Grid", circuitCenterX + tubeWidth / 2 - 5, gridY + 4);

    // Plate (anode at top)
    const plateY = tubeTop + 45;
    const plateWidth = 50;

    ctx.fillStyle = "#374151";
    ctx.fillRect(circuitCenterX - plateWidth / 2, plateY - 10, plateWidth, 20);

    ctx.fillStyle = textColor;
    ctx.font = "9px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Plate", circuitCenterX + tubeWidth / 2 - 5, plateY + 4);

    // === ELECTRONS ===
    // Spawn new electrons from cathode
    if (Math.random() < electronFlowRate * 0.3) {
      electronsRef.current.push({
        x: circuitCenterX + (Math.random() - 0.5) * cathodeWidth * 0.8,
        y: cathodeY - 5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -1.5 - Math.random() * 1,
        age: 0
      });
    }

    // Update and draw electrons
    const newElectrons: Electron[] = [];
    electronsRef.current.forEach(e => {
      // Update position
      e.x += e.vx;
      e.y += e.vy;
      e.age += 1;

      // Electrons are attracted to plate (positive) and repelled by grid (negative)
      if (e.y > gridY - 10 && e.y < gridY + 10) {
        // Near grid - apply grid voltage effect
        const repulsion = -effectiveGridVoltage * 0.15;
        e.vy += repulsion;
        // Some electrons get blocked by negative grid
        if (effectiveGridVoltage < -1.5 && Math.random() < 0.1) {
          return; // Electron blocked
        }
      }

      // Accelerate toward plate
      if (e.y < gridY) {
        e.vy -= 0.1;
      }

      // Keep if still in tube
      if (e.y > plateY - 5 && e.y < cathodeY && e.age < 200) {
        newElectrons.push(e);

        // Draw electron
        ctx.fillStyle = "#60a5fa";
        ctx.beginPath();
        ctx.arc(e.x, e.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    electronsRef.current = newElectrons;

    // === WIRE TO GRID ===
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gridResX, capY);
    ctx.lineTo(circuitCenterX - tubeWidth / 2 + 5, capY);
    ctx.lineTo(circuitCenterX - tubeWidth / 2 + 5, gridY);
    ctx.lineTo(circuitCenterX - gridWidth / 2 - 5, gridY);
    ctx.stroke();

    // === PLATE LOAD RESISTOR (Ra) ===
    const plateResX = circuitCenterX;
    const plateResY = tubeTop - 40;

    // Wire from plate to resistor
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(circuitCenterX, plateY - 10);
    ctx.lineTo(circuitCenterX, plateResY + 20);
    ctx.stroke();

    // Plate resistor symbol
    ctx.strokeStyle = componentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plateResX - 15, plateResY + 20);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(plateResX - 15 + (i + 1) * 7, plateResY + 20 + (i % 2 === 0 ? 6 : -6));
    }
    ctx.lineTo(plateResX + 15, plateResY + 20);
    ctx.stroke();

    ctx.fillStyle = mutedColor;
    ctx.font = "8px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Ra", plateResX, plateResY + 8);

    // B+ supply
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plateResX - 15, plateResY + 20);
    ctx.lineTo(plateResX - 15, plateResY - 5);
    ctx.stroke();

    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("B+", plateResX - 15, plateResY - 10);
    ctx.fillStyle = mutedColor;
    ctx.font = "8px system-ui";
    ctx.fillText("(250-400V)", plateResX - 15, plateResY - 22);

    // === OUTPUT COUPLING CAP ===
    const outCapX = circuitCenterX + tubeWidth / 2 + 30;
    const outCapY = plateY;

    // Wire from plate to output cap
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plateResX + 15, plateResY + 20);
    ctx.lineTo(outCapX - 10, plateResY + 20);
    ctx.lineTo(outCapX - 10, outCapY);
    ctx.stroke();

    // Output coupling capacitor
    ctx.strokeStyle = componentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(outCapX - 10, outCapY - 10);
    ctx.lineTo(outCapX - 10, outCapY + 10);
    ctx.moveTo(outCapX - 5, outCapY - 10);
    ctx.lineTo(outCapX - 5, outCapY + 10);
    ctx.stroke();

    ctx.fillStyle = mutedColor;
    ctx.font = "8px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("C2", outCapX - 7, outCapY - 15);

    // Wire to output (AC output, after coupling cap)
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(outCapX - 5, outCapY);
    ctx.lineTo(outputWaveX, acWaveY);
    ctx.stroke();

    // === CATHODE BIAS RESISTOR (Rk) ===
    const cathodeResX = circuitCenterX;
    const cathodeResY = tubeTop + tubeHeight + 25;

    // Wire from cathode to resistor
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(circuitCenterX, cathodeY + 5);
    ctx.lineTo(circuitCenterX, tubeTop + tubeHeight - 10);
    ctx.lineTo(circuitCenterX, cathodeResY - 15);
    ctx.stroke();

    // Cathode resistor symbol
    ctx.strokeStyle = componentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cathodeResX, cathodeResY - 15);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(cathodeResX + (i % 2 === 0 ? 6 : -6), cathodeResY - 15 + (i + 1) * 7);
    }
    ctx.lineTo(cathodeResX, cathodeResY + 15);
    ctx.stroke();

    ctx.fillStyle = mutedColor;
    ctx.font = "8px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Rk", cathodeResX + 10, cathodeResY);

    // Bypass capacitor parallel to Rk
    const bypassCapX = cathodeResX + 25;
    ctx.strokeStyle = componentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cathodeResX, cathodeResY - 15);
    ctx.lineTo(bypassCapX, cathodeResY - 15);
    ctx.moveTo(bypassCapX, cathodeResY - 5);
    ctx.lineTo(bypassCapX, cathodeResY - 15);
    ctx.stroke();

    // Capacitor symbol
    ctx.beginPath();
    ctx.moveTo(bypassCapX - 6, cathodeResY - 5);
    ctx.lineTo(bypassCapX + 6, cathodeResY - 5);
    ctx.moveTo(bypassCapX - 6, cathodeResY);
    ctx.lineTo(bypassCapX + 6, cathodeResY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bypassCapX, cathodeResY);
    ctx.lineTo(bypassCapX, cathodeResY + 15);
    ctx.lineTo(cathodeResX, cathodeResY + 15);
    ctx.stroke();

    ctx.fillStyle = mutedColor;
    ctx.font = "8px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Ck", bypassCapX + 8, cathodeResY);

    // Ground for cathode
    ctx.strokeStyle = componentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cathodeResX, cathodeResY + 15);
    ctx.lineTo(cathodeResX, cathodeResY + 25);
    ctx.moveTo(cathodeResX - 8, cathodeResY + 25);
    ctx.lineTo(cathodeResX + 8, cathodeResY + 25);
    ctx.moveTo(cathodeResX - 5, cathodeResY + 29);
    ctx.lineTo(cathodeResX + 5, cathodeResY + 29);
    ctx.moveTo(cathodeResX - 2, cathodeResY + 33);
    ctx.lineTo(cathodeResX + 2, cathodeResY + 33);
    ctx.stroke();

    // === INFO PANEL ===
    const infoY = height - 60;
    ctx.fillStyle = mutedColor;
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";

    // Grid voltage indicator
    const gvColor = effectiveGridVoltage < -2 ? "#ef4444" : effectiveGridVoltage > -0.5 ? "#22c55e" : "#f59e0b";
    ctx.fillStyle = textColor;
    ctx.fillText("Grid voltage: ", padding, infoY);
    ctx.fillStyle = gvColor;
    ctx.fillText(`${effectiveGridVoltage.toFixed(1)}V`, padding + 75, infoY);

    ctx.fillStyle = textColor;
    ctx.fillText("Electron flow: ", padding, infoY + 16);
    ctx.fillStyle = electronFlowRate > 0.8 ? "#22c55e" : electronFlowRate > 0.3 ? "#f59e0b" : "#ef4444";
    ctx.fillText(`${(electronFlowRate * 100).toFixed(0)}%`, padding + 80, infoY + 16);

    // Phase inversion note
    ctx.fillStyle = mutedColor;
    ctx.font = "10px system-ui";
    ctx.textAlign = "right";
    ctx.fillText("Note: Output is phase-inverted (180°)", width - padding, infoY + 8);

  }, [inputLevel, cathodeR, softClip]);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.03;
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

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
          aria-label="Vacuum tube preamp visualization"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Input Level</span>
                <span className="text-zinc-800 dark:text-zinc-400">{inputLevel.toFixed(1)}V</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.1"
                value={inputLevel}
                onChange={(e) => setInputLevel(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-zinc-400">
              <span className="flex justify-between">
                <span>Cathode Resistor (Rk)</span>
                <span className="text-zinc-800 dark:text-zinc-400">{cathodeR.toFixed(1)}kΩ → {(-cathodeR).toFixed(1)}V bias</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={cathodeR}
                onChange={(e) => setCathodeR(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-zinc-400 flex justify-between">
                <span>Hot (clips early)</span>
                <span>Cold (more headroom)</span>
              </span>
            </label>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-500">
            <strong>Watch the electrons:</strong> The cathode resistor sets the bias point. Lower
            resistance = hotter bias = clips sooner. Higher resistance = colder bias = more clean headroom.
          </p>
        </div>
      </div>
    </div>
  );
}
