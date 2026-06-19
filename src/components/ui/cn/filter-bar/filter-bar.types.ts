export interface FilterBarOption {
  value: string
  label: string
  count?: number
}

export interface FilterBarProps {
  options: FilterBarOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (values: string[]) => void
  multiSelect?: boolean
  clearable?: boolean
  className?: string
  style?: React.CSSProperties
}
