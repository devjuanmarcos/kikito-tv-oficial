"use client";
import { useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { TreeNode, TreeViewProps } from "./tree-view.types";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className={cn("w-3 h-3 shrink-0 transition-transform duration-[120ms]", open ? "rotate-90" : "")}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function flattenVisible(nodes: TreeNode[], expanded: string[]): TreeNode[] {
  const out: TreeNode[] = [];
  function walk(list: TreeNode[]) {
    for (const n of list) {
      out.push(n);
      if ((n.children?.length ?? 0) > 0 && expanded.includes(n.id)) walk(n.children!);
    }
  }
  walk(nodes);
  return out;
}

function buildParentMap(nodes: TreeNode[], parent: TreeNode | null, map: Map<string, TreeNode | null>) {
  for (const n of nodes) {
    map.set(n.id, parent);
    if ((n.children?.length ?? 0) > 0) buildParentMap(n.children!, n, map);
  }
}

interface NodeProps {
  node: TreeNode;
  depth: number;
  selected: string | undefined;
  expanded: string[];
  activeId: string | null;
  onSelect: (id: string, node: TreeNode) => void;
  onToggle: (id: string) => void;
  onActivate: (id: string) => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
}

function TreeNodeRow({
  node,
  depth,
  selected,
  expanded,
  activeId,
  onSelect,
  onToggle,
  onActivate,
  registerRef,
}: NodeProps) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isExpanded = expanded.includes(node.id);
  const isSelected = selected === node.id;

  return (
    <li role="treeitem" aria-selected={isSelected} aria-expanded={hasChildren ? isExpanded : undefined}>
      <button
        ref={(el) => registerRef(node.id, el)}
        type="button"
        disabled={node.disabled}
        tabIndex={node.id === activeId ? 0 : -1}
        onFocus={() => onActivate(node.id)}
        onClick={() => {
          if (node.disabled) return;
          onActivate(node.id);
          if (hasChildren) onToggle(node.id);
          else onSelect(node.id, node);
        }}
        className={cn(
          // py-[0.3125rem] (5px): sem match exato na escala de spacing
          "w-full flex items-center gap-(--spacing-xs) px-(--spacing-sm) py-[0.3125rem] rounded-(--radius-xs) text-left text-body-callout transition-colors duration-[80ms] select-none",
          isSelected ? "bg-patina-soft text-patina-soft-fg" : "text-foreground hover:bg-graphite",
          node.disabled && "opacity-40 cursor-not-allowed"
        )}
        // paddingLeft escala continuamente com `depth` (profundidade da árvore) — não é um tier de tamanho, sem token de spacing aplicável
        style={{ paddingLeft: `${0.5 + depth * 1.25}rem` }}
      >
        {hasChildren && (
          <span className="shrink-0">
            <ChevronIcon open={isExpanded} />
          </span>
        )}
        {!hasChildren && <span className="w-3 shrink-0" />}
        {node.icon && (
          <span aria-hidden="true" className="shrink-0 w-4 h-4 flex items-center justify-center text-faint">
            {node.icon}
          </span>
        )}
        <span className="truncate">{node.label}</span>
      </button>

      {hasChildren && isExpanded && (
        <ul role="group" className="mt-(--spacing-3xs)">
          {node.children!.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expanded={expanded}
              activeId={activeId}
              onSelect={onSelect}
              onToggle={onToggle}
              onActivate={onActivate}
              registerRef={registerRef}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeView({
  nodes,
  selected,
  expanded: expandedProp,
  defaultExpanded = [],
  onSelect,
  onExpand,
  className,
  style,
}: TreeViewProps) {
  const isExpandedControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpanded);
  const expanded = isExpandedControlled ? expandedProp : internalExpanded;

  // achado real: role="tree" declarava "keyboard navigation" no registry mas cada item era
  // um <button> independente navegável só via Tab (25 paradas de tab numa árvore de 25 nós,
  // sem nenhuma seta funcionando) — zero suporte ao padrão ARIA de treeview real (roving
  // tabindex + Up/Down/Right/Left/Home/End). Implementado abaixo com foco imperativo via
  // refs, mesma técnica useRef<Map> já usada nesta lib pra listas dinâmicas
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const navigable = useMemo(() => flattenVisible(nodes, expanded).filter((n) => !n.disabled), [nodes, expanded]);
  const parentMap = useMemo(() => {
    const map = new Map<string, TreeNode | null>();
    buildParentMap(nodes, null, map);
    return map;
  }, [nodes]);
  const [activeId, setActiveId] = useState<string | null>(() => selected ?? navigable[0]?.id ?? null);

  function registerRef(id: string, el: HTMLButtonElement | null) {
    if (el) btnRefs.current.set(id, el);
    else btnRefs.current.delete(id);
  }

  function focusId(id: string) {
    setActiveId(id);
    btnRefs.current.get(id)?.focus();
  }

  function handleToggle(id: string) {
    const next = expanded.includes(id) ? expanded.filter((x) => x !== id) : [...expanded, id];
    if (!isExpandedControlled) setInternalExpanded(next);
    onExpand?.(next);
  }

  function handleSelect(id: string, node: TreeNode) {
    onSelect?.(id, node);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    if (!activeId) return;
    const idx = navigable.findIndex((n) => n.id === activeId);
    if (idx === -1) return;
    const current = navigable[idx];
    const hasChildren = (current.children?.length ?? 0) > 0;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = navigable[idx + 1];
        if (next) focusId(next.id);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = navigable[idx - 1];
        if (prev) focusId(prev.id);
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (hasChildren && !expanded.includes(current.id)) {
          handleToggle(current.id);
        } else if (hasChildren) {
          const child = current.children!.find((c) => !c.disabled);
          if (child) focusId(child.id);
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (hasChildren && expanded.includes(current.id)) {
          handleToggle(current.id);
        } else {
          const parent = parentMap.get(current.id);
          if (parent) focusId(parent.id);
        }
        break;
      }
      case "Home": {
        e.preventDefault();
        if (navigable[0]) focusId(navigable[0].id);
        break;
      }
      case "End": {
        e.preventDefault();
        if (navigable[navigable.length - 1]) focusId(navigable[navigable.length - 1].id);
        break;
      }
      default:
        break;
    }
  }

  return (
    <ul
      role="tree"
      style={style}
      onKeyDown={handleKeyDown}
      className={cn("flex flex-col gap-(--spacing-3xs)", className)}
    >
      {nodes.map((node) => (
        <TreeNodeRow
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          expanded={expanded}
          activeId={activeId}
          onSelect={handleSelect}
          onToggle={handleToggle}
          onActivate={setActiveId}
          registerRef={registerRef}
        />
      ))}
    </ul>
  );
}
