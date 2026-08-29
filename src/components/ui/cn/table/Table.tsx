"use client";

import { useState, useRef, useEffect, useMemo, useCallback, useId, type ReactNode, type CSSProperties } from "react";

import { Button } from "@/components/ui/cn/button/Button";
import { Checkbox } from "@/components/ui/cn/checkbox/Checkbox";
import { Pagination } from "@/components/ui/cn/pagination/Pagination";
import { Select } from "@/components/ui/cn/select/Select";
import { cn } from "@/lib/utils";

import type {
  ColumnDef,
  DataTableProps,
  DataTableGridProps,
  DataTableListProps,
  DataTableTreeProps,
  FilterOption,
  SortDir,
  SuperDataTableProps,
} from "./table.types";

const SortNone = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[14px] h-[14px]"
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
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
        // px-[14px]: sem match exato na escala de spacing (entre --spacing-md 12px e --spacing-lg 16px) — padding canônico de célula usado em todo o componente
        "px-[14px] py-(--spacing-md) align-middle",
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
        // px-[14px]/py-[11px]: sem match exato na escala de spacing
        "px-[14px] py-[11px] text-body-caption font-semibold tracking-[0.02em] text-faint text-left whitespace-nowrap select-none relative",
        sortable && "cursor-pointer hover:text-foreground",
        sorted && "text-foreground",
        align === "center" && "text-center",
        align === "right" && "text-right",
        pinRight && "sticky right-0 bg-inherit shadow-[-1px_0_0_var(--ks-rule)]",
        className
      )}
      onClick={sortable ? onSort : undefined}
      tabIndex={sortable ? 0 : undefined}
      onKeyDown={
        sortable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSort?.();
              }
            }
          : undefined
      }
      colSpan={colSpan}
      style={style}
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : sortable ? "none" : undefined}
    >
      {/* gap-[5px]: sem match exato na escala de spacing */}
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
    // px-[14px]/py-[10px]: sem match exato na escala de spacing
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
  const listboxId = useId();

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
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={cn(
          // px-[10px]: sem match exato na escala de spacing (padrão de chip de filtro/toolbar, repetido no arquivo)
          "inline-flex items-center gap-(--spacing-xs) h-8 px-[10px] border border-dashed border-rule rounded-(--radius-sm) bg-transparent text-body-callout text-faint cursor-pointer whitespace-nowrap transition-colors duration-[120ms] hover:border-patina hover:text-foreground",
          value.length > 0 && "border-patina border-solid text-foreground"
        )}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
      >
        {value.length > 0 ? (
          <button
            type="button"
            aria-label="Limpar filtro"
            className="w-[14px] h-[14px] border border-rule rounded-(--radius-xs) flex items-center justify-center flex-shrink-0 bg-patina border-patina text-patina-fg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
          >
            <XIcon />
          </button>
        ) : (
          <PlusIcon />
        )}
        {title}
        {value.length > 0 && (
          // below scale minimum: inline count pill, matches Badge's sm-size scale
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-(--spacing-2xs) bg-patina-soft text-patina rounded-(--radius-xs) text-[0.625rem] font-bold">
            {value.length}
          </span>
        )}
      </div>
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-[800] bg-raised border border-rule rounded-(--radius-md) shadow-[0_4px_16px_oklch(0%_0_0_/_0.2)] min-w-[180px] overflow-hidden">
          <div className="p-(--spacing-sm) border-b border-rule">
            <input
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title}…`}
              // py-[5px]: sem match exato na escala de spacing
              className="w-full bg-graphite border border-rule rounded-(--radius-sm) px-(--spacing-sm) py-[5px] text-body-callout text-foreground outline-none placeholder:text-faint"
            />
          </div>
          <div
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple}
            className="max-h-[220px] overflow-y-auto p-(--spacing-2xs)"
          >
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value.includes(opt.value)}
                // py-[7px]: sem match exato na escala de spacing
                className="flex items-center gap-(--spacing-sm) px-(--spacing-sm) py-[7px] rounded-(--radius-sm) cursor-pointer text-body-callout border-0 bg-transparent w-full text-left text-foreground transition-colors duration-[80ms] hover:bg-patina/8"
                onClick={() => toggle(opt.value)}
              >
                <span
                  className={cn(
                    "w-[14px] h-[14px] border border-rule rounded-(--radius-xs) flex items-center justify-center flex-shrink-0 transition-colors duration-100",
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
              className="flex items-center justify-center p-(--spacing-xs) border-t border-rule text-body-caption text-faint cursor-pointer bg-transparent border-l-0 border-r-0 border-b-0 w-full transition-colors duration-[120ms] hover:text-danger"
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
  const menuId = useId();

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
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex items-center gap-(--spacing-xs) h-8 px-[10px] border border-rule rounded-(--radius-sm) bg-transparent text-body-callout text-faint cursor-pointer relative transition-colors duration-[120ms] hover:text-foreground"
        onClick={() => setOpen((o) => !o)}
      >
        <ViewIcon />
        View
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute top-[calc(100%+4px)] right-0 z-[800] bg-raised border border-rule rounded-(--radius-md) shadow-[0_4px_16px_oklch(0%_0_0_/_0.2)] min-w-[180px] p-(--spacing-xs)"
        >
          {toggleable.map((col) => {
            const visible = !hidden.has(col.key);
            return (
              <button
                key={col.key}
                type="button"
                role="menuitemcheckbox"
                aria-checked={visible}
                className={cn(
                  // py-[7px]: sem match exato na escala de spacing
                  "flex items-center gap-(--spacing-sm) px-(--spacing-sm) py-[7px] rounded-(--radius-sm) cursor-pointer text-body-callout border-0 bg-transparent w-full text-left transition-colors duration-[80ms] hover:bg-patina/8",
                  visible ? "text-foreground" : "text-faint"
                )}
                onClick={() => onToggle(col.key)}
              >
                <span
                  className={cn(
                    "w-[14px] h-[14px] border border-rule rounded-(--radius-xs) flex items-center justify-center flex-shrink-0 transition-colors duration-100",
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
    <div className="flex items-center gap-(--spacing-md) flex-wrap">
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={onChange}
        totalItems={totalItems}
        pageSize={pageSize}
        size="sm"
        className="flex-1"
      />
      <div className="flex items-center gap-(--spacing-sm) text-body-callout text-faint shrink-0">
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

function TableVariant<TRow extends object>({
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

  // thCls/tdCls variam por `size` (sm/md/lg): escala própria do componente, não migra pra spacing genérico
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
    <div
      aria-busy={loading || undefined}
      // gap-[10px]: sem match exato na escala de spacing
      className={cn("flex flex-col gap-[10px] w-full", className)}
      style={style}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-(--spacing-sm) flex-wrap">
        <div className="flex items-center gap-(--spacing-sm) flex-1 flex-wrap">
          {filterCols.map((col) => {
            const fv = filters[col.key];
            if (col.filterVariant === "text" || !col.filterVariant) {
              return (
                <label
                  key={col.key}
                  className="flex items-center gap-(--spacing-xs) h-8 px-[10px] border border-rule rounded-(--radius-sm) bg-raised text-body-callout text-foreground min-w-[140px] transition-colors duration-[120ms] focus-within:border-patina cursor-text"
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
            <Button variant="outline" intent="neutral" size="sm" iconLeft={<XIcon />} onClick={() => setFilters({})}>
              Reset
            </Button>
          )}
        </div>
        <div className="flex items-center gap-(--spacing-sm) flex-shrink-0">
          <ViewOptions columns={columns.filter((c) => c.hideable !== false)} hidden={hidden} onToggle={toggleCol} />
        </div>
      </div>

      {/* Action bar */}
      {selectable && selected.size > 0 && actionBar && (
        <div
          // px-[14px]/py-[10px]: sem match exato na escala de spacing
          className="flex items-center gap-(--spacing-md) px-[14px] py-[10px] rounded-(--radius-md) text-body-callout border"
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
                  tabIndex={col.sortable ? 0 : undefined}
                  onKeyDown={
                    col.sortable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleSort(col.key);
                          }
                        }
                      : undefined
                  }
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
                  {/* gap-[5px]: sem match exato na escala de spacing */}
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
                        className="h-4 bg-graphite rounded-(--radius-xs)"
                        style={{ width: `${55 + ((ri * 13 + col.key.length * 7) % 35)}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + (selectable ? 1 : 0)}>
                  <div className="flex flex-col items-center justify-center gap-(--spacing-sm) py-(--spacing-3xl) px-(--spacing-lg) text-faint text-body-callout text-center">
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
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                  >
                    {selectable && (
                      <td className={cn(tdCls, "w-10 pr-1")} onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          aria-label={`Selecionar linha ${id}`}
                        />
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

/* ── Variant: grid (absorbed VERBATIM from DataGrid) ── */

type GridSortDir = "asc" | "desc" | null;

function GridVariant<T = Record<string, unknown>>({
  columns,
  rows,
  getRowKey,
  selectable = false,
  selectedKeys: controlledKeys,
  onSelectionChange,
  stickyHeader = false,
  striped = false,
  className,
  style,
}: DataTableGridProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<GridSortDir>(null);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  const selected = controlledKeys ?? internalSelected;
  const setSelected = (keys: string[]) => {
    if (!controlledKeys) setInternalSelected(keys);
    onSelectionChange?.(keys);
  };

  const rowKey = (row: T, i: number) => (getRowKey ? getRowKey(row, i) : String(i));

  const sorted = [...rows].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const av = String((a as Record<string, unknown>)[sortKey] ?? "");
    const bv = String((b as Record<string, unknown>)[sortKey] ?? "");
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const allKeys = sorted.map((r, i) => rowKey(r, i));
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.includes(k));
  const someSelected = selected.length > 0 && !allSelected;
  const toggleAll = () => setSelected(allSelected ? [] : allKeys);
  const toggleRow = (key: string) =>
    setSelected(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);

  return (
    <div className={cn("overflow-auto border border-rule rounded-(--radius-md)", className)} style={style}>
      <table className="w-full border-collapse text-body-callout text-foreground">
        <thead>
          <tr>
            {selectable && (
              <th
                className={cn(
                  // py-[10px]/px-[14px]: sem match exato na escala de spacing
                  "py-[10px] px-[14px] text-left text-body-caption font-bold uppercase tracking-[0.06em] text-muted bg-sunken border-b border-rule whitespace-nowrap select-none",
                  stickyHeader && "sticky top-0 z-[2]"
                )}
                style={{ width: 40, textAlign: "center" }}
              >
                <Checkbox
                  className="justify-center"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => toggleAll()}
                  aria-label="Selecionar todas as linhas"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  // py-[10px]/px-[14px]: sem match exato na escala de spacing
                  "py-[10px] px-[14px] text-left text-body-caption font-bold uppercase tracking-[0.06em] text-muted bg-sunken border-b border-rule whitespace-nowrap select-none",
                  stickyHeader && "sticky top-0 z-[2]",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right"
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.sortable ? (
                  <button
                    className="bg-transparent border-none cursor-pointer text-inherit inline-flex items-center gap-(--spacing-2xs) p-0 font-[inherit] text-[inherit] tracking-[inherit] uppercase hover:text-foreground"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.header}
                    {/* below scale minimum: sort-direction glyph sized as icon, not content text */}
                    <span className={cn("text-faint text-[0.625rem]", sortKey === col.key && "text-patina")}>
                      {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const key = rowKey(row, i);
            const isEven = i % 2 === 1;
            return (
              <tr
                key={key}
                className={cn(
                  "border-b border-rule last:border-none transition-[background] duration-[100ms] hover:bg-raised",
                  striped && isEven && "bg-sunken hover:bg-raised",
                  selected.includes(key) && "bg-patina-soft"
                )}
              >
                {selectable && (
                  // py-[9px]/px-[14px]: sem match exato na escala de spacing
                  <td className="py-[9px] px-[14px] align-middle text-center">
                    <Checkbox
                      className="justify-center"
                      checked={selected.includes(key)}
                      onChange={() => toggleRow(key)}
                      aria-label={`Selecionar linha ${key}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      // py-[9px]/px-[14px]: sem match exato na escala de spacing
                      "py-[9px] px-[14px] align-middle",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right"
                    )}
                  >
                    {col.render ? col.render(row, i) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Variant: list (absorbed VERBATIM from DataList) ── */

function ListVariant({
  items,
  layout = "horizontal",
  columns = 2,
  striped = false,
  bordered = false,
  compact = false,
  className,
  style,
}: DataTableListProps) {
  const isGrid = layout === "grid";
  const isHoriz = layout === "horizontal";
  const isVert = layout === "vertical";

  return (
    <dl
      className={cn(isGrid ? "grid" : "flex flex-col", className)}
      style={isGrid ? { gridTemplateColumns: `repeat(${columns}, 1fr)`, ...style } : style}
    >
      {items.map((item, i) => {
        const isEven = i % 2 === 1;
        return (
          <div
            key={i}
            className={cn(
              "flex gap-(--spacing-md)",
              // py-[10px]: sem match exato na escala de spacing
              isHoriz && "flex-row items-baseline py-[10px] border-b border-rule last:border-none",
              isVert && "flex-col gap-(--spacing-2xs) py-[10px] border-b border-rule last:border-none",
              isGrid && "flex-col gap-(--spacing-2xs) p-(--spacing-md) border border-rule rounded-(--radius-base)",
              bordered &&
                (isHoriz || isVert) &&
                "py-[10px] px-(--spacing-md) border border-rule rounded-(--radius-base) mb-(--spacing-2xs)",
              striped && isEven && !bordered && "bg-sunken rounded-(--radius-sm) px-(--spacing-md)",
              compact && "py-(--spacing-xs)" // py-[6px] === --spacing-xs (6px), match exato
            )}
            style={item.span && isGrid ? { gridColumn: `span ${item.span}` } : undefined}
          >
            <dt
              className={cn(
                "text-body-caption font-semibold text-muted opacity-60 uppercase tracking-[0.04em] flex-shrink-0",
                isHoriz && "w-40 min-w-40"
              )}
            >
              {item.label}
            </dt>
            <dd className="text-body-callout text-foreground flex-1">{item.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/* ── Variant: tree (absorbed VERBATIM from TreeTable) ── */

function TreeRow<T>({
  row,
  columns,
  depth,
  defaultExpanded,
}: {
  row: DataTableTreeProps<T>["rows"][number];
  columns: DataTableTreeProps<T>["columns"];
  depth: number;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <tr className="border-b border-rule transition-colors duration-100 last:border-b-0 hover:bg-raised">
        {columns.map((col, ci) => (
          // px-[14px]/py-[9px]: sem match exato na escala de spacing
          <td key={col.key} className="px-[14px] py-[9px] align-middle text-body-callout text-foreground">
            {ci === 0 ? (
              <span className="inline-flex items-center gap-(--spacing-xs)" style={{ paddingLeft: depth * 20 }}>
                {hasChildren ? (
                  <button
                    className="w-[18px] h-[18px] bg-transparent border border-rule rounded-(--radius-xs) cursor-pointer inline-flex items-center justify-center text-muted text-body-caption flex-shrink-0 transition-colors duration-[120ms] hover:bg-float hover:border-patina"
                    onClick={() => setExpanded((e) => !e)}
                    aria-label={expanded ? "Recolher" : "Expandir"}
                  >
                    {expanded ? "−" : "+"}
                  </button>
                ) : (
                  <span className="inline-block w-[18px] h-[18px] flex-shrink-0" />
                )}
                {col.render ? col.render(row.data) : String((row.data as Record<string, unknown>)[col.key] ?? "")}
              </span>
            ) : col.render ? (
              col.render(row.data)
            ) : (
              String((row.data as Record<string, unknown>)[col.key] ?? "")
            )}
          </td>
        ))}
      </tr>
      {hasChildren &&
        expanded &&
        row.children!.map((child) => (
          <TreeRow key={child.id} row={child} columns={columns} depth={depth + 1} defaultExpanded={defaultExpanded} />
        ))}
    </>
  );
}

function TreeVariant<T = Record<string, unknown>>({
  columns,
  rows,
  defaultExpanded = false,
  className,
  style,
}: DataTableTreeProps<T>) {
  return (
    <div className={cn("overflow-x-auto border border-rule rounded-(--radius-md)", className)} style={style}>
      <table className="w-full border-collapse text-body-callout text-foreground">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                // px-[14px]/py-[10px]: sem match exato na escala de spacing
                className="px-[14px] py-[10px] text-left text-body-caption font-bold uppercase tracking-[0.06em] text-muted border-b border-rule bg-sunken whitespace-nowrap"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TreeRow key={row.id} row={row} columns={columns} depth={0} defaultExpanded={defaultExpanded} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * DataTable — Super component.
 * `variant` (default 'table') dispatches between the absorbed families:
 *  - 'table' → full-featured table (sort/filter/paginate/select) — original DataTable.
 *  - 'grid'  → DataGrid (lightweight sortable/selectable grid).
 *  - 'list'  → DataList (definition list / cards).
 *  - 'tree'  → TreeTable (hierarchical expandable rows).
 * The sibling DataGrid/DataList/TreeTable are now backward-compat wrappers.
 */
export function DataTable<TRow extends object = Record<string, unknown>>(props: SuperDataTableProps<TRow>) {
  switch (props.variant) {
    case "grid":
      return <GridVariant {...props} />;
    case "list":
      return <ListVariant {...props} />;
    case "tree":
      return <TreeVariant {...props} />;
    default:
      return <TableVariant {...(props as DataTableProps<TRow>)} />;
  }
}
