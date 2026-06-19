import type React from 'react'

export interface ImageViewerImage {
  src: string
  alt?: string
  caption?: string
}

export interface ImageViewerProps {
  images: ImageViewerImage[]
  defaultIndex?: number
  className?: string
  style?: React.CSSProperties
}
