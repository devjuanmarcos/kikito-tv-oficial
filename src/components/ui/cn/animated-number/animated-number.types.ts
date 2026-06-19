export interface AnimatedNumberProps {
  value: number
  duration?: number
  format?: (value: number) => string
  className?: string
  style?: React.CSSProperties
}
