'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { SkillBarProps } from './skill-bar.types'

const INTENT_COLOR: Record<string, string> = {
  primary:    'var(--ks-patina)',
  secondary:  'var(--ks-kinpaku)',
  tertiary:   'var(--ks-violet)',
  quaternary: 'var(--ks-rose)',
  success:    'var(--ks-success)',
  warning:    'var(--ks-warning)',
  danger:     'var(--ks-danger)',
}

export function SkillBar({
  skills,
  animate     = true,
  showValues  = true,
  height      = 8,
  intent: rootIntent = 'primary',
  className,
  style,
}: SkillBarProps) {
  const [visible, setVisible] = useState(!animate)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animate) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [animate])

  return (
    <div ref={ref} className={cn('flex flex-col gap-[14px]', className)} style={style}>
      {skills.map((skill, i) => {
        const max   = skill.max ?? 100
        const pct   = Math.min((skill.value / max) * 100, 100)
        const color = INTENT_COLOR[skill.intent ?? rootIntent] ?? INTENT_COLOR.primary

        return (
          <div key={i} className="flex flex-col gap-[6px]">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[0.8125rem] font-semibold text-foreground">{skill.label}</span>
                {skill.sublabel && <span className="text-[0.6875rem] opacity-40"> — {skill.sublabel}</span>}
              </div>
              {showValues && (
                <span className="text-[0.75rem] font-bold opacity-60 tabular-nums">
                  {skill.value}{max !== 100 ? `/${max}` : '%'}
                </span>
              )}
            </div>
            <div className="rounded-pill bg-sunken overflow-hidden" style={{ height }}>
              <div
                className="rounded-pill transition-[width] duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ width: visible ? `${pct}%` : '0%', height, background: color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
