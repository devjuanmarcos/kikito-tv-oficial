import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGroup, getComponentsByGroup, CN_GROUPS } from '@/lib/cn-registry'

interface Props {
  params: Promise<{ locale: string; group: string }>
}

export async function generateStaticParams() {
  return CN_GROUPS.map(g => ({ group: g.id }))
}

export default async function CnGroupPage({ params }: Props) {
  const { group } = await params
  const groupMeta = getGroup(group)
  if (!groupMeta) notFound()

  const components = getComponentsByGroup(group)

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/cn" className="text-body-callout text-muted hover:text-foreground inline-flex items-center gap-1 mb-4 transition-colors">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><path d="M10 12L6 8l4-4"/></svg>
          Todos os grupos
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-heading-05">{groupMeta.icon}</span>
          <h1 className="text-heading-04 font-bold text-foreground">{groupMeta.label}</h1>
        </div>
        <p className="text-muted">{groupMeta.description}</p>
      </div>

      <div className="grid gap-3">
        {components.map(comp => (
          <Link
            key={comp.name}
            href={`/cn/${comp.group}/${comp.name}`}
            className="group flex items-center justify-between p-4 rounded-[--radius-md] border border-rule bg-raised hover:border-patina hover:bg-patina-soft transition-all duration-150"
          >
            <div>
              <h2 className="text-body-paragraph font-semibold text-foreground group-hover:text-patina transition-colors">{comp.title}</h2>
              <p className="text-body-callout text-muted mt-[2px]">{comp.description}</p>
            </div>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14} className="text-faint group-hover:text-patina transition-colors shrink-0">
              <path d="M6 12l4-4-4-4"/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
