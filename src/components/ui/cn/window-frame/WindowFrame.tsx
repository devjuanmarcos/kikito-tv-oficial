'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type WindowFrameVariant = 'macos' | 'windows' | 'minimal'

export interface WindowFrameProps {
  children:   React.ReactNode
  variant?:   WindowFrameVariant
  title?:     string
  url?:       string
  className?: string
  style?:     React.CSSProperties
}

function MacOsChrome({ title, url }: { title?: string; url?: string }) {
  return (
    <div className="flex flex-col border-b border-rule bg-graphite-2">
      {/* Traffic + title */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        {title && !url && (
          <span className="flex-1 text-center text-body-caption text-faint">{title}</span>
        )}
        {url && (
          <div className="flex-1 mx-4 px-3 py-1 rounded-md bg-graphite border border-rule text-body-caption text-faint truncate text-center">
            {url}
          </div>
        )}
      </div>
    </div>
  )
}

function WindowsChrome({ title, url }: { title?: string; url?: string }) {
  return (
    <div className="flex flex-col border-b border-rule bg-graphite-2">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-body-caption text-faint">{title}</span>
        <div className="flex items-center gap-0">
          {['─', '□', '✕'].map((icon, i) => (
            <button key={i} type="button" className="w-8 h-7 flex items-center justify-center text-faint hover:bg-graphite text-xs">
              {icon}
            </button>
          ))}
        </div>
      </div>
      {url && (
        <div className="px-3 pb-2">
          <div className="px-3 py-1 rounded-sm bg-graphite border border-rule text-body-caption text-faint truncate">
            {url}
          </div>
        </div>
      )}
    </div>
  )
}

function MinimalChrome({ title }: { title?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-rule bg-graphite-2">
      <span className="text-body-caption text-faint">{title}</span>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-rule" />
        ))}
      </div>
    </div>
  )
}

export function WindowFrame({
  children,
  variant   = 'macos',
  title,
  url,
  className,
  style,
}: WindowFrameProps) {
  return (
    <div
      style={style}
      className={cn(
        'rounded-xl overflow-hidden border border-rule shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.5)]',
        className,
      )}
    >
      {variant === 'macos'   && <MacOsChrome title={title} url={url} />}
      {variant === 'windows' && <WindowsChrome title={title} url={url} />}
      {variant === 'minimal' && <MinimalChrome title={title} />}
      {children}
    </div>
  )
}
