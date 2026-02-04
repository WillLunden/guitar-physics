"use client";

import { useState } from "react";
import WaveEquationSim from "./WaveEquationSim";
import StringModesSim from "./StringModesSim";

interface SimulationTabsProps {
  className?: string;
}

const tabs = [
  {
    id: "string",
    label: "String Vibration",
    description: "Visualize standing waves with optional mode overlay",
  },
  {
    id: "modes",
    label: "String & Modes",
    description: "See how normal modes combine in real-time",
  },
];

export default function SimulationTabs({
  className = "",
}: SimulationTabsProps) {
  const [activeTab, setActiveTab] = useState("string");

  return (
    <div className={className}>
      {/* Tab buttons */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-purple-600 dark:text-purple-400"
                : "text-zinc-700 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-orange-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab description */}
      <p className="text-sm text-zinc-700 dark:text-zinc-500 py-3">
        {tabs.find((t) => t.id === activeTab)?.description}
      </p>

      {/* Tab content */}
      <div>
        {activeTab === "string" && <WaveEquationSim />}
        {activeTab === "modes" && <StringModesSim />}
      </div>
    </div>
  );
}
