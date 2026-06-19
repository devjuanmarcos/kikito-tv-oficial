'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { UserCardProps } from './user-card.types'

export function UserCard({
  name,
  username,
  bio,
  avatar,
  avatarFallback,
  stats          = [],
  badge,
  followed: controlledFollowed,
  onFollow,
  coverColor,
  className,
  style,
}: UserCardProps) {
  const [internalFollowed, setInternalFollowed] = useState(false)
  const isControlled = controlledFollowed !== undefined
  const followed     = isControlled ? controlledFollowed : internalFollowed

  function handleFollow() {
    if (!isControlled) setInternalFollowed(f => !f)
    onFollow?.(!followed)
  }

  const initials = (avatarFallback ?? name).slice(0, 2).toUpperCase()

  return (
    <div className={cn('bg-raised border border-rule rounded-[16px] overflow-hidden w-[280px]', className)} style={style}>
      <div
        className="h-20"
        style={{ background: coverColor ?? 'linear-gradient(135deg,var(--ks-patina),var(--ks-kinpaku))' }}
      />
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-7 mb-3">
          <div className="w-14 h-14 rounded-full border-[3px] border-raised bg-patina flex items-center justify-center text-[20px] font-bold text-patina-fg overflow-hidden shrink-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover">
            {avatar ? <img src={avatar} alt={name} /> : initials}
          </div>
          {onFollow !== undefined && (
            <button
              type="button"
              className={cn(
                'py-[7px] px-4 rounded-full text-[0.75rem] font-bold cursor-pointer transition-[background,border-color] duration-[150ms] border-[1.5px] border-patina font-[inherit]',
                followed ? 'bg-patina text-patina-fg' : 'bg-transparent text-patina',
              )}
              onClick={handleFollow}
            >
              {followed ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <div className="text-[0.9375rem] font-bold text-foreground">{name}</div>
        {username && <div className="text-[0.75rem] opacity-40 mt-[2px]">@{username}</div>}
        {badge && (
          <div className="inline-block text-[0.625rem] font-bold py-[2px] px-2 rounded-[4px] bg-[color-mix(in_srgb,var(--ks-patina)_15%,transparent)] text-patina mt-1">
            {badge}
          </div>
        )}
        {bio && <div className="text-[12.5px] opacity-55 mt-2 leading-[1.6]">{bio}</div>}

        {stats.length > 0 && (
          <div className="flex gap-5 mt-[14px] pt-[14px] border-t border-rule">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col items-center gap-[2px]">
                <span className="text-[0.9375rem] font-bold tabular-nums">{s.value}</span>
                <span className="text-[0.625rem] opacity-40 uppercase tracking-[0.05em]">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
