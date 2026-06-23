import { codeToHtml } from "shiki";

import { KkCodeBlockCopy } from "./KkCodeBlockCopy";

interface KkCodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
  showLineNumbers?: boolean;
  maxHeight?: number;
}

export async function KkCodeBlock({
  code,
  lang = "tsx",
  filename,
  showLineNumbers = false,
  maxHeight,
}: KkCodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang,
    theme: "github-dark",
    transformers: showLineNumbers
      ? [
          {
            line(node, line) {
              node.properties["data-line"] = line;
            },
          },
        ]
      : [],
  });

  return (
    <div className="group relative rounded-(--radius-md) border border-rule bg-[#0d1117] overflow-hidden text-[0.8125rem] font-mono">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-rule bg-[#161b22]">
          <span className="text-body-caption text-[#8b949e] font-medium">{filename}</span>
          <KkCodeBlockCopy code={code.trim()} />
        </div>
      )}

      {!filename && (
        <div className="absolute top-2.5 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <KkCodeBlockCopy code={code.trim()} />
        </div>
      )}

      <div
        className="overflow-auto [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_pre]:leading-6 [&_code]:!bg-transparent"
        style={maxHeight ? { maxHeight } : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
