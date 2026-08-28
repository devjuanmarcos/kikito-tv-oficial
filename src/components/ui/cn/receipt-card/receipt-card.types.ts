import type React from "react";

export type ReceiptStatus = "paid" | "pending" | "cancelled";

export interface ReceiptLineItem {
  label: string;
  value: number | string;
  highlight?: boolean;
}

export interface ReceiptCardProps {
  total: string | number;
  title?: string;
  from?: string;
  to?: string;
  date?: Date | string;
  items?: ReceiptLineItem[];
  subtotal?: string | number;
  discount?: string | number;
  tax?: string | number;
  currency?: string;
  status?: ReceiptStatus;
  className?: string;
  style?: React.CSSProperties;
}
