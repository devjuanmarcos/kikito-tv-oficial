import React from 'react'
import { cn } from '@/lib/utils'
import type { CreditCardProps } from './credit-card.types'

function maskNumber(n = '') {
  const digits = n.replace(/\D/g, '').padEnd(16, '•')
  return [0, 4, 8, 12].map(i => digits.slice(i, i + 4)).join(' ')
}

function brandLabel(brand = 'generic') {
  const map: Record<string, string> = { visa: 'VISA', mastercard: '●● MC', amex: 'AMEX', generic: '◆◆' }
  return map[brand] ?? '◆◆'
}

const VARIANT_BG: Record<string, string> = {
  dark:     'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
  light:    'linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%)',
  gradient: 'linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f64f59 100%)',
}

const VARIANT_TEXT: Record<string, string> = {
  dark: '#ffffff', light: '#1a1a2e', gradient: '#ffffff',
}

export function CreditCard({
  number = '',
  name = 'CARD HOLDER',
  expiry = 'MM/YY',
  cvv = '•••',
  brand = 'generic',
  variant = 'dark',
  showBack = false,
  className,
  style,
}: CreditCardProps) {
  const bg        = VARIANT_BG[variant] ?? VARIANT_BG.dark
  const textColor = VARIANT_TEXT[variant] ?? '#ffffff'

  return (
    <>
      <style>{`
        .cc-scene { perspective: 1000px; }
        .cc-card { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
        .cc-card.cc-flipped { transform: rotateY(180deg); }
        .cc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 16px; overflow: hidden; }
        .cc-back { transform: rotateY(180deg); }
        .cc-chip-grid { display: grid; grid-template-columns: repeat(3,1fr); grid-template-rows: repeat(3,1fr); gap: 2px; width: 40px; height: 30px; border-radius: 4px; overflow: hidden; background: rgba(0,0,0,0.15); padding: 2px; }
        .cc-chip-cell { background: rgba(255,200,50,0.6); border-radius: 1px; }
        .cc-chip-cell:nth-child(2),.cc-chip-cell:nth-child(4),.cc-chip-cell:nth-child(6),.cc-chip-cell:nth-child(8) { background: rgba(255,200,50,0.3); }
      `}</style>
      <div className={cn('cc-scene w-[340px] h-[200px]', className)} style={style}>
        <div className={cn('cc-card', showBack && 'cc-flipped')}>
          <div className="cc-face" style={{ background: bg, color: textColor }}>
            <div className="flex flex-col h-full p-6 gap-4">
              <div className="flex items-start justify-between">
                <div className="cc-chip-grid">
                  {Array(9).fill(null).map((_, i) => <div key={i} className="cc-chip-cell" />)}
                </div>
                <span className="font-bold text-body-title tracking-widest opacity-90">{brandLabel(brand)}</span>
              </div>
              <div className="font-mono text-body-title tracking-[0.22em] mt-auto">{maskNumber(number)}</div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.6rem] opacity-60 uppercase tracking-widest">Card Holder</span>
                  <span className="text-body-callout font-semibold tracking-wide uppercase truncate max-w-[160px]">{name || 'CARD HOLDER'}</span>
                </div>
                <div className="flex flex-col gap-0.5 items-end">
                  <span className="text-[0.6rem] opacity-60 uppercase tracking-widest">Expires</span>
                  <span className="text-body-callout font-semibold tracking-wide">{expiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="cc-face cc-back" style={{ background: bg, color: textColor }}>
            <div className="flex flex-col h-full">
              <div className="w-full h-12 mt-6" style={{ background: 'rgba(0,0,0,0.4)' }} />
              <div className="flex items-center gap-3 px-6 mt-6">
                <div className="flex-1 h-8 rounded flex items-center px-3" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <span className="text-[0.625rem] uppercase tracking-[0.15em] opacity-50">Signature</span>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[0.6rem] uppercase tracking-widest opacity-60">CVV</span>
                  <span className="font-mono text-body-callout tracking-[0.3em]">{cvv}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
