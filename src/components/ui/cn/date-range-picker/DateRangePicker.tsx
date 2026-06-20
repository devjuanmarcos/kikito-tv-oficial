"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { DateRange, DateRangePickerProps } from "./date-range-picker.types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildCal(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  return { first, days };
}

function MonthGrid({
  year,
  month,
  range,
  hovered,
  onDay,
  onHover,
}: {
  year: number;
  month: number;
  range: DateRange;
  hovered: Date | null;
  onDay: (d: Date) => void;
  onHover: (d: Date | null) => void;
}) {
  const { first, days } = buildCal(year, month);
  const today = new Date();
  const cells: (Date | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1)),
  ];
  const endDisplay = range.end ?? hovered;

  return (
    <>
      <div className="grid grid-cols-7 gap-[2px]">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-body-caption font-semibold text-muted opacity-50 py-[3px]">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="pointer-events-none" />;
          const isStart = !!range.start && isSameDay(day, range.start);
          const isEnd = !!endDisplay && isSameDay(day, endDisplay);
          const inRange =
            !!range.start &&
            !!endDisplay &&
            day > (range.start < endDisplay ? range.start : endDisplay) &&
            day < (range.start < endDisplay ? endDisplay : range.start);
          const isToday = isSameDay(day, today);
          return (
            <button
              key={i}
              type="button"
              className={cn(
                "text-center text-body-caption py-[5px] border-0 bg-transparent text-foreground cursor-pointer transition-colors duration-100",
                !isStart && !isEnd && "rounded-(--radius-sm) hover:bg-raised",
                isToday && "font-bold",
                (isStart || isEnd) && "bg-patina text-patina-fg font-bold",
                isStart && !isEnd && "rounded-l-[6px] rounded-r-none",
                isEnd && !isStart && "rounded-r-[6px] rounded-l-none",
                isStart && isEnd && "rounded-(--radius-sm)",
                inRange && "bg-patina/18 rounded-none"
              )}
              onClick={() => onDay(day)}
              onMouseEnter={() => onHover(day)}
              onMouseLeave={() => onHover(null)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function DateRangePicker({
  value: controlled,
  defaultValue,
  onChange,
  placeholder = "Select date range",
  disabled = false,
  className,
  style,
}: DateRangePickerProps) {
  const [internal, setInternal] = useState<DateRange>(defaultValue ?? { start: null, end: null });
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<Date | null>(null);
  const today = new Date();
  const [leftYear, setLeftYear] = useState(today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(today.getMonth());
  const rootRef = useRef<HTMLDivElement>(null);

  const range = controlled !== undefined ? controlled : internal;

  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;

  function prev() {
    if (leftMonth === 0) {
      setLeftYear((y) => y - 1);
      setLeftMonth(11);
    } else setLeftMonth((m) => m - 1);
  }
  function next() {
    if (leftMonth === 11) {
      setLeftYear((y) => y + 1);
      setLeftMonth(0);
    } else setLeftMonth((m) => m + 1);
  }

  function handleDay(day: Date) {
    let next: DateRange;
    if (!range.start || (range.start && range.end)) {
      next = { start: day, end: null };
    } else {
      next = day < range.start ? { start: day, end: range.start } : { start: range.start, end: day };
      setOpen(false);
    }
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
  }

  useEffect(() => {
    if (!open) return;
    function h(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const displayLabel = range.start
    ? range.end
      ? `${fmt(range.start)} – ${fmt(range.end)}`
      : fmt(range.start)
    : undefined;

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)} style={style}>
      <button
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 bg-sunken border border-rule rounded-(--radius-base) cursor-pointer text-body-callout text-foreground transition-colors duration-150 min-w-[200px] justify-between hover:border-patina",
          disabled && "opacity-40 cursor-not-allowed"
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        type="button"
      >
        <span className="opacity-50 text-body-paragraph">📅</span>
        <span className={cn("flex-1 text-left text-body-callout", !displayLabel && "opacity-40")}>
          {displayLabel ?? placeholder}
        </span>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-[200] bg-float border border-rule rounded-(--radius-lg) shadow-[0_8px_32px_color-mix(in_srgb,black_20%,transparent)] p-4 flex gap-4 animate-in fade-in slide-in-from-top-1 duration-[120ms]">
          {/* Left month */}
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between mb-3">
              <button
                className="bg-transparent border-0 cursor-pointer text-muted text-body-paragraph px-[6px] py-[2px] rounded hover:bg-raised transition-colors duration-100"
                onClick={prev}
                type="button"
              >
                ‹
              </button>
              <span className="font-bold text-body-callout text-foreground">
                {MONTHS[leftMonth]} {leftYear}
              </span>
              <button
                className="invisible bg-transparent border-0 cursor-pointer text-muted text-body-paragraph px-[6px] py-[2px] rounded"
                type="button"
              >
                ›
              </button>
            </div>
            <MonthGrid
              year={leftYear}
              month={leftMonth}
              range={range}
              hovered={hovered}
              onDay={handleDay}
              onHover={setHovered}
            />
          </div>
          {/* Right month */}
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between mb-3">
              <button
                className="invisible bg-transparent border-0 cursor-pointer text-muted text-body-paragraph px-[6px] py-[2px] rounded"
                type="button"
              >
                ‹
              </button>
              <span className="font-bold text-body-callout text-foreground">
                {MONTHS[rightMonth]} {rightYear}
              </span>
              <button
                className="bg-transparent border-0 cursor-pointer text-muted text-body-paragraph px-[6px] py-[2px] rounded hover:bg-raised transition-colors duration-100"
                onClick={next}
                type="button"
              >
                ›
              </button>
            </div>
            <MonthGrid
              year={rightYear}
              month={rightMonth}
              range={range}
              hovered={hovered}
              onDay={handleDay}
              onHover={setHovered}
            />
          </div>
        </div>
      )}
    </div>
  );
}
