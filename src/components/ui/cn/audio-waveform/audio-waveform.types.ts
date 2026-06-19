import type React from 'react'

export type WaveformVariant = 'bars' | 'wave' | 'pulse'

export interface AudioWaveformProps {
  playing?: boolean
  bars?: number
  color?: string
  height?: number
  variant?: WaveformVariant
  className?: string
  style?: React.CSSProperties
}
