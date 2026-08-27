"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

import type { EventCalendarProps, CalendarEvent } from "./event-calendar.types";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const intentMap: Record<string, string> = {
  primary: "bg-patina-soft text-patina",
  secondary: "bg-kinpaku-soft text-kinpaku",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  tertiary: "bg-violet-soft text-violet",
  quaternary: "bg-rose-soft text-rose",
};

export function EventCalendar({
  events = [],
  defaultMonth,
  onEventClick,
  onDayClick,
  className,
  style,
}: EventCalendarProps) {
  const initial = defaultMonth ? new Date(defaultMonth + "-01") : new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; outside: boolean; str: string }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    cells.push({ day: d, outside: true, str: toDateStr(prevY, prevM, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, outside: false, str: toDateStr(year, month, d) });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    cells.push({ day: d, outside: true, str: toDateStr(nextY, nextM, d) });
  }

  const eventsOnDay = (str: string): CalendarEvent[] => events.filter((e) => e.date === str);

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <div
      className={cn(
        "bg-raised border border-rule rounded-(--radius-lg) overflow-hidden text-body-callout text-foreground",
        className
      )}
      style={style}
    >
      {/* px-[18px]/py-[14px]: sem match exato na escala de spacing */}
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-rule bg-sunken">
        <button
          type="button"
          aria-label="Mês anterior"
          className="w-[30px] h-[30px] bg-transparent border border-rule rounded-(--radius-sm) cursor-pointer text-muted flex items-center justify-center text-body-callout transition-colors duration-[120ms] hover:bg-float hover:text-foreground"
          onClick={prev}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <span className="text-body-paragraph font-bold text-foreground">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          aria-label="Próximo mês"
          className="w-[30px] h-[30px] bg-transparent border border-rule rounded-(--radius-sm) cursor-pointer text-muted flex items-center justify-center text-body-callout transition-colors duration-[120ms] hover:bg-float hover:text-foreground"
          onClick={next}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-rule">
        {WEEKDAYS.map((d) => (
          // text-[0.625rem]: below scale minimum, micro-label do dia da semana
          <div
            key={d}
            className="py-(--spacing-sm) text-center text-[0.625rem] font-bold uppercase tracking-[0.06em] text-faint"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const dayEvents = eventsOnDay(cell.str);
          const isToday = cell.str === todayStr;
          return (
            <div
              key={i}
              role={onDayClick ? "button" : undefined}
              tabIndex={onDayClick ? 0 : undefined}
              aria-label={onDayClick ? `Dia ${cell.day}` : undefined}
              className={cn(
                // py-[6px]/px-[8px] (era p-[6px_8px]): matches exatos --spacing-xs/--spacing-sm
                "min-h-[80px] py-(--spacing-xs) px-(--spacing-sm) border-r border-b border-rule cursor-pointer transition-colors duration-100 align-top",
                "[&:nth-child(7n)]:border-r-0",
                "hover:bg-float",
                isToday && "bg-patina-soft",
                cell.outside && "opacity-30"
              )}
              onClick={() => onDayClick?.(cell.str)}
              onKeyDown={
                onDayClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onDayClick(cell.str);
                      }
                    }
                  : undefined
              }
            >
              <div
                className={cn(
                  "text-body-caption font-semibold text-muted mb-(--spacing-2xs)",
                  isToday && "text-patina"
                )}
              >
                {cell.day}
              </div>
              <div className="flex flex-col gap-(--spacing-3xs)">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    role={onEventClick ? "button" : undefined}
                    tabIndex={onEventClick ? 0 : undefined}
                    // text-[0.625rem]: below scale minimum, chip de evento no calendário
                    className={cn(
                      "px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs) text-[0.625rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer transition-opacity duration-[120ms] hover:opacity-80",
                      intentMap[ev.intent ?? "primary"] ?? intentMap.primary
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(ev);
                    }}
                    onKeyDown={
                      onEventClick
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              onEventClick(ev);
                            }
                          }
                        : undefined
                    }
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  // text-[0.625rem]: below scale minimum
                  <div className="px-(--spacing-xs) py-(--spacing-3xs) rounded-(--radius-xs) text-[0.625rem] font-semibold bg-patina-soft text-patina opacity-60">
                    +{dayEvents.length - 3}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
