"use client";

import { useState } from "react";
import { Menu, X, Github } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import NavSection from "./NavSection";

const navSections = [
  {
    title: "Vibrations & Waves",
    items: [
      { label: "Wave Equation", href: "/vibrations-and-waves/wave-equation" },
      {
        label: "Picking Simulation",
        href: "/vibrations-and-waves/picking-simulation",
      },
      // { label: "Tonewoods", href: "/vibrations-and-waves/tonewoods" }, // Hidden - needs work
    ],
  },
  {
    title: "Transduction",
    items: [
      { label: "Pickup Operation", href: "/transduction/pickup-operation" },
      { label: "Pickup Placement", href: "/transduction/pickup-placement" },
      { label: "Humbuckers", href: "/transduction/humbuckers" },
    ],
  },
  {
    title: "Fret Placement",
    items: [
      { label: "Equal Temperament", href: "/tuning/equal-temperament" },
      { label: "Multiscale", href: "/tuning/multiscale" },
      { label: "True Temperament", href: "/tuning/true-temperament" },
    ],
  },
  {
    title: "Electronics",
    items: [
      { label: "Gain Simulation", href: "/electronics/gain-simulation" },
      { label: "Intermodulation", href: "/electronics/intermodulation" },
      { label: "Tube Preamp", href: "/electronics/tube-preamp" },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-zinc-900 shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-zinc-900 dark:text-zinc-300" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
                Physics of Shred
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-zinc-900 dark:text-zinc-300" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <Link
              href="/about"
              className="block px-3 py-2 mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              About
            </Link>
            {navSections.map((section) => (
              <NavSection
                key={section.title}
                title={section.title}
                items={section.items}
                defaultOpen={true}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-end">
              <a
                href="https://github.com/WillLunden/guitar-physics"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-zinc-800 dark:text-zinc-400" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
