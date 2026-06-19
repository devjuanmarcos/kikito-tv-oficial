import type React from 'react'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangePickerProps {
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}
