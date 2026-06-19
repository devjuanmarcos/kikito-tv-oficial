import type React from 'react'

export type FileUploadVariant = 'dropzone' | 'button'
export type FileUploadSize = 'sm' | 'md' | 'lg'

export interface FileUploadFile {
  file: File
  id: string
  preview?: string
}

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  onFiles?: (files: File[]) => void
  variant?: FileUploadVariant
  size?: FileUploadSize
  label?: string
  hint?: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}
