import type React from 'react'

export type ButtonVariant  = 'solid' | 'outline' | 'ghost' | 'soft' | 'dashed' | 'link'
export type ButtonSize     = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonIntent   =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'
export type ButtonStatus   = 'idle' | 'loading' | 'success' | 'error'
export type ButtonRounded  = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type ButtonLoadingPosition = 'left' | 'replace'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?         : ButtonVariant
  size?            : ButtonSize
  intent?          : ButtonIntent
  /** Simple boolean loading (uncontrolled). Prefer `status` for async feedback. */
  loading?         : boolean
  /** Controlled async state — drives spinner → checkmark/X transitions. */
  status?          : ButtonStatus
  successText?     : string
  errorText?       : string
  loadingText?     : string
  loadingPosition? : ButtonLoadingPosition
  iconLeft?        : React.ReactNode
  iconRight?       : React.ReactNode
  /** Square icon-only button — hides children, forces equal width/height. */
  iconOnly?        : boolean
  fullWidth?       : boolean
  /** Override border-radius independently of size. */
  rounded?         : ButtonRounded
  /** Polymorphic root — pass 'a' to render as a link button. */
  as?              : React.ElementType
}
