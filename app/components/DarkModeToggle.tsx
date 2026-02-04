"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
        aria-label="Toggle dark mode"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-orange-400" />
      ) : (
        <Moon className="w-5 h-5 text-purple-600" />
      )}
    </button>
  );
}
