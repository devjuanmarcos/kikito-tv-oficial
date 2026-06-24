import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CnInstallBlock } from "@/components/ui/cn/cn-install-block";
import { CnPageHeader } from "@/components/ui/cn/cn-page-header";
import { CnPropsTable } from "@/components/ui/cn/cn-props-table";
import { CnSourceBlock } from "@/components/ui/cn/cn-source-block";
import { CnUsageBlock } from "@/components/ui/cn/cn-usage-block";
import { CnVariantBar } from "@/components/ui/cn/cn-variant-bar";
import { getComponent, getComponentByName, getResolvedVariants, CN_GROUPS } from "@/lib/cn-registry";
import { getComponentSource } from "@/lib/cn-source";

import { CnShowcase } from "./_showcase";

interface Props {
  params: Promise<{ locale: string; group: string; component: string }>;
  searchParams: Promise<{ v?: string }>;
}

export const dynamic = "force-dynamic";

export default async function CnComponentPage({ params, searchParams }: Props) {
  const { group, component } = await params;
  const meta = getComponent(group, component);
  if (!meta) notFound();

  const groupMeta = CN_GROUPS.find((g) => g.id === group);
  const groupLabel = groupMeta?.label ?? group;

  // Variant selector: base Super + absorbed siblings. `?v=<name>` picks a sibling;
  // the showcase + docs below then reflect that sibling's own real demo and props.
  const variants = getResolvedVariants(meta);
  const requested = (await searchParams).v ?? "";
  const activeVariant = variants.find((v) => !v.isBase && v.name === requested);
  const active = activeVariant?.name ?? "";

  // The component actually documented (base, or the selected absorbed sibling).
  const docMeta = activeVariant ? getComponentByName(activeVariant.name) ?? meta : meta;

  const source = docMeta.filePath ? getComponentSource(docMeta.filePath) : "";
  const filename = docMeta.filePath ? docMeta.filePath.split("/").pop() : undefined;

  return (
    <div className="px-8 py-8 max-w-5xl">
      <CnPageHeader group={group} groupLabel={groupLabel} title={meta.title} description={meta.description} />

      {/* Variant selector (Super components): base + absorbed siblings */}
      <CnVariantBar chips={variants} active={active} />

      {/* Live showcase (reflects the active variant) */}
      <Suspense
        key={docMeta.name}
        fallback={
          <div className="rounded-(--radius-lg) border border-rule bg-raised p-12 flex items-center justify-center min-h-[240px]">
            <div className="w-5 h-5 rounded-full border-2 border-patina border-t-transparent animate-spin-icon" />
          </div>
        }
      >
        <CnShowcase group={docMeta.group} component={docMeta.name} />
      </Suspense>

      {/* Documentation blocks (reflect the active variant) */}
      <div className="mt-12 flex flex-col gap-8">
        {/* Install via CLI */}
        <CnInstallBlock name={docMeta.name} peerDeps={docMeta.peerDeps} dependencies={docMeta.dependencies} />

        {/* Usage example with syntax highlighting */}
        <CnUsageBlock meta={docMeta} />

        {/* Full source */}
        {source && <CnSourceBlock source={source} filename={filename} />}

        {/* Props table */}
        {docMeta.props && docMeta.props.length > 0 && <CnPropsTable props={docMeta.props} />}
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
