import React from 'react'
import { cn } from '@/lib/utils'
import type { AvatarGroupProps, AvatarGroupItem } from './avatar-group.types'

function getInitials(name?: string) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function colorForName(name?: string) {
  if (!name) return 'var(--ks-graphite-2)'
  const hue = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return `hsl(${hue}deg 40% 50% / 0.25)`
}

function textColorForName(name?: string) {
  if (!name) return 'var(--ks-text-faint)'
  const hue = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return `hsl(${hue}deg 60% 55%)`
}

const SIZE_CLS: Record<string, string> = {
  sm: '[--ag-sz:28px] [--ag-fs:10px]',
  md: '[--ag-sz:36px] [--ag-fs:12px]',
  lg: '[--ag-sz:44px] [--ag-fs:14px]',
  xl: '[--ag-sz:56px] [--ag-fs:18px]',
}

const OVERLAP_CLS: Record<string, string> = {
  sm: '[--ag-gap:-6px]',
  md: '[--ag-gap:-10px]',
  lg: '[--ag-gap:-16px]',
}

const avatarCls = 'w-[--ag-sz] h-[--ag-sz] rounded-full border-[2.5px] border-raised overflow-hidden bg-graphite text-muted text-[length:--ag-fs] font-bold flex items-center justify-center shrink-0 relative z-[1] ml-[--ag-gap] transition-[transform] duration-[150ms] hover:-translate-y-[3px] hover:scale-[1.06] hover:z-10 first:ml-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:block'

function AvatarItem({ item, isOverflow }: { item: AvatarGroupItem; isOverflow?: boolean }) {
  const overflowCls = isOverflow ? 'bg-graphite-2 text-muted tracking-[-0.02em]' : ''
  if (item.src) {
    return (
      <div className={cn(avatarCls, overflowCls)}>
        <img src={item.src} alt={item.alt ?? item.name ?? ''} />
      </div>
    )
  }
  return (
    <div
      className={cn(avatarCls, overflowCls)}
      style={!isOverflow ? { background: colorForName(item.name), color: textColorForName(item.name) } : undefined}
      aria-label={item.name}
      title={item.name}
    >
      {getInitials(item.name)}
    </div>
  )
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'md',
  overlap = 'md',
  className,
  style,
}: AvatarGroupProps) {
  const visible  = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div
      className={cn('inline-flex items-center', SIZE_CLS[size], OVERLAP_CLS[overlap], className)}
      style={style}
      role="group"
      aria-label={`${avatars.length} member${avatars.length !== 1 ? 's' : ''}`}
    >
      {visible.map((av, i) => <AvatarItem key={i} item={av} />)}
      {overflow > 0 && <AvatarItem item={{ name: `+${overflow}` }} isOverflow />}
    </div>
  )
}
