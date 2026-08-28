"use client";
import { Badge } from "@/components/ui/cn/badge";
import { cn } from "@/lib/utils";

import type { ReceiptCardProps, ReceiptStatus } from "./receipt-card.types";

const STATUS_INTENT: Record<ReceiptStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  cancelled: "danger",
};

function fmt(v: string | number, sym: string) {
  if (typeof v === "number") return `${sym}${v.toFixed(2)}`;
  return v;
}

function fmtDate(d: Date | string) {
  if (d instanceof Date) return d.toLocaleDateString();
  return d;
}

export function ReceiptCard({
  total,
  title = "Receipt",
  from,
  to,
  date,
  items = [],
  subtotal,
  discount,
  tax,
  currency = "$",
  status,
  className,
  style,
}: ReceiptCardProps) {
  return (
    <div
      style={style}
      className={cn("rounded-2xl border border-rule bg-raised overflow-hidden w-full max-w-sm font-mono", className)}
    >
      {/* Header */}
      <div className="px-(--spacing-xl) py-(--spacing-lg) border-b border-dashed border-rule text-center">
        <p className="text-body-callout font-bold text-foreground">{title}</p>
        {date && <p className="text-body-caption text-faint mt-(--spacing-3xs)">{fmtDate(date)}</p>}
        {(from || to) && (
          <div className="mt-(--spacing-sm) text-body-caption text-faint">
            {from && <p>From: {from}</p>}
            {to && <p>To: {to}</p>}
          </div>
        )}
      </div>

      {/* Items */}
      {items.length > 0 && (
        <div className="px-(--spacing-xl) py-(--spacing-md) space-y-(--spacing-sm) border-b border-dashed border-rule">
          {items.map((item, i) => (
            <div
              key={i}
              className={cn("flex justify-between text-body-caption", item.highlight && "text-patina font-semibold")}
            >
              <span>{item.label}</span>
              <span>{fmt(item.value, currency)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Subtotals */}
      {(subtotal !== undefined || discount !== undefined || tax !== undefined) && (
        <div className="px-(--spacing-xl) py-(--spacing-md) space-y-(--spacing-xs) border-b border-dashed border-rule">
          {subtotal !== undefined && (
            <div className="flex justify-between text-body-caption text-faint">
              <span>Subtotal</span>
              <span>{fmt(subtotal, currency)}</span>
            </div>
          )}
          {discount !== undefined && (
            <div className="flex justify-between text-body-caption text-success">
              <span>Discount</span>
              <span>-{fmt(discount, currency)}</span>
            </div>
          )}
          {tax !== undefined && (
            <div className="flex justify-between text-body-caption text-faint">
              <span>Tax</span>
              <span>{fmt(tax, currency)}</span>
            </div>
          )}
        </div>
      )}

      {/* Total + status */}
      <div className="px-(--spacing-xl) py-(--spacing-lg) flex items-center justify-between">
        <div>
          <p className="text-body-caption text-faint">Total</p>
          <p className="text-body-title font-bold text-foreground">{fmt(total, currency)}</p>
        </div>
        {status && (
          <Badge variant="soft" intent={STATUS_INTENT[status]} size="sm" className="uppercase">
            {status}
          </Badge>
        )}
      </div>

      {/* Serrated bottom — puramente decorativo. var(--ks-lacquer-deep): equivalente real
          de bg-canvas (achado real — usava var(--background), var legada do dashboard,
          fora do sistema de tokens CN) */}
      <div
        aria-hidden="true"
        className="h-3 bg-[repeating-linear-gradient(90deg,var(--ks-lacquer-deep)_0,var(--ks-lacquer-deep)_10px,transparent_10px,transparent_20px)] border-t border-rule"
      />
    </div>
  );
}
