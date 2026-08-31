/**
 * DarkGradientBackground — backdrop full-bleed escuro com gradiente radial,
 * feixes diagonais decorativos e textura de pontos, pro grupo novo
 * "Backgrounds" (hero/marketing sections). Adaptado de um exemplo
 * shadcndashboard-style (ver docs/component-import/animation-backport/PLAN.md
 * pro precedente de uso dessa biblioteca vendorizada como base).
 *
 * Diferente dos demais componentes da Kikito CN: este e os outros 2 do grupo
 * "Backgrounds" sao **propositalmente escuros independente do tema da
 * pagina** — sao telas de fundo atmosfericas (a origem ja era 100% dark:
 * bg-black + gradiente pra cinza escuro), nao superficies de UI que devem
 * reagir a light/dark. Forcar reatividade de tema quebraria a identidade
 * visual do proprio componente (documentado aqui como excecao deliberada,
 * mesma categoria do "no token equivalent" ja usado pro glare do Card.tsx).
 *
 * Adaptado pro vocabulario Kikito CN:
 * - Cor dos feixes diagonais (rgb(0,207,255) cru) -> prop `streakColor` com
 *   default `var(--ks-info)` (o azul semantico mais proximo do cyan original).
 * - Textura de ruido: a origem hotlinkava um PNG de terceiro
 *   (framerusercontent.com) -- removido. Ativos de terceiros nao sao uma
 *   dependencia aceitavel (podem sumir, mudar, ou ser lentos). Substituido
 *   por ruido gerado via filtro SVG inline (feTurbulence), self-contained.
 * - `bg-gradient-radial` (utility Tailwind customizada que nao existe no v4
 *   deste projeto) -> `background: radial-gradient(...)` via style inline,
 *   equivalente exato sem precisar de plugin novo.
 */
import { cn } from "@/lib/utils";

import type { DarkGradientBackgroundProps } from "./dark-gradient-background.types";

// Ruido self-contained via SVG filter (feTurbulence) -- substitui o PNG de
// terceiro (framerusercontent.com) da origem. data URI, zero dependencia externa.
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// 5 feixes com posicoes/mascaras diferentes -- geometria mantida identica a
// origem (e o que da o efeito de "raios de luz" cruzando o fundo).
const STREAK_MASKS = [
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0) 36%, rgb(0,0,0) 55%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)",
  "linear-gradient(90deg, rgba(0,0,0,0) 11%, rgb(0,0,0) 25%, rgba(0,0,0,0.55) 41%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)",
  "linear-gradient(90deg, rgba(0,0,0,0) 9%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.424) 40%, rgb(0,0,0) 48%, rgba(0,0,0,0.267) 54%, rgba(0,0,0,0.13) 78%, rgb(0,0,0) 88%, rgba(0,0,0,0) 97%)",
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 17%, rgba(0,0,0,0.55) 26%, rgb(0,0,0) 35%, rgba(0,0,0,0) 47%, rgba(0,0,0,0.13) 69%, rgb(0,0,0) 79%, rgba(0,0,0,0) 97%)",
  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 27%, rgb(0,0,0) 42%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 74%, rgb(0,0,0) 82%, rgba(0,0,0,0.47) 88%, rgba(0,0,0,0) 97%)",
];

export function DarkGradientBackground({
  children,
  streakColor = "var(--ks-info)",
  className,
  style,
}: DarkGradientBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-black", className)} style={style}>
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(100% 100% at 0% 0%, rgb(46,46,46) 0%, rgb(0,0,0) 100%)",
            mask: "radial-gradient(125% 100% at 0% 0%, rgb(0,0,0) 0%, rgba(0,0,0,0.224) 88.2883%, rgba(0,0,0,0) 100%)",
          }}
        >
          {STREAK_MASKS.map((mask, i) => (
            <div
              key={i}
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(${streakColor} 0%, transparent 100%)`,
                mask,
                transform: "skewX(45deg)",
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="absolute inset-0 bg-repeat opacity-5"
        style={{ backgroundImage: `url("${NOISE_SVG}")`, backgroundSize: "150px" }}
      />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(255,255,255,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
