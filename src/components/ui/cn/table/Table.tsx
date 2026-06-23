"use client";

import { useState, useRef, useEffect, useMemo, useCallback, type ReactNode, type CSSProperties } from "react";

import { Checkbox } from "@/components/ui/cn/checkbox/Checkbox";
import { Pagination } from "@/components/ui/cn/pagination/Pagination";
import { Select } from "@/components/ui/cn/select/Select";
import { cn } from "@/lib/utils";

import type { ColumnDef, DataTableProps, FilterOption, SortDir } from "./table.types";

const SortNone = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[14px] h-[14px]"
  >
    <path d="M7 15l5 5 5-5" />
    <path d="M7 9l5-5 5 5" />
  </svg>
);
const SortAsc = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[14px] h-[14px]"
  >
    <path d="M12 4v16m-5-5l5 5 5-5" />
  </svg>
);
const SortDesc = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[14px] h-[14px]"
  >
    <path d="M12 20V4M7 9l5-5 5 5" />
  </svg>
);
const FilterIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3 flex-shrink-0"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3 flex-shrink-0"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[10px] h-[10px]"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ViewIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[14px] h-[14px]"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3 text-faint flex-shrink-0"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const EmptyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

/* ── Primitive table elements ── */

export function Table({
  children,
  striped,
  size,
  className,
  style,
}: {
  children?: ReactNode;
  striped?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className="w-full overflow-x-auto overflow-y-visible border border-rule rounded-(--radius-md) bg-raised">
      <table
        className={cn("w-full border-collapse text-body-callout text-foreground", className)}
        data-striped={striped || undefined}
        data-size={size || "md"}
        style={style}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({
  children,
  sticky,
  className,
}: {
  children?: ReactNode;
  sticky?: boolean;
  className?: string;
}) {
  return (
    <thead className={cn("bg-graphite border-b border-rule", sticky && "sticky top-0 z-[2]", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: { children?: ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableFoot({ children, className }: { children?: ReactNode; className?: string }) {
  return <tfoot className={cn("border-t border-rule bg-graphite font-semibold", className)}>{children}</tfoot>;
}

export function TableRow({
  children,
  selected,
  onClick,
  className,
}: {
  children?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "border-b border-rule transition-colors duration-[80ms] last:border-b-0 hover:bg-patina/5",
        selected && "bg-patina/8",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  align,
  pinRight,
  colSpan,
  className,
  style,
}: {
  children?: ReactNode;
  align?: "left" | "center" | "right";
  pinRight?: boolean;
  colSpan?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <td
      className={cn(
        "px-[14px] py-3 align-middle",
        align === "center" && "text-center",
        align === "right" && "text-right",
        pinRight && "sticky right-0 bg-inherit shadow-[-1px_0_0_var(--ks-rule)]",
        className
      )}
      colSpan={colSpan}
      style={style}
    >
      {children}
    </td>
  );
}

export function TableHeadCell({
  children,
  align,
  sortable,
  sorted,
  onSort,
  pinRight,
  colSpan,
  className,
  style,
}: {
  children?: ReactNode;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sorted?: SortDir | null;
  onSort?: () => void;
  pinRight?: boolean;
  colSpan?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <th
      className={cn(
        "px-[14px] py-[11px] text-body-caption font-semibold tracking-[0.02em] text-faint text-left whitespace-nowrap select-none relative",
        sortable && "cursor-pointer hover:text-foreground",
        sorted && "text-foreground",
        align === "center" && "text-center",
        align === "right" && "text-right",
        pinRight && "sticky right-0 bg-inherit shadow-[-1px_0_0_var(--ks-rule)]",
        className
      )}
      onClick={sortable ? onSort : undefined}
      colSpan={colSpan}
      style={style}
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : sortable ? "none" : undefined}
    >
      <span className="inline-flex items-center gap-[5px]">
        {children}
        {sortable && (
          <span
            className={cn(
              "inline-flex items-center opacity-40 transition-opacity flex-shrink-0",
              sorted && "opacity-100 text-patina"
            )}
          >
            {sorted === "asc" ? <SortAsc /> : sorted === "desc" ? <SortDesc /> : <SortNone />}
          </span>
        )}
      </span>
    </th>
  );
}

export function TableCaption({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <caption className={cn("text-body-caption text-faint px-[14px] py-[10px] text-left caption-bottom", className)}>
      {children}
    </caption>
  );
}

/* ── SelectFilter ── */

function SelectFilter({
  title,
  options,
  value,
  multiple,
  onChange,
}: {
  title: string;
  options: FilterOption[];
  value: string[];
  multiple?: boolean;
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  function toggle(v: string) {
    if (multiple) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange(value.includes(v) ? [] : [v]);
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-[6px] h-8 px-[10px] border border-dashed border-rule rounded-(--radius-sm) bg-transparent text-body-callout text-faint cursor-pointer whitespace-nowrap transition-colors duration-[120ms] hover:border-patina hover:text-foreground",
          value.length > 0 && "border-patina border-solid text-foreground"
        )}
        onClick={() => setOpen((o) => !o)}
      >
        {value.length > 0 ? (
          <span
            className="w-[14px] h-[14px] border border-rule rounded flex items-center justify-center flex-shrink-0 bg-patina border-patina text-patina-fg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
          >
            <XIcon />
          </span>
        ) : (
          <PlusIcon />
        )}
        {title}
        {value.length > 0 && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-patina-soft text-patina rounded-[3px] text-[0.625rem] font-bold">
            {value.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-[800] bg-raised border border-rule rounded-(--radius-md) shadow-[0_4px_16px_oklch(0%_0_0_/_0.2)] min-w-[180px] overflow-hidden">
          <div className="p-2 border-b border-rule">
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title}…`}
              className="w-full bg-graphite border border-rule rounded-(--radius-sm) px-2 py-[5px] text-body-callout text-foreground outline-none placeholder:text-faint"
            />
          </div>
          <div className="max-h-[220px] overflow-y-auto p-1">
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="flex items-center gap-2 px-2 py-[7px] rounded-(--radius-sm) cursor-pointer text-body-callout border-0 bg-transparent w-full text-left text-foreground transition-colors duration-[80ms] hover:bg-patina/8"
                onClick={() => toggle(opt.value)}
              >
                <span
                  className={cn(
                    "w-[14px] h-[14px] border border-rule rounded-[3px] flex items-center justify-center flex-shrink-0 transition-colors duration-100",
                    value.includes(opt.value) && "bg-patina border-patina text-patina-fg"
                  )}
                >
                  {value.includes(opt.value) && <CheckIcon />}
                </span>
                {opt.icon && <span className="flex items-center text-faint">{opt.icon}</span>}
                {opt.label}
              </button>
            ))}
          </div>
          {value.length > 0 && (
            <button
              className="flex items-center justify-center p-[6px] border-t border-rule text-body-caption text-faint cursor-pointer bg-transparent border-l-0 border-r-0 border-b-0 w-full transition-colors duration-[120ms] hover:text-danger"
              onClick={() => onChange([])}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── ViewOptions ── */

function ViewOptions({
  columns,
  hidden,
  onToggle,
}: {
  columns: { key: string; header: string }[];
  hidden: Set<string>;
  onToggle: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const toggleable = columns.filter((c) => c.key !== "__select__");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="inline-flex items-center gap-[6px] h-8 px-[10px] border border-rule rounded-(--radius-sm) bg-transparent text-body-callout text-faint cursor-pointer relative transition-colors duration-[120ms] hover:text-foreground"
        onClick={() => setOpen((o) => !o)}
      >
        <ViewIcon />
        View
      </button>
      {open && (
        <div className="absolute top-[calc(100%+4px)] right-0 z-[800] bg-raised border border-rule rounded-(--radius-md) shadow-[0_4px_16px_oklch(0%_0_0_/_0.2)] min-w-[180px] p-[6px]">
          {toggleable.map((col) => {
            const visible = !hidden.has(col.key);
            return (
              <button
                key={col.key}
                type="button"
                className={cn(
                  "flex items-center gap-2 px-2 py-[7px] rounded-(--radius-sm) cursor-pointer text-body-callout border-0 bg-transparent w-full text-left transition-colors duration-[80ms] hover:bg-patina/8",
                  visible ? "text-foreground" : "text-faint"
                )}
                onClick={() => onToggle(col.key)}
              >
                <span
                  className={cn(
                    "w-[14px] h-[14px] border border-rule rounded-[3px] flex items-center justify-center flex-shrink-0 transition-colors duration-100",
                    visible && "bg-patina border-patina text-patina-fg"
                  )}
                >
                  {visible && <CheckIcon />}
                </span>
                {col.header}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Pagination ── */

function PaginationBar({
  page,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions,
  onChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: number[];
  onChange: (p: number) => void;
  onPageSizeChange: (ps: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={onChange}
        totalItems={totalItems}
        pageSize={pageSize}
        size="sm"
        className="flex-1"
      />
      <div className="flex items-center gap-2 text-body-callout text-faint shrink-0">
        <span>Rows per page</span>
        <Select
          size="sm"
          value={String(pageSize)}
          options={pageSizeOptions.map((s) => ({ value: String(s), label: String(s) }))}
          onChange={(v) => {
            onPageSizeChange(Number(v));
            onChange(0);
          }}
          className="w-20"
        />
      </div>
    </div>
  );
}

/* ── DataTable ── */

function normalize(s: unknown): string {
  return String(s ?? "").toLowerCase();
}

function stableSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
  return arr
    .map((item, i) => ({ item, i }))
    .sort((a, b) => compareFn(a.item, b.item) || a.i - b.i)
    .map(({ item }) => item);
}

export function DataTable<TRow extends object>({
  columns,
  data,
  getRowId,
  selectable = false,
  pageSizeOptions = [10, 20, 30, 50],
  defaultPageSize = 10,
  defaultSort,
  emptyMessage = "No results found.",
  actionBar,
  onRowClick,
  stickyHeader = false,
  striped = false,
  size = "md",
  loading = false,
  className,
  style,
}: DataTableProps<TRow>) {
  const rowId = useCallback((row: TRow, i: number) => getRowId?.(row, i) ?? String(i), [getRowId]);

  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key ?? null);
  const [sortDir, setSortDir] = useState<SortDir>(defaultSort?.dir ?? "asc");
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.key))
  );

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
    }
    setPage(0);
  }

  function setFilter(key: string, val: string | string[]) {
    setFilters((f) => {
      const next = { ...f };
      if (val === "" || (Array.isArray(val) && val.length === 0)) delete next[key];
      else next[key] = val;
      return next;
    });
    setPage(0);
  }

  const hasFilters = Object.keys(filters).length > 0;

  const processed = useMemo<TRow[]>(() => {
    let result = data;
    for (const col of columns) {
      const fv = filters[col.key];
      if (!fv || !col.filterable) continue;
      const acc = col.accessor ?? ((r: TRow) => (r as Record<string, unknown>)[col.key]);
      if (Array.isArray(fv)) {
        if (fv.length > 0) result = result.filter((r) => fv.includes(String(acc(r))));
      } else {
        const q = fv.toLowerCase();
        result = result.filter((r) => normalize(acc(r)).includes(q));
      }
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col) {
        const acc = col.accessor ?? ((r: TRow) => (r as Record<string, unknown>)[col.key]);
        result = stableSort(result, (a, b) => {
          const av = acc(a);
          const bv = acc(b);
          const cmp =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av ?? "").localeCompare(String(bv ?? ""));
          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }
    return result;
  }, [data, columns, filters, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = processed.slice(safePage * pageSize, (safePage + 1) * pageSize);
  const visibleCols = columns.filter((c) => !hidden.has(c.key));

  const pagedIds = paged.map((r, i) => rowId(r, safePage * pageSize + i));
  const allSelected = pagedIds.length > 0 && pagedIds.every((id) => selected.has(id));
  const someSelected = pagedIds.some((id) => selected.has(id)) && !allSelected;

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) pagedIds.forEach((id) => next.delete(id));
      else pagedIds.forEach((id) => next.add(id));
      return next;
    });
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function toggleCol(key: string) {
    setHidden((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  }

  const selectedIds = Array.from(selected);
  const filterCols = columns.filter((c) => c.filterable && !hidden.has(c.key));
  const skeletonRows = Array.from({ length: Math.min(pageSize, 5) });

  const thCls = cn(
    "text-left whitespace-nowrap select-none relative text-faint font-semibold tracking-[0.02em]",
    size === "sm"
      ? "px-3 py-2 text-body-caption"
      : size === "lg"
        ? "px-4 py-[14px] text-body-caption"
        : "px-[14px] py-[11px] text-body-caption"
  );
  const tdCls = cn(
    "align-middle",
    size === "sm" ? "px-3 py-2 text-body-callout" : size === "lg" ? "px-4 py-[14px]" : "px-[14px] py-3"
  );

  return (
    <div className={cn("flex flex-col gap-[10px] w-full", className)} style={style}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {filterCols.map((col) => {
            const fv = filters[col.key];
            if (col.filterVariant === "text" || !col.filterVariant) {
              return (
                <label
                  key={col.key}
                  className="flex items-center gap-[6px] h-8 px-[10px] border border-rule rounded-(--radius-sm) bg-raised text-body-callout text-foreground min-w-[140px] transition-colors duration-[120ms] focus-within:border-patina cursor-text"
                >
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder={`Filter ${col.header}…`}
                    value={(fv as string) ?? ""}
                    onChange={(e) => setFilter(col.key, e.target.value)}
                    className="flex-1 bg-transparent border-0 outline-none text-body-callout text-foreground min-w-0 placeholder:text-faint"
                  />
                </label>
              );
            }
            return (
              <SelectFilter
                key={col.key}
                title={col.header}
                options={col.filterOptions ?? []}
                value={(fv as string[]) ?? []}
                multiple={col.filterVariant === "multiSelect"}
                onChange={(v) => setFilter(col.key, v)}
              />
            );
          })}
          {hasFilters && (
            <button
              className="inline-flex items-center gap-[5px] h-8 px-[10px] border border-rule rounded-(--radius-sm) bg-transparent text-body-callout text-faint cursor-pointer whitespace-nowrap transition-colors duration-[120ms] hover:text-foreground hover:border-faint"
              onClick={() => setFilters({})}
            >
              <XIcon />
              Reset
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ViewOptions columns={columns.filter((c) => c.hideable !== false)} hidden={hidden} onToggle={toggleCol} />
        </div>
      </div>

      {/* Action bar */}
      {selectable && selected.size > 0 && actionBar && (
        <div
          className="flex items-center gap-3 px-[14px] py-[10px] rounded-(--radius-md) text-body-callout border"
          style={{
            background: "color-mix(in oklch, var(--ks-primary) 10%, var(--ks-lacquer-raised))",
            borderColor: "color-mix(in oklch, var(--ks-primary) 30%, transparent)",
          }}
        >
          <span className="font-semibold text-patina flex-1">{selected.size} selected</span>
          {actionBar(selectedIds)}
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto overflow-y-visible border border-rule rounded-(--radius-md) bg-raised">
        <table
          className="w-full border-collapse text-body-callout text-foreground"
          data-striped={striped || undefined}
          data-size={size}
        >
          <thead className={cn("bg-graphite border-b border-rule", stickyHeader && "sticky top-0 z-[2]")}>
            <tr>
              {selectable && (
                <th className={cn(thCls, "w-10 pr-1")}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={() => toggleAll()}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {visibleCols.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    thCls,
                    col.sortable && "cursor-pointer hover:text-foreground",
                    sortKey === col.key && "text-foreground",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.pinRight && "sticky right-0 bg-graphite shadow-[-1px_0_0_var(--ks-rule)]"
                  )}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                  style={{ width: col.width, minWidth: col.minWidth }}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : col.sortable
                        ? "none"
                        : undefined
                  }
                >
                  <span className="inline-flex items-center gap-[5px]">
                    {col.header}
                    {col.sortable && (
                      <span
                        className={cn(
                          "inline-flex items-center opacity-40 transition-opacity flex-shrink-0",
                          sortKey === col.key && "opacity-100 text-patina"
                        )}
                      >
                        {sortKey === col.key && sortDir === "asc" ? (
                          <SortAsc />
                        ) : sortKey === col.key ? (
                          <SortDesc />
                        ) : (
                          <SortNone />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRows.map((_, ri) => (
                <tr key={ri} className="border-b border-rule animate-pulse">
                  {selectable && <td className={cn(tdCls, "w-10 pr-1")} />}
                  {visibleCols.map((col) => (
                    <td key={col.key} className={tdCls}>
                      <div
                        className="h-4 bg-graphite rounded-[3px]"
                        style={{ width: `${55 + ((ri * 13 + col.key.length * 7) % 35)}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + (selectable ? 1 : 0)}>
                  <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-faint text-body-callout text-center">
                    <span className="opacity-35">
                      <EmptyIcon />
                    </span>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => {
                const absIdx = safePage * pageSize + ri;
                const id = rowId(row, absIdx);
                const isSelected = selected.has(id);
                const isEven = ri % 2 === 1;
                return (
                  <tr
                    key={id}
                    className={cn(
                      "border-b border-rule transition-colors duration-[80ms] last:border-b-0",
                      isSelected ? "bg-patina/8" : striped && isEven ? "bg-foreground/[2.5%]" : "",
                      onRowClick ? "cursor-pointer" : "",
                      "hover:bg-patina/5"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className={cn(tdCls, "w-10 pr-1")} onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isSelected} onChange={() => toggleRow(id)} />
                      </td>
                    )}
                    {visibleCols.map((col) => {
                      const val = col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.key];
                      return (
                        <td
                          key={col.key}
                          className={cn(
                            tdCls,
                            col.align === "center" && "text-center",
                            col.align === "right" && "text-right",
                            col.pinRight && "sticky right-0 bg-inherit shadow-[-1px_0_0_var(--ks-rule)]"
                          )}
                        >
                          {col.cell ? col.cell(row, absIdx) : String(val ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationBar
        page={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={processed.length}
        pageSizeOptions={pageSizeOptions}
        onChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
