import type React from 'react'

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageCropperProps {
  src: string
  aspect?: number
  onCrop?: (area: CropArea) => void
  className?: string
  style?: React.CSSProperties
}
