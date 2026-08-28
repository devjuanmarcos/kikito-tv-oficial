"use client";

import React from "react";

import { cn } from "@/lib/utils";

import type { MiniMapProps } from "./mini-map.types";

export function MiniMap({ sections, activeId, onNavigate, position = "right", className, style }: MiniMapProps) {
  return (
    <nav className={cn("flex flex-col items-center gap-0", className)} style={style} aria-label="Page navigation">
      {sections.map((section, i) => {
        const isActive = activeId === section.id;
        return (
          <React.Fragment key={section.id}>
            {i > 0 && <div className="w-px h-4 bg-rule" />}
            <button
              type="button"
              className="group flex items-center gap-(--spacing-sm) py-(--spacing-3xs)"
              onClick={() => {
                onNavigate?.(section.id);
                document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-current={isActive ? "true" : undefined}
            >
              {position === "right" && (
                <span
                  className={cn(
                    "text-body-caption text-right opacity-0 group-hover:opacity-100 transition-opacity text-muted max-w-[5rem] truncate",
                    isActive && "opacity-100 text-patina font-semibold"
                  )}
                >
                  {section.label}
                </span>
              )}
              <div
                className={cn(
                  "rounded-full transition-all duration-200",
                  isActive ? "w-3 h-3 bg-patina" : "w-2 h-2 bg-rule group-hover:bg-muted"
                )}
              />
              {position === "left" && (
                <span
                  className={cn(
                    "text-body-caption text-left opacity-0 group-hover:opacity-100 transition-opacity text-muted max-w-[5rem] truncate",
                    isActive && "opacity-100 text-patina font-semibold"
                  )}
                >
                  {section.label}
                </span>
              )}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
