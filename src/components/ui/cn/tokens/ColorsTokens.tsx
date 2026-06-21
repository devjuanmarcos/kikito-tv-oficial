/* ─── ColorsTokens.tsx — CN Design Tokens: Colors ─────────────────────────
   Server component — pure render. Tokens resolved via CSS custom props.
─────────────────────────────────────────────────────────────────────────── */

type IntentDef = {
  label: string
  base: string
  fg: string
  hover: string
  deep: string
  soft: string
  softFg: string
  note?: string
}

const BRAND_INTENTS: IntentDef[] = [
  { label: 'Patina — primary (teal)',    base: '--ks-patina',       fg: '--ks-patina-fg',       hover: '--ks-patina-hover',   deep: '--ks-patina-deep',   soft: '--ks-patina-soft',   softFg: '--ks-patina-soft-fg' },
  { label: 'Kinpaku — secondary (gold)', base: '--ks-kinpaku',      fg: '--ks-kinpaku-fg',      hover: '--ks-kinpaku-hover',  deep: '--ks-kinpaku-deep',  soft: '--ks-kinpaku-soft',  softFg: '--ks-kinpaku-soft-fg',  note: 'fg varia: dourado escuro no light, brilhante no dark' },
  { label: 'Violet — tertiary',          base: '--ks-violet',       fg: '--ks-violet-fg',       hover: '--ks-violet-hover',   deep: '--ks-violet-deep',   soft: '--ks-violet-soft',   softFg: '--ks-violet-soft-fg' },
  { label: 'Rose — quaternary',          base: '--ks-rose',         fg: '--ks-rose-fg',         hover: '--ks-rose-hover',     deep: '--ks-rose-deep',     soft: '--ks-rose-soft',     softFg: '--ks-rose-soft-fg' },
]

const SEMANTIC_INTENTS: IntentDef[] = [
  { label: 'Danger',   base: '--ks-danger',           fg: '--ks-danger-fg',           hover: '--ks-danger-hover',   deep: '--ks-danger-deep',   soft: '--ks-danger-soft',   softFg: '--ks-danger-soft-fg' },
  { label: 'Success',  base: '--ks-success',          fg: '--ks-success-fg',          hover: '--ks-success-hover',  deep: '--ks-success-deep',  soft: '--ks-success-soft',  softFg: '--ks-success-soft-fg' },
  { label: 'Warning',  base: '--ks-warning',          fg: '--ks-warning-fg',          hover: '--ks-warning-hover',  deep: '--ks-warning-deep',  soft: '--ks-warning-soft',  softFg: '--ks-warning-soft-fg',  note: 'fg brilhante no dark' },
  { label: 'Info',     base: '--ks-info',             fg: '--ks-info-fg',             hover: '--ks-info-hover',     deep: '--ks-info-deep',     soft: '--ks-info-soft',     softFg: '--ks-info-soft-fg' },
  { label: 'Neutral',  base: '--ks-neutral-btn',      fg: '--ks-neutral-btn-fg',      hover: '--ks-neutral-btn-hover', deep: '--ks-neutral-btn-deep', soft: '--ks-neutral-btn-soft', softFg: '--ks-neutral-btn-soft-fg' },
]

type TokenPair = { name: string; dark: string; light: string }

const SURFACE_TOKENS: TokenPair[] = [
  { name: '--ks-lacquer-deep',   dark: 'oklch(8% .006 95)',   light: 'oklch(96% 0 0)' },
  { name: '--ks-lacquer',        dark: 'oklch(13% .006 95)',  light: 'oklch(99% 0 0)' },
  { name: '--ks-lacquer-raised', dark: 'oklch(14.5% 0 0)',    light: 'oklch(100% 0 0)' },
  { name: '--ks-lacquer-float',  dark: 'oklch(18% .004 95)',  light: 'oklch(98% 0 0)' },
  { name: '--ks-lacquer-sunken', dark: 'oklch(10% .006 95)',  light: 'oklch(95% 0 0)' },
  { name: '--ks-graphite',       dark: 'oklch(20% .004 95)',  light: 'oklch(96% 0 0)' },
  { name: '--ks-graphite-2',     dark: 'oklch(27% .003 95)',  light: 'oklch(93% 0 0)' },
]

const TEXT_TOKENS: TokenPair[] = [
  { name: '--ks-text',       dark: 'oklch(87% 0 0)',  light: 'oklch(18% 0 0)' },
  { name: '--ks-text-muted', dark: 'oklch(62% 0 0)',  light: 'oklch(46% 0 0)' },
  { name: '--ks-text-faint', dark: 'oklch(42% 0 0)',  light: 'oklch(65% 0 0)' },
]

const RADIUS_TOKENS = [
  { name: '--ks-radius-xs',   value: '2px',    label: 'xs' },
  { name: '--ks-radius-sm',   value: '6px',    label: 'sm' },
  { name: '--ks-radius-md',   value: '10px',   label: 'md' },
  { name: '--ks-radius-lg',   value: '14px',   label: 'lg' },
  { name: '--ks-radius-xl',   value: '20px',   label: 'xl' },
  { name: '--ks-radius-2xl',  value: '28px',   label: '2xl' },
  { name: '--ks-radius-pill', value: '9999px', label: 'pill' },
]

const SPACING_TOKENS = [
  { name: '--spacing-xs',  px: 8  },
  { name: '--spacing-sm',  px: 12 },
  { name: '--spacing-md',  px: 16 },
  { name: '--spacing-lg',  px: 24 },
  { name: '--spacing-xl',  px: 32 },
  { name: '--spacing-2xl', px: 48 },
]

const EASING_TOKENS = [
  { name: '--ease-out-quint',    value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  { name: '--ease-in-out-quart', value: 'cubic-bezier(0.76, 0, 0.24, 1)' },
  { name: '--ease-spring',       value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
]

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'var(--ks-text-faint)', marginBottom: '1.25rem',
    }}>
      {children}
    </p>
  )
}

function TokenRow({ name, value }: { name: string; value: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '5px 0', borderBottom: '1px solid var(--ks-rule)', gap: 16,
    }}>
      <code style={{ fontSize: 11, color: 'var(--ks-primary)', fontFamily: 'monospace' }}>{name}</code>
      <span style={{ fontSize: 11, color: 'var(--ks-text-muted)', textAlign: 'right', fontFamily: 'monospace' }}>{value}</span>
    </div>
  )
}

function IntentCard({ intent }: { intent: IntentDef }) {
  const cells = [
    { label: 'base',    bg: `var(${intent.base})`,  fg: `var(${intent.fg})`,    token: intent.base },
    { label: 'hover',   bg: `var(${intent.hover})`, fg: `var(${intent.fg})`,    token: intent.hover },
    { label: 'deep',    bg: `var(${intent.deep})`,  fg: `var(${intent.fg})`,    token: intent.deep },
    { label: 'soft',    bg: `var(${intent.soft})`,  fg: `var(${intent.softFg})`,token: intent.soft },
    { label: 'soft-fg', bg: 'transparent',           fg: `var(${intent.softFg})`,token: intent.softFg },
    { label: 'fg',      bg: `var(${intent.fg})`,    fg: `var(${intent.base})`,  token: intent.fg },
  ]
  return (
    <div style={{
      background: 'var(--ks-lacquer-raised)', border: '1px solid var(--ks-rule)',
      borderRadius: 12, overflow: 'hidden', marginBottom: '0.875rem',
    }}>
      <div style={{ padding: '9px 14px', borderBottom: '1px solid var(--ks-rule)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: `var(${intent.base})`, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ks-text)' }}>{intent.label}</span>
        {intent.note && (
          <span style={{ fontSize: 10, color: 'var(--ks-text-faint)', marginLeft: 'auto', fontStyle: 'italic' }}>⚠ {intent.note}</span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {cells.map(cell => (
          <div key={cell.label} style={{
            padding: '10px 6px', background: cell.bg,
            borderRight: '1px solid var(--ks-rule)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: 64,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: cell.fg, textAlign: 'center', lineHeight: 1.2 }}>
              {cell.label === 'soft-fg' || cell.label === 'fg' ? 'Aa' : cell.label}
            </span>
            <code style={{ fontSize: 8, color: cell.fg, opacity: 0.7, textAlign: 'center', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.2 }}>
              {cell.token.replace('--ks-', '').replace('neutral-btn', 'neutral')}
            </code>
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 14px 8px' }}>
        {[
          { label: 'base', t: intent.base }, { label: 'fg', t: intent.fg },
          { label: 'hover', t: intent.hover }, { label: 'deep', t: intent.deep },
          { label: 'soft', t: intent.soft }, { label: 'soft-fg', t: intent.softFg },
        ].map(row => (
          <div key={row.t} style={{ display: 'flex', gap: 8, fontSize: 10, borderBottom: '1px solid var(--ks-rule)', padding: '2px 0' }}>
            <span style={{ color: 'var(--ks-text-faint)', minWidth: 48, flexShrink: 0 }}>{row.label}</span>
            <code style={{ color: 'var(--ks-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{row.t}</code>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniSwatch({ token }: { token: TokenPair }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', minWidth: 0 }}>
      <div style={{
        width: '100%', aspectRatio: '1', borderRadius: 8,
        background: `var(${token.name})`, border: '1px solid var(--ks-rule)',
      }} />
      <p style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--ks-text)', wordBreak: 'break-all', lineHeight: 1.3 }}>
        {token.name.replace('--ks-', '')}
      </p>
      <p style={{ fontSize: '0.5rem', color: 'var(--ks-text-faint)', fontFamily: 'monospace', lineHeight: 1.25, wordBreak: 'break-all' }}>
        dark: {token.dark}
      </p>
      <p style={{ fontSize: '0.5rem', color: 'var(--ks-text-faint)', fontFamily: 'monospace', lineHeight: 1.25, wordBreak: 'break-all' }}>
        light: {token.light}
      </p>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function ColorsTokens() {
  return (
    <div style={{ maxWidth: 880 }}>

      {/* ── Brand colors ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeader>Brand Colors — Patina / Kinpaku / Violet / Rose</SectionHeader>
        <p style={{ fontSize: 12, color: 'var(--ks-text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Cada intent expõe 6 variantes.{' '}
          <code style={{ color: 'var(--ks-primary)', fontFamily: 'monospace' }}>--ks-primary</code>,{' '}
          <code style={{ color: 'var(--ks-primary)', fontFamily: 'monospace' }}>--ks-secondary</code> etc. são aliases semânticos.
          As swatches refletem o tema atual (light / dark).
        </p>
        {BRAND_INTENTS.map(intent => <IntentCard key={intent.label} intent={intent} />)}
      </section>

      {/* ── Semantic intents ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeader>Semantic Intents — Danger / Success / Warning / Info / Neutral</SectionHeader>
        {SEMANTIC_INTENTS.map(intent => <IntentCard key={intent.label} intent={intent} />)}
      </section>

      {/* ── Semantic alias table ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeader>Aliases Semânticos</SectionHeader>
        <p style={{ fontSize: 12, color: 'var(--ks-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Use{' '}
          <code style={{ color: 'var(--ks-primary)', fontFamily: 'monospace' }}>--ks-primary</code> /{' '}
          <code style={{ color: 'var(--ks-primary)', fontFamily: 'monospace' }}>--ks-secondary</code> /{' '}
          <code style={{ color: 'var(--ks-primary)', fontFamily: 'monospace' }}>--ks-tertiary</code>{' '}
          nos componentes. Os aliases resolvem dinamicamente ao alterar o token de marca.
        </p>
        <div style={{ overflowX: 'auto', background: 'var(--ks-lacquer-raised)', border: '1px solid var(--ks-rule)', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ks-rule)' }}>
                {['Alias', 'Brand token', 'base', 'hover', 'deep', 'soft', 'fg'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--ks-text-faint)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { alias: '--ks-primary',   brand: '--ks-patina',       color: 'var(--ks-primary)' },
                { alias: '--ks-secondary', brand: '--ks-kinpaku',      color: 'var(--ks-kinpaku)' },
                { alias: '--ks-tertiary',  brand: '--ks-violet',       color: 'var(--ks-violet)' },
                { alias: '--ks-quaternary',brand: '--ks-rose',         color: 'var(--ks-rose)' },
                { alias: '--ks-neutral',   brand: '--ks-neutral-btn',  color: 'var(--ks-neutral-btn)' },
              ].map(row => (
                <tr key={row.alias} style={{ borderBottom: '1px solid var(--ks-rule)' }}>
                  <td style={{ padding: '8px 10px' }}>
                    <code style={{ color: 'var(--ks-primary)', fontFamily: 'monospace', fontSize: 10 }}>{row.alias}</code>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <code style={{ color: 'var(--ks-text-muted)', fontFamily: 'monospace', fontSize: 10 }}>{row.brand}</code>
                  </td>
                  {['', '-hover', '-deep', '-soft', '-fg'].map(suffix => (
                    <td key={suffix} style={{ padding: '8px 10px' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 5, border: '1px solid var(--ks-rule)',
                        background: row.color,
                        opacity: suffix === '-soft' ? 0.25 : suffix === '-hover' ? 0.8 : suffix === '-deep' ? 0.65 : suffix === '-fg' ? 0.5 : 1,
                      }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Surfaces ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeader>Surfaces — Lacquer / Graphite</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {SURFACE_TOKENS.map(t => <MiniSwatch key={t.name} token={t} />)}
        </div>
      </section>

      {/* ── Text ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeader>Text</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {TEXT_TOKENS.map(t => <MiniSwatch key={t.name} token={t} />)}
        </div>
        <div style={{
          padding: '12px 16px', background: 'var(--ks-lacquer-raised)', borderRadius: 8,
          border: '1px solid var(--ks-rule)', display: 'flex', gap: 28, flexWrap: 'wrap',
        }}>
          <span style={{ color: 'var(--ks-text)', fontSize: 13 }}>--ks-text (primary)</span>
          <span style={{ color: 'var(--ks-text-muted)', fontSize: 13 }}>--ks-text-muted (secondary)</span>
          <span style={{ color: 'var(--ks-text-faint)', fontSize: 13 }}>--ks-text-faint (labels / tertiary)</span>
        </div>
      </section>

      {/* ── Border radius ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeader>Border Radius</SectionHeader>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
          {RADIUS_TOKENS.map(t => (
            <div key={t.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 56, height: 56,
                background: 'var(--ks-primary-soft)', border: '2px solid var(--ks-primary)',
                borderRadius: t.value,
              }} />
              <code style={{ fontSize: 10, color: 'var(--ks-primary)', fontFamily: 'monospace' }}>{t.label}</code>
              <span style={{ fontSize: 10, color: 'var(--ks-text-faint)' }}>{t.value}</span>
            </div>
          ))}
        </div>
        {RADIUS_TOKENS.map(t => <TokenRow key={t.name} name={t.name} value={t.value} />)}
      </section>

      {/* ── Spacing ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeader>Spacing Scale</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {SPACING_TOKENS.map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: t.px, height: 14, background: 'var(--ks-primary)', borderRadius: 3, opacity: 0.75, flexShrink: 0 }} />
              <code style={{ fontSize: 11, color: 'var(--ks-primary)', fontFamily: 'monospace', minWidth: 130 }}>{t.name}</code>
              <span style={{ fontSize: 11, color: 'var(--ks-text-faint)', fontFamily: 'monospace' }}>{t.px}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Easing ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeader>Easing Curves</SectionHeader>
        {EASING_TOKENS.map(t => <TokenRow key={t.name} name={t.name} value={t.value} />)}
      </section>

    </div>
  )
}
