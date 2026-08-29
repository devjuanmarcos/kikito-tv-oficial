"use client";

import type { PropDoc } from "@/lib/cn-registry";

interface CnPropsTableProps {
  props: PropDoc[];
}

// py-2.5 (0.625rem, repetido nas células abaixo): sem match exato entre --spacing-sm
// (0.5rem) e --spacing-md (0.75rem) — fica arbitrário mesmo, ver CLAUDE.md §Spacing.
export function CnPropsTable({ props }: CnPropsTableProps) {
  return (
    <div data-testid="cn-props-table">
      <div className="mb-(--spacing-sm)">
        <span className="text-body-caption font-semibold text-foreground">Props</span>
      </div>

      <div className="rounded-(--radius-md) border border-rule bg-raised overflow-hidden">
        <table className="w-full text-body-caption">
          <thead>
            <tr className="bg-graphite-2 border-b border-rule">
              <th className="px-(--spacing-lg) py-2.5 text-left font-semibold text-faint uppercase tracking-[0.06em] text-[0.625rem] w-[160px]">
                Prop
              </th>
              <th className="px-(--spacing-lg) py-2.5 text-left font-semibold text-faint uppercase tracking-[0.06em] text-[0.625rem]">
                Tipo
              </th>
              <th className="px-(--spacing-lg) py-2.5 text-left font-semibold text-faint uppercase tracking-[0.06em] text-[0.625rem] w-[120px]">
                Padrão
              </th>
              <th className="px-(--spacing-lg) py-2.5 text-left font-semibold text-faint uppercase tracking-[0.06em] text-[0.625rem]">
                Descrição
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {props.map((prop) => (
              <tr key={prop.name} data-testid="cn-props-row" className="hover:bg-graphite transition-colors">
                <td className="px-(--spacing-lg) py-2.5 align-top">
                  <code className="font-mono text-patina font-medium">
                    {prop.name}
                    {prop.required && <span className="text-danger ml-(--spacing-3xs)">*</span>}
                  </code>
                </td>
                <td className="px-(--spacing-lg) py-2.5 align-top">
                  <code className="font-mono text-kinpaku text-[0.75rem]">{prop.type}</code>
                </td>
                <td className="px-(--spacing-lg) py-2.5 align-top">
                  {prop.default !== undefined ? (
                    <code className="font-mono text-muted text-[0.75rem]">{prop.default}</code>
                  ) : (
                    <span className="text-faint">—</span>
                  )}
                </td>
                <td className="px-(--spacing-lg) py-2.5 align-top text-muted leading-relaxed">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
