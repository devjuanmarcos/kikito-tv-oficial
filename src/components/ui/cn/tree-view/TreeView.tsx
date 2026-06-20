'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface TreeNode {
  id:        string
  label:     React.ReactNode
  icon?:     React.ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeViewProps {
  nodes:           TreeNode[]
  selected?:       string
  expanded?:       string[]
  defaultExpanded?: string[]
  onSelect?:       (id: string, node: TreeNode) => void
  onExpand?:       (expanded: string[]) => void
  className?:      string
  style?:          React.CSSProperties
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
    className={cn('w-3 h-3 shrink-0 transition-transform duration-[120ms]', open ? 'rotate-90' : '')}
  >
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

interface NodeProps {
  node:      TreeNode
  depth:     number
  selected:  string | undefined
  expanded:  string[]
  onSelect:  (id: string, node: TreeNode) => void
  onToggle:  (id: string) => void
}

function TreeNodeRow({ node, depth, selected, expanded, onSelect, onToggle }: NodeProps) {
  const hasChildren = (node.children?.length ?? 0) > 0
  const isExpanded  = expanded.includes(node.id)
  const isSelected  = selected === node.id

  return (
    <li role="treeitem" aria-selected={isSelected} aria-expanded={hasChildren ? isExpanded : undefined}>
      <button
        type="button"
        disabled={node.disabled}
        onClick={() => {
          if (node.disabled) return
          if (hasChildren) onToggle(node.id)
          else onSelect(node.id, node)
        }}
        className={cn(
          'w-full flex items-center gap-1.5 px-2 py-[0.3125rem] rounded-[--radius-xs] text-left text-body-callout transition-colors duration-[80ms] select-none',
          isSelected
            ? 'bg-patina/15 text-patina'
            : 'text-foreground hover:bg-graphite',
          node.disabled && 'opacity-40 cursor-not-allowed',
        )}
        style={{ paddingLeft: `${0.5 + depth * 1.25}rem` }}
      >
        {hasChildren && (
          <span className="shrink-0">
            <ChevronIcon open={isExpanded} />
          </span>
        )}
        {!hasChildren && <span className="w-3 shrink-0" />}
        {node.icon && (
          <span className="shrink-0 w-4 h-4 flex items-center justify-center text-faint">
            {node.icon}
          </span>
        )}
        <span className="truncate">{node.label}</span>
      </button>

      {hasChildren && isExpanded && (
        <ul role="group" className="mt-0.5">
          {node.children!.map(child => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expanded={expanded}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  )
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
  const isExpandedControlled = expandedProp !== undefined
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpanded)
  const expanded = isExpandedControlled ? expandedProp : internalExpanded

  function handleToggle(id: string) {
    const next = expanded.includes(id)
      ? expanded.filter(x => x !== id)
      : [...expanded, id]
    if (!isExpandedControlled) setInternalExpanded(next)
    onExpand?.(next)
  }

  function handleSelect(id: string, node: TreeNode) {
    onSelect?.(id, node)
  }

  return (
    <ul role="tree" style={style} className={cn('flex flex-col gap-0.5', className)}>
      {nodes.map(node => (
        <TreeNodeRow
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          expanded={expanded}
          onSelect={handleSelect}
          onToggle={handleToggle}
        />
      ))}
    </ul>
  )
}
