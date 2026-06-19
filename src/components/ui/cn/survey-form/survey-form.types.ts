import type React from 'react'

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'scale' | 'rating'

export interface SurveyQuestion {
  id: string
  label: string
  type: QuestionType
  required?: boolean
  options?: string[]
  min?: number
  max?: number
  placeholder?: string
}

export interface SurveyFormProps {
  title?: string
  description?: string
  questions: SurveyQuestion[]
  onSubmit?: (answers: Record<string, unknown>) => void
  submitLabel?: string
  className?: string
  style?: React.CSSProperties
}
