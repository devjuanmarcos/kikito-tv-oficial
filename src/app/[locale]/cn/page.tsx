import Link from 'next/link'
import { CN_GROUPS, CN_REGISTRY } from '@/lib/cn-registry'

export default function CnIndexPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-patina mb-2">Design System</p>
        <h1 className="text-[2.25rem] font-bold text-foreground leading-[1.15] mb-3">Kikito CN</h1>
        <p className="text-[1rem] text-muted max-w-xl">
          Biblioteca de componentes construída com Tailwind v4,{' '}
          <code className="bg-raised px-[5px] py-[2px] rounded-[5px] text-[0.875rem] font-mono text-patina">cn()</code>
          , tokens semânticos e zero CSS Modules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CN_GROUPS.map(group => {
          const components = CN_REGISTRY.filter(c => c.group === group.id)
          if (components.length === 0) return null
          return (
            <div key={group.id} className="rounded-[--radius-md] border border-rule bg-raised p-5 hover:border-patina transition-colors duration-150">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[1.25rem]">{group.icon}</span>
                <h2 className="text-[0.9375rem] font-semibold text-foreground">{group.label}</h2>
                <span className="ml-auto text-[0.6875rem] font-bold text-faint bg-graphite px-[6px] py-[2px] rounded-pill">
                  {components.length}
                </span>
              </div>
              <p className="text-[0.8125rem] text-muted mb-4">{group.description}</p>
              <ul className="space-y-[3px]">
                {components.map(comp => (
                  <li key={comp.name}>
                    <Link
                      href={`/cn/${comp.group}/${comp.name}`}
                      className="flex items-center gap-2 text-[0.8125rem] text-muted hover:text-patina transition-colors duration-100 group"
                    >
                      <span className="w-[4px] h-[4px] rounded-full bg-rule group-hover:bg-patina transition-colors duration-100 flex-shrink-0" />
                      {comp.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="mt-10 pt-8 border-t border-rule flex items-center gap-3">
        <div className="w-[8px] h-[8px] rounded-full bg-patina animate-ping-dot" />
        <p className="text-[0.8125rem] text-muted">
          {CN_REGISTRY.length} componentes disponíveis — mais sendo migrados continuamente
        </p>
      </div>
    </div>
  )
}
