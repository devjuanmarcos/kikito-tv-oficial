import type React from "react";

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeViewProps {
  nodes: TreeNode[];
  selected?: string;
  expanded?: string[];
  defaultExpanded?: string[];
  onSelect?: (id: string, node: TreeNode) => void;
  onExpand?: (expanded: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}
