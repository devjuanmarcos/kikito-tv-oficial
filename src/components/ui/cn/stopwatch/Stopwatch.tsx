'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/cn/button'
import type { Lap, StopwatchProps } from './stopwatch.types'

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const millis = Math.floor((ms % 1000) / 10)
  return {
    hh: h > 0 ? `${String(h).padStart(2, '0')}:` : '',
    mm: String(m).padStart(2, '0'),
    ss: String(s).padStart(2, '0'),
    ms: String(millis).padStart(2, '0'),
  }
}

export function Stopwatch({
  initialTime = 0,
  onLap,
  showLaps = true,
  maxLaps = 20,
  className,
  style,
}: StopwatchProps) {
  const [elapsed, setElapsed] = useState(initialTime)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const startRef = useRef<number | null>(null)
  const baseRef = useRef(initialTime)
  const rafRef = useRef<number | null>(null)

  const tick = useCallback(() => {
    if (startRef.current === null) return
    setElapsed(baseRef.current + (performance.now() - startRef.current))
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = () => {
    startRef.current = performance.now()
    setRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }

  const pause = () => {
    if (startRef.current !== null) {
      baseRef.current += performance.now() - startRef.current
      startRef.current = null
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setRunning(false)
  }

  const reset = () => {
    pause()
    baseRef.current = 0
    setElapsed(0)
    setLaps([])
  }

  const lap = () => {
    if (!running) return
    const lastLapTime = laps.reduce((acc, l) => acc + l.delta, 0)
    const delta = elapsed - lastLapTime
    const newLap: Lap = { index: laps.length + 1, time: elapsed, delta }
    setLaps(prev => [newLap, ...prev].slice(0, maxLaps))
    onLap?.(newLap)
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const { hh, mm, ss, ms } = fmt(elapsed)

  return (
    <div className={cn('flex flex-col items-center gap-4', className)} style={style}>
      <div className="font-mono text-heading-01 font-bold tabular-nums tracking-tight text-foreground">
        {hh}{mm}:{ss}
        <span className="text-heading-04 text-muted">.{ms}</span>
      </div>

      <div className="flex gap-2">
        {!running ? (
          <Button intent="primary" variant="solid" size="md" onClick={start}>Start</Button>
        ) : (
          <Button intent="warning" variant="solid" size="md" onClick={pause}>Pause</Button>
        )}
        {running && (
          <Button intent="neutral" variant="outline" size="md" onClick={lap}>Lap</Button>
        )}
        <Button
          intent="neutral"
          variant="ghost"
          size="md"
          onClick={reset}
          disabled={elapsed === 0 && !running}
        >
          Reset
        </Button>
      </div>

      {showLaps && laps.length > 0 && (
        <div className="w-full max-h-48 overflow-y-auto rounded-[--radius-sm] border border-rule divide-y divide-rule">
          {laps.map(l => {
            const t = fmt(l.time)
            const d = fmt(l.delta)
            return (
              <div key={l.index} className="flex items-center justify-between px-4 py-2 text-body-callout hover:bg-raised transition-colors">
                <span className="text-faint font-medium w-14">Lap {l.index}</span>
                <span className="font-mono text-patina">+{d.mm}:{d.ss}.{d.ms}</span>
                <span className="font-mono text-muted">{t.hh}{t.mm}:{t.ss}.{t.ms}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
