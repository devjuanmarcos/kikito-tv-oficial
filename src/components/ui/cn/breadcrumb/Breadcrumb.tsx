"use client";

import type { MenuItem } from "@/components/ui/cn/dropdown-menu/dropdown-menu.types";
import { DropdownMenu } from "@/components/ui/cn/dropdown-menu/DropdownMenu";
import { cn } from "@/lib/utils";

import type { BreadcrumbProps, BreadcrumbItem } from "./breadcrumb.types";

const DefaultSeparator = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface EllipsisSlot {
  collapsed: BreadcrumbItem[];
}

function buildVisible(items: BreadcrumbItem[], maxItems?: number): (BreadcrumbItem | EllipsisSlot)[] {
  if (!maxItems || items.length <= maxItems) return items;
  const keep = Math.max(maxItems - 1, 2);
  const tailCount = Math.floor((keep - 1) / 2);
  const headCount = keep - 1 - tailCount;
  const head = items.slice(0, headCount);
  const collapsed = items.slice(headCount, items.length - tailCount - 1);
  const tail = items.slice(items.length - tailCount - 1);
  return [...head, { collapsed }, ...tail];
}

function isEllipsisSlot(item: BreadcrumbItem | EllipsisSlot): item is EllipsisSlot {
  return Object.prototype.hasOwnProperty.call(item, "collapsed");
}

function toMenuItem(item: BreadcrumbItem, idx: number): MenuItem {
  return {
    type: "item",
    value: `${item.label}-${idx}`,
    label: item.label,
    icon: item.icon,
    onClick: item.onClick ?? (item.href ? () => window.location.assign(item.href!) : undefined),
  };
}

const SIZE_CLS: Record<string, string> = {
  sm: "text-body-caption",
  md: "text-body-callout",
  lg: "text-body-paragraph",
};

// gap-[0.3125rem] (5px): below spacing scale minimum, sem match exato
const interactiveCls =
  "inline-flex items-center gap-[0.3125rem] py-(--spacing-xs) text-faint no-underline bg-none border-none font-[inherit] cursor-pointer rounded-sm transition-colors duration-[140ms] whitespace-nowrap hover:text-foreground";

export function Breadcrumb({ items, separator, maxItems, size = "md", className, style }: BreadcrumbProps) {
  const visible = buildVisible(items, maxItems);
  const sep = separator ?? <DefaultSeparator />;

  return (
    <nav aria-label="Breadcrumb" className={cn("inline-flex items-center", SIZE_CLS[size], className)} style={style}>
      <ol className="flex flex-wrap items-center gap-0 list-none m-0 p-0">
        {visible.map((item, idx) => {
          const isLast = idx === visible.length - 1;

          return (
            <li key={idx} className="flex items-center">
              {idx > 0 && (
                <span
                  className="inline-flex items-center text-faint px-(--spacing-2xs) shrink-0 pointer-events-none [&>svg]:w-[0.875em] [&>svg]:h-[0.875em]"
                  aria-hidden="true"
                >
                  {sep}
                </span>
              )}

              {isEllipsisSlot(item) ? (
                <DropdownMenu
                  items={item.collapsed.map((collapsedItem, i) => toMenuItem(collapsedItem, i))}
                  placement="bottom-start"
                >
                  <button
                    type="button"
                    className="inline-flex items-center py-(--spacing-xs) px-(--spacing-2xs) text-faint tracking-[0.05em] rounded-sm hover:text-foreground hover:bg-graphite transition-colors duration-[140ms]"
                    aria-label={`Mostrar ${item.collapsed.length} itens ocultos`}
                  >
                    …
                  </button>
                </DropdownMenu>
              ) : isLast ? (
                // gap-[0.3125rem] (5px): below spacing scale minimum, sem match exato
                <span
                  className="inline-flex items-center gap-[0.3125rem] py-(--spacing-xs) text-foreground font-medium whitespace-nowrap pointer-events-none"
                  aria-current="page"
                >
                  {(item as BreadcrumbItem).icon && (
                    <span className="inline-flex items-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">
                      {(item as BreadcrumbItem).icon}
                    </span>
                  )}
                  {(item as BreadcrumbItem).label}
                </span>
              ) : (item as BreadcrumbItem).href ? (
                <a href={(item as BreadcrumbItem).href} className={interactiveCls}>
                  {(item as BreadcrumbItem).icon && (
                    <span className="inline-flex items-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">
                      {(item as BreadcrumbItem).icon}
                    </span>
                  )}
                  {(item as BreadcrumbItem).label}
                </a>
              ) : (item as BreadcrumbItem).onClick ? (
                <button type="button" className={interactiveCls} onClick={(item as BreadcrumbItem).onClick}>
                  {(item as BreadcrumbItem).icon && (
                    <span className="inline-flex items-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">
                      {(item as BreadcrumbItem).icon}
                    </span>
                  )}
                  {(item as BreadcrumbItem).label}
                </button>
              ) : (
                <span className={cn(interactiveCls, "pointer-events-none")}>
                  {(item as BreadcrumbItem).icon && (
                    <span className="inline-flex items-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">
                      {(item as BreadcrumbItem).icon}
                    </span>
                  )}
                  {(item as BreadcrumbItem).label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
