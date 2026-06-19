import type React from 'react'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  endDate?: string
  intent?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'neutral'
  allDay?: boolean
}

export interface EventCalendarProps {
  events?: CalendarEvent[]
  defaultMonth?: string
  onEventClick?: (event: CalendarEvent) => void
  onDayClick?: (date: string) => void
  className?: string
  style?: React.CSSProperties
}
