import type React from 'react'

export type DiffLineType = 'added' | 'removed' | 'unchanged' | 'header'

export interface DiffLine {
  type: DiffLineType
  content: string
  oldNum?: number
  newNum?: number
}

export interface CodeDiffProps {
  before: string
  after: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  splitView?: boolean
  maxHeight?: number
  className?: string
  style?: React.CSSProperties
}
