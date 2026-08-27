"use client";

import type React from "react";
import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

import type { DateRange, DatePickerProps, DatePickerSingleProps, DatePickerRangeProps } from "./date-picker.types";

/* ── Icons ────────────────────────────────────────────────────────────────── */

const ChevronL = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={16}
    height={16}
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronR = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={16}
    height={16}
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const CalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={16}
    height={16}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={12}
    height={12}
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isToday(d: Date) {
  return isSameDay(d, new Date());
}

/* ── Single-date input (default mode) ─────────────────────────────────────── */
function SingleDatePicker({
  value,
  defaultValue = null,
  onChange,
  placeholder = "Select date…",
  label,
  helperText,
  errorText,
  state = "default",
  disabled = false,
  clearable = true,
  showTime = false,
  minDate,
  maxDate,
  formatDate,
  locale = "en-US",
  className,
}: DatePickerSingleProps) {
  const uid = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<Date | null>(defaultValue);
  const selected = isControlled ? value! : internal;

  const now = new Date();
  const [view, setView] = useState<"days" | "months" | "years">("days");
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? now.getMonth());
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(selected ? String(selected.getHours()).padStart(2, "0") : "00");
  const [minute, setMinute] = useState(selected ? String(selected.getMinutes()).padStart(2, "0") : "00");

  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  function commit(d: Date | null) {
    if (!isControlled) setInternal(d);
    onChange?.(d);
  }

  function selectDay(day: Date) {
    const d = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Number(hour), Number(minute));
    commit(d);
    if (!showTime) setOpen(false);
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    commit(null);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  function isDisabled(d: Date) {
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  }

  function buildGrid() {
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const dayCount = daysInMonth(viewYear, viewMonth);
    const prevCount = daysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);
    const cells: { date: Date; otherMonth: boolean }[] = [];

    for (let i = first - 1; i >= 0; i--) {
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({ date: new Date(y, m, prevCount - i), otherMonth: true });
    }
    for (let d = 1; d <= dayCount; d++) {
      cells.push({ date: new Date(viewYear, viewMonth, d), otherMonth: false });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({ date: new Date(y, m, d), otherMonth: true });
    }
    return cells;
  }

  const fmt =
    formatDate ??
    ((d: Date) =>
      d.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...(showTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      }));
  const displayStr = selected ? fmt(selected) : null;
  const grid = open && view === "days" ? buildGrid() : [];

  function handleGridKey(e: KeyboardEvent<HTMLButtonElement>, date: Date) {
    let target: Date | null = null;
    if (e.key === "ArrowRight") {
      target = new Date(date);
      target.setDate(date.getDate() + 1);
    }
    if (e.key === "ArrowLeft") {
      target = new Date(date);
      target.setDate(date.getDate() - 1);
    }
    if (e.key === "ArrowDown") {
      target = new Date(date);
      target.setDate(date.getDate() + 7);
    }
    if (e.key === "ArrowUp") {
      target = new Date(date);
      target.setDate(date.getDate() - 7);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectDay(date);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (target && e.key.startsWith("Arrow")) {
      e.preventDefault();
      if (target.getMonth() !== viewMonth || target.getFullYear() !== viewYear) {
        setViewMonth(target.getMonth());
        setViewYear(target.getFullYear());
      }
      setTimeout(() => {
        const btn = wrapRef.current?.querySelector<HTMLButtonElement>(`[data-date='${target!.toDateString()}']`);
        btn?.focus();
      }, 10);
    }
  }

  const dayBtnCls =
    "relative aspect-square flex items-center justify-center text-body-callout rounded-(--radius-sm) border-none bg-transparent cursor-pointer text-foreground font-inherit transition-[background,color] duration-[100ms] outline-none hover:bg-graphite focus-visible:shadow-[0_0_0_2px_var(--ks-primary)]";

  return (
    <div ref={wrapRef} className={cn("flex flex-col gap-(--spacing-xs) w-full relative", className)}>
      {label && (
        // id em vez de htmlFor: o alvo agora é um <div role="button"> (não labelable), associado via aria-labelledby
        <span id={`${uid}-label`} className="text-body-callout font-semibold text-foreground leading-none">
          {label}
        </span>
      )}

      {/* div (não button) porque contém um segundo controle interativo (limpar) — botão dentro de botão é HTML inválido e trava o foco por teclado no filho */}
      <div
        id={uid}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${uid}-popover` : undefined}
        aria-labelledby={label ? `${uid}-label` : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          "flex items-center w-full bg-raised border border-rule rounded-(--radius-sm) cursor-pointer font-inherit text-foreground transition-[border-color,box-shadow] duration-[140ms]",
          "focus:border-patina focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]",
          open && "border-patina shadow-[0_0_0_3px_color-mix(in_oklch,var(--ks-primary)_18%,transparent)]",
          errorText && "border-[color-mix(in_oklch,var(--ks-danger)_55%,transparent)]",
          disabled && "opacity-55 cursor-not-allowed"
        )}
        onClick={() => {
          if (!disabled) {
            setOpen((o) => !o);
            setView("days");
          }
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
            setView("days");
          }
        }}
      >
        <span className="inline-flex px-(--spacing-md) text-faint">
          <CalIcon />
        </span>
        <span className="flex-1 py-(--spacing-sm) pr-(--spacing-sm) text-body-callout text-left leading-normal">
          {displayStr ?? <span className="text-faint">{placeholder}</span>}
        </span>
        {clearable && selected && (
          <button
            type="button"
            className="inline-flex py-(--spacing-2xs) px-(--spacing-sm) text-faint hover:text-foreground cursor-pointer bg-transparent border-none"
            onClick={clear}
            aria-label="Clear date"
          >
            <XIcon />
          </button>
        )}
      </div>

      {open && (
        <div
          id={`${uid}-popover`}
          role="dialog"
          aria-label={label ?? "Choose date"}
          className="absolute top-[calc(100%+4px)] left-0 z-[300] bg-lacquer border border-rule rounded-(--radius-md) shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.45),0_2px_8px_-2px_oklch(0%_0_0/0.28)] p-(--spacing-lg) w-[280px]"
          style={{
            animationName: "ks-cal-in",
            animationDuration: "140ms",
            animationTimingFunction: "ease",
            animationFillMode: "both",
          }}
        >
          {view === "days" && (
            <>
              <div className="flex items-center mb-(--spacing-md)">
                <button
                  type="button"
                  className="inline-flex text-faint p-(--spacing-2xs) rounded-(--radius-sm) border-none bg-transparent cursor-pointer hover:text-foreground hover:bg-graphite flex-shrink-0"
                  onClick={prevMonth}
                >
                  <ChevronL />
                </button>
                <button
                  type="button"
                  className="flex-1 text-center text-body-callout font-bold text-foreground cursor-pointer rounded-(--radius-sm) p-(--spacing-2xs) hover:bg-graphite transition-[background] bg-transparent border-none font-inherit"
                  onClick={() => setView("months")}
                >
                  {MONTHS[viewMonth]} {viewYear}
                </button>
                <button
                  type="button"
                  className="inline-flex text-faint p-(--spacing-2xs) rounded-(--radius-sm) border-none bg-transparent cursor-pointer hover:text-foreground hover:bg-graphite flex-shrink-0"
                  onClick={nextMonth}
                >
                  <ChevronR />
                </button>
              </div>
              <div className="grid grid-cols-7 mb-(--spacing-2xs)">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    // text-[0.625rem]: below scale minimum, micro-label do dia da semana (Su/Mo/Tu…)
                    className="text-center text-[0.625rem] font-bold tracking-[0.06em] uppercase text-faint py-(--spacing-2xs)"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-(--spacing-3xs)">
                {grid.map(({ date, otherMonth }) => (
                  <button
                    key={date.toDateString()}
                    type="button"
                    data-date={date.toDateString()}
                    className={cn(
                      dayBtnCls,
                      isToday(date) && "text-patina font-bold",
                      selected && isSameDay(date, selected) && "bg-patina! text-patina-fg! font-bold",
                      otherMonth && "text-faint opacity-50",
                      isDisabled(date) && "opacity-35 cursor-not-allowed"
                    )}
                    disabled={isDisabled(date)}
                    tabIndex={selected && isSameDay(date, selected) ? 0 : isToday(date) ? 0 : -1}
                    onClick={() => selectDay(date)}
                    onKeyDown={(e) => handleGridKey(e, date)}
                  >
                    {date.getDate()}
                    {isToday(date) && (
                      <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-patina" />
                    )}
                  </button>
                ))}
              </div>
              {showTime && (
                <div className="flex items-center gap-(--spacing-sm) border-t border-rule mt-(--spacing-md) pt-(--spacing-md)">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    className="flex-1 bg-graphite border border-rule rounded-(--radius-sm) py-(--spacing-2xs) px-(--spacing-sm) font-inherit text-body-callout text-foreground text-center outline-none focus:border-patina"
                    value={hour}
                    onChange={(e) => setHour(e.target.value.padStart(2, "0"))}
                  />
                  <span className="text-faint font-bold">:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    className="flex-1 bg-graphite border border-rule rounded-(--radius-sm) py-(--spacing-2xs) px-(--spacing-sm) font-inherit text-body-callout text-foreground text-center outline-none focus:border-patina"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value.padStart(2, "0"))}
                  />
                  <button
                    type="button"
                    className="text-body-callout text-patina bg-transparent border-none cursor-pointer"
                    onClick={() => {
                      if (selected) {
                        const d = new Date(selected);
                        d.setHours(Number(hour));
                        d.setMinutes(Number(minute));
                        commit(d);
                      }
                      setOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </>
          )}

          {view === "months" && (
            <>
              <div className="flex items-center mb-(--spacing-md)">
                <button
                  type="button"
                  className="inline-flex text-faint p-(--spacing-2xs) rounded-(--radius-sm) border-none bg-transparent cursor-pointer hover:text-foreground hover:bg-graphite flex-shrink-0"
                  onClick={() => setViewYear((y) => y - 1)}
                >
                  <ChevronL />
                </button>
                <button
                  type="button"
                  className="flex-1 text-center text-body-callout font-bold text-foreground cursor-pointer rounded-(--radius-sm) p-(--spacing-2xs) hover:bg-graphite bg-transparent border-none font-inherit"
                  onClick={() => setView("years")}
                >
                  {viewYear}
                </button>
                <button
                  type="button"
                  className="inline-flex text-faint p-(--spacing-2xs) rounded-(--radius-sm) border-none bg-transparent cursor-pointer hover:text-foreground hover:bg-graphite flex-shrink-0"
                  onClick={() => setViewYear((y) => y + 1)}
                >
                  <ChevronR />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-(--spacing-2xs) max-h-[200px] overflow-y-auto">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    className={cn(
                      // py-[0.4rem] (6.4px): sem match exato na escala de spacing
                      "py-[0.4rem] rounded-(--radius-sm) border-none bg-transparent cursor-pointer font-inherit text-body-callout text-foreground text-center hover:bg-graphite transition-[background]",
                      i === viewMonth && viewYear === (selected?.getFullYear() ?? -1) && "bg-patina! text-patina-fg!"
                    )}
                    onClick={() => {
                      setViewMonth(i);
                      setView("days");
                    }}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}

          {view === "years" && (
            <>
              <div className="flex items-center mb-(--spacing-md)">
                <span className="flex-1 text-center text-body-callout font-bold text-foreground">Select year</span>
              </div>
              <div className="grid grid-cols-4 gap-(--spacing-2xs) max-h-[200px] overflow-y-auto">
                {Array.from({ length: 24 }, (_, i) => now.getFullYear() - 10 + i).map((y) => (
                  <button
                    key={y}
                    type="button"
                    className={cn(
                      // py-[0.4rem] (6.4px): sem match exato na escala de spacing
                      "py-[0.4rem] rounded-(--radius-sm) border-none bg-transparent cursor-pointer font-inherit text-body-callout text-foreground text-center hover:bg-graphite transition-[background]",
                      y === viewYear && "bg-patina! text-patina-fg!"
                    )}
                    onClick={() => {
                      setViewYear(y);
                      setView("months");
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {(errorText || helperText) && (
        <span className={cn("text-body-caption", errorText ? "text-danger" : "text-faint")}>
          {errorText ?? helperText}
        </span>
      )}
    </div>
  );
}

/* ── Inline calendar grid (mode="inline", absorbed from Calendar) ─────────── */
function InlineCalendar({
  value,
  defaultValue,
  onChange,
  events = [],
  onEventClick,
  className,
  style,
}: DatePickerSingleProps) {
  const today = new Date();
  const isControlled = value !== undefined;
  const initial = defaultValue ?? null;
  const [internal, setInternal] = useState<Date | undefined>(initial ?? undefined);
  const selected = (isControlled ? value : internal) ?? undefined;

  const seed = value ?? defaultValue ?? today;
  const [viewYear, setViewYear] = useState(() => seed.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => seed.getMonth());

  function select(d: Date) {
    if (!isControlled) setInternal(d);
    onChange?.(d);
    const dayEvents = events.filter((e) => isSameDay(e.date, d));
    if (dayEvents.length > 0) onEventClick?.(dayEvents[0]);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const dayCount = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + dayCount }, (_, i) => (i < firstDay ? null : i - firstDay + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      style={style}
      className={cn(
        "inline-flex flex-col gap-(--spacing-2xs) p-(--spacing-lg) rounded-2xl border border-rule bg-raised",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-(--spacing-sm)">
        <button
          type="button"
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-faint hover:text-foreground hover:bg-graphite transition-colors"
        >
          <ChevronL />
        </button>
        <span className="text-body-callout font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-faint hover:text-foreground hover:bg-graphite transition-colors"
        >
          <ChevronR />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-(--spacing-2xs)">
        {WEEKDAYS.map((d) => (
          // text-[0.65rem]: below scale minimum, micro-label do dia da semana
          <div key={d} className="text-center text-[0.65rem] font-medium text-faint py-(--spacing-2xs)">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-(--spacing-2xs)">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(viewYear, viewMonth, day);
          const today_ = isSameDay(date, today);
          const isSelected = selected ? isSameDay(date, selected) : false;
          const dayEvents = events.filter((e) => isSameDay(e.date, date));

          return (
            <button
              key={i}
              type="button"
              onClick={() => select(date)}
              className={cn(
                "relative flex flex-col items-center justify-center w-8 h-8 rounded-lg mx-auto text-body-callout",
                "transition-[background,color] duration-[80ms]",
                isSelected && "bg-patina text-patina-fg font-semibold",
                !isSelected && today_ && "border border-patina text-patina font-semibold",
                !isSelected && !today_ && "text-foreground hover:bg-graphite"
              )}
            >
              {day}
              {dayEvents.length > 0 && (
                <span
                  className={cn("absolute bottom-0.5 w-1 h-1 rounded-full", isSelected ? "bg-patina-fg/80" : "")}
                  style={!isSelected ? { background: dayEvents[0].color ?? "var(--ks-primary)" } : undefined}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Dual-calendar range picker (range, absorbed from DateRangePicker) ────── */
function rangeFmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function RangeMonthGrid({
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
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells: (Date | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1)),
  ];
  const endDisplay = range.end ?? hovered;

  return (
    <div className="grid grid-cols-7 gap-(--spacing-3xs)">
      {WEEKDAYS.map((d) => (
        // py-[3px]: sem match exato na escala de spacing
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
        const today_ = isSameDay(day, today);
        return (
          <button
            key={i}
            type="button"
            className={cn(
              // py-[5px]: sem match exato na escala de spacing
              "text-center text-body-caption py-[5px] border-0 bg-transparent text-foreground cursor-pointer transition-colors duration-100",
              !isStart && !isEnd && "rounded-(--radius-sm) hover:bg-raised",
              today_ && "font-bold",
              (isStart || isEnd) && "bg-patina text-patina-fg font-bold",
              isStart && !isEnd && "rounded-l-(--radius-sm) rounded-r-none",
              isEnd && !isStart && "rounded-r-(--radius-sm) rounded-l-none",
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
  );
}

function RangeDatePicker({
  value: controlled,
  defaultValue,
  onChange,
  placeholder = "Select date range",
  disabled = false,
  className,
  style,
}: DatePickerRangeProps) {
  const [internal, setInternal] = useState<DateRange>(defaultValue ?? { start: null, end: null });
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<Date | null>(null);
  const today = new Date();
  const [leftYear, setLeftYear] = useState(today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(today.getMonth());
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

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
    let nextRange: DateRange;
    if (!range.start || (range.start && range.end)) {
      nextRange = { start: day, end: null };
    } else {
      nextRange = day < range.start ? { start: day, end: range.start } : { start: range.start, end: day };
      setOpen(false);
    }
    if (controlled === undefined) setInternal(nextRange);
    onChange?.(nextRange);
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
      ? `${rangeFmt(range.start)} – ${rangeFmt(range.end)}`
      : rangeFmt(range.start)
    : undefined;

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)} style={style}>
      <button
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        className={cn(
          "inline-flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) bg-sunken border border-rule rounded-(--radius-base) cursor-pointer text-body-callout text-foreground transition-colors duration-150 min-w-[200px] justify-between hover:border-patina",
          disabled && "opacity-40 cursor-not-allowed"
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        type="button"
      >
        {/* emoji como ícone: desaconselhado em produção, sugestão de melhoria (não bloqueante) */}
        <span className="opacity-50 text-body-paragraph">📅</span>
        <span className={cn("flex-1 text-left text-body-callout", !displayLabel && "opacity-40")}>
          {displayLabel ?? placeholder}
        </span>
      </button>
      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-label="Choose date range"
          className="absolute top-[calc(100%+8px)] left-0 z-[200] bg-float border border-rule rounded-(--radius-lg) shadow-[0_8px_32px_color-mix(in_srgb,black_20%,transparent)] p-(--spacing-lg) flex gap-(--spacing-lg) animate-in fade-in slide-in-from-top-1 duration-[120ms]"
        >
          {/* Left month */}
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between mb-(--spacing-md)">
              <button
                className="bg-transparent border-0 cursor-pointer text-muted text-body-paragraph px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs) hover:bg-raised transition-colors duration-100"
                onClick={prev}
                type="button"
              >
                ‹
              </button>
              <span className="font-bold text-body-callout text-foreground">
                {MONTHS[leftMonth]} {leftYear}
              </span>
              <button
                className="invisible bg-transparent border-0 cursor-pointer text-muted text-body-paragraph px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs)"
                type="button"
              >
                ›
              </button>
            </div>
            <RangeMonthGrid
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
            <div className="flex items-center justify-between mb-(--spacing-md)">
              <button
                className="invisible bg-transparent border-0 cursor-pointer text-muted text-body-paragraph px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs)"
                type="button"
              >
                ‹
              </button>
              <span className="font-bold text-body-callout text-foreground">
                {MONTHS[rightMonth]} {rightYear}
              </span>
              <button
                className="bg-transparent border-0 cursor-pointer text-muted text-body-paragraph px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs) hover:bg-raised transition-colors duration-100"
                onClick={next}
                type="button"
              >
                ›
              </button>
            </div>
            <RangeMonthGrid
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

/**
 * DatePicker — Super component for the DATE family.
 *
 * Dispatches by discriminator:
 *  - `range` (default false) → dual-calendar range picker (absorbs DateRangePicker, value `{ start, end }`).
 *  - `mode="inline"`         → always-open calendar grid (absorbs Calendar, value `Date` + events).
 *  - default                 → single-date popover input (with optional `showTime`).
 *
 * Standalone DateRangePicker / Calendar are now backward-compat wrappers over
 * this component. TimePicker is kept standalone (catalog-absorb: value shape
 * `{ hours, minutes, period }` and standalone dropdown UI differ too much to
 * merge without regression).
 */
export function DatePicker(props: DatePickerProps) {
  if (props.range) return <RangeDatePicker {...props} />;
  if (props.mode === "inline") return <InlineCalendar {...props} />;
  return <SingleDatePicker {...props} />;
}
