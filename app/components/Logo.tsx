"use client";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-label="Physics of Shred Logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* Guitar pick shape */}
      <path
        d="M24 4 C32 4 40 10 40 20 C40 32 28 44 24 44 C20 44 8 32 8 20 C8 10 16 4 24 4"
        fill="url(#logoGradient)"
      />
      {/* Sine wave through the pick */}
      <path
        d="M12 24 Q18 16 24 24 Q30 32 36 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
