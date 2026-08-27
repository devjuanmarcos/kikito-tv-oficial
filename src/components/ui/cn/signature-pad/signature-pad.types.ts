import type React from "react";

export interface SignaturePadProps {
  width?: number;
  height?: number;
  lineWidth?: number;
  color?: string;
  backgroundColor?: string;
  onSave?: (dataUrl: string) => void;
  onClear?: () => void;
  saveLabel?: string;
  clearLabel?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
