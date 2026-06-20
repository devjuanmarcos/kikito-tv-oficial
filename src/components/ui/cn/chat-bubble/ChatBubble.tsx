'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type ChatBubbleSide   = 'left' | 'right'
export type ChatBubbleStatus = 'sent' | 'delivered' | 'read' | 'error'

export interface ChatBubbleProps {
  message:        string
  side?:          ChatBubbleSide
  time?:          string
  senderName?:    string
  avatar?:        string
  avatarFallback?: string
  status?:        ChatBubbleStatus
  isTyping?:      boolean
  className?:     string
  style?:         React.CSSProperties
}

const STATUS_ICON: Record<ChatBubbleStatus, string> = {
  sent:      '✓',
  delivered: '✓✓',
  read:      '✓✓',
  error:     '⚠',
}
const STATUS_CLS: Record<ChatBubbleStatus, string> = {
  sent:      'text-faint',
  delivered: 'text-faint',
  read:      'text-info',
  error:     'text-danger',
}

function Avatar({ src, fallback }: { src?: string; fallback?: string }) {
  if (!src && !fallback) return null
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden bg-patina flex items-center justify-center text-patina-fg text-[0.6rem] font-bold">
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : fallback}
    </div>
  )
}

export function ChatBubble({
  message,
  side            = 'left',
  time,
  senderName,
  avatar,
  avatarFallback,
  status,
  isTyping        = false,
  className,
  style,
}: ChatBubbleProps) {
  const isLeft  = side === 'left'
  const hasAvatar = !!avatar || !!avatarFallback

  return (
    <div
      style={style}
      className={cn(
        'flex gap-2',
        isLeft ? 'flex-row items-end' : 'flex-row-reverse items-end',
        className,
      )}
    >
      {hasAvatar && isLeft && <Avatar src={avatar} fallback={avatarFallback} />}
      {hasAvatar && !isLeft && <div className="w-7" />}

      <div className={cn('flex flex-col gap-0.5 max-w-[70%]', isLeft ? 'items-start' : 'items-end')}>
        {senderName && isLeft && (
          <span className="text-[0.65rem] font-medium text-faint px-1">{senderName}</span>
        )}

        <div
          className={cn(
            'rounded-2xl px-3 py-2 text-body-callout leading-snug break-words',
            isLeft
              ? 'rounded-bl-sm bg-graphite-2 text-foreground'
              : 'rounded-br-sm bg-patina text-patina-fg',
          )}
        >
          {isTyping ? (
            <span className="flex items-center gap-1 h-4">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce"
                  style={{ animationDelay: `${i * 160}ms`, animationDuration: '800ms' }}
                />
              ))}
            </span>
          ) : (
            message
          )}
        </div>

        {(time || status) && !isTyping && (
          <div className={cn('flex items-center gap-1 px-1', isLeft ? '' : 'flex-row-reverse')}>
            {time && <span className="text-[0.6rem] text-faint">{time}</span>}
            {status && !isLeft && (
              <span className={cn('text-[0.6rem] font-bold', STATUS_CLS[status])}>
                {STATUS_ICON[status]}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
