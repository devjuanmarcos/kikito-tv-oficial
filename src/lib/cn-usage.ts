/**
 * Usage examples for CN components.
 * Key = component name (matches CnComponentMeta.name).
 * Value = complete TSX usage snippet.
 */
export const COMPONENT_USAGE: Record<string, string> = {
  button: `import { Button } from "@/components/ui/cn/button/Button";

export function ButtonExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="solid" intent="primary">
        Confirmar
      </Button>
      <Button variant="outline" intent="neutral">
        Cancelar
      </Button>
      <Button variant="ghost" intent="danger" size="sm">
        Excluir
      </Button>
      <Button variant="solid" intent="primary" loading>
        Salvando...
      </Button>
    </div>
  );
}`,

  badge: `import { Badge } from "@/components/ui/cn/badge/Badge";

export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge intent="primary">Novo</Badge>
      <Badge intent="success" variant="soft">Ativo</Badge>
      <Badge intent="danger" variant="outline">Erro</Badge>
      <Badge intent="warning" dot>Em revisão</Badge>
    </div>
  );
}`,

  input: `import { Input } from "@/components/ui/cn/input/Input";

export function InputExample() {
  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <Input
        label="E-mail"
        type="email"
        placeholder="voce@exemplo.com"
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        hint="Mínimo 8 caracteres"
      />
      <Input
        label="Usuário"
        defaultValue="jottaennie"
        state="success"
        hint="Nome disponível"
      />
    </div>
  );
}`,

  card: `import { Card } from "@/components/ui/cn/card/Card";

export function CardExample() {
  return (
    <Card className="max-w-sm p-6">
      <h3 className="font-semibold text-foreground mb-1">Título do card</h3>
      <p className="text-muted text-sm">
        Conteúdo do card. Aceita qualquer children.
      </p>
    </Card>
  );
}`,

  alert: `import { Alert } from "@/components/ui/cn/alert/Alert";

export function AlertExample() {
  return (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert intent="info" title="Informação">
        Sua sessão expira em 30 minutos.
      </Alert>
      <Alert intent="success" title="Sucesso" dismissible>
        Dados salvos com sucesso!
      </Alert>
      <Alert intent="danger" title="Erro">
        Não foi possível completar a operação.
      </Alert>
    </div>
  );
}`,

  avatar: `import { Avatar } from "@/components/ui/cn/avatar/Avatar";

export function AvatarExample() {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src="https://github.com/devjuanmarcos.png"
        alt="Juan Marcos"
        size="md"
      />
      <Avatar name="Juan Marcos" size="md" />
      <Avatar size="md" />
    </div>
  );
}`,

  select: `import { Select } from "@/components/ui/cn/select/Select";

export function SelectExample() {
  return (
    <Select
      label="Framework"
      placeholder="Selecione..."
      options={[
        { value: "next", label: "Next.js" },
        { value: "vite", label: "Vite" },
        { value: "remix", label: "Remix" },
      ]}
    />
  );
}`,

  textarea: `import { Textarea } from "@/components/ui/cn/textarea/Textarea";

export function TextareaExample() {
  return (
    <Textarea
      label="Mensagem"
      placeholder="Escreva aqui..."
      hint="Máximo 500 caracteres"
      rows={4}
    />
  );
}`,

  checkbox: `import { Checkbox } from "@/components/ui/cn/checkbox/Checkbox";

export function CheckboxExample() {
  return (
    <div className="flex flex-col gap-2">
      <Checkbox label="Aceito os termos de uso" defaultChecked />
      <Checkbox label="Receber novidades por e-mail" />
      <Checkbox label="Opção desabilitada" disabled />
    </div>
  );
}`,

  radio: `import { Radio } from "@/components/ui/cn/radio/Radio";

export function RadioExample() {
  return (
    <div className="flex flex-col gap-2">
      <Radio name="plano" value="free" label="Grátis" defaultChecked />
      <Radio name="plano" value="pro" label="Pro — R$ 29/mês" />
      <Radio name="plano" value="team" label="Team — R$ 99/mês" />
    </div>
  );
}`,

  switch: `import { Switch } from "@/components/ui/cn/switch/Switch";

export function SwitchExample() {
  return (
    <div className="flex flex-col gap-3">
      <Switch label="Notificações por e-mail" defaultChecked />
      <Switch label="Modo escuro" />
      <Switch label="Opção desabilitada" disabled />
    </div>
  );
}`,

  banner: `import { Banner } from "@/components/ui/cn/banner/Banner";

export function BannerExample() {
  return (
    <div className="flex flex-col gap-2">
      <Banner intent="info">
        Manutenção programada para domingo às 03h.
      </Banner>
      <Banner intent="success" dismissible>
        Cadastro realizado com sucesso!
      </Banner>
      <Banner intent="warning">
        Sua conta expira em 3 dias.
      </Banner>
    </div>
  );
}`,

  callout: `import { Callout } from "@/components/ui/cn/callout/Callout";

export function CalloutExample() {
  return (
    <div className="flex flex-col gap-3 max-w-lg">
      <Callout intent="info" title="Dica">
        Use tokens para customizar o tema sem sobrescrever CSS.
      </Callout>
      <Callout intent="warning" title="Atenção" appearance="outline">
        Essa ação não pode ser desfeita.
      </Callout>
    </div>
  );
}`,

  breadcrumb: `import { Breadcrumb } from "@/components/ui/cn/breadcrumb/Breadcrumb";

export function BreadcrumbExample() {
  return (
    <Breadcrumb
      items={[
        { label: "Início", href: "/" },
        { label: "Componentes", href: "/cn" },
        { label: "Breadcrumb" },
      ]}
    />
  );
}`,

  "code-block": `import { KkCodeBlock } from "@/components/ui/kk-code-block";

// KkCodeBlock é um Server Component — use em .tsx sem "use client"
export async function CodeBlockExample() {
  return (
    <div className="flex flex-col gap-6">
      {/* Básico */}
      <KkCodeBlock
        code={\`const greeting = "Olá, mundo!";\nconsole.log(greeting);\`}
        lang="ts"
      />

      {/* Com filename e numeração de linhas */}
      <KkCodeBlock
        code={\`import { Button } from "@/components/ui/cn/button/Button";

export function Example() {
  return <Button intent="primary">Clique aqui</Button>;
}\`}
        lang="tsx"
        filename="Example.tsx"
        showLineNumbers
      />

      {/* Com altura máxima */}
      <KkCodeBlock
        code={\`// arquivo longo com scroll
const a = 1;
const b = 2;
const c = a + b;\`}
        lang="ts"
        filename="long-file.ts"
        maxHeight={200}
      />
    </div>
  );
}`,

  "copy-button": `import { CopyButton } from "@/components/ui/cn/copy-button/CopyButton";

export function CopyButtonExample() {
  return (
    <CopyButton value="npx kikitocn add button" />
  );
}`,

  tooltip: `import { Tooltip } from "@/components/ui/cn/tooltip/Tooltip";
import { Button } from "@/components/ui/cn/button/Button";

export function TooltipExample() {
  return (
    <Tooltip content="Informação adicional">
      <Button variant="outline">Passe o mouse</Button>
    </Tooltip>
  );
}`,

  modal: `import { Modal } from "@/components/ui/cn/modal/Modal";
import { Button } from "@/components/ui/cn/button/Button";
import { useState } from "react";

export function ModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmar ação"
      >
        <p>Tem certeza que deseja continuar?</p>
      </Modal>
    </>
  );
}`,

  accordion: `import { Accordion } from "@/components/ui/cn/accordion/Accordion";

export function AccordionExample() {
  return (
    <Accordion
      items={[
        {
          title: "O que é Kikito CN?",
          content: "Uma biblioteca de 196+ componentes React prontos para uso.",
        },
        {
          title: "Precisa de configuração?",
          content: "Rode npx kikitocn init e o CLI cuida do resto.",
        },
      ]}
    />
  );
}`,

  "animated-number": `import { AnimatedNumber } from "@/components/ui/cn/animated-number/AnimatedNumber";

export function AnimatedNumberExample() {
  return (
    <AnimatedNumber value={1234} duration={800} />
  );
}`,

  "card-stack": `import { CardStack } from "@/components/ui/cn/card-stack/CardStack";

export function CardStackExample() {
  return (
    <CardStack
      cards={[
        { id: 1, content: "Primeiro card" },
        { id: 2, content: "Segundo card" },
        { id: 3, content: "Terceiro card" },
      ]}
    />
  );
}`,

  carousel: `import { Carousel } from "@/components/ui/cn/carousel/Carousel";

export function CarouselExample() {
  return (
    <Carousel>
      <div className="p-8 bg-raised rounded-lg">Slide 1</div>
      <div className="p-8 bg-raised rounded-lg">Slide 2</div>
      <div className="p-8 bg-raised rounded-lg">Slide 3</div>
    </Carousel>
  );
}`,

  marquee: `import { MarqueeText } from "@/components/ui/cn/marquee-text/MarqueeText";

export function MarqueeExample() {
  return (
    <MarqueeText speed={40}>
      Next.js · React · TypeScript · Tailwind · Framer Motion · Kikito CN
    </MarqueeText>
  );
}`,

  sparkline: `import { Sparkline } from "@/components/ui/cn/sparkline/Sparkline";

export function SparklineExample() {
  return (
    <Sparkline
      data={[12, 18, 9, 24, 30, 27, 35, 28, 40]}
      color="var(--kk-accent)"
      height={40}
    />
  );
}`,
};
