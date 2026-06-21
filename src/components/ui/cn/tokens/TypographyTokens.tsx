'use client'

/* ─── TypographyTokens.tsx — CN Design Tokens: Typography ─────────────────
   Client component — font switcher + weight toggle use useState/useEffect.
─────────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'

/* ─── Font catalogue ─────────────────────────────────────────────────────── */
const FONTS: Record<string, string | null> = {
  'Geist (padrão)':    null,
  'System UI':         null,
  'Inter':             'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'DM Sans':           'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap',
  'Plus Jakarta Sans': 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',
  'Space Grotesk':     'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
  'Manrope':           'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap',
  'Outfit':            'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
  'Nunito':            'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
}

/* ─── Type scale ─────────────────────────────────────────────────────────── */
const TYPE_SCALE = [
  { label: 'Display',  size: '7.5rem',    weight: 700, sample: 'Aa',               description: 'Hero / landing headlines', cap: '4rem' },
  { label: 'Headline', size: '2.25rem',   weight: 700, sample: 'Headline',         description: 'Títulos de seção, page headers' },
  { label: 'H1',       size: '1.875rem',  weight: 700, sample: 'Page header H1',   description: 'Cabeçalho de página principal' },
  { label: 'H2',       size: '1.5rem',    weight: 600, sample: 'Section title H2', description: 'Subtítulo de seção' },
  { label: 'Title',    size: '1.25rem',   weight: 600, sample: 'Card / panel title', description: 'Cards, painéis, dialogs' },
  { label: 'Body',     size: '1rem',      weight: 400, sample: 'The quick brown fox jumps over the lazy dog. Body text at this scale should have line-height 1.6 for comfortable reading.', description: 'Parágrafos — line-height 1.6', lineHeight: 1.6 },
  { label: 'Body SM',  size: '0.9375rem', weight: 400, sample: 'Texto de corpo menor, secundário ou em panels. Ainda legível e confortável.', description: 'Secondary body', lineHeight: 1.55 },
  { label: 'Caption',  size: '0.8125rem', weight: 400, sample: 'Helper text, timestamps, metadata, form hints, labels', description: 'Texto auxiliar' },
  { label: 'Caption S',size: '0.75rem',   weight: 400, sample: 'Tooltips, notas de rodapé, contador de caracteres', description: 'Captions pequeñas' },
  { label: 'Eyebrow',  size: '0.625rem',  weight: 700, sample: 'SECTION LABEL / CATEGORY', description: 'Eyebrows, tags, allcaps labels', textTransform: 'uppercase' as const, letterSpacing: '0.12em' },
]

const WEIGHTS = [300, 400, 500, 600, 700]

const WEIGHT_LABELS: Record<number, string> = {
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
}

/* ─── TypographyTokens ───────────────────────────────────────────────────── */
export function TypographyTokens() {
  const [fontKey, setFontKey] = useState('Geist (padrão)')
  const [showWeights, setShowWeights] = useState(false)

  useEffect(() => {
    const url = FONTS[fontKey]
    if (!url) return
    const id = `gf-${fontKey.replace(/\s+/g, '-').toLowerCase()}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id; link.rel = 'stylesheet'; link.href = url
    document.head.appendChild(link)
  }, [fontKey])

  const fontFamily = fontKey === 'Geist (padrão)'
    ? 'var(--font-geist-sans), system-ui, sans-serif'
    : fontKey === 'System UI'
    ? 'system-ui, -apple-system, sans-serif'
    : `'${fontKey}', system-ui, sans-serif`

  return (
    <div style={{ maxWidth: 860 }}>

      {/* ── Controls ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap',
        marginBottom: '2.5rem', padding: '1rem 1.25rem',
        background: 'var(--ks-lacquer-raised)', border: '1px solid var(--ks-rule)',
        borderRadius: 10,
      }}>
        {/* Font select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <label style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ks-text-faint)' }}>
            Font Family
          </label>
          <select
            value={fontKey}
            onChange={e => setFontKey(e.target.value)}
            style={{
              padding: '0.4375rem 2.25rem 0.4375rem 0.75rem',
              borderRadius: 6, border: '1px solid var(--ks-rule)',
              background: 'var(--ks-lacquer)', color: 'var(--ks-text)',
              fontSize: '0.875rem', fontFamily, cursor: 'pointer', outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center',
            }}
          >
            {Object.keys(FONTS).map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Weight toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <label style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ks-text-faint)' }}>
            Modo
          </label>
          <button
            onClick={() => setShowWeights(v => !v)}
            style={{
              padding: '0.4375rem 0.875rem', borderRadius: 6,
              border: `1px solid ${showWeights ? 'var(--ks-primary)' : 'var(--ks-rule)'}`,
              background: showWeights ? 'var(--ks-primary-soft)' : 'transparent',
              color: showWeights ? 'var(--ks-primary)' : 'var(--ks-text-muted)',
              fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 140ms ease',
            }}
          >
            {showWeights ? 'Pesos ativos' : 'Ver pesos'}
          </button>
        </div>

        {/* Active font display */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--ks-text-faint)' }}>Usando:</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--ks-text)', fontFamily, fontWeight: 600 }}>{fontKey}</span>
        </div>
      </div>

      {/* ── Type scale ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {TYPE_SCALE.map((step, i) => (
          <div
            key={step.label}
            style={{
              padding: '1.75rem 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--ks-rule)',
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            {/* Meta column */}
            <div style={{ paddingTop: '0.125rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--ks-primary)', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                {step.label}
              </p>
              <p style={{ fontSize: '0.5625rem', color: 'var(--ks-text-faint)', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                {step.size} / {step.weight}
              </p>
              <p style={{ fontSize: '0.6rem', color: 'var(--ks-text-faint)', lineHeight: 1.45 }}>
                {step.description}
              </p>
            </div>

            {/* Sample column */}
            <div>
              {showWeights ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {WEIGHTS.map(w => (
                    <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.5625rem', color: 'var(--ks-text-faint)', fontFamily: 'monospace', width: 44, flexShrink: 0 }}>
                        {w} {WEIGHT_LABELS[w]}
                      </span>
                      <span style={{
                        fontFamily,
                        fontSize: `min(${step.size}, ${step.cap ?? step.size})`,
                        fontWeight: w,
                        color: 'var(--ks-text)',
                        lineHeight: step.lineHeight ?? 1.2,
                        textTransform: step.textTransform,
                        letterSpacing: step.letterSpacing,
                        wordBreak: 'break-word',
                      }}>
                        {step.sample}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{
                  fontFamily,
                  fontSize: `min(${step.size}, ${step.cap ?? step.size})`,
                  fontWeight: step.weight,
                  color: 'var(--ks-text)',
                  lineHeight: step.lineHeight ?? 1.2,
                  textTransform: step.textTransform,
                  letterSpacing: step.letterSpacing,
                  display: 'block',
                  wordBreak: 'break-word',
                }}>
                  {step.sample}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Spacing tokens ───────────────────────────────────────── */}
      <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--ks-rule)' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ks-text-faint)', marginBottom: '1.25rem' }}>
          Spacing Tokens
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[
            { name: '--spacing-xs',  value: '0.5rem',  px: '8px',  w: 8 },
            { name: '--spacing-sm',  value: '0.75rem', px: '12px', w: 12 },
            { name: '--spacing-md',  value: '1rem',    px: '16px', w: 16 },
            { name: '--spacing-lg',  value: '1.5rem',  px: '24px', w: 24 },
            { name: '--spacing-xl',  value: '2rem',    px: '32px', w: 32 },
            { name: '--spacing-2xl', value: '3rem',    px: '48px', w: 48 },
          ].map(sp => (
            <div key={sp.name} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <span style={{ fontSize: '0.625rem', fontFamily: 'monospace', color: 'var(--ks-text-faint)', width: 120, flexShrink: 0 }}>{sp.name}</span>
              <div style={{ height: 18, width: sp.w, background: 'var(--ks-primary)', borderRadius: 3, opacity: 0.75, flexShrink: 0 }} />
              <span style={{ fontSize: '0.5625rem', fontFamily: 'monospace', color: 'var(--ks-text-faint)' }}>{sp.value} · {sp.px}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Font weight matrix ───────────────────────────────────── */}
      <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--ks-rule)' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ks-text-faint)', marginBottom: '1.25rem' }}>
          Weight Matrix
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {WEIGHTS.map(w => (
            <div key={w} style={{
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              padding: '0.5rem 0', borderBottom: '1px solid var(--ks-rule)',
            }}>
              <span style={{ fontSize: '0.625rem', fontFamily: 'monospace', color: 'var(--ks-text-faint)', width: 80, flexShrink: 0 }}>
                {w} — {WEIGHT_LABELS[w]}
              </span>
              <span style={{ fontFamily, fontWeight: w, fontSize: '1.125rem', color: 'var(--ks-text)' }}>
                Kikito Design System CN
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
