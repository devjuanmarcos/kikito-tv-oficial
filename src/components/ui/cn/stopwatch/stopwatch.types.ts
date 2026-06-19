export interface Lap {
  index: number
  time: number
  delta: number
}

export interface StopwatchProps {
  initialTime?: number
  onLap?: (lap: Lap) => void
  showLaps?: boolean
  maxLaps?: number
  className?: string
  style?: React.CSSProperties
}
