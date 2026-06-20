import type React from 'react'

export type TabsVariant = 'line' | 'pill' | 'card' | 'enclosed'
export type TabsSize    = 'sm' | 'md' | 'lg'
export type TabsAlign   = 'start' | 'center' | 'end' | 'stretch'

export interface TabItem {
  value:     string
  label:     React.ReactNode
  icon?:     React.ReactNode
  badge?:    React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items:         TabItem[]
  value?:        string
  defaultValue?: string
  onChange?:     (value: string) => void
  variant?:      TabsVariant
  size?:         TabsSize
  align?:        TabsAlign
  className?:    string
  children?:     React.ReactNode
}

export interface TabPanelProps {
  value:     string
  activeTab: string
  children?: React.ReactNode
  className?: string
}
