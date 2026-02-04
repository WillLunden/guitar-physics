"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

interface NavSectionProps {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

export default function NavSection({
  title,
  items,
  defaultOpen = false,
}: NavSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const pathname = usePathname();

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
        )}
        {title}
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/20 to-orange-500/20 text-purple-700 dark:text-purple-300 font-medium"
                    : "text-zinc-800 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
