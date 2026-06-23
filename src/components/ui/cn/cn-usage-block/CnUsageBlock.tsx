import { KkCodeBlock } from "@/components/ui/kk-code-block";
import { generateUsage } from "@/lib/cn-registry";
import type { CnComponentMeta } from "@/lib/cn-registry";
import { COMPONENT_USAGE } from "@/lib/cn-usage";

interface CnUsageBlockProps {
  meta: CnComponentMeta;
}

export function CnUsageBlock({ meta }: CnUsageBlockProps) {
  const code = generateUsage(meta, COMPONENT_USAGE);

  return (
    <div data-testid="cn-usage-block">
      <div className="mb-2">
        <span className="text-body-caption font-semibold text-foreground">Exemplo de uso</span>
      </div>
      <KkCodeBlock code={code} lang="tsx" filename={`${meta.title}Example.tsx`} showLineNumbers />
    </div>
  );
}
