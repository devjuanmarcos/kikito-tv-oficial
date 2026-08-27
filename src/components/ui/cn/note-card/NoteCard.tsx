"use client";
import type React from "react";

import { cn } from "@/lib/utils";

export type NoteCardColor = "yellow" | "blue" | "green" | "pink" | "purple" | "orange";

export interface NoteCardProps {
  children: React.ReactNode;
  color?: NoteCardColor;
  rotate?: number;
  author?: string;
  date?: string;
  className?: string;
  style?: React.CSSProperties;
}

const COLOR_CLS: Record<NoteCardColor, string> = {
  yellow: "bg-[#fef08a] text-[#713f12]",
  blue: "bg-[#bfdbfe] text-[#1e3a5f]",
  green: "bg-[#bbf7d0] text-[#14532d]",
  pink: "bg-[#fbcfe8] text-[#831843]",
  purple: "bg-[#ddd6fe] text-[#4c1d95]",
  orange: "bg-[#fed7aa] text-[#7c2d12]",
};

export function NoteCard({ children, color = "yellow", rotate = 0, author, date, className, style }: NoteCardProps) {
  return (
    <div
      style={{ transform: rotate !== 0 ? `rotate(${rotate}deg)` : undefined, ...style }}
      className={cn(
        "relative p-4 rounded-(--radius-md) shadow-[2px_4px_12px_oklch(0%_0_0/0.2)] min-w-[120px]",
        COLOR_CLS[color],
        className
      )}
    >
      {/* Pin decoration */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/60 shadow-[0_1px_3px_oklch(0%_0_0/0.3)] border border-white/40" />

      <p className="text-sm font-medium leading-snug mt-1">{children}</p>

      {(author || date) && (
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/20 text-[0.65rem] font-medium opacity-60">
          {author && <span>{author}</span>}
          {date && <span>{date}</span>}
        </div>
      )}
    </div>
  );
}
