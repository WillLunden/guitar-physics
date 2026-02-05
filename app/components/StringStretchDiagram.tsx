"use client";

import { useEffect, useRef, useCallback } from "react";

interface StringStretchDiagramProps {
  className?: string;
}

export default function StringStretchDiagram({ className = "" }: StringStretchDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const padding = 50;
    const diagramWidth = width - padding * 2;

    // Positions
    const nutX = padding;
    const fretX = padding + diagramWidth * 0.35;
    const fingerX = fretX - 25; // Finger presses BEHIND the fret
    const bridgeX = padding + diagramWidth;

    // Heights
    const fretboardY = height * 0.42; // The fretboard surface
    const fretHeight = 8; // How tall the fret wire is
    const fretTopY = fretboardY - fretHeight;
    const stringActionHeight = 12; // String height above fretboard when open
    const openStringY = fretboardY - stringActionHeight - fretHeight;
    const pressDepth = stringActionHeight + 4; // How far finger pushes string down

    // === TOP: Open string (unfretted) ===
    ctx.fillStyle = "#71717a";
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Open string — string floats above fret:", padding, 20);

    // Draw fretboard
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(nutX - 10, fretboardY, diagramWidth + 20, 16);

    // Draw nut (at string height)
    ctx.fillStyle = "#e4e4e7";
    ctx.fillRect(nutX - 4, openStringY - 4, 8, stringActionHeight + fretHeight + 8);

    // Draw fret (raised above fretboard)
    ctx.fillStyle = "#d4d4d8";
    ctx.fillRect(fretX - 2, fretTopY, 5, fretHeight);

    // Draw bridge saddle
    ctx.fillStyle = "#a1a1aa";
    ctx.fillRect(bridgeX - 4, openStringY - 4, 8, stringActionHeight + fretHeight + 8);

    // Open string - straight line floating above fret
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(nutX, openStringY);
    ctx.lineTo(bridgeX, openStringY);
    ctx.stroke();

    // Show clearance above fret
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(fretX + 8, openStringY);
    ctx.lineTo(fretX + 8, fretTopY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#22c55e";
    ctx.font = "9px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("clearance", fretX + 12, openStringY + 8);

    // Labels for top
    ctx.fillStyle = "#52525b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Nut", nutX, fretboardY + 28);
    ctx.fillText("Fret", fretX, fretboardY + 28);
    ctx.fillText("Bridge", bridgeX, fretboardY + 28);

    // === BOTTOM: Fretted string ===
    const bottomOffset = height * 0.5;
    const fretboardY2 = fretboardY + bottomOffset;
    const fretTopY2 = fretboardY2 - fretHeight;
    const openStringY2 = fretboardY2 - stringActionHeight - fretHeight;
    const pressedY = openStringY2 + pressDepth; // Where finger pushes string to

    ctx.fillStyle = "#71717a";
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Fretted string — finger presses string down behind fret:", padding, bottomOffset + 8);

    // Draw fretboard
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(nutX - 10, fretboardY2, diagramWidth + 20, 16);

    // Draw nut
    ctx.fillStyle = "#e4e4e7";
    ctx.fillRect(nutX - 4, openStringY2 - 4, 8, stringActionHeight + fretHeight + 8);

    // Draw fret
    ctx.fillStyle = "#d4d4d8";
    ctx.fillRect(fretX - 2, fretTopY2, 5, fretHeight);

    // Draw bridge saddle
    ctx.fillStyle = "#a1a1aa";
    ctx.fillRect(bridgeX - 4, openStringY2 - 4, 8, stringActionHeight + fretHeight + 8);

    // Muted portion: nut → finger press point → fret top (dashed, dimmed)
    ctx.strokeStyle = "#a1a1aa";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(nutX, openStringY2);
    ctx.lineTo(fingerX, pressedY); // Down to finger
    ctx.lineTo(fretX, fretTopY2); // Up to fret top
    ctx.stroke();
    ctx.setLineDash([]);

    // Vibrating portion: fret top → bridge (solid orange)
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fretX, fretTopY2);
    ctx.lineTo(bridgeX, openStringY2);
    ctx.stroke();

    // Finger indicator (pressing behind the fret)
    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.ellipse(fingerX, pressedY - 6, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Arrow showing press direction
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fingerX, pressedY - 28);
    ctx.lineTo(fingerX, pressedY - 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fingerX - 4, pressedY - 20);
    ctx.lineTo(fingerX, pressedY - 16);
    ctx.lineTo(fingerX + 4, pressedY - 20);
    ctx.stroke();

    // Labels for bottom
    ctx.fillStyle = "#52525b";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Nut", nutX, fretboardY2 + 28);
    ctx.fillText("Fret", fretX, fretboardY2 + 28);
    ctx.fillText("Bridge", bridgeX, fretboardY2 + 28);

    // Label the portions
    ctx.font = "9px system-ui";
    ctx.fillStyle = "#71717a";
    ctx.fillText("(muted)", (nutX + fretX) / 2, pressedY + 18);

    ctx.fillStyle = "#f97316";
    ctx.font = "bold 10px system-ui";
    ctx.fillText("Vibrating portion →", (fretX + bridgeX) / 2 - 20, fretTopY2 - 8);

    // Key insight at bottom
    ctx.fillStyle = "#dc2626";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("The string now travels a longer path → stretched → higher tension → goes sharp", width / 2, height - 12);

  }, []);

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
          aria-label="String stretch diagram comparing open and fretted string"
        />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-wrap gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-green-500" />
              Open string
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-orange-500" />
              Vibrating portion (determines pitch)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-zinc-400" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #a1a1aa 0, #a1a1aa 4px, transparent 4px, transparent 7px)' }} />
              Muted portion
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-3 rounded-full bg-purple-600" />
              Finger pressing down
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
