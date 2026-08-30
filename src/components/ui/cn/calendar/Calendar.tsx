"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { DatePicker } from "../date-picker/DatePicker";

import type { CalendarProps, CalendarRange } from "./calendar.types";

/* ── Icons/consts — cópia local dos mesmos usados em DatePicker.tsx (não exportados
   de lá) — mesmo espírito de "escala própria do componente" já usado em outros
   pontos do design system: duplicar um bloco pequeno e autocontido é mais seguro
   aqui do que abrir os internals do Super DatePicker (888 linhas) só pra reexportar
   2 ícones + 2 arrays. */
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

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/* ── Grade de mês compartilhada por range/multiple — igual em espírito ao
   InlineCalendar do DatePicker (mesmas classes visuais), só que o predicado de
   seleção/hover é injetado por fora em vez de ser sempre "1 data == selecionada". */
function MonthGrid({
  viewYear,
  viewMonth,
  onPrev,
  onNext,
  isSelected,
  isInRange,
  isRangeEdge,
  onSelectDay,
}: {
  viewYear: number;
  viewMonth: number;
  onPrev: () => void;
  onNext: () => void;
  isSelected: (d: Date) => boolean;
  isInRange?: (d: Date) => boolean;
  isRangeEdge?: (d: Date) => boolean;
  onSelectDay: (d: Date) => void;
}) {
  const today = new Date();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const dayCount = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + dayCount }, (_, i) => (i < firstDay ? null : i - firstDay + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-(--spacing-sm)">
        <button
          type="button"
          onClick={onPrev}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-faint hover:text-foreground hover:bg-graphite transition-colors"
        >
          <ChevronL />
        </button>
        <span className="text-body-callout font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={onNext}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-faint hover:text-foreground hover:bg-graphite transition-colors"
        >
          <ChevronR />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-(--spacing-2xs)">
        {WEEKDAYS.map((d) => (
          // text-[0.65rem]: below scale minimum, micro-label do dia da semana (mesma
          // exceção já documentada no InlineCalendar do DatePicker)
          <div key={d} className="text-center text-[0.65rem] font-medium text-faint py-(--spacing-2xs)">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-(--spacing-2xs)">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(viewYear, viewMonth, day);
          const today_ = isSameDay(date, today);
          const selected = isSelected(date);
          const inRange = isInRange?.(date) ?? false;
          const edge = isRangeEdge?.(date) ?? selected;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay(date)}
              aria-pressed={selected}
              aria-label={date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
              className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-lg mx-auto text-body-callout",
                "transition-[background,color] duration-[80ms]",
                edge && "bg-patina text-patina-fg font-semibold",
                !edge && inRange && "bg-patina-soft text-patina-soft-fg rounded-none",
                !edge && !inRange && today_ && "border border-patina text-patina font-semibold",
                !edge && !inRange && !today_ && "text-foreground hover:bg-graphite"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function useMonthNav(seed: Date) {
  const [viewYear, setViewYear] = useState(() => seed.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => seed.getMonth());
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
  return { viewYear, viewMonth, prevMonth, nextMonth };
}

/* ── mode="range" — clique 1 marca o início, clique 2 marca o fim (troca sozinho
   se o segundo clique for antes do primeiro). Origem: calendar-04/06/09.tsx do
   shadcndashboard, aprovado no DECISIONS.md #5. */
function CalendarRangeImpl({
  value,
  defaultValue,
  onChange,
  className,
  style,
}: {
  value?: CalendarRange;
  defaultValue?: CalendarRange;
  onChange?: (range: CalendarRange) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<CalendarRange>(defaultValue ?? { start: null, end: null });
  const range = isControlled ? value ?? { start: null, end: null } : internal;
  const { viewYear, viewMonth, prevMonth, nextMonth } = useMonthNav(range.start ?? new Date());

  function selectDay(date: Date) {
    let next: CalendarRange;
    if (!range.start || (range.start && range.end)) {
      next = { start: date, end: null };
    } else if (date < range.start) {
      next = { start: date, end: range.start };
    } else {
      next = { start: range.start, end: date };
    }
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <div
      style={style}
      className={cn(
        "inline-flex flex-col gap-(--spacing-2xs) p-(--spacing-lg) rounded-2xl border border-rule bg-raised",
        className
      )}
    >
      <MonthGrid
        viewYear={viewYear}
        viewMonth={viewMonth}
        onPrev={prevMonth}
        onNext={nextMonth}
        onSelectDay={selectDay}
        isSelected={(d) => (!!range.start && isSameDay(d, range.start)) || (!!range.end && isSameDay(d, range.end))}
        isRangeEdge={(d) => (!!range.start && isSameDay(d, range.start)) || (!!range.end && isSameDay(d, range.end))}
        isInRange={(d) => !!range.start && !!range.end && d > range.start && d < range.end}
      />
    </div>
  );
}

/* ── mode="multiple" — qualquer número de datas, cada uma alternada independente
   (clicar numa data já selecionada remove ela do array). */
function CalendarMultipleImpl({
  value,
  defaultValue,
  onChange,
  className,
  style,
}: {
  value?: Date[];
  defaultValue?: Date[];
  onChange?: (dates: Date[]) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<Date[]>(defaultValue ?? []);
  const dates = isControlled ? value ?? [] : internal;
  const { viewYear, viewMonth, prevMonth, nextMonth } = useMonthNav(dates[0] ?? new Date());

  function selectDay(date: Date) {
    const exists = dates.some((d) => isSameDay(d, date));
    const next = exists ? dates.filter((d) => !isSameDay(d, date)) : [...dates, date];
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <div
      style={style}
      className={cn(
        "inline-flex flex-col gap-(--spacing-2xs) p-(--spacing-lg) rounded-2xl border border-rule bg-raised",
        className
      )}
    >
      <MonthGrid
        viewYear={viewYear}
        viewMonth={viewMonth}
        onPrev={prevMonth}
        onNext={nextMonth}
        onSelectDay={selectDay}
        isSelected={(d) => dates.some((sel) => isSameDay(sel, d))}
      />
    </div>
  );
}

/**
 * Calendar — backward-compat wrapper (mode="single", default) + range/multiple
 * selection nativas do próprio Calendar (não delegadas ao DatePicker, que só
 * suporta range no modo "input"/popover, nunca inline — ver docs/component-import/
 * variant-intake/DECISIONS.md #5).
 *
 * mode="single" (default): a lógica inline-calendar-grid continua vivendo no Super
 * `DatePicker` (`<DatePicker mode="inline" />`) — este wrapper preserva a API
 * original (value como `Date`, onChange emitindo `Date`).
 */
export function Calendar(props: CalendarProps) {
  if (props.mode === "range") {
    const { value, defaultValue, onChange, className, style } = props;
    return (
      <CalendarRangeImpl
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={className}
        style={style}
      />
    );
  }
  if (props.mode === "multiple") {
    const { value, defaultValue, onChange, className, style } = props;
    return (
      <CalendarMultipleImpl
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={className}
        style={style}
      />
    );
  }
  const { value, defaultValue, onChange, events, onEventClick, className, style } = props;
  return (
    <DatePicker
      mode="inline"
      value={value}
      defaultValue={defaultValue}
      onChange={(d) => {
        if (d) onChange?.(d);
      }}
      events={events}
      onEventClick={onEventClick}
      className={className}
      style={style}
    />
  );
}
