"use client";
/**
 * QuickActions — backward-compat wrapper.
 * Absorbed by the Fab Super component (`<Fab position="inline" />`). Kept so existing
 * imports of `QuickActions` keep working; new code should use Fab directly.
 *
 * Aposentado na auditoria Kikito CN: Fab e QuickActions implementavam o mesmo conceito
 * (botão circular + speed-dial de ações) de forma totalmente independente, sem `absorbs`
 * ligando os dois — ficavam ambos visíveis na sidebar como se fossem componentes diferentes.
 * Fab ganhou `position="inline"` (renderiza no fluxo normal em vez de fixed num canto),
 * `placement` de 4 direções e `intent` por ação (as 3 features exclusivas do QuickActions)
 * pra poder absorver de verdade. Diferença de comportamento visual aceita conscientemente:
 * as ações agora empurram o layout ao abrir (flex, igual ao resto do Fab) em vez de
 * sobrepor por cima via `position: absolute` como o QuickActions original fazia.
 */
import { Fab } from "@/components/ui/cn/fab/Fab";
import type { FabAction } from "@/components/ui/cn/fab/fab.types";

import type { QuickActionsProps } from "./quick-actions.types";

export function QuickActions({ actions, triggerIcon = "+", placement = "top", className, style }: QuickActionsProps) {
  const fabActions: FabAction[] = actions.map((a) => ({
    icon: a.icon,
    label: a.label,
    onClick: a.onClick ?? (() => {}),
    intent: a.intent,
  }));

  return (
    <Fab
      icon={triggerIcon}
      actions={fabActions}
      position="inline"
      placement={placement}
      // preserva o aria-label fixo "Quick actions" do componente original — sem isto o
      // fallback do Fab produz "Abrir menu"/"Fechar", uma mudança de nome acessível pra
      // quem já depende do rótulo antigo
      tooltip="Quick actions"
      className={className}
      style={style}
    />
  );
}
