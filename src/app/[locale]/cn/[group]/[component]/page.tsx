import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CnInstallBlock } from "@/components/ui/cn/cn-install-block";
import { CnPageHeader } from "@/components/ui/cn/cn-page-header";
import { CnPropsTable } from "@/components/ui/cn/cn-props-table";
import { CnSourceBlock } from "@/components/ui/cn/cn-source-block";
import { CnUsageBlock } from "@/components/ui/cn/cn-usage-block";
import { CnVariantBar } from "@/components/ui/cn/cn-variant-bar";
import { getComponent, getResolvedVariants, CN_GROUPS } from "@/lib/cn-registry";
import { getComponentSource } from "@/lib/cn-source";

import { CnShowcase } from "./_showcase";

interface Props {
  params: Promise<{ locale: string; group: string; component: string }>;
}

export const dynamic = "force-dynamic";

const showcaseFallback = (
  <div className="rounded-(--radius-lg) border border-rule bg-raised p-12 flex items-center justify-center min-h-[240px]">
    <div className="w-5 h-5 rounded-full border-2 border-patina border-t-transparent animate-spin-icon" />
  </div>
);

export default async function CnComponentPage({ params }: Props) {
  const { group, component } = await params;
  const meta = getComponent(group, component);
  if (!meta) notFound();

  const groupMeta = CN_GROUPS.find((g) => g.id === group);
  const groupLabel = groupMeta?.label ?? group;

  // Super component: the absorbed siblings whose own real demos are stacked below
  // the base showcase. The variant bar deep-links (smooth scroll) to each section.
  const siblings = getResolvedVariants(meta).filter((v) => !v.isBase);

  const source = meta.filePath ? getComponentSource(meta.filePath) : "";
  const filename = meta.filePath ? meta.filePath.split("/").pop() : undefined;

  return (
    <div className="px-8 py-8 max-w-5xl">
      <CnPageHeader group={group} groupLabel={groupLabel} title={meta.title} description={meta.description} />

      {/* Quick links to the absorbed siblings rendered below (smooth scroll) */}
      <CnVariantBar siblings={siblings} />

      {/* Base showcase */}
      <Suspense fallback={showcaseFallback}>
        <CnShowcase group={group} component={component} />
      </Suspense>

      {/* Absorbed siblings: each real demo stacked inline with its own anchor */}
      {siblings.length > 0 && (
        <div className="mt-16 flex flex-col gap-16">
          {siblings.map((s) => (
            <section key={s.name} id={`cn-v-${s.name}`} className="scroll-mt-24">
              <div className="mb-5 flex items-center gap-2.5 border-t border-rule pt-8">
                <h2 className="text-heading-04 font-bold text-foreground">{s.label}</h2>
                <span className="text-body-caption font-semibold uppercase tracking-[0.06em] text-patina bg-patina/10 border border-patina/30 rounded-full px-2 py-0.5">
                  Unificado
                </span>
              </div>
              <Suspense fallback={showcaseFallback}>
                <CnShowcase group={s.group} component={s.name} />
              </Suspense>
            </section>
          ))}
        </div>
      )}

      {/* Documentation blocks (base Super) */}
      <div className="mt-16 flex flex-col gap-8 border-t border-rule pt-10">
        {/* Install via CLI */}
        <CnInstallBlock name={component} peerDeps={meta.peerDeps} dependencies={meta.dependencies} />

        {/* Usage example with syntax highlighting */}
        <CnUsageBlock meta={meta} />

        {/* Full source */}
        {source && <CnSourceBlock source={source} filename={filename} />}

        {/* Props table */}
        {meta.props && meta.props.length > 0 && <CnPropsTable props={meta.props} />}
      </div>

      <div className="mt-8 pt-6 border-t border-rule">
        <Link
          href={`/cn/${group}`}
          className="inline-flex items-center gap-1.5 text-body-callout text-muted hover:text-foreground transition-colors duration-100"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width={13} height={13} aria-hidden>
            <path d="M10 12L6 8l4-4" />
          </svg>
          Voltar para {groupLabel}
        </Link>
      </div>
    </div>
  );
}
