import type React from 'react'

export interface StepFormStep {
  id: string
  title: string
  description?: string
  content: React.ReactNode
  validate?: () => boolean | string
}

export interface StepFormProps {
  steps: StepFormStep[]
  onComplete?: (stepId: string) => void
  className?: string
  style?: React.CSSProperties
}
