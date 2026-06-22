"use client";

import { Bold, Italic, Underline, ChevronDown, Star } from "lucide-react";
import * as React from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlipButton } from "@/components/ui/flip-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RippleButton } from "@/components/ui/ripple-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4" data-section={title}>
      <h2 className="text-lg font-semibold border-b pb-2">{title}</h2>
      <div className="flex flex-wrap gap-4 items-start">{children}</div>
    </section>
  );
}

export default function TestAnimationsPage() {
  const [progress, setProgress] = React.useState(40);
  const [checked, setChecked] = React.useState(false);
  const [switched, setSwitched] = React.useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  return (
    <TooltipProvider>
      <div className="p-8 flex flex-col gap-12 max-w-4xl mx-auto" data-testid="test-animations-page">
        <h1 className="text-2xl font-bold">Animation QA — Kikito Components</h1>

        {/* ACCORDION */}
        <Section title="Accordion">
          <Accordion type="single" collapsible className="w-full max-w-sm" data-testid="accordion">
            <AccordionItem value="item-1">
              <AccordionTrigger>Item 1 — Spring expand</AccordionTrigger>
              <AccordionContent>Conteúdo do item 1 com animação spring height.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Item 2 — Conteúdo longo</AccordionTrigger>
              <AccordionContent>
                Conteúdo mais longo para testar a animação de height com texto em múltiplas linhas. Precisa expandir
                suavemente sem pular ou cortar o conteúdo no início.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Item 3</AccordionTrigger>
              <AccordionContent>Terceiro item.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        {/* CHECKBOX */}
        <Section title="Checkbox">
          <div className="flex items-center gap-3" data-testid="checkbox-wrapper">
            <Checkbox id="cb1" checked={checked} onCheckedChange={(v) => setChecked(!!v)} data-testid="checkbox" />
            <label htmlFor="cb1" className="text-sm cursor-pointer">
              {checked ? "Marcado ✓" : "Clique para marcar"}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="cb2" defaultChecked data-testid="checkbox-pre-checked" />
            <label htmlFor="cb2" className="text-sm">
              Pré-marcado
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="cb3" disabled data-testid="checkbox-disabled" />
            <label htmlFor="cb3" className="text-sm text-muted-foreground">
              Desabilitado
            </label>
          </div>
        </Section>

        {/* SWITCH */}
        <Section title="Switch">
          <div className="flex items-center gap-3" data-testid="switch-wrapper">
            <Switch checked={switched} onCheckedChange={setSwitched} data-testid="switch" />
            <span className="text-sm">{switched ? "ON" : "OFF"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch defaultChecked data-testid="switch-pre-checked" />
            <span className="text-sm">Pré-ativo</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch disabled data-testid="switch-disabled" />
            <span className="text-sm text-muted-foreground">Desabilitado</span>
          </div>
        </Section>

        {/* PROGRESS */}
        <Section title="Progress">
          <div className="w-full max-w-sm flex flex-col gap-3" data-testid="progress-wrapper">
            <Progress value={progress} data-testid="progress" />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
                -10%
              </Button>
              <Button size="sm" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
                +10%
              </Button>
              <span className="text-sm self-center">{progress}%</span>
            </div>
          </div>
        </Section>

        {/* TOGGLE */}
        <Section title="Toggle & Toggle Group">
          <Toggle data-testid="toggle" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <ToggleGroup type="multiple" data-testid="toggle-group">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </Section>

        {/* BUTTON */}
        <Section title="Button (hover scale + tap scale)">
          <Button data-testid="button-default">Default</Button>
          <Button variant="outline" data-testid="button-outline">
            Outline
          </Button>
          <Button variant="ghost" data-testid="button-ghost">
            Ghost
          </Button>
          <Button variant="destructive" data-testid="button-destructive">
            Destructive
          </Button>
          <Button size="sm" data-testid="button-sm">
            Small
          </Button>
          <Button size="lg" data-testid="button-lg">
            Large
          </Button>
          <Button disabled data-testid="button-disabled">
            Disabled
          </Button>
        </Section>

        {/* RIPPLE BUTTON */}
        <Section title="Ripple Button">
          <RippleButton data-testid="ripple-button">Clique para ripple</RippleButton>
          <RippleButton variant="outline" rippleColor="rgba(0,0,0,0.15)" data-testid="ripple-button-outline">
            Outline Ripple
          </RippleButton>
        </Section>

        {/* FLIP BUTTON */}
        <Section title="Flip Button">
          <FlipButton
            front={<span>Hover me</span>}
            back={
              <>
                <Star className="h-4 w-4" /> Flipped!
              </>
            }
            data-testid="flip-button-top"
          />
          <FlipButton
            front={<span>From Bottom</span>}
            back={<span>Bottom flip</span>}
            from="bottom"
            variant="outline"
            data-testid="flip-button-bottom"
          />
          <FlipButton
            front={<span>From Left</span>}
            back={<span>Left flip</span>}
            from="left"
            variant="ghost"
            data-testid="flip-button-left"
          />
        </Section>

        {/* TABS */}
        <Section title="Tabs (layoutId pill + content fade)">
          <Tabs defaultValue="tab1" className="w-full max-w-sm" data-testid="tabs">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Conteúdo da aba 1 — aparece com fade.</TabsContent>
            <TabsContent value="tab2">Conteúdo da aba 2 — conteúdo diferente para testar transição.</TabsContent>
            <TabsContent value="tab3">Conteúdo da aba 3.</TabsContent>
          </Tabs>
        </Section>

        {/* DIALOG */}
        <Section title="Dialog (spring + from: top)">
          <Dialog data-testid="dialog">
            <DialogTrigger asChild>
              <Button data-testid="dialog-trigger">Abrir Dialog (top)</Button>
            </DialogTrigger>
            <DialogContent from="top" data-testid="dialog-content">
              <DialogHeader>
                <DialogTitle>Dialog com animação spring</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">Conteúdo do dialog. Fecha ao clicar fora ou no X.</p>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="dialog-trigger-bottom">
                Dialog (bottom)
              </Button>
            </DialogTrigger>
            <DialogContent from="bottom" data-testid="dialog-content-bottom">
              <DialogHeader>
                <DialogTitle>Entrada de baixo</DialogTitle>
              </DialogHeader>
              <p className="text-sm">Animação spring from bottom.</p>
            </DialogContent>
          </Dialog>
        </Section>

        {/* SHEET */}
        <Section title="Sheet (spring slide)">
          <Sheet data-testid="sheet-right">
            <SheetTrigger asChild>
              <Button data-testid="sheet-trigger-right">Sheet Direita</Button>
            </SheetTrigger>
            <SheetContent side="right" data-testid="sheet-content-right">
              <SheetHeader>
                <SheetTitle>Sheet direita</SheetTitle>
              </SheetHeader>
              <p className="text-sm mt-4">Desliza da direita com spring.</p>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" data-testid="sheet-trigger-bottom">
                Sheet Bottom
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" data-testid="sheet-content-bottom">
              <SheetHeader>
                <SheetTitle>Sheet bottom</SheetTitle>
              </SheetHeader>
              <p className="text-sm mt-4">Desliza de baixo com spring.</p>
            </SheetContent>
          </Sheet>
        </Section>

        {/* POPOVER */}
        <Section title="Popover (spring scale)">
          <Popover>
            <PopoverTrigger asChild>
              <Button data-testid="popover-trigger">Abrir Popover</Button>
            </PopoverTrigger>
            <PopoverContent data-testid="popover-content">
              <p className="text-sm">Conteúdo do popover com spring scale.</p>
            </PopoverContent>
          </Popover>
        </Section>

        {/* TOOLTIP */}
        <Section title="Tooltip (spring scale)">
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="outline" data-testid="tooltip-trigger">
                Hover para Tooltip
              </Button>
            </TooltipTrigger>
            <TooltipContent data-testid="tooltip-content">
              <p>Tooltip com spring scale</p>
            </TooltipContent>
          </Tooltip>
          {/* Hidden button lets E2E tests open tooltip without relying on pointer events in headless */}
          <button
            data-testid="tooltip-open-btn"
            onClick={() => setTooltipOpen(true)}
            style={{ position: "absolute", opacity: 0, pointerEvents: "auto", width: 1, height: 1 }}
          >
            Open Tooltip
          </button>
        </Section>

        {/* DROPDOWN */}
        <Section title="Dropdown Menu (fade + scale)">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" data-testid="dropdown-trigger">
                Dropdown <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent data-testid="dropdown-content">
              <DropdownMenuItem>Opção 1</DropdownMenuItem>
              <DropdownMenuItem>Opção 2</DropdownMenuItem>
              <DropdownMenuItem>Opção 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        {/* SELECT */}
        <Section title="Select (fade + scale)">
          <Select data-testid="select">
            <SelectTrigger className="w-48" data-testid="select-trigger">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent data-testid="select-content">
              <SelectItem value="op1">Opção 1</SelectItem>
              <SelectItem value="op2">Opção 2</SelectItem>
              <SelectItem value="op3">Opção 3</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        {/* COLLAPSIBLE */}
        <Section title="Collapsible (spring height)">
          <div className="w-full max-w-sm border rounded-lg p-4" data-testid="collapsible-wrapper">
            <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Seção recolhível</span>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="collapsible-trigger">
                    <ChevronDown className={`h-4 w-4 transition-transform ${collapsibleOpen ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent data-testid="collapsible-content">
                <div className="pt-3 text-sm text-muted-foreground">
                  Conteúdo que expande e recolhe com spring height animation.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Section>

        {/* SLIDER */}
        <Section title="Slider (thumb spring)">
          <div className="w-full max-w-sm" data-testid="slider-wrapper">
            <Slider defaultValue={[50]} max={100} step={1} data-testid="slider" />
          </div>
        </Section>

        {/* ALERT */}
        <Section title="Alert (entrance animation)">
          <Alert data-testid="alert-default">
            <AlertTitle>Alert padrão</AlertTitle>
            <AlertDescription>Entra com slide-down + fade na montagem.</AlertDescription>
          </Alert>
          <Alert variant="destructive" data-testid="alert-destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>Alert destrutivo com animação de entrada.</AlertDescription>
          </Alert>
        </Section>

        {/* CARD */}
        <Section title="Card (hover lift — interactive prop)">
          <Card className="w-48" data-testid="card-static">
            <CardHeader className="text-sm font-medium pb-2">Card Estático</CardHeader>
            <CardContent className="text-xs text-muted-foreground">Sem animação</CardContent>
          </Card>
          <Card interactive className="w-48 cursor-pointer" data-testid="card-interactive">
            <CardHeader className="text-sm font-medium pb-2">Card Interativo</CardHeader>
            <CardContent className="text-xs text-muted-foreground">Hover para lift</CardContent>
          </Card>
        </Section>

        {/* BADGE */}
        <Section title="Badge (hover scale — interactive prop)">
          <Badge data-testid="badge-static">Estático</Badge>
          <Badge interactive data-testid="badge-interactive">
            Interativo
          </Badge>
          <Badge variant="destructive" interactive data-testid="badge-interactive-destructive">
            Destructive
          </Badge>
          <Badge variant="outline" interactive data-testid="badge-interactive-outline">
            Outline
          </Badge>
        </Section>

        {/* AVATAR */}
        <Section title="Avatar (hover scale — interactive prop)">
          <Avatar data-testid="avatar-static">
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <Avatar interactive data-testid="avatar-interactive">
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <Avatar interactive data-testid="avatar-with-image">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Section>
      </div>
    </TooltipProvider>
  );
}
