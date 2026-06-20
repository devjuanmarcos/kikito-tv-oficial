'use client'
import type React from 'react'
import { useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface TextEditorProps {
  value?:       string
  defaultValue?: string
  onChange?:    (html: string) => void
  placeholder?: string
  minHeight?:   number
  disabled?:    boolean
  className?:   string
  style?:       React.CSSProperties
}

type Cmd = 'bold' | 'italic' | 'underline' | 'strikeThrough' |
           'insertUnorderedList' | 'insertOrderedList' | 'formatBlock'

const TOOLBAR: Array<{ cmd: Cmd; label: string; arg?: string; title: string }> = [
  { cmd: 'bold',                label: 'B',   title: 'Bold' },
  { cmd: 'italic',              label: 'I',   title: 'Italic' },
  { cmd: 'underline',           label: 'U',   title: 'Underline' },
  { cmd: 'strikeThrough',       label: 'S̶',   title: 'Strikethrough' },
  { cmd: 'insertUnorderedList', label: '• ≡', title: 'Unordered list' },
  { cmd: 'insertOrderedList',   label: '1 ≡', title: 'Ordered list' },
  { cmd: 'formatBlock',         label: 'H2',  arg: 'h2', title: 'Heading 2' },
]

export function TextEditor({
  value,
  defaultValue = '',
  onChange,
  placeholder  = 'Start typing…',
  minHeight    = 140,
  disabled     = false,
  className,
  style,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isControlled = value !== undefined

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = isControlled ? value! : defaultValue
    }
  }, [])

  useEffect(() => {
    if (isControlled && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value!
    }
  }, [value, isControlled])

  const exec = useCallback((cmd: Cmd, arg?: string) => {
    document.execCommand(cmd, false, arg)
    editorRef.current?.focus()
    onChange?.(editorRef.current?.innerHTML ?? '')
  }, [onChange])

  return (
    <div style={style} className={cn('flex flex-col rounded-xl border border-rule overflow-hidden bg-raised', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-rule bg-graphite-2">
        {TOOLBAR.map(btn => (
          <button
            key={btn.cmd + (btn.arg ?? '')}
            type="button"
            title={btn.title}
            disabled={disabled}
            onMouseDown={e => { e.preventDefault(); exec(btn.cmd, btn.arg) }}
            className={cn(
              'px-2 py-1 rounded text-body-caption font-medium text-faint hover:text-foreground hover:bg-graphite transition-colors',
              disabled && 'opacity-40 pointer-events-none',
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => onChange?.(editorRef.current?.innerHTML ?? '')}
        style={{ minHeight }}
        className={cn(
          'px-4 py-3 text-body-paragraph text-foreground outline-none',
          'prose prose-invert max-w-none',
          '[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-faint',
          disabled && 'opacity-50 select-none',
        )}
      />
    </div>
  )
}
