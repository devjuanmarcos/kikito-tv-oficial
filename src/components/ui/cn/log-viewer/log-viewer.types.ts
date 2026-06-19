export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

export interface LogEntry {
  id?: string | number
  level: LogLevel
  message: string
  timestamp?: Date | string
  meta?: string
}

export interface LogViewerProps {
  entries: LogEntry[]
  maxHeight?: number | string
  searchable?: boolean
  showTimestamps?: boolean
  showLevelBadge?: boolean
  autoScroll?: boolean
  emptyMessage?: string
  className?: string
  style?: React.CSSProperties
}
