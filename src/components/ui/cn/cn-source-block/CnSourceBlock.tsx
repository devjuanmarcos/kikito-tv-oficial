import { KkCodeBlock } from "@/components/ui/kk-code-block";

interface CnSourceBlockProps {
  source: string;
  filename?: string;
}

export async function CnSourceBlock({ source, filename }: CnSourceBlockProps) {
  return (
    <div data-testid="cn-source-block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-body-caption font-semibold text-foreground">Código-fonte</span>
        {filename && <span className="text-body-caption font-mono text-faint">{filename}</span>}
      </div>
      <KkCodeBlock code={source} lang="tsx" filename={filename} showLineNumbers maxHeight={480} />
    </div>
  );
}
