import { cn } from '@/lib/utils'
import type { AudioWaveformProps } from './audio-waveform.types'

const HEIGHTS = [0.3, 0.5, 0.8, 1.0, 0.9, 0.7, 0.5, 0.85, 1.0, 0.6, 0.4, 0.7, 0.95, 0.8, 0.5, 0.35, 0.65, 0.9, 1.0, 0.7]

export function AudioWaveform({
  playing = false,
  bars = 20,
  color = 'var(--ks-primary)',
  height = 40,
  className,
  style,
}: AudioWaveformProps) {
  const count = Math.min(bars, 40)
  const baseHeights = HEIGHTS.slice(0, count)

  return (
    <>
      <style>{`
        @keyframes aw-bounce {
          0%, 100% { transform: scaleY(0.3); }
          50%       { transform: scaleY(1); }
        }
        .aw-bar { transform-origin: bottom; transform: scaleY(var(--_h, 0.3)); }
        [data-playing="true"] .aw-bar {
          animation: aw-bounce var(--_dur, 0.6s) ease-in-out var(--_delay, 0s) infinite;
        }
      `}</style>
      <div
        className={cn('flex items-end gap-[2px]', className)}
        style={{ height, ...style }}
        data-playing={playing}
        aria-label={playing ? 'Playing' : 'Paused'}
      >
        {baseHeights.map((h, i) => {
          const barH = Math.max(4, h * height)
          const dur = `${(0.5 + (i % 5) * 0.12).toFixed(2)}s`
          const delay = `${((i * 0.05) % 0.5).toFixed(2)}s`
          return (
            <div
              key={i}
              className="aw-bar rounded-full w-[3px] shrink-0"
              style={{
                height: barH,
                background: color,
                '--_h': h,
                '--_dur': dur,
                '--_delay': delay,
              } as React.CSSProperties}
            />
          )
        })}
      </div>
    </>
  )
}
