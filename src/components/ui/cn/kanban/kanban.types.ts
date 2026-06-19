export interface KanbanCard {
  id: string | number
  title: string
  description?: string
  label?: string
  labelColor?: string
  assignee?: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  intent?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}

export interface KanbanProps {
  columns: KanbanColumn[]
  onChange?: (columns: KanbanColumn[]) => void
  className?: string
  style?: React.CSSProperties
}
