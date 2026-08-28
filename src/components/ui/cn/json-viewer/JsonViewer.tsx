"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import type { JsonViewerProps } from "./json-viewer.types";

interface NodeProps {
  name?: string;
  value: unknown;
  depth: number;
  defaultExpandDepth: number;
}

function JsonNode({ name, value, depth, defaultExpandDepth }: NodeProps) {
  const [open, setOpen] = useState(depth < defaultExpandDepth);

  const key =
    name !== undefined ? (
      <>
        <span className="text-violet font-medium">&quot;{name}&quot;</span>
        <span className="text-faint">: </span>
      </>
    ) : null;

  if (value === null)
    return (
      <span className="inline">
        {key}
        <span className="text-faint italic">null</span>
      </span>
    );
  if (typeof value === "string")
    return (
      <span className="inline">
        {key}
        <span className="text-kinpaku">&quot;{value}&quot;</span>
      </span>
    );
  if (typeof value === "number")
    return (
      <span className="inline">
        {key}
        <span className="text-info">{value}</span>
      </span>
    );
  if (typeof value === "boolean")
    return (
      <span className="inline">
        {key}
        <span className="text-patina">{String(value)}</span>
      </span>
    );

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as [string, unknown])
    : Object.entries(value as Record<string, unknown>);

  const openB = isArray ? "[" : "{";
  const closeB = isArray ? "]" : "}";

  if (!open) {
    return (
      <span className="inline">
        {key}
        <button
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label="Expand"
          className="text-faint hover:text-foreground transition-colors"
        >
          <span className="text-muted">{openB}</span>
          <span className="text-muted px-(--spacing-2xs) text-body-caption">
            {entries.length} {isArray ? "items" : "keys"}
          </span>
          <span className="text-muted">{closeB}</span>
        </button>
      </span>
    );
  }

  return (
    <span className="inline">
      {key}
      <button
        onClick={() => setOpen(false)}
        aria-expanded={true}
        aria-label="Collapse"
        className="text-muted hover:text-foreground transition-colors"
      >
        {openB}
      </button>
      <span className="block pl-(--spacing-lg) border-l border-rule ml-(--spacing-2xs)">
        {entries.map(([k, v], i) => (
          <span key={k} className="block">
            <JsonNode
              name={isArray ? undefined : k}
              value={v}
              depth={depth + 1}
              defaultExpandDepth={defaultExpandDepth}
            />
            {i < entries.length - 1 && <span className="text-faint">,</span>}
          </span>
        ))}
      </span>
      <span className="text-muted">{closeB}</span>
    </span>
  );
}

export function JsonViewer({ data, defaultExpandDepth = 2, name, className, style }: JsonViewerProps) {
  return (
    <div
      className={cn(
        "font-mono text-body-callout leading-relaxed bg-canvas rounded-(--radius-md) border border-rule p-(--spacing-lg) overflow-auto",
        className
      )}
      style={style}
    >
      <JsonNode name={name} value={data} depth={0} defaultExpandDepth={defaultExpandDepth} />
    </div>
  );
}
