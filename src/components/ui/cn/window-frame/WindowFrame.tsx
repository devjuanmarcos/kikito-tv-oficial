import { cn } from "@/lib/utils";

import type { WindowFrameProps } from "./window-frame.types";

function MacOsChrome({ title, url }: { title?: string; url?: string }) {
  return (
    <div className="flex flex-col border-b border-rule bg-graphite-2">
      {/* Traffic + title */}
      <div className="flex items-center gap-(--spacing-md) px-(--spacing-lg) py-2.5">
        {/* Traffic lights: puramente decorativo, sem ação real — mesmo tratamento do
            TerminalBlock (tokens de intent, não hex cru imitando as cores reais do macOS) */}
        <div aria-hidden="true" className="flex items-center gap-(--spacing-xs) flex-shrink-0">
          <span className="w-3 h-3 rounded-full bg-danger" />
          <span className="w-3 h-3 rounded-full bg-warning" />
          <span className="w-3 h-3 rounded-full bg-success" />
        </div>
        {title && !url && <span className="flex-1 text-center text-body-caption text-faint">{title}</span>}
        {url && (
          <div className="flex-1 mx-(--spacing-lg) px-(--spacing-md) py-(--spacing-2xs) rounded-md bg-graphite border border-rule text-body-caption text-faint truncate text-center">
            {url}
          </div>
        )}
      </div>
    </div>
  );
}

function WindowsChrome({ title, url }: { title?: string; url?: string }) {
  return (
    <div className="flex flex-col border-b border-rule bg-graphite-2">
      <div className="flex items-center justify-between px-(--spacing-md) py-(--spacing-sm)">
        <span className="text-body-caption text-faint">{title}</span>
        {/* Botões de controle são decoração de chrome (mesmo papel dos traffic lights do
            macOS acima) — sem onClick/callback nenhum, um <button> real criaria uma
            afordância falsa (foco/tab stop que não faz nada, leitor de tela anuncia
            "botão" sem ação). Downgrade pra span decorativo, mesmo tratamento */}
        <div aria-hidden="true" className="flex items-center gap-0">
          {["─", "□", "✕"].map((icon, i) => (
            <span key={i} className="w-8 h-7 flex items-center justify-center text-faint text-body-caption">
              {icon}
            </span>
          ))}
        </div>
      </div>
      {url && (
        <div className="px-(--spacing-md) pb-(--spacing-sm)">
          <div className="px-(--spacing-md) py-(--spacing-2xs) rounded-sm bg-graphite border border-rule text-body-caption text-faint truncate">
            {url}
          </div>
        </div>
      )}
    </div>
  );
}

function MinimalChrome({ title }: { title?: string }) {
  return (
    <div className="flex items-center justify-between px-(--spacing-lg) py-(--spacing-sm) border-b border-rule bg-graphite-2">
      <span className="text-body-caption text-faint">{title}</span>
      <div aria-hidden="true" className="flex gap-(--spacing-xs)">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-rule" />
        ))}
      </div>
    </div>
  );
}

export function WindowFrame({ children, variant = "macos", title, url, className, style }: WindowFrameProps) {
  return (
    <div
      style={style}
      className={cn(
        "rounded-xl overflow-hidden border border-rule shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.5)]",
        className
      )}
    >
      {variant === "macos" && <MacOsChrome title={title} url={url} />}
      {variant === "windows" && <WindowsChrome title={title} url={url} />}
      {variant === "minimal" && <MinimalChrome title={title} />}
      {children}
    </div>
  );
}
