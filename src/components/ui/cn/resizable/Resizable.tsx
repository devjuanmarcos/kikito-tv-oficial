'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { ResizableProps } from './resizable.types'

export function Resizable({
  children,
  direction = 'horizontal',
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  onResize,
  className,
  style,
}: ResizableProps) {
  const [size, setSize] = useState(defaultSize)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const startPos = direction === 'horizontal' ? e.clientX : e.clientY
    const startSize = size

    const onMove = (moveEvent: MouseEvent) => {
      const currentPos = direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
      const containerSize = direction === 'horizontal' ? rect.width : rect.height
      const delta = ((currentPos - startPos) / containerSize) * 100
      const next = Math.min(maxSize, Math.max(minSize, startSize + delta))
      setSize(next)
      onResize?.(next)
    }

    const onUp = () => {
      setDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [direction, size, minSize, maxSize, onResize])

  const isHoriz = direction === 'horizontal'
  const paneStyle = isHoriz
    ? { width: `${size}%`, height: '100%' }
    : { height: `${size}%`, width: '100%' }

  return (
    <div
      ref={containerRef}
      className={cn('flex overflow-hidden w-full h-full', !isHoriz && 'flex-col', className)}
      style={style}
    >
      <div className="overflow-auto flex-shrink-0" style={paneStyle}>
        {children[0]}
      </div>
      <div
        className={cn(
          'flex-shrink-0 relative flex items-center justify-center transition-colors duration-150 z-[1]',
          isHoriz ? 'w-[5px] cursor-col-resize flex-col' : 'h-[5px] cursor-row-resize flex-row',
          dragging ? 'bg-patina opacity-60' : 'hover:bg-patina hover:opacity-60',
        )}
        onMouseDown={startDrag}
      >
        <span
          className={cn(
            'rounded-[1px] bg-rule pointer-events-none',
            isHoriz ? 'w-[2px] h-6' : 'w-6 h-[2px]',
          )}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {children[1]}
      </div>
    </div>
  )
}
