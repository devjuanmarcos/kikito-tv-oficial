import { cn } from "@/lib/utils";

import type { AvatarGroupProps, AvatarGroupItem } from "./avatar-group.types";

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// oklch() literal intencional (no token equivalent), mesma técnica já usada no Avatar.tsx:
// paleta curada (não hue contínuo derivado do nome) garante contraste mínimo entre fundo e
// texto em todos os pares — hue aleatório sem curadoria (como a versão anterior usava)
// não garante contraste nenhum entre as duas cores geradas independentemente
const BG_PALETTE: [string, string][] = [
  ["oklch(42% .12 200)", "oklch(88% .06 200)"], // teal
  ["oklch(42% .12 270)", "oklch(88% .06 270)"], // purple
  ["oklch(42% .12 30)", "oklch(88% .06 30)"], // orange
  ["oklch(38% .12 145)", "oklch(88% .06 145)"], // green
  ["oklch(38% .12 340)", "oklch(88% .06 340)"], // pink
  ["oklch(42% .12 220)", "oklch(88% .06 220)"], // blue
  ["oklch(38% .12 80)", "oklch(88% .06 80)"], // yellow-green
  ["oklch(38% .12 300)", "oklch(88% .06 300)"], // violet
];

function colorsForName(name?: string): [string, string] {
  if (!name) return ["var(--ks-graphite-2)", "var(--ks-text-faint)"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return BG_PALETTE[hash % BG_PALETTE.length];
}

const SIZE_CLS: Record<string, string> = {
  sm: "[--ag-sz:28px] [--ag-fs:10px]",
  md: "[--ag-sz:36px] [--ag-fs:12px]",
  lg: "[--ag-sz:44px] [--ag-fs:14px]",
  xl: "[--ag-sz:56px] [--ag-fs:18px]",
};

const OVERLAP_CLS: Record<string, string> = {
  sm: "[--ag-gap:-6px]",
  md: "[--ag-gap:-10px]",
  lg: "[--ag-gap:-16px]",
};

// w-[--ag-sz] etc (bracket cru) confirmado quebrado empiricamente em 2026-08-27 — trocado por sintaxe de parenteses
const avatarCls =
  "w-(--ag-sz) h-(--ag-sz) rounded-full border-[2.5px] border-raised overflow-hidden bg-graphite text-muted text-(length:--ag-fs) font-bold flex items-center justify-center shrink-0 relative z-[1] ml-(--ag-gap) transition-[transform] duration-[150ms] hover:-translate-y-[3px] hover:scale-[1.06] hover:z-10 first:ml-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:block";

function AvatarItem({ item }: { item: AvatarGroupItem }) {
  if (item.src) {
    return (
      <div className={avatarCls}>
        <img src={item.src} alt={item.alt ?? item.name ?? ""} />
      </div>
    );
  }
  const [bg, fg] = colorsForName(item.name);
  return (
    <div
      role="img"
      className={avatarCls}
      style={{ background: bg, color: fg }}
      aria-label={item.name ?? "Unknown member"}
      title={item.name}
    >
      {getInitials(item.name)}
    </div>
  );
}

function OverflowItem({ count }: { count: number }) {
  return (
    <div
      role="img"
      className={cn(avatarCls, "bg-graphite-2 text-muted tracking-[-0.02em]")}
      aria-label={`${count} more`}
      title={`+${count}`}
    >
      {/* achado real: passar "+N" pelo getInitials() (split por espaço) descartava o número
          inteiro — "+3" virava só "+". Renderizado direto aqui, sem passar pelo helper de iniciais */}
      +{count}
    </div>
  );
}

export function AvatarGroup({ avatars, max = 4, size = "md", overlap = "md", className, style }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div
      className={cn("inline-flex items-center", SIZE_CLS[size], OVERLAP_CLS[overlap], className)}
      style={style}
      role="group"
      aria-label={`${avatars.length} member${avatars.length !== 1 ? "s" : ""}`}
    >
      {visible.map((av, i) => (
        <AvatarItem key={i} item={av} />
      ))}
      {overflow > 0 && <OverflowItem count={overflow} />}
    </div>
  );
}
