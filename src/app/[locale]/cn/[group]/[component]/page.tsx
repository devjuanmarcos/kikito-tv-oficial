import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CnInstallBlock } from "@/components/ui/cn/cn-install-block";
import { CnPageHeader } from "@/components/ui/cn/cn-page-header";
import { CnPropsTable } from "@/components/ui/cn/cn-props-table";
import { CnSourceBlock } from "@/components/ui/cn/cn-source-block";
import { getComponent, generateStaticComponentParams, CN_GROUPS } from "@/lib/cn-registry";
import { getComponentSource } from "@/lib/cn-source";

import { CnShowcase } from "./_showcase";

interface Props {
  params: Promise<{ locale: string; group: string; component: string }>;
}

export async function generateStaticParams() {
  return generateStaticComponentParams();
}

export default async function CnComponentPage({ params }: Props) {
  const { group, component } = await params;
  const meta = getComponent(group, component);
  if (!meta) notFound();

  const groupMeta = CN_GROUPS.find((g) => g.id === group);
  const groupLabel = groupMeta?.label ?? group;

  const source = meta.filePath ? getComponentSource(meta.filePath) : "";
  const filename = meta.filePath ? meta.filePath.split("/").pop() : undefined;

  return (
    <div className="px-8 py-8 max-w-5xl">
      <CnPageHeader group={group} groupLabel={groupLabel} title={meta.title} description={meta.description} />

      {/* Live showcase */}
      <Suspense
        fallback={
          <div className="rounded-(--radius-lg) border border-rule bg-raised p-12 flex items-center justify-center min-h-[240px]">
            <div className="w-5 h-5 rounded-full border-2 border-patina border-t-transparent animate-spin-icon" />
          </div>
        }
      >
        <CnShowcase group={group} component={component} />
      </Suspense>

      {/* Documentation blocks */}
      {(meta.filePath || (meta.props && meta.props.length > 0) || source) && (
        <div className="mt-12 flex flex-col gap-8">
          {meta.filePath && (
            <CnInstallBlock filePath={meta.filePath} peerDeps={meta.peerDeps} dependencies={meta.dependencies} />
          )}

          {source && <CnSourceBlock source={source} filename={filename} />}

          {meta.props && meta.props.length > 0 && <CnPropsTable props={meta.props} />}
        </div>
      )}

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
