'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface CodeBlockProps {
  code:            string
  language?:       string
  filename?:       string
  showLineNumbers?: boolean
  maxHeight?:      number
  className?:      string
  style?:          React.CSSProperties
}

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="w-3.5 h-3.5">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-3.5 h-3.5 text-success">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  maxHeight,
  className,
  style,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      style={style}
      className={cn(
        'group relative rounded-[--radius-md] border border-rule bg-graphite overflow-hidden text-[0.8125rem] font-mono',
        className,
      )}
    >
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-rule bg-graphite-2">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-body-caption text-foreground font-medium">{filename}</span>
            )}
            {language && !filename && (
              <span className="text-body-caption text-faint uppercase tracking-wide">{language}</span>
            )}
            {language && filename && (
              <span className="text-body-caption text-faint">{language}</span>
            )}
          </div>
          <button
            type="button"
            aria-label={copied ? 'Copied!' : 'Copy code'}
            onClick={copy}
            className="flex items-center gap-1 text-faint hover:text-foreground transition-colors text-body-caption"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      )}

      <div className="relative overflow-auto" style={maxHeight ? { maxHeight } : undefined}>
        {!filename && !language && (
          <button
            type="button"
            aria-label={copied ? 'Copied!' : 'Copy code'}
            onClick={copy}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-faint hover:text-foreground bg-graphite-2 border border-rule rounded px-2 py-1 text-body-caption"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        )}
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/[0.03]">
                {showLineNumbers && (
                  <td
                    className="select-none text-right text-faint pr-4 pl-4 py-0 leading-6 w-px align-top border-r border-rule"
                    style={{ userSelect: 'none' }}
                  >
                    {i + 1}
                  </td>
                )}
                <td className={cn('py-0 leading-6 text-foreground', showLineNumbers ? 'pl-4 pr-4' : 'px-4')}>
                  <pre className="m-0 whitespace-pre">{line || ' '}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
