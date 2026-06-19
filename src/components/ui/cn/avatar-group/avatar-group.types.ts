import type React from 'react'

export type AvatarGroupSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarGroupItem {
  src?: string
  name?: string
  alt?: string
}

export interface AvatarGroupProps {
  avatars: AvatarGroupItem[]
  max?: number
  size?: AvatarGroupSize
  overlap?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}
