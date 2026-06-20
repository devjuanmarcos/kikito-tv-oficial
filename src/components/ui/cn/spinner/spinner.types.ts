export type SpinnerSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerIntent = 'primary' | 'secondary' | 'neutral' | 'current'

export interface SpinnerProps {
  size?:      SpinnerSize
  intent?:    SpinnerIntent
  label?:     string
  className?: string
  style?:     React.CSSProperties
}
