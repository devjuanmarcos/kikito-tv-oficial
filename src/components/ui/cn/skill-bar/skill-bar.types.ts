import type React from 'react'

export type SkillBarIntent = 'primary' | 'success' | 'warning' | 'danger' | 'secondary'

export interface SkillItem {
  label: string
  value: number
  max?: number
  intent?: SkillBarIntent
  sublabel?: string
}

export interface SkillBarProps {
  skills: SkillItem[]
  animate?: boolean
  showValues?: boolean
  height?: number
  intent?: SkillBarIntent
  className?: string
  style?: React.CSSProperties
}
