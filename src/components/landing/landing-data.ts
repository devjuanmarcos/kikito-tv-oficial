/* ──────────────────────────────────────────────────────────────────────────
 * Conteúdo da landing do Kikito. Texto original (sem marcas de terceiros).
 * ────────────────────────────────────────────────────────────────────────── */

/* Stack mostrada na faixa do hero */
export const HERO_STACK = ["Next.js", "React", "TypeScript", "Tailwind", "Figma", "shadcn/ui"];

/* Depoimentos da comunidade — fictícios, avatar por inicial */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Montei a landing inteira num fim de semana. Os componentes já vêm com tema claro/escuro e acessibilidade.",
    name: "Marina Alves",
    role: "Front-end, Nuvem",
  },
  {
    quote: "Os tutoriais em vídeo são diretos ao ponto. Em uma tarde eu já tinha o design system rodando no projeto.",
    name: "Diego Prado",
    role: "Tech Lead, Orbe",
  },
  {
    quote: "Copia, cola, funciona. E o melhor: dá pra customizar tudo pelos tokens sem brigar com o CSS.",
    name: "Letícia Souza",
    role: "Product Designer",
  },
  {
    quote: "A tabela periódica de componentes é viciante. Achei coisa que eu nem sabia que precisava.",
    name: "Rafael Lima",
    role: "Eng. de Software",
  },
  {
    quote: "Documentação honesta, com estados de erro e loading de verdade. Economizou semanas do meu time.",
    name: "Camila Reis",
    role: "Front-end Sr.",
  },
  {
    quote: "O tema dourado/patina deu uma cara premium pro nosso painel sem a gente contratar designer.",
    name: "João Vitor",
    role: "Fundador, Pixe",
  },
  {
    quote: "Dicas e novidades toda semana. Virou minha fonte pra acompanhar o ecossistema React.",
    name: "Ana Beatriz",
    role: "Dev Advocate",
  },
  {
    quote: "Migrei do zero pro Kikito CN e os bugs de acessibilidade simplesmente sumiram.",
    name: "Pedro Henrique",
    role: "Front-end Pleno",
  },
  {
    quote: "Performance impecável. Nada de JS pesado escondido nos componentes.",
    name: "Bruna Carvalho",
    role: "Eng. de Performance",
  },
  {
    quote: "O portfólio do Kikito é referência. Mando pros juniores estudarem padrão de qualidade.",
    name: "Thiago Nunes",
    role: "Engenheiro Mobile",
  },
];

/* Fundamentos do design system (plinths) */
export interface Foundation {
  label: string;
  detail: string;
  /** chave da animação SVG do card */
  anim: "draw" | "move-x" | "res" | "toggle" | "ball" | "blink" | "fade";
}

export const FOUNDATIONS: Foundation[] = [
  {
    label: "Tipografia",
    detail: "Escala com contraste real entre títulos e corpo, ritmo de leitura confortável.",
    anim: "draw",
  },
  {
    label: "Cor & Contraste",
    detail: "Paleta tingida, dourado técnico como acento e contraste dentro do WCAG.",
    anim: "fade",
  },
  {
    label: "Espaçamento",
    detail: "Ritmo vertical consistente, respiro intencional em vez de padding aleatório.",
    anim: "move-x",
  },
  { label: "Responsivo", detail: "Breakpoints guiados pelo conteúdo, não por dispositivos genéricos.", anim: "res" },
  {
    label: "Interação",
    detail: "Estados honestos: hover, foco, loading e erro de verdade em cada peça.",
    anim: "toggle",
  },
  { label: "Movimento", detail: "Easing físico, sem bounce. Animação que orienta, não que distrai.", anim: "ball" },
  { label: "UX Writing", detail: "Texto específico em vez de genérico. Cada palavra ganha seu lugar.", anim: "blink" },
];

/* Bento — features do Kikito */
export interface BentoTile {
  id: string;
  span: 4 | 6 | 8;
  title: string;
  body: string;
  kind: "terminal" | "card" | "video" | "news" | "tokens" | "registry" | "live" | "diff";
}

export const BENTO: BentoTile[] = [
  {
    id: "respects",
    span: 8,
    title: "Componentes prontos para baixar",
    body: "Mais de 190 componentes copy-paste, do Button ao Kanban. Você instala só o que usa.",
    kind: "terminal",
  },
  {
    id: "tokens",
    span: 4,
    title: "Tokens e tema",
    body: "Um arquivo de tokens controla cor, raio e tipografia. Claro e escuro de graça.",
    kind: "tokens",
  },
  {
    id: "video",
    span: 4,
    title: "Tutoriais em vídeo",
    body: "Projetos do zero ao deploy, explicados passo a passo.",
    kind: "video",
  },
  {
    id: "registry",
    span: 8,
    title: "Catálogo navegável",
    body: "Tabela periódica e revista de componentes, com busca por ⌘K e preview ao vivo.",
    kind: "registry",
  },
  {
    id: "news",
    span: 4,
    title: "Dicas & novidades",
    body: "Curadoria semanal do ecossistema front-end, sem ruído.",
    kind: "news",
  },
  {
    id: "diff",
    span: 4,
    title: "Código aberto",
    body: "Tudo versionado e auditável. Sem caixa-preta, sem dependências escondidas.",
    kind: "diff",
  },
  {
    id: "live",
    span: 4,
    title: "Preview ao vivo",
    body: "Veja cada componente em ação antes de copiar, em tema claro ou escuro.",
    kind: "live",
  },
  {
    id: "card",
    span: 4,
    title: "Portfólio em evolução",
    body: "Projetos reais que mostram o design system aplicado de ponta a ponta.",
    kind: "card",
  },
];

/* Comandos de instalação */
export interface InstallCmd {
  label: string;
  prompt: "$" | "/";
  cmd: string;
}

export const INSTALL_PRIMARY: InstallCmd[] = [
  { label: "Instalar um componente", prompt: "$", cmd: "npx shadcn@latest add @kikito/button" },
  { label: "Tokens do design system", prompt: "$", cmd: "npx shadcn@latest add @kikito/tokens" },
  { label: "Catálogo completo", prompt: "$", cmd: "npx shadcn@latest add @kikito/all" },
];

export const INSTALL_ALT: InstallCmd[] = [
  { label: "Registry manual", prompt: "$", cmd: "npx shadcn@latest add https://kikito.com.br/r/button.json" },
  { label: "Clonar o repositório", prompt: "$", cmd: "git clone https://github.com/kikito/cn" },
];

export interface ExtraLink {
  title: string;
  desc: string;
  href: string;
}

export const EXTRAS: ExtraLink[] = [
  { title: "GitHub", desc: "Código-fonte, issues e releases.", href: "https://github.com" },
  { title: "Tutoriais", desc: "Playlist de projetos em vídeo.", href: "#tutoriais" },
  { title: "Comunidade", desc: "Dicas, novidades e suporte.", href: "#comunidade" },
];
