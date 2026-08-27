"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useRef } from "react";

import { Accordion } from "@/components/ui/cn/accordion/Accordion";
import { AccordionGroup } from "@/components/ui/cn/accordion-group/AccordionGroup";
import { ActivityFeed } from "@/components/ui/cn/activity-feed/ActivityFeed";
import { Alert } from "@/components/ui/cn/alert/Alert";
import { AlertDialog } from "@/components/ui/cn/alert-dialog/AlertDialog";
import { AnimatedList } from "@/components/ui/cn/animated-list/AnimatedList";
import { AnimatedNumber } from "@/components/ui/cn/animated-number/AnimatedNumber";
import { AreaChart } from "@/components/ui/cn/area-chart/AreaChart";
import { AspectRatio } from "@/components/ui/cn/aspect-ratio/AspectRatio";
import { AudioWaveform } from "@/components/ui/cn/audio-waveform/AudioWaveform";
import { Autocomplete } from "@/components/ui/cn/autocomplete/Autocomplete";
import { Avatar } from "@/components/ui/cn/avatar/Avatar";
import { AvatarGroup } from "@/components/ui/cn/avatar-group/AvatarGroup";
import { Badge } from "@/components/ui/cn/badge/Badge";
import { Banner } from "@/components/ui/cn/banner/Banner";
import { BarChart } from "@/components/ui/cn/bar-chart/BarChart";
import { BentoGrid } from "@/components/ui/cn/bento-grid/BentoGrid";
import { Breadcrumb } from "@/components/ui/cn/breadcrumb/Breadcrumb";
import { Button } from "@/components/ui/cn/button/Button";
import { Calendar } from "@/components/ui/cn/calendar/Calendar";
import { Callout } from "@/components/ui/cn/callout/Callout";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/cn/card/Card";
import { CardStack } from "@/components/ui/cn/card-stack/CardStack";
import { Carousel } from "@/components/ui/cn/carousel/Carousel";
import { Chart } from "@/components/ui/cn/chart/Chart";
import type { ChartType } from "@/components/ui/cn/chart/chart.types";
import { ChatBubble } from "@/components/ui/cn/chat-bubble/ChatBubble";
import { Checkbox } from "@/components/ui/cn/checkbox/Checkbox";
import { Checklist } from "@/components/ui/cn/checklist/Checklist";
import { ChipGroup } from "@/components/ui/cn/chip-group/ChipGroup";
import { CodeBlock } from "@/components/ui/cn/code-block";
import { CodeDiff } from "@/components/ui/cn/code-diff/CodeDiff";
import { Collapsible } from "@/components/ui/cn/collapsible/Collapsible";
import { ColorPicker } from "@/components/ui/cn/color-picker/ColorPicker";
import { Combobox } from "@/components/ui/cn/combobox/Combobox";
import { Command } from "@/components/ui/cn/command/Command";
import { CommandBar } from "@/components/ui/cn/command-bar/CommandBar";
import { ComparisonTable } from "@/components/ui/cn/comparison-table/ComparisonTable";
import { ConfettiButton } from "@/components/ui/cn/confetti-button/ConfettiButton";
import { ConfirmButton } from "@/components/ui/cn/confirm-button/ConfirmButton";
import { ContextCard } from "@/components/ui/cn/context-card/ContextCard";
import { ContextMenu } from "@/components/ui/cn/context-menu/ContextMenu";
import { CopyButton } from "@/components/ui/cn/copy-button/CopyButton";
import { CountdownTimer } from "@/components/ui/cn/countdown-timer/CountdownTimer";
import { CreditCard } from "@/components/ui/cn/credit-card/CreditCard";
import { CurrencyInput } from "@/components/ui/cn/currency-input/CurrencyInput";
import { DataGrid } from "@/components/ui/cn/data-grid/DataGrid";
import { DataList } from "@/components/ui/cn/data-list/DataList";
import { DatePicker } from "@/components/ui/cn/date-picker/DatePicker";
import { DateRangePicker } from "@/components/ui/cn/date-range-picker/DateRangePicker";
import { DonutChart } from "@/components/ui/cn/donut-chart/DonutChart";
import { DotStepper } from "@/components/ui/cn/dot-stepper/DotStepper";
import { Draggable } from "@/components/ui/cn/draggable/Draggable";
import { Drawer } from "@/components/ui/cn/drawer/Drawer";
import { DropdownMenu } from "@/components/ui/cn/dropdown-menu/DropdownMenu";
import { EmptyState } from "@/components/ui/cn/empty-state/EmptyState";
import { EventCalendar } from "@/components/ui/cn/event-calendar/EventCalendar";
import { Fab } from "@/components/ui/cn/fab/Fab";
import { FeatureList } from "@/components/ui/cn/feature-list/FeatureList";
import { FeedbackWidget } from "@/components/ui/cn/feedback-widget/FeedbackWidget";
import { FileUpload } from "@/components/ui/cn/file-upload/FileUpload";
import { FilterBar } from "@/components/ui/cn/filter-bar/FilterBar";
import { FlipCard } from "@/components/ui/cn/flip-card/FlipCard";
import { FloatingBar } from "@/components/ui/cn/floating-bar/FloatingBar";
import { FloatingLabelInput } from "@/components/ui/cn/floating-label-input/FloatingLabelInput";
import { FloatingMenu } from "@/components/ui/cn/floating-menu/FloatingMenu";
import { FormField } from "@/components/ui/cn/form-field/FormField";
import { FunnelChart } from "@/components/ui/cn/funnel-chart/FunnelChart";
import { Gauge } from "@/components/ui/cn/gauge/Gauge";
import { GlassCard } from "@/components/ui/cn/glass-card/GlassCard";
import { GlowCard } from "@/components/ui/cn/glow-card/GlowCard";
import { GradientBorder } from "@/components/ui/cn/gradient-border/GradientBorder";
import { GridPattern } from "@/components/ui/cn/grid-pattern/GridPattern";
import { HoverCard } from "@/components/ui/cn/hover-card/HoverCard";
import { ImageCompare } from "@/components/ui/cn/image-compare/ImageCompare";
import { ImageCropper } from "@/components/ui/cn/image-cropper/ImageCropper";
import { ImageViewer } from "@/components/ui/cn/image-viewer/ImageViewer";
import { InfiniteScroll } from "@/components/ui/cn/infinite-scroll/InfiniteScroll";
import { InlineEdit } from "@/components/ui/cn/inline-edit/InlineEdit";
import { Input } from "@/components/ui/cn/input/Input";
import { JsonViewer } from "@/components/ui/cn/json-viewer/JsonViewer";
import { Kanban } from "@/components/ui/cn/kanban/Kanban";
import { Kbd, KbdSequence } from "@/components/ui/cn/kbd";
import { KeyboardShortcuts } from "@/components/ui/cn/keyboard-shortcuts/KeyboardShortcuts";
import { Label } from "@/components/ui/cn/label/Label";
import { LineChart } from "@/components/ui/cn/line-chart/LineChart";
import { LogViewer } from "@/components/ui/cn/log-viewer/LogViewer";
import { MagneticButton } from "@/components/ui/cn/magnetic-button/MagneticButton";
import { MarkdownRenderer } from "@/components/ui/cn/markdown-renderer/MarkdownRenderer";
import { MarqueeText } from "@/components/ui/cn/marquee-text/MarqueeText";
import { Masonry } from "@/components/ui/cn/masonry/Masonry";
import { MediaPlayer } from "@/components/ui/cn/media-player/MediaPlayer";
import { MetricCard } from "@/components/ui/cn/metric-card/MetricCard";
import { MiniMap } from "@/components/ui/cn/mini-map/MiniMap";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/cn/modal/Modal";
import { MorphingText } from "@/components/ui/cn/morphing-text/MorphingText";
import { MultiAccordion } from "@/components/ui/cn/multi-accordion/MultiAccordion";
import { MultiSelect } from "@/components/ui/cn/multi-select/MultiSelect";
import { NavigationMenu as CnNavigationMenu } from "@/components/ui/cn/navigation-menu/NavigationMenu";
import { NewsletterForm } from "@/components/ui/cn/newsletter-form/NewsletterForm";
import { NoteCard } from "@/components/ui/cn/note-card/NoteCard";
import { NotificationBell } from "@/components/ui/cn/notification-bell/NotificationBell";
import { NumberInput } from "@/components/ui/cn/number-input/NumberInput";
import { NumberPad } from "@/components/ui/cn/number-pad/NumberPad";
import { OnboardingTour } from "@/components/ui/cn/onboarding-tour/OnboardingTour";
import { OtpInput } from "@/components/ui/cn/otp-input/OtpInput";
import { Pagination } from "@/components/ui/cn/pagination/Pagination";
import { ParticleField } from "@/components/ui/cn/particle-field/ParticleField";
import { PasswordInput } from "@/components/ui/cn/password-input/PasswordInput";
import { PasswordStrength } from "@/components/ui/cn/password-strength/PasswordStrength";
import { PhoneInput } from "@/components/ui/cn/phone-input/PhoneInput";
import { PinBoard } from "@/components/ui/cn/pin-board/PinBoard";
import { Ping } from "@/components/ui/cn/ping/Ping";
import { Popover } from "@/components/ui/cn/popover/Popover";
import { PriceTable } from "@/components/ui/cn/price-table/PriceTable";
import { PricingCard } from "@/components/ui/cn/pricing-card/PricingCard";
import { PricingToggle } from "@/components/ui/cn/pricing-toggle/PricingToggle";
import { Progress } from "@/components/ui/cn/progress/Progress";
import { ProgressRing } from "@/components/ui/cn/progress-ring/ProgressRing";
import { ProgressSteps } from "@/components/ui/cn/progress-steps/ProgressSteps";
import { QuickActions } from "@/components/ui/cn/quick-actions/QuickActions";
import { RadarChart } from "@/components/ui/cn/radar-chart/RadarChart";
import { Radio, RadioGroup } from "@/components/ui/cn/radio/Radio";
import { RangeSlider } from "@/components/ui/cn/range-slider/RangeSlider";
import { Rating } from "@/components/ui/cn/rating/Rating";
import { RatingInput } from "@/components/ui/cn/rating-input/RatingInput";
import { ReceiptCard } from "@/components/ui/cn/receipt-card/ReceiptCard";
import { Resizable } from "@/components/ui/cn/resizable/Resizable";
import { Ribbon } from "@/components/ui/cn/ribbon/Ribbon";
import { RichSelect } from "@/components/ui/cn/rich-select/RichSelect";
import { RichTooltip } from "@/components/ui/cn/rich-tooltip/RichTooltip";
import { ScrollArea } from "@/components/ui/cn/scroll-area/ScrollArea";
import { ScrollProgress } from "@/components/ui/cn/scroll-progress/ScrollProgress";
import { ScrollReveal } from "@/components/ui/cn/scroll-reveal/ScrollReveal";
import { ScrollSpy } from "@/components/ui/cn/scroll-spy/ScrollSpy";
import { ScrollTimeline } from "@/components/ui/cn/scroll-timeline/ScrollTimeline";
import { SearchInput } from "@/components/ui/cn/search-input/SearchInput";
import { SegmentedControl } from "@/components/ui/cn/segmented-control/SegmentedControl";
import { Select } from "@/components/ui/cn/select/Select";
import { Separator } from "@/components/ui/cn/separator/Separator";
import { ShortcutKey } from "@/components/ui/cn/shortcut-key/ShortcutKey";
import { SidePanel } from "@/components/ui/cn/side-panel/SidePanel";
import { SignaturePad } from "@/components/ui/cn/signature-pad/SignaturePad";
import { Skeleton } from "@/components/ui/cn/skeleton/Skeleton";
import { SkillBar } from "@/components/ui/cn/skill-bar/SkillBar";
import { Slider } from "@/components/ui/cn/slider/Slider";
import { SortableList } from "@/components/ui/cn/sortable-list/SortableList";
import { Sparkline } from "@/components/ui/cn/sparkline/Sparkline";
import { Spinner } from "@/components/ui/cn/spinner/Spinner";
import { SplitButton } from "@/components/ui/cn/split-button/SplitButton";
import { Spotlight } from "@/components/ui/cn/spotlight/Spotlight";
import { SpotlightSearch } from "@/components/ui/cn/spotlight-search/SpotlightSearch";
import { Stat } from "@/components/ui/cn/stat/Stat";
import { StatsCard } from "@/components/ui/cn/stats-card/StatsCard";
import { StatusBadge } from "@/components/ui/cn/status-badge/StatusBadge";
import { StatusPage } from "@/components/ui/cn/status-page/StatusPage";
import { StepForm } from "@/components/ui/cn/step-form/StepForm";
import { Stepper, useStepper } from "@/components/ui/cn/stepper/Stepper";
import { Stopwatch } from "@/components/ui/cn/stopwatch/Stopwatch";
import { SurveyForm } from "@/components/ui/cn/survey-form/SurveyForm";
import { SwipeCard } from "@/components/ui/cn/swipe-card/SwipeCard";
import { Switch } from "@/components/ui/cn/switch/Switch";
import { DataTable } from "@/components/ui/cn/table/Table";
import { TableOfContents } from "@/components/ui/cn/table-of-contents/TableOfContents";
import { Tabs, TabPanel } from "@/components/ui/cn/tabs/Tabs";
import { Tag } from "@/components/ui/cn/tag/Tag";
import { TagCloud } from "@/components/ui/cn/tag-cloud/TagCloud";
import { TagInput } from "@/components/ui/cn/tag-input/TagInput";
import { TerminalBlock } from "@/components/ui/cn/terminal-block/TerminalBlock";
import { TextEditor } from "@/components/ui/cn/text-editor/TextEditor";
import type { TextEffectType } from "@/components/ui/cn/text-effect/text-effect.types";
import { TextEffect } from "@/components/ui/cn/text-effect/TextEffect";
import { TextGradient } from "@/components/ui/cn/text-gradient/TextGradient";
import { Textarea } from "@/components/ui/cn/textarea/Textarea";
import { ThemeSelector } from "@/components/ui/cn/theme-selector/ThemeSelector";
import { TiltCard } from "@/components/ui/cn/tilt-card/TiltCard";
import { TimePicker } from "@/components/ui/cn/time-picker/TimePicker";
import { Timeline } from "@/components/ui/cn/timeline/Timeline";
import { TimelineProgress } from "@/components/ui/cn/timeline-progress/TimelineProgress";
import { ToastProvider, useToast } from "@/components/ui/cn/toast/Toast";
import { ToggleGroup } from "@/components/ui/cn/toggle-group/ToggleGroup";
import { ColorsTokens } from "@/components/ui/cn/tokens/ColorsTokens";
import { TypographyTokens } from "@/components/ui/cn/tokens/TypographyTokens";
import { Tooltip } from "@/components/ui/cn/tooltip/Tooltip";
import { TreeTable } from "@/components/ui/cn/tree-table/TreeTable";
import { TreeView } from "@/components/ui/cn/tree-view/TreeView";
import { Typewriter } from "@/components/ui/cn/typewriter/Typewriter";
import { UserCard } from "@/components/ui/cn/user-card/UserCard";
import { VerticalNav } from "@/components/ui/cn/vertical-nav/VerticalNav";
import { VideoCard } from "@/components/ui/cn/video-card/VideoCard";
import { VirtualList } from "@/components/ui/cn/virtual-list/VirtualList";
import { WindowFrame } from "@/components/ui/cn/window-frame/WindowFrame";
import { WordCounter } from "@/components/ui/cn/word-counter/WordCounter";

interface ShowcaseProps {
  group: string;
  component: string;
}

function Frame({
  children,
  label,
  noPad,
  align = "center",
}: {
  children: React.ReactNode;
  label?: string;
  noPad?: boolean;
  align?: "center" | "start" | "stretch";
}) {
  return (
    <div className="mb-4">
      {label && <p className="text-body-caption font-semibold text-faint uppercase tracking-[0.08em] mb-2">{label}</p>}
      <div
        className={`rounded-(--radius-lg) border border-rule bg-raised ${noPad ? "" : "p-8"} flex ${align === "center" ? "items-center justify-center" : align === "start" ? "items-start justify-start" : "items-stretch"} min-h-[140px]`}
      >
        {children}
      </div>
    </div>
  );
}

function ShowcaseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-body-caption font-bold uppercase tracking-[0.1em] text-faint/60 mb-4 pb-2 border-b border-rule">
        {title}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

/* ── Per-component demos ── */

function AutocompleteDemo() {
  const opts = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "angular", label: "Angular" },
    { value: "solid", label: "SolidJS" },
    { value: "qwik", label: "Qwik" },
  ];
  return (
    <div className="w-72 flex flex-col gap-6">
      <Frame label="Default">
        <Autocomplete options={opts} placeholder="Search framework…" className="w-full" />
      </Frame>
      <Frame label="With label">
        <Autocomplete options={opts} label="Framework" placeholder="Pick one…" className="w-full" />
      </Frame>
    </div>
  );
}

function ColorPickerDemo() {
  const [color, setColor] = useState("#22c55e");
  return (
    <div className="flex flex-col gap-4">
      <Frame label="Swatches + hex input">
        <ColorPicker />
      </Frame>
      <Frame label="Controlado + disabled">
        <div className="flex items-center gap-6">
          <ColorPicker value={color} onChange={setColor} />
          <ColorPicker defaultValue="#8b5cf6" disabled />
        </div>
      </Frame>
    </div>
  );
}

function ComboboxDemo() {
  const opts = [
    { value: "design", label: "Design" },
    { value: "dev", label: "Development" },
    { value: "product", label: "Product" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
  ];
  return (
    <div className="w-80 flex flex-col gap-6">
      <Frame label="Multi-select">
        <Combobox options={opts} placeholder="Select teams…" className="w-full" />
      </Frame>
      <Frame label="Single (maxSelected=1)">
        <Combobox options={opts} placeholder="Select one team…" maxSelected={1} className="w-full" />
      </Frame>
    </div>
  );
}

function DatePickerDemo() {
  return (
    <div className="w-80 flex flex-col gap-6">
      <Frame label="Date only">
        <DatePicker label="Event date" className="w-full" />
      </Frame>
      <Frame label="Date + time">
        <DatePicker label="Scheduled at" showTime className="w-full" />
      </Frame>
    </div>
  );
}

function FileUploadDemo() {
  return (
    <div className="w-96 flex flex-col gap-6">
      <Frame label="Dropzone">
        <FileUpload
          multiple
          accept=".png,.jpg,.pdf"
          hint="PNG, JPG or PDF — max 5 MB"
          maxSize={5 * 1024 * 1024}
          className="w-full"
        />
      </Frame>
      <Frame label="Button">
        <FileUpload variant="button" multiple className="w-full" />
      </Frame>
    </div>
  );
}

function FilterBarDemo() {
  const opts = [
    { value: "all", label: "All", count: 24 },
    { value: "active", label: "Active", count: 12 },
    { value: "pending", label: "Pending", count: 8 },
    { value: "closed", label: "Closed", count: 4 },
  ];
  return (
    <div className="w-full flex flex-col gap-6">
      <Frame label="Multi-select">
        <FilterBar options={opts} defaultValue={["active"]} />
      </Frame>
      <Frame label="Single select">
        <FilterBar options={opts} multiSelect={false} defaultValue={["all"]} />
      </Frame>
    </div>
  );
}

function AnimatedNumberDemo() {
  const [val, setVal] = useState(1234567);
  return (
    <Frame label="Click to animate">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-12 items-end">
          <AnimatedNumber value={val} className="text-[3rem] font-bold text-foreground tabular-nums" />
          <AnimatedNumber
            value={val / 10}
            format={(v) => `${v.toFixed(1)}%`}
            className="text-heading-03 font-bold text-patina tabular-nums"
          />
          <AnimatedNumber
            value={val / 100}
            format={(v) => `#${Math.round(v)}`}
            className="text-heading-03 font-bold text-kinpaku tabular-nums"
          />
        </div>
        <Button onClick={() => setVal((v) => (v === 1234567 ? 9876543 : 1234567))} intent="primary" size="sm">
          Toggle value
        </Button>
      </div>
    </Frame>
  );
}

function CardStackDemo() {
  const cards = [
    {
      id: "a",
      content: (
        <div className="rounded-(--radius-lg) bg-patina text-patina-fg p-6 h-40 w-64 flex flex-col justify-between">
          <p className="text-body-caption opacity-70">Project Alpha</p>
          <p className="text-body-title font-bold">Q4 Launch Ready</p>
        </div>
      ),
    },
    {
      id: "b",
      content: (
        <div className="rounded-(--radius-lg) bg-kinpaku text-kinpaku-fg p-6 h-40 w-64 flex flex-col justify-between">
          <p className="text-body-caption opacity-70">Project Beta</p>
          <p className="text-body-title font-bold">In Review</p>
        </div>
      ),
    },
    {
      id: "c",
      content: (
        <div className="rounded-(--radius-lg) bg-violet text-violet-fg p-6 h-40 w-64 flex flex-col justify-between">
          <p className="text-body-caption opacity-70">Project Gamma</p>
          <p className="text-body-title font-bold">Planned</p>
        </div>
      ),
    },
  ];
  return (
    <Frame label="Auto-play (3s)">
      <CardStack cards={cards} autoPlay interval={3000} />
    </Frame>
  );
}

function CarouselDemo() {
  const items = [
    {
      id: "1",
      content: (
        <div className="rounded-(--radius-lg) bg-patina-soft border border-patina h-48 w-full flex items-center justify-center text-patina text-body-title font-bold">
          Slide 1
        </div>
      ),
    },
    {
      id: "2",
      content: (
        <div className="rounded-(--radius-lg) bg-kinpaku-soft border border-kinpaku h-48 w-full flex items-center justify-center text-kinpaku text-body-title font-bold">
          Slide 2
        </div>
      ),
    },
    {
      id: "3",
      content: (
        <div className="rounded-(--radius-lg) bg-violet-soft border border-violet h-48 w-full flex items-center justify-center text-violet text-body-title font-bold">
          Slide 3
        </div>
      ),
    },
    {
      id: "4",
      content: (
        <div className="rounded-(--radius-lg) bg-rose-soft border border-rose h-48 w-full flex items-center justify-center text-rose text-body-title font-bold">
          Slide 4
        </div>
      ),
    },
  ];
  return (
    <Frame label="Horizontal with dots">
      <Carousel items={items} className="w-80" />
    </Frame>
  );
}

function MarkdownRendererDemo() {
  const md = `# Heading 1\n\nRegular paragraph with **bold** and *italic* text, plus \`inline code\`.\n\n## Code block\n\n\`\`\`\nconst cls = cn('bg-patina', active && 'text-patina-fg')\n\`\`\`\n\n> Blockquote with context\n\n- List item one\n- List item two\n- List item three`;
  return (
    <Frame label="Markdown → styled HTML">
      <MarkdownRenderer content={md} className="max-w-lg w-full" />
    </Frame>
  );
}

function MultiAccordionDemo() {
  const items = [
    {
      id: "1",
      title: "What is Kikito CN?",
      content: "A Tailwind v4 component library with semantic token aliases and zero CSS Modules.",
    },
    {
      id: "2",
      title: "How do I install?",
      content:
        "Copy components to your ui/ directory, add the token bridge to globals.css, import cn() from @/lib/utils.",
    },
    {
      id: "3",
      title: "Does it support dark mode?",
      content: "Yes — all tokens adapt via CSS custom properties. Toggle .dark on the root element.",
    },
  ];
  const intentItems = [
    { id: "1", title: "Primary intent", content: 'This item uses intent="primary".', intent: "primary" as const },
    { id: "2", title: "Success intent", content: 'This item uses intent="success".', intent: "success" as const },
    { id: "3", title: "Danger intent", content: 'This item uses intent="danger".', intent: "danger" as const },
  ];
  return (
    <div className="w-full max-w-lg flex flex-col gap-6">
      <Frame label="Default (multiple open)">
        <MultiAccordion items={items} className="w-full" />
      </Frame>
      <Frame label="Per-item intents">
        <MultiAccordion items={intentItems} className="w-full" />
      </Frame>
    </div>
  );
}

function ScrollTimelineDemo() {
  const events = [
    { id: "1", title: "Project Kickoff", date: "Jan 2024", description: "Team assembled, goals defined." },
    { id: "2", title: "Design Phase", date: "Feb 2024", description: "Wireframes and tokens established." },
    { id: "3", title: "Dev Sprint", date: "Mar 2024", description: "Core components built and tested." },
    { id: "4", title: "Beta Release", date: "Apr 2024", description: "Soft launch to internal stakeholders." },
  ];
  return (
    <Frame label="Alternating layout">
      <ScrollTimeline events={events} orientation="alternating" className="w-full" />
    </Frame>
  );
}

function SparklineDemo() {
  const data = [12, 24, 18, 36, 28, 42, 38, 55, 48, 60];
  return (
    <div className="flex flex-col gap-6">
      <Frame label="Area">
        <Sparkline data={data} type="area" width={200} height={60} color="var(--ks-primary)" />
      </Frame>
      <Frame label="Line">
        <Sparkline data={data} type="line" width={200} height={60} color="var(--ks-violet)" />
      </Frame>
      <Frame label="Bar">
        <Sparkline data={data} type="bar" width={200} height={60} color="var(--ks-kinpaku)" />
      </Frame>
    </div>
  );
}

function DataGridDemo() {
  const columns = [
    { key: "name", header: "Name", sortable: true },
    { key: "role", header: "Role", sortable: true },
    { key: "status", header: "Status", sortable: false },
    { key: "score", header: "Score", sortable: true },
  ];
  const rows = [
    { id: "1", name: "Alice Chen", role: "Engineer", status: "Active", score: 98 },
    { id: "2", name: "Bob Tanaka", role: "Designer", status: "Active", score: 87 },
    { id: "3", name: "Carol Davis", role: "PM", status: "Away", score: 92 },
    { id: "4", name: "David Kim", role: "Engineer", status: "Inactive", score: 74 },
    { id: "5", name: "Eva Rodriguez", role: "Designer", status: "Active", score: 95 },
  ];
  return (
    <Frame label="Sortable + selectable + striped">
      <DataGrid columns={columns} rows={rows} selectable striped className="w-full" />
    </Frame>
  );
}

function DataListDemo() {
  const items = [
    { label: "Version", value: "0.1.0" },
    { label: "License", value: "MIT" },
    { label: "Language", value: "TypeScript" },
    { label: "Runtime", value: "React 18+" },
  ];
  return (
    <div className="w-full flex flex-col gap-6">
      <Frame label="Horizontal">
        <DataList items={items} layout="horizontal" className="w-full max-w-sm" />
      </Frame>
      <Frame label="Grid + bordered + striped">
        <DataList items={items} layout="grid" bordered striped className="w-full max-w-sm" />
      </Frame>
    </div>
  );
}

function DraggableDemo() {
  const initial = [
    { id: "1", content: <span className="text-body-callout text-foreground">First item</span> },
    { id: "2", content: <span className="text-body-callout text-foreground">Second item</span> },
    { id: "3", content: <span className="text-body-callout text-foreground">Third item</span> },
    { id: "4", content: <span className="text-body-callout text-foreground">Fourth item</span> },
  ];
  return (
    <Frame label="Drag to reorder">
      <Draggable items={initial} className="w-72" />
    </Frame>
  );
}

function CommandDemo() {
  const groups = [
    {
      heading: "Navigation",
      items: [
        { id: "home", label: "Go to Home", icon: "🏠", shortcut: "G H", onSelect: () => {} },
        { id: "cn", label: "Open CN", icon: "🎨", shortcut: "G C", onSelect: () => {} },
        { id: "settings", label: "Open Settings", icon: "⚙️", shortcut: "⌘ ,", onSelect: () => {} },
      ],
    },
    {
      heading: "Actions",
      items: [
        { id: "theme", label: "Toggle Theme", icon: "🌙", onSelect: () => {} },
        { id: "copy", label: "Copy URL", icon: "📋", onSelect: () => {} },
      ],
    },
  ];
  return (
    <Frame label="Press ⌘K / Ctrl+K to open">
      <Command groups={groups} placeholder="Type a command…" />
    </Frame>
  );
}

function ContextMenuDemo() {
  const groups = [
    {
      items: [
        { label: "Copy", icon: "📋", onClick: () => {} },
        { label: "Paste", icon: "📄", onClick: () => {} },
        { label: "Cut", icon: "✂️", onClick: () => {} },
      ],
    },
    {
      items: [{ label: "Delete", icon: "🗑️", danger: true, onClick: () => {} }],
    },
  ];
  return (
    <Frame label="Right-click the area below">
      <ContextMenu groups={groups}>
        <div className="w-64 h-24 rounded-(--radius-md) border-2 border-dashed border-rule flex items-center justify-center text-body-callout text-muted select-none cursor-context-menu hover:border-patina hover:text-foreground transition-colors">
          Right-click here
        </div>
      </ContextMenu>
    </Frame>
  );
}

function DropdownMenuDemo() {
  const items = [
    {
      type: "group" as const,
      label: "Actions",
      items: [
        { type: "item" as const, value: "edit", label: "Edit", icon: "✏️", shortcut: "⌘E", onClick: () => {} },
        {
          type: "item" as const,
          value: "duplicate",
          label: "Duplicate",
          icon: "📋",
          shortcut: "⌘D",
          onClick: () => {},
        },
      ],
    },
    { type: "separator" as const },
    {
      type: "item" as const,
      value: "delete",
      label: "Delete",
      icon: "🗑️",
      danger: true,
      onClick: () => {},
    },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Click trigger">
        <Frame label="Default (bottom-start)">
          <DropdownMenu items={items}>
            <Button variant="outline">Open menu</Button>
          </DropdownMenu>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Placements">
        <Frame label="bottom-start · bottom-end · top-start · top-end">
          <div className="flex flex-wrap gap-4 justify-center">
            {(["bottom-start", "bottom-end", "top-start", "top-end"] as const).map((placement) => (
              <DropdownMenu key={placement} items={items} placement={placement}>
                <Button variant="outline" size="sm">
                  {placement}
                </Button>
              </DropdownMenu>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SpotlightSearchDemo() {
  const [open, setOpen] = useState(false);
  const actions = [
    { id: "home", label: "Home", group: "Pages", description: "Back to main page", icon: "🏠", onSelect: () => {} },
    { id: "cn", label: "Kikito CN", group: "Pages", description: "Design system", icon: "🎨", onSelect: () => {} },
    {
      id: "settings",
      label: "Settings",
      group: "Pages",
      description: "Account preferences",
      icon: "⚙️",
      onSelect: () => {},
    },
    { id: "theme", label: "Toggle Theme", group: "Actions", icon: "🌙", onSelect: () => {} },
    { id: "logout", label: "Sign out", group: "Actions", icon: "👋", onSelect: () => setOpen(false) },
  ];
  return (
    <Frame label="Click the button to open the search overlay">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-(--radius-sm) border border-rule bg-raised text-muted hover:text-foreground hover:border-patina text-body-callout transition-colors duration-150 min-w-[220px]"
        >
          <span>🔍</span>
          <span className="flex-1 text-left">Search everything…</span>
          <kbd className="text-[0.625rem] font-bold bg-graphite px-[5px] py-[2px] rounded-[3px] text-faint">⌘K</kbd>
        </button>
        <SpotlightSearch actions={actions} isOpen={open} onClose={() => setOpen(false)} placeholder="Search…" />
      </div>
    </Frame>
  );
}

/* ── New component demos ── */

function MultiSelectDemo() {
  const [values, setValues] = useState<string[]>(["react", "typescript"]);
  const options = [
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
    { value: "nextjs", label: "Next.js" },
    { value: "tailwind", label: "Tailwind CSS" },
    { value: "prisma", label: "Prisma" },
    { value: "trpc", label: "tRPC" },
  ];
  return (
    <Frame label="Multi Select — select multiple values">
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        <MultiSelect options={options} value={values} onChange={setValues} placeholder="Select technologies…" />
        <p className="text-body-caption text-faint">Selected: {values.join(", ") || "none"}</p>
      </div>
    </Frame>
  );
}

function RichSelectDemo() {
  const [value, setValue] = useState("patina");
  const options = [
    { value: "patina", label: "Patina", description: "Primary brand color", icon: "🟢" },
    { value: "kinpaku", label: "Kinpaku", description: "Gold accent", icon: "🟡" },
    { value: "violet", label: "Violet", description: "Purple tertiary", icon: "🟣" },
    { value: "rose", label: "Rose", description: "Warm pink quaternary", icon: "🔴" },
  ];
  return (
    <Frame label="Rich Select — single value with icon and description">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
        <RichSelect options={options} value={value} onChange={setValue} placeholder="Choose a color token…" />
        <p className="text-body-caption text-faint">Selected: {value}</p>
      </div>
    </Frame>
  );
}

function SurveyFormDemo() {
  const questions = [
    { id: "name", label: "Your name", type: "text" as const, placeholder: "Enter your name" },
    { id: "bio", label: "Short bio", type: "textarea" as const, placeholder: "Tell us about yourself…" },
    { id: "role", label: "Your role", type: "radio" as const, options: ["Developer", "Designer", "Product", "Other"] },
    {
      id: "tools",
      label: "Tools you use",
      type: "checkbox" as const,
      options: ["VS Code", "Figma", "Linear", "Notion"],
    },
    { id: "exp", label: "Years of experience", type: "scale" as const, min: 0, max: 10 },
    { id: "rating", label: "Rate this survey", type: "rating" as const, max: 5 },
  ];
  return (
    <Frame label="Survey Form — multiple question types">
      <div className="w-full max-w-lg mx-auto">
        <SurveyForm
          questions={questions}
          onSubmit={(answers) => console.log("Survey answers:", answers)}
          submitLabel="Submit Survey"
        />
      </div>
    </Frame>
  );
}

function DateRangePickerDemo() {
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  return (
    <Frame label="Date Range Picker — select start and end dates">
      <div className="w-full flex flex-col items-center gap-4">
        <DateRangePicker value={range} onChange={setRange} />
        <p className="text-body-caption text-faint">
          {range.start && range.end
            ? `${range.start.toLocaleDateString()} → ${range.end.toLocaleDateString()}`
            : "No range selected"}
        </p>
      </div>
    </Frame>
  );
}

function EventCalendarDemo() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const events = [
    { id: "1", title: "Team standup", date: new Date(y, m, 3).toISOString().split("T")[0], intent: "primary" as const },
    {
      id: "2",
      title: "Design review",
      date: new Date(y, m, 7).toISOString().split("T")[0],
      intent: "secondary" as const,
    },
    { id: "3", title: "Release v2", date: new Date(y, m, 12).toISOString().split("T")[0], intent: "success" as const },
    {
      id: "4",
      title: "On-call week",
      date: new Date(y, m, 15).toISOString().split("T")[0],
      intent: "warning" as const,
    },
    { id: "5", title: "All hands", date: new Date(y, m, 20).toISOString().split("T")[0], intent: "info" as const },
    { id: "6", title: "Incident", date: new Date(y, m, 25).toISOString().split("T")[0], intent: "danger" as const },
  ];
  return (
    <Frame label="Event Calendar — monthly grid with color-coded events">
      <div className="w-full max-w-2xl mx-auto">
        <EventCalendar events={events} />
      </div>
    </Frame>
  );
}

function ImageViewerDemo() {
  const images = [
    { src: "https://picsum.photos/seed/a/800/600", alt: "Abstract landscape", caption: "Landscape A" },
    { src: "https://picsum.photos/seed/b/800/600", alt: "Mountain range", caption: "Mountains B" },
    { src: "https://picsum.photos/seed/c/800/600", alt: "Forest path", caption: "Forest C" },
    { src: "https://picsum.photos/seed/d/800/600", alt: "Ocean sunset", caption: "Ocean D" },
  ];
  return (
    <Frame label="Image Viewer — thumbnail grid with full-screen lightbox">
      <ImageViewer images={images} />
    </Frame>
  );
}

function TableDemo() {
  type Row = { id: number; name: string; role: string; status: string; joined: string };
  const columns = [
    { key: "name" as const, header: "Name", sortable: true },
    {
      key: "role" as const,
      header: "Role",
      sortable: true,
      filter: "select" as const,
      filterOptions: [
        { label: "Developer", value: "Developer" },
        { label: "Designer", value: "Designer" },
      ],
    },
    {
      key: "status" as const,
      header: "Status",
      sortable: true,
      filter: "select" as const,
      filterOptions: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
    { key: "joined" as const, header: "Joined", sortable: true },
  ];
  const rows: Row[] = [
    { id: 1, name: "Alice Chen", role: "Developer", status: "Active", joined: "2023-01-15" },
    { id: 2, name: "Bob Tanaka", role: "Designer", status: "Active", joined: "2023-03-22" },
    { id: 3, name: "Carol Wright", role: "Developer", status: "Inactive", joined: "2022-11-08" },
    { id: 4, name: "Dan Müller", role: "Designer", status: "Active", joined: "2024-02-01" },
    { id: 5, name: "Eva Ferreira", role: "Developer", status: "Active", joined: "2023-07-30" },
    { id: 6, name: "Frank Okafor", role: "Developer", status: "Active", joined: "2022-05-14" },
  ];
  return (
    <Frame label="DataTable — filters, sort, bulk actions, pagination">
      <DataTable<Row>
        columns={columns}
        data={rows}
        getRowId={(r) => String(r.id)}
        defaultPageSize={4}
        selectable
        striped
      />
    </Frame>
  );
}

function TreeTableDemo() {
  type NodeData = { name: string; type: string; size: string };
  const columns = [
    { key: "name", header: "Name", render: (d: NodeData) => d.name },
    { key: "type", header: "Type", render: (d: NodeData) => d.type },
    { key: "size", header: "Size", render: (d: NodeData) => d.size },
  ];
  const rows = [
    {
      id: "1",
      data: { name: "src", type: "folder", size: "—" },
      children: [
        {
          id: "1-1",
          data: { name: "components", type: "folder", size: "—" },
          children: [
            { id: "1-1-1", data: { name: "Button.tsx", type: "file", size: "4.2 KB" } },
            { id: "1-1-2", data: { name: "Input.tsx", type: "file", size: "3.1 KB" } },
          ],
        },
        {
          id: "1-2",
          data: { name: "lib", type: "folder", size: "—" },
          children: [{ id: "1-2-1", data: { name: "utils.ts", type: "file", size: "1.8 KB" } }],
        },
        {
          id: "1-3",
          data: { name: "app", type: "folder", size: "—" },
          children: [
            { id: "1-3-1", data: { name: "page.tsx", type: "file", size: "2.5 KB" } },
            { id: "1-3-2", data: { name: "layout.tsx", type: "file", size: "1.2 KB" } },
          ],
        },
      ],
    },
    {
      id: "2",
      data: { name: "public", type: "folder", size: "—" },
      children: [{ id: "2-1", data: { name: "favicon.ico", type: "file", size: "14 KB" } }],
    },
    { id: "3", data: { name: "package.json", type: "file", size: "1.6 KB" } },
  ];
  return (
    <Frame label="Tree Table — expandable hierarchy with toggle controls">
      <TreeTable<NodeData> columns={columns} rows={rows} />
    </Frame>
  );
}

function TreeViewDemo() {
  const nodes = [
    {
      id: "src",
      label: "src",
      children: [
        {
          id: "components",
          label: "components",
          children: [
            { id: "button", label: "Button.tsx" },
            { id: "input", label: "Input.tsx" },
          ],
        },
        { id: "utils", label: "utils.ts" },
      ],
    },
    {
      id: "public",
      label: "public",
      children: [{ id: "favicon", label: "favicon.ico" }],
    },
    { id: "package", label: "package.json", disabled: true },
  ];
  const [selected, setSelected] = useState("button");
  return (
    <Frame label="Tree View — expand/collapse, selection, keyboard navigation" align="start">
      <div className="w-64">
        <TreeView nodes={nodes} selected={selected} defaultExpanded={["src", "components"]} onSelect={setSelected} />
      </div>
    </Frame>
  );
}

function ImageCropperDemo() {
  const [cropArea, setCropArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  return (
    <Frame label="Image Cropper — drag handles to define crop area">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-4">
        <ImageCropper src="https://picsum.photos/seed/crop/800/500" onCrop={setCropArea} aspect={16 / 9} />
        {cropArea && (
          <p className="text-body-caption text-faint text-center">
            Crop: x={Math.round(cropArea.x)} y={Math.round(cropArea.y)} {Math.round(cropArea.width)}×
            {Math.round(cropArea.height)}
          </p>
        )}
      </div>
    </Frame>
  );
}

function ResizableDemo() {
  return (
    <Frame label="Resizable — drag the divider to resize panels">
      <div className="w-full h-[320px]">
        <Resizable direction="horizontal" defaultSize={50} minSize={20} maxSize={80}>
          <div className="h-full bg-raised rounded-(--radius-sm) p-4 flex flex-col gap-2">
            <p className="text-body-caption font-semibold text-muted uppercase tracking-wide">Panel A</p>
            <p className="text-body-callout text-foreground">Drag the divider ↔</p>
          </div>
          <div className="h-full bg-raised rounded-(--radius-sm) p-4 flex flex-col gap-2">
            <p className="text-body-caption font-semibold text-muted uppercase tracking-wide">Panel B</p>
            <p className="text-body-callout text-foreground">This panel resizes too</p>
          </div>
        </Resizable>
      </div>
    </Frame>
  );
}

/* ── Batch 2 demos ── */

function BarChartDemo() {
  const data = [
    { label: "Jan", value: 42 },
    { label: "Feb", value: 68 },
    { label: "Mar", value: 55 },
    { label: "Apr", value: 91 },
    { label: "May", value: 73 },
    { label: "Jun", value: 84 },
  ];
  return (
    <Frame label="Bar Chart — animated SVG bars with per-bar colors">
      <div className="w-full flex justify-center py-4">
        <BarChart data={data} height={220} animate />
      </div>
    </Frame>
  );
}

function LineChartDemo() {
  const series = [
    { label: "Revenue", data: [30, 52, 45, 70, 60, 88, 75], color: "var(--ks-primary)" },
    { label: "Costs", data: [20, 28, 35, 40, 38, 50, 42], color: "var(--ks-danger)" },
  ];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <Frame label="Line Chart — multi-series with area fill and legend">
      <LineChart series={series} labels={labels} height={220} />
    </Frame>
  );
}

function DonutChartDemo() {
  const segments = [
    { label: "React", value: 40 },
    { label: "Vue", value: 25 },
    { label: "Angular", value: 20 },
    { label: "Svelte", value: 10 },
    { label: "Other", value: 5 },
  ];
  return (
    <Frame label="Donut Chart — segments with legend and center value">
      <div className="flex justify-center">
        <DonutChart segments={segments} size={180} centerValue="100" centerLabel="responses" showLegend />
      </div>
    </Frame>
  );
}

function AreaChartDemo() {
  const data = [
    { label: "Jan", users: 1200, sessions: 3400 },
    { label: "Feb", users: 1800, sessions: 4100 },
    { label: "Mar", users: 1600, sessions: 3800 },
    { label: "Apr", users: 2400, sessions: 5200 },
    { label: "May", users: 2100, sessions: 4800 },
    { label: "Jun", users: 3000, sessions: 6500 },
  ];
  const series = [
    { key: "users", label: "Users" },
    { key: "sessions", label: "Sessions" },
  ];
  return (
    <Frame label="Area Chart — gradient fills with hover tooltip">
      <AreaChart data={data} series={series} height={240} showTooltip showLegend />
    </Frame>
  );
}

function FlipCardDemo() {
  return (
    <Frame label="Flip Card — hover to reveal back face">
      <div className="flex flex-wrap gap-6 justify-center">
        <FlipCard
          trigger="hover"
          width={200}
          height={130}
          front={
            <div className="h-full bg-patina flex flex-col items-center justify-center gap-2 text-patina-fg rounded-2xl">
              <span className="text-3xl">☀️</span>
              <span className="font-semibold text-sm">Front</span>
            </div>
          }
          back={
            <div className="h-full bg-raised border border-rule flex flex-col items-center justify-center gap-2 rounded-2xl">
              <span className="text-3xl">🌙</span>
              <span className="font-semibold text-sm text-foreground">Back</span>
            </div>
          }
        />
        <FlipCard
          trigger="click"
          direction="vertical"
          width={200}
          height={130}
          front={
            <div className="h-full bg-kinpaku flex flex-col items-center justify-center gap-2 text-kinpaku-fg rounded-2xl">
              <span className="text-3xl">🃏</span>
              <span className="font-semibold text-sm">Click me</span>
            </div>
          }
          back={
            <div className="h-full bg-canvas border border-rule flex flex-col items-center justify-center gap-2 rounded-2xl">
              <span className="text-3xl">✨</span>
              <span className="font-semibold text-sm text-foreground">Vertical flip</span>
            </div>
          }
        />
      </div>
    </Frame>
  );
}

function GlowCardDemo() {
  return (
    <Frame label="Glow Card — radial glow follows mouse position">
      <div className="flex flex-wrap gap-4 justify-center">
        <GlowCard glowColor="var(--ks-primary)" radius={12} padding={24}>
          <div className="flex flex-col gap-2 text-foreground w-48">
            <span className="text-2xl">🚀</span>
            <p className="font-semibold text-body-callout">Patina Glow</p>
            <p className="text-body-caption text-muted">Hover to see the effect</p>
          </div>
        </GlowCard>
        <GlowCard glowColor="var(--ks-kinpaku)" glowOpacity={0.2} radius={12} padding={24}>
          <div className="flex flex-col gap-2 text-foreground w-48">
            <span className="text-2xl">⚡</span>
            <p className="font-semibold text-body-callout">Kinpaku Glow</p>
            <p className="text-body-caption text-muted">Hover to see the effect</p>
          </div>
        </GlowCard>
      </div>
    </Frame>
  );
}

function MarqueeTextDemo() {
  return (
    <Frame label="Marquee Text — infinite scrolling ticker">
      <div className="flex flex-col gap-4 w-full">
        <MarqueeText text="Kikito Design System  ·  " size="lg" speed={20} />
        <MarqueeText text="Components  ·  Patterns  ·  Tokens  ·  " size="md" speed={35} />
        <MarqueeText text="Open Source  ·  " size="sm" speed={15} />
      </div>
    </Frame>
  );
}

function ComparisonTableDemo() {
  const columns = [
    { key: "free", label: "Free" },
    { key: "pro", label: "Pro", highlight: true, badge: "Popular" },
    { key: "team", label: "Team" },
  ];
  const rows = [
    { group: "Features", feature: "Projects", values: { free: "3", pro: "Unlimited", team: "Unlimited" } },
    { group: "Features", feature: "Team members", values: { free: "1", pro: "5", team: "Unlimited" } },
    { group: "Features", feature: "Storage", values: { free: "1 GB", pro: "50 GB", team: "500 GB" } },
    { group: "Collaboration", feature: "Sharing", values: { free: false, pro: true, team: true } },
    { group: "Collaboration", feature: "Comments", values: { free: false, pro: true, team: true } },
    { group: "Collaboration", feature: "Roles & permissions", values: { free: false, pro: false, team: true } },
    { group: "Support", feature: "Email support", values: { free: false, pro: true, team: true } },
    { group: "Support", feature: "Priority support", values: { free: false, pro: false, team: true } },
  ];
  return (
    <Frame label="Comparison Table — feature matrix with highlighted column">
      <ComparisonTable columns={columns} rows={rows} />
    </Frame>
  );
}

function KanbanDemo() {
  const initial = [
    {
      id: "backlog",
      title: "Backlog",
      intent: "neutral" as const,
      cards: [
        { id: "b1", title: "Add dark mode", label: "Design", assignee: "Alice" },
        { id: "b2", title: "Refactor auth", label: "Backend", description: "Extract into middleware" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      intent: "primary" as const,
      cards: [
        {
          id: "i1",
          title: "Kanban component",
          label: "Frontend",
          assignee: "Bob",
          description: "Drag and drop support",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      intent: "warning" as const,
      cards: [{ id: "r1", title: "CI pipeline fix", label: "DevOps", assignee: "Carol" }],
    },
    {
      id: "done",
      title: "Done",
      intent: "success" as const,
      cards: [
        { id: "d1", title: "Design tokens v2", label: "Design", assignee: "Alice" },
        { id: "d2", title: "Setup monorepo", label: "DevOps" },
      ],
    },
  ];
  return (
    <Frame label="Kanban — drag cards between columns">
      <Kanban columns={initial} />
    </Frame>
  );
}

function JsonViewerDemo() {
  const data = {
    user: {
      id: 42,
      name: "Alice Chen",
      email: "alice@example.com",
      active: true,
      roles: ["admin", "editor"],
      meta: { joined: "2024-01-15", lastSeen: null, preferences: { theme: "dark", lang: "en" } },
    },
    pagination: { page: 1, perPage: 20, total: 142 },
  };
  return (
    <Frame label="JSON Viewer — collapsible tree with syntax highlighting">
      <JsonViewer data={data} defaultExpandDepth={2} name="response" />
    </Frame>
  );
}

function ConfirmButtonDemo() {
  return (
    <Frame label="Confirm Button — double-click or hold to confirm">
      <div className="flex flex-wrap gap-4 justify-center">
        <ConfirmButton mode="doubleclick" intent="danger" onConfirm={() => alert("Deleted!")}>
          Delete account
        </ConfirmButton>
        <ConfirmButton mode="hold" intent="warning" onConfirm={() => alert("Submitted!")} holdDuration={1000}>
          Hold to submit
        </ConfirmButton>
        <ConfirmButton mode="doubleclick" intent="primary" variant="outline" onConfirm={() => {}}>
          Confirm action
        </ConfirmButton>
      </div>
    </Frame>
  );
}

function StopwatchDemo() {
  return (
    <Frame label="Stopwatch — start, pause, lap and reset">
      <div className="flex justify-center">
        <Stopwatch showLaps maxLaps={5} />
      </div>
    </Frame>
  );
}

function ProgressRingDemo() {
  return (
    <Frame label="Progress Ring — circular progress with intent colors">
      <div className="flex flex-wrap gap-6 justify-center">
        <ProgressRing value={75} intent="primary" size={90} label="Usage" />
        <ProgressRing value={42} intent="success" size={90} label="Health" />
        <ProgressRing value={88} intent="warning" size={90} label="Load" />
        <ProgressRing value={20} intent="danger" size={90} label="Disk" />
        <ProgressRing value={60} intent="info" size={90} label="Tasks" />
      </div>
    </Frame>
  );
}

/* ── Batch 3 demos ── */

function ScrollProgressDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <Frame label="Scroll Progress — barra de progresso que acompanha o scroll">
      <div className="relative overflow-hidden rounded-(--radius-md) border border-rule" style={{ height: 260 }}>
        <ScrollProgress
          target={containerRef}
          position="top"
          height={4}
          color="var(--ks-primary)"
          style={{ position: "absolute", zIndex: 10 }}
        />
        <div ref={containerRef} className="h-full overflow-y-auto p-4 flex flex-col gap-2.5">
          <p className="text-body-caption text-faint text-center mb-1">Role para ver a barra preencher</p>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="rounded-(--radius-sm) border border-rule bg-raised px-3 py-2 text-body-callout text-muted"
            >
              Parágrafo {i + 1}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function ImageCompareDemo() {
  return (
    <Frame label="Image Compare — drag to reveal before/after">
      <ImageCompare
        before="https://picsum.photos/seed/before/800/400"
        after="https://picsum.photos/seed/after/800/400"
        height={260}
        beforeLabel="Original"
        afterLabel="Processed"
      />
    </Frame>
  );
}

function TimePickerDemo() {
  const [val24, setVal24] = useState<{ hours: number; minutes: number }>({ hours: 9, minutes: 30 });
  const [val12, setVal12] = useState<{ hours: number; minutes: number; period?: "AM" | "PM" }>({
    hours: 2,
    minutes: 0,
    period: "PM",
  });
  return (
    <Frame label="Time Picker — dropdown hour/minute selector">
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="flex flex-col gap-2">
          <p className="text-body-caption font-semibold text-muted">24-hour format</p>
          <TimePicker value={val24} onChange={setVal24} format="24" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-body-caption font-semibold text-muted">12-hour format</p>
          <TimePicker value={val12} onChange={setVal12} format="12" />
        </div>
      </div>
    </Frame>
  );
}

function PriceTableDemo() {
  const plans = [
    { id: "free", name: "Free", price: 0, ctaLabel: "Get started", description: "Perfect for side projects" },
    {
      id: "pro",
      name: "Pro",
      price: 19,
      period: "mo",
      ctaLabel: "Start trial",
      description: "For solo creators",
      highlight: true,
      badge: "Most popular",
    },
    { id: "team", name: "Team", price: 49, period: "mo", ctaLabel: "Start trial", description: "For growing teams" },
  ];
  const features = [
    { label: "Projects", plans: { free: "3", pro: "Unlimited", team: "Unlimited" } },
    { label: "Members", plans: { free: "1", pro: "5", team: "Unlimited" } },
    { label: "Storage", plans: { free: "1 GB", pro: "50 GB", team: "500 GB" } },
    { label: "API access", plans: { free: false, pro: true, team: true } },
    { label: "Priority support", plans: { free: false, pro: false, team: true } },
  ];
  return (
    <Frame label="Price Table — plans with feature matrix and CTA buttons">
      <PriceTable plans={plans} features={features} />
    </Frame>
  );
}

function LogViewerDemo() {
  const entries = [
    { id: 1, level: "info" as const, message: "Server started on port 3000", timestamp: new Date(Date.now() - 5000) },
    {
      id: 2,
      level: "debug" as const,
      message: "Loading config from .env.local",
      timestamp: new Date(Date.now() - 4000),
    },
    {
      id: 3,
      level: "success" as const,
      message: "Database connected successfully",
      timestamp: new Date(Date.now() - 3000),
    },
    {
      id: 4,
      level: "warn" as const,
      message: "Rate limit approaching: 87% used",
      timestamp: new Date(Date.now() - 2000),
      meta: "API",
    },
    {
      id: 5,
      level: "error" as const,
      message: "Failed to fetch /api/users: 503 Service Unavailable",
      timestamp: new Date(Date.now() - 1000),
    },
    { id: 6, level: "info" as const, message: "Retrying request in 5 seconds…", timestamp: new Date() },
    { id: 7, level: "success" as const, message: "Request succeeded on retry", timestamp: new Date() },
  ];
  return (
    <Frame label="Log Viewer — terminal-style log list with filter">
      <LogViewer entries={entries} maxHeight={300} searchable showTimestamps showLevelBadge />
    </Frame>
  );
}

function CodeDiffDemo() {
  const before = `function greet(name) {
  console.log("Hello, " + name)
  return name
}

const user = "World"
greet(user)`;

  const after = `function greet(name: string): string {
  const msg = \`Hello, \${name}!\`
  console.log(msg)
  return msg
}

const user = "Kikito"
greet(user)`;

  return (
    <Frame label="Code Diff — unified diff with LCS algorithm">
      <CodeDiff
        before={before}
        after={after}
        filename="greet.ts"
        language="TypeScript"
        showLineNumbers
        maxHeight={320}
      />
    </Frame>
  );
}

function CollapsibleDemo() {
  return (
    <div className="w-96 flex flex-col gap-4">
      <Frame label="Single collapsible panel" align="start">
        <Collapsible title="What is Kikito CN?" defaultOpen className="w-full">
          A design-system component library published via <code>npx kikitocn add</code>.
        </Collapsible>
      </Frame>
      <Frame label="Disabled" align="start">
        <Collapsible title="Can't touch this" disabled className="w-full">
          This content is not reachable while disabled.
        </Collapsible>
      </Frame>
    </div>
  );
}

function GradientBorderDemo() {
  return (
    <Frame label="Gradient Border — spinning and static variants">
      <div className="flex flex-wrap gap-6 justify-center">
        <GradientBorder variant="spin" speed={3} borderRadius={12}>
          <div className="px-6 py-4 text-center">
            <p className="font-semibold text-foreground">Spin</p>
            <p className="text-body-caption text-muted">Conic gradient</p>
          </div>
        </GradientBorder>
        <GradientBorder
          variant="pulse"
          colors={["var(--ks-primary)", "var(--ks-kinpaku)", "var(--ks-violet)"]}
          speed={2}
        >
          <div className="px-6 py-4 text-center">
            <p className="font-semibold text-foreground">Pulse</p>
            <p className="text-body-caption text-muted">Token colors</p>
          </div>
        </GradientBorder>
        <GradientBorder variant="static" borderWidth={3}>
          <div className="px-6 py-4 text-center">
            <p className="font-semibold text-foreground">Static</p>
            <p className="text-body-caption text-muted">Linear gradient</p>
          </div>
        </GradientBorder>
      </div>
    </Frame>
  );
}

function GlassCardDemo() {
  return (
    <Frame label="Glass Card — frosted glass with backdrop blur">
      <div
        className="relative rounded-(--radius-lg) overflow-hidden flex items-center justify-center gap-4 p-8"
        style={{ background: "linear-gradient(135deg, var(--ks-primary), var(--ks-kinpaku), var(--ks-violet))" }}
      >
        <GlassCard className="px-6 py-5">
          <p className="font-semibold text-white text-body-callout">blur: 12px</p>
          <p className="text-white/70 text-body-caption">opacity: 0.1</p>
        </GlassCard>
        <GlassCard blur={24} opacity={0.2} className="px-6 py-5">
          <p className="font-semibold text-white text-body-callout">blur: 24px</p>
          <p className="text-white/70 text-body-caption">opacity: 0.2</p>
        </GlassCard>
      </div>
    </Frame>
  );
}

function MagneticButtonDemo() {
  return (
    <Frame label="Magnetic Button — button follows cursor within radius">
      <div className="flex flex-wrap gap-6 justify-center">
        <MagneticButton strength={0.4} radius={80}>
          Hover me
        </MagneticButton>
        <MagneticButton strength={0.7} radius={120}>
          Strong pull
        </MagneticButton>
        <MagneticButton strength={0.2} radius={60}>
          Gentle
        </MagneticButton>
      </div>
    </Frame>
  );
}

function ShortcutKeyDemo() {
  return (
    <Frame label="Shortcut Key — keyboard shortcut display">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <ShortcutKey keys={["cmd", "k"]} />
          <span className="text-body-callout text-muted">Open command palette</span>
        </div>
        <div className="flex items-center gap-3">
          <ShortcutKey keys={["ctrl", "shift", "s"]} size="lg" />
          <span className="text-body-callout text-muted">Save all files</span>
        </div>
        <div className="flex items-center gap-3">
          <ShortcutKey keys={["esc"]} size="sm" variant="filled" />
          <span className="text-body-callout text-muted">Close dialog</span>
        </div>
        <div className="flex items-center gap-3">
          <ShortcutKey keys={["alt", "left"]} />
          <span className="text-body-callout text-muted">Navigate back</span>
        </div>
      </div>
    </Frame>
  );
}

function KbdDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Sizes & variants">
        <Frame label="sm · md · lg — default / ghost / solid">
          <div className="flex flex-wrap items-center gap-4">
            <Kbd size="sm">A</Kbd>
            <Kbd>B</Kbd>
            <Kbd size="lg">C</Kbd>
            <Kbd variant="ghost">D</Kbd>
            <Kbd variant="solid">E</Kbd>
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="KbdSequence">
        <Frame label="Key combos, with symbol mapping" align="start">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <KbdSequence keys={["cmd", "k"]} symbols />
              <span className="text-body-callout text-muted">Open command palette</span>
            </div>
            <div className="flex items-center gap-3">
              <KbdSequence keys={["ctrl", "shift", "s"]} symbols size="lg" />
              <span className="text-body-callout text-muted">Save all files</span>
            </div>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ConfettiButtonDemo() {
  return (
    <Frame label="Confetti Button — canvas confetti burst on click">
      <div className="flex flex-wrap gap-4 justify-center">
        <ConfettiButton intent="primary" size="lg" particleCount={80}>
          🎉 Celebrate!
        </ConfettiButton>
        <ConfettiButton intent="success" spread={160}>
          ✅ Success
        </ConfettiButton>
        <ConfettiButton intent="warning" particleCount={40}>
          ⚡ Action
        </ConfettiButton>
      </div>
    </Frame>
  );
}

function BentoGridDemo() {
  const items = [
    {
      id: 1,
      colSpan: 2 as const,
      rowSpan: 2 as const,
      children: (
        <div className="h-full flex flex-col gap-2 p-5 bg-patina/8">
          <span className="text-3xl">🚀</span>
          <p className="font-semibold text-foreground">Featured Item</p>
          <p className="text-body-caption text-muted">This cell spans 2 columns and 2 rows</p>
        </div>
      ),
    },
    {
      id: 2,
      children: (
        <div className="h-full flex flex-col gap-1 p-4 bg-kinpaku/8">
          <span className="text-2xl">📊</span>
          <p className="font-medium text-foreground text-body-callout">Analytics</p>
        </div>
      ),
    },
    {
      id: 3,
      children: (
        <div className="h-full flex flex-col gap-1 p-4 bg-success/8">
          <span className="text-2xl">✅</span>
          <p className="font-medium text-foreground text-body-callout">Status</p>
        </div>
      ),
    },
    {
      id: 4,
      colSpan: 3 as const,
      children: (
        <div className="h-full flex items-center gap-3 p-4 bg-violet/8">
          <span className="text-2xl">🎨</span>
          <p className="font-medium text-foreground text-body-callout">Wide card — spans full row</p>
        </div>
      ),
    },
  ];
  return (
    <Frame label="Bento Grid — flexible CSS grid with col/row spans">
      <BentoGrid items={items} cols={3} gap={12} />
    </Frame>
  );
}

/* ── Batch 4 demos ── */

function RadarChartDemo() {
  const axes = [
    { label: "Speed", max: 100 },
    { label: "Strength", max: 100 },
    { label: "Stamina", max: 100 },
    { label: "Agility", max: 100 },
    { label: "Intellect", max: 100 },
    { label: "Charisma", max: 100 },
  ];
  const series = [
    { label: "Hero A", data: [80, 60, 70, 90, 50, 40], color: "var(--ks-primary)" },
    { label: "Hero B", data: [50, 85, 55, 45, 90, 75], color: "var(--ks-kinpaku)" },
  ];
  return (
    <Frame label="Radar Chart — multi-series spider chart">
      <div className="flex justify-center">
        <RadarChart axes={axes} series={series} size={280} levels={4} showLegend />
      </div>
    </Frame>
  );
}

function FunnelChartDemo() {
  const stages = [
    { label: "Visitors", value: 12000 },
    { label: "Sign-ups", value: 3600 },
    { label: "Activated", value: 1800 },
    { label: "Paid", value: 540 },
    { label: "Retained", value: 270 },
  ];
  return (
    <Frame label="Funnel Chart — conversion funnel with rates">
      <div className="w-full max-w-md mx-auto">
        <FunnelChart stages={stages} showValues showPercent showConversion />
      </div>
    </Frame>
  );
}

function StepFormDemo() {
  const steps = [
    {
      id: "account",
      title: "Account",
      description: "Set up your account credentials.",
      content: (
        <div className="flex flex-col gap-3">
          <input
            placeholder="Email address"
            className="px-3 py-2 rounded-(--radius-sm) border border-rule bg-canvas text-foreground text-body-callout outline-none focus:border-patina/60 placeholder:text-faint"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-3 py-2 rounded-(--radius-sm) border border-rule bg-canvas text-foreground text-body-callout outline-none focus:border-patina/60 placeholder:text-faint"
          />
        </div>
      ),
    },
    {
      id: "profile",
      title: "Profile",
      description: "Tell us a bit about yourself.",
      content: (
        <div className="flex flex-col gap-3">
          <input
            placeholder="Full name"
            className="px-3 py-2 rounded-(--radius-sm) border border-rule bg-canvas text-foreground text-body-callout outline-none focus:border-patina/60 placeholder:text-faint"
          />
          <textarea
            rows={3}
            placeholder="Short bio…"
            className="px-3 py-2 rounded-(--radius-sm) border border-rule bg-canvas text-foreground text-body-callout outline-none focus:border-patina/60 resize-none placeholder:text-faint"
          />
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Confirm",
      description: "Review and finalize your setup.",
      content: (
        <p className="text-body-callout text-muted">
          Everything looks good! Click <strong>Complete</strong> to finish.
        </p>
      ),
    },
  ];
  return (
    <Frame label="Step Form — multi-step with progress indicator">
      <div className="w-full max-w-lg mx-auto">
        <StepForm steps={steps} onComplete={() => {}} />
      </div>
    </Frame>
  );
}

function FeedbackWidgetDemo() {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      <Frame label="Stars">
        <FeedbackWidget type="stars" title="Rate your experience" />
      </Frame>
      <Frame label="NPS">
        <FeedbackWidget type="nps" title="How likely to recommend?" />
      </Frame>
      <Frame label="Emoji">
        <FeedbackWidget type="emoji" title="How do you feel?" />
      </Frame>
    </div>
  );
}

function InfiniteScrollDemo() {
  const [items, setItems] = useState(() => Array.from({ length: 8 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  function loadMore() {
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => {
        const next = [...prev, ...Array.from({ length: 8 }, (_, i) => prev.length + i + 1)];
        if (next.length >= 32) setHasMore(false);
        return next;
      });
      setLoading(false);
    }, 800);
  }

  return (
    <Frame label="Infinite Scroll — load more on sentinel intersection">
      <div className="w-full max-w-sm mx-auto h-64 overflow-auto border border-rule rounded-(--radius-md)">
        <InfiniteScroll
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoading={loading}
          endMessage={<span>All {items.length} items loaded</span>}
        >
          {items.map((n) => (
            <div key={n} className="px-4 py-3 border-b border-rule text-body-callout text-foreground">
              Item #{n}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </Frame>
  );
}

function MorphingTextDemo() {
  return (
    <Frame label="Morphing Text — cycling animated words">
      <div className="flex flex-col items-center gap-4">
        <p className="text-heading-05 font-bold text-foreground">
          We build{" "}
          <MorphingText
            words={["interfaces", "experiences", "products", "systems"]}
            interval={2000}
            className="text-patina"
          />
        </p>
        <p className="text-body-callout text-muted">
          Fast{" "}
          <MorphingText
            words={["delivery", "iteration", "feedback", "learning"]}
            interval={1500}
            className="text-kinpaku font-semibold"
          />{" "}
          cycles
        </p>
      </div>
    </Frame>
  );
}

function CurrencyInputDemo() {
  const [usd, setUsd] = useState(1299.99);
  const [eur, setEur] = useState(0);
  return (
    <Frame label="Currency Input — formatted display, raw edit on focus">
      <div className="flex flex-col gap-4 w-72">
        <CurrencyInput value={usd} onChange={setUsd} currency="USD" locale="en-US" min={0} />
        <CurrencyInput value={eur} onChange={setEur} currency="EUR" locale="de-DE" min={0} max={10000} />
        <p className="text-body-caption text-faint">
          USD: {usd} · EUR: {eur}
        </p>
      </div>
    </Frame>
  );
}

function PasswordInputDemo() {
  return (
    <Frame label="Password Input — reveal toggle, optional strength meter">
      <div className="flex flex-col gap-4 w-72">
        <PasswordInput placeholder="Enter password" />
        <PasswordInput placeholder="With strength meter" showStrength defaultValue="Str0ng!Pass" />
        <PasswordInput placeholder="Invalid" invalid errorMessage="Password is too short." />
      </div>
    </Frame>
  );
}

function SearchInputDemo() {
  return (
    <Frame label="Search Input — clear button, loading, shortcut hint">
      <div className="flex flex-col gap-4 w-72">
        <SearchInput placeholder="Search…" shortcut="⌘K" />
        <SearchInput placeholder="Searching…" loading defaultValue="kikito" />
      </div>
    </Frame>
  );
}

function NumberInputDemo() {
  const [qty, setQty] = useState(1);
  return (
    <Frame label="Number Input — stepper with min/max/step">
      <div className="flex flex-col gap-4 w-56">
        <NumberInput value={qty} onChange={setQty} min={0} max={10} step={1} />
        <NumberInput defaultValue={9.5} step={0.5} precision={1} allowDecimal prefix="$" />
      </div>
    </Frame>
  );
}

function PricingToggleDemo() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  return (
    <Frame label="Pricing Toggle — monthly/yearly with savings badge">
      <div className="flex flex-col items-center gap-6">
        <PricingToggle value={billing} onChange={setBilling} savingsLabel="Save 20%" />
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">${billing === "yearly" ? "15" : "19"}</p>
            <p className="text-body-caption text-muted">Pro / {billing === "yearly" ? "year" : "month"}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">${billing === "yearly" ? "39" : "49"}</p>
            <p className="text-body-caption text-muted">Team / {billing === "yearly" ? "year" : "month"}</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function SwipeCardDemo() {
  const initial = [
    {
      id: "1",
      children: (
        <div className="p-6 bg-raised rounded-(--radius-lg) border border-rule text-center w-72">
          <p className="font-semibold text-foreground">Design Tokens</p>
          <p className="text-body-caption text-faint mt-1">Color, spacing, typography</p>
          <p className="text-body-callout text-muted mt-2">Systematic design decisions captured as variables.</p>
        </div>
      ),
    },
    {
      id: "2",
      children: (
        <div className="p-6 bg-raised rounded-(--radius-lg) border border-rule text-center w-72">
          <p className="font-semibold text-foreground">Component API</p>
          <p className="text-body-caption text-faint mt-1">Props and variants</p>
          <p className="text-body-callout text-muted mt-2">Consistent, composable component interfaces.</p>
        </div>
      ),
    },
    {
      id: "3",
      children: (
        <div className="p-6 bg-raised rounded-(--radius-lg) border border-rule text-center w-72">
          <p className="font-semibold text-foreground">Accessibility</p>
          <p className="text-body-caption text-faint mt-1">ARIA and keyboard</p>
          <p className="text-body-callout text-muted mt-2">Built-in screen reader and keyboard support.</p>
        </div>
      ),
    },
    {
      id: "4",
      children: (
        <div className="p-6 bg-raised rounded-(--radius-lg) border border-rule text-center w-72">
          <p className="font-semibold text-foreground">Dark Mode</p>
          <p className="text-body-caption text-faint mt-1">CSS custom properties</p>
          <p className="text-body-callout text-muted mt-2">Automatic theme switching with token aliases.</p>
        </div>
      ),
    },
  ];
  const [stack, setStack] = useState(initial);

  return (
    <Frame label="Swipe Card — drag left/right to dismiss">
      <div className="flex flex-col items-center gap-12">
        <SwipeCard
          items={stack}
          onSwipeLeft={(id) => setStack((s) => s.filter((i) => i.id !== id))}
          onSwipeRight={(id) => setStack((s) => s.filter((i) => i.id !== id))}
        />
        <Button onClick={() => setStack(initial)} variant="ghost" size="xs">
          Reset stack
        </Button>
      </div>
    </Frame>
  );
}

function PinBoardDemo() {
  return (
    <Frame label="Pin Board — drag sticky notes freely">
      <div className="w-full">
        <PinBoard height={340} width="100%" />
      </div>
    </Frame>
  );
}

/* ── Batch 5 demos ── */

function TypewriterDemo() {
  return (
    <Frame label="Typewriter — type, pause, delete, loop">
      <div className="flex flex-col items-center gap-6">
        <p className="text-heading-05 font-bold text-foreground">
          We design{" "}
          <Typewriter
            texts={["interfaces.", "experiences.", "systems.", "products."]}
            speed={70}
            deleteSpeed={35}
            className="text-patina"
          />
        </p>
        <p className="text-body-paragraph text-muted">
          <Typewriter
            texts={["Fast.", "Reliable.", "Beautiful.", "Accessible."]}
            speed={80}
            pauseDuration={1200}
            cursorChar="_"
            className="text-kinpaku font-semibold"
          />
        </p>
      </div>
    </Frame>
  );
}

function AudioWaveformDemo() {
  const [playing, setPlaying] = useState(false);
  return (
    <Frame label="Audio Waveform — animated bars when playing">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-6 items-center">
          <AudioWaveform playing={playing} bars={20} color="var(--ks-primary)" height={48} />
          <AudioWaveform playing={playing} bars={12} color="var(--ks-kinpaku)" height={36} />
          <AudioWaveform playing={playing} bars={16} color="var(--ks-violet)" height={42} />
        </div>
        <Button onClick={() => setPlaying((p) => !p)} intent="primary" size="sm">
          {playing ? "⏸ Pause" : "▶ Play"}
        </Button>
      </div>
    </Frame>
  );
}

function TiltCardDemo() {
  return (
    <Frame label="Tilt Card — 3D mouse-tracked tilt with glare">
      <div className="flex flex-wrap gap-6 justify-center">
        <TiltCard maxTilt={12} glare>
          <div className="w-48 h-36 rounded-2xl bg-patina flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">🚀</span>
            <p className="font-semibold text-patina-fg text-body-callout">Hover me</p>
          </div>
        </TiltCard>
        <TiltCard maxTilt={18} scale={1.06} glare>
          <div className="w-48 h-36 rounded-2xl bg-gradient-to-br from-kinpaku to-violet flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">✨</span>
            <p className="font-semibold text-white text-body-callout">Gradient</p>
          </div>
        </TiltCard>
        <TiltCard maxTilt={8} glare={false}>
          <div className="w-48 h-36 rounded-2xl border border-rule bg-raised flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">🎯</span>
            <p className="font-semibold text-foreground text-body-callout">No glare</p>
          </div>
        </TiltCard>
      </div>
    </Frame>
  );
}

function OtpInputDemo() {
  const [val, setVal] = useState("");
  return (
    <Frame label="OTP Input — digit cells with paste and navigation">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col gap-4 items-center">
          <p className="text-body-caption font-semibold text-muted">Outline (default)</p>
          <OtpInput length={6} onChange={setVal} onComplete={(v) => console.log("OTP:", v)} />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <p className="text-body-caption font-semibold text-muted">Filled — large — masked</p>
          <OtpInput length={4} variant="filled" size="lg" mask />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <p className="text-body-caption font-semibold text-muted">Underline — small</p>
          <OtpInput length={6} variant="underline" size="sm" />
        </div>
        {val && <p className="text-body-caption text-faint">Value: {val}</p>}
      </div>
    </Frame>
  );
}

function PhoneInputDemo() {
  const [phone, setPhone] = useState("");
  return (
    <Frame label="Phone Input — country selector with dial code">
      <div className="w-full max-w-xs flex flex-col gap-4">
        <PhoneInput onChange={setPhone} defaultCountry="BR" />
        <PhoneInput onChange={setPhone} defaultCountry="US" size="sm" placeholder="(555) 000-0000" />
        {phone && <p className="text-body-caption text-faint">{phone}</p>}
      </div>
    </Frame>
  );
}

function CountdownTimerDemo() {
  const [done, setDone] = useState(false);
  return (
    <Frame label="Countdown Timer — target date or seconds">
      <div className="flex flex-col items-center gap-6">
        {!done ? (
          <CountdownTimer seconds={90} showDays={false} onComplete={() => setDone(true)} />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-danger font-bold text-lg">Time&apos;s up!</p>
            <Button onClick={() => setDone(false)} variant="ghost" size="xs">
              Reset
            </Button>
          </div>
        )}
        <CountdownTimer targetDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} showDays separator="·" />
      </div>
    </Frame>
  );
}

function ScrollSpyDemo() {
  const items = [
    { id: "intro", label: "Introduction", depth: 1 as const },
    { id: "install", label: "Installation", depth: 1 as const },
    { id: "config", label: "Configuration", depth: 1 as const },
    { id: "tokens", label: "Tokens", depth: 2 as const },
    { id: "usage", label: "Usage", depth: 1 as const },
  ];
  return (
    <Frame label="Scroll Spy — highlights active section on scroll">
      <div className="flex gap-6 w-full max-w-lg">
        <div className="w-44 shrink-0">
          <ScrollSpy items={items} />
        </div>
        <div className="flex-1 text-body-callout text-muted">
          <p>Scroll the page to see the active item update. Attach item IDs to heading elements in your content.</p>
        </div>
      </div>
    </Frame>
  );
}

function SidePanelDemo() {
  return (
    <Frame label="Side Panel — collapsible split layout">
      <div className="w-full h-64 rounded-(--radius-md) overflow-hidden border border-rule">
        <SidePanel
          panelWidth={180}
          panel={
            <div className="p-4 flex flex-col gap-2 h-full">
              <p className="text-body-caption font-semibold text-muted uppercase tracking-wide">Navigation</p>
              {["Overview", "Components", "Tokens", "Docs"].map((item) => (
                <button
                  key={item}
                  className="text-left text-body-callout text-foreground hover:text-patina transition-colors py-1 px-2 rounded-(--radius-sm) hover:bg-patina/8"
                >
                  {item}
                </button>
              ))}
            </div>
          }
        >
          <div className="p-6 h-full flex flex-col gap-3">
            <p className="text-body-callout font-semibold text-foreground">Main Content</p>
            <p className="text-body-callout text-muted">
              Click the toggle button on the panel edge to collapse/expand the side panel.
            </p>
          </div>
        </SidePanel>
      </div>
    </Frame>
  );
}

function StatDemo() {
  const UpIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="M13 13l6 6" />
    </svg>
  );
  const UsersIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  return (
    <Frame label="Stat — value card with trend, icon and intent">
      <div className="flex flex-wrap gap-4 justify-center">
        <Stat
          label="Monthly Revenue"
          value="$42,890"
          trend="up"
          trendValue="+12%"
          description="vs last month"
          intent="primary"
          icon={<UpIcon />}
        />
        <Stat
          label="Active Users"
          value="8,214"
          trend="up"
          trendValue="+4.3%"
          description="last 30 days"
          intent="success"
          icon={<UsersIcon />}
        />
        <Stat label="Churn Rate" value="2.1%" trend="down" trendValue="-0.4%" description="improved" intent="warning" />
        <Stat label="Loading…" value="—" loading intent="default" />
      </div>
    </Frame>
  );
}

function ToastDemoInner() {
  const { toast } = useToast();
  return (
    <Frame label="Toast — notification system with context provider">
      <div className="flex flex-wrap gap-3 justify-center">
        {(["info", "success", "warning", "danger", "neutral"] as const).map((intent) => (
          <Button
            key={intent}
            variant="outline"
            size="sm"
            onClick={() =>
              toast({
                intent,
                title: `${intent.charAt(0).toUpperCase() + intent.slice(1)}`,
                message: `This is a ${intent} toast notification.`,
              })
            }
            className="capitalize"
          >
            {intent}
          </Button>
        ))}
        <Button
          intent="primary"
          size="sm"
          onClick={() =>
            toast({
              intent: "success",
              variant: "solid",
              title: "Solid variant",
              message: "Same toast, solid background.",
            })
          }
        >
          Solid
        </Button>
      </div>
    </Frame>
  );
}

function ToastDemo() {
  return (
    <ToastProvider placement="bottom-right">
      <ToastDemoInner />
    </ToastProvider>
  );
}

/* ── Batch 6 demos ── */

function ScrollRevealDemo() {
  const [tick, setTick] = useState(0);
  return (
    <Frame label="Scroll Reveal — animações de fade/slide ao entrar na viewport">
      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-wrap gap-4 justify-center">
          {(["fade", "slide-up", "slide-left", "zoom"] as const).map((anim) => (
            <ScrollReveal key={`${tick}-${anim}`} animation={anim} duration={600} once={false}>
              <div className="w-32 h-20 rounded-(--radius-md) bg-raised border border-rule flex items-center justify-center text-body-caption text-muted font-medium capitalize">
                {anim}
              </div>
            </ScrollReveal>
          ))}
        </div>
        <Button variant="outline" intent="neutral" size="sm" onClick={() => setTick((t) => t + 1)}>
          Repetir animação
        </Button>
      </div>
    </Frame>
  );
}

function TextGradientDemo() {
  return (
    <Frame label="Text Gradient — gradient text with optional animation">
      <div className="flex flex-col items-center gap-4">
        <TextGradient
          from="var(--ks-primary)"
          to="var(--ks-kinpaku)"
          as="h2"
          className="text-heading-02 font-extrabold"
        >
          Kikito Design
        </TextGradient>
        <TextGradient from="#a78bfa" to="#38bdf8" direction="135deg" as="h3" className="text-heading-05 font-bold">
          Purple to Sky
        </TextGradient>
        <TextGradient
          from="var(--ks-primary)"
          via="var(--ks-violet)"
          to="var(--ks-kinpaku)"
          animate
          as="p"
          className="text-body-title font-semibold"
        >
          Animated gradient flow
        </TextGradient>
      </div>
    </Frame>
  );
}

function NumberPadDemo() {
  const [pin, setPin] = useState("");
  return (
    <Frame label="Number Pad — PIN input with masked dots">
      <div className="flex flex-col items-center gap-4">
        <NumberPad maxLength={4} onChange={setPin} onComplete={(v) => alert(`PIN: ${v}`)} />
        {pin && <p className="text-body-caption text-faint">Length: {pin.length}/4</p>}
      </div>
    </Frame>
  );
}

function SpotlightDemo() {
  return (
    <Frame label="Spotlight — mouse-tracked radial glow overlay">
      <Spotlight color="rgba(120,80,255,0.3)" size={320} className="w-full rounded-(--radius-lg) bg-[#0a0a0f] p-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-heading-05 font-bold text-white">Spotlight Effect</p>
          <p className="text-white/50 text-body-callout">Move your cursor over this area</p>
        </div>
      </Spotlight>
    </Frame>
  );
}

function GridPatternDemo() {
  return (
    <Frame label="Grid Pattern — SVG repeating background decoration">
      <div className="flex flex-wrap gap-4 justify-center">
        {(["dots", "grid", "cross", "lines"] as const).map((type) => (
          <GridPattern
            key={type}
            type={type}
            size={20}
            color="var(--ks-primary)"
            opacity={0.3}
            className="w-32 h-24 rounded-(--radius-md) border border-rule"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-body-caption font-semibold text-foreground bg-raised/80 px-2 py-0.5 rounded-(--radius-sm)">
                {type}
              </span>
            </div>
          </GridPattern>
        ))}
      </div>
    </Frame>
  );
}

function NewsletterFormDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <Frame label="Card variant">
        <NewsletterForm variant="card" onSubmit={async () => {}} />
      </Frame>
      <Frame label="Inline variant">
        <NewsletterForm variant="inline" title="Get updates" onSubmit={async () => {}} />
      </Frame>
    </div>
  );
}

function VideoCardDemo() {
  const cards = [
    {
      title: "Getting Started",
      description: "Set up your first project in minutes.",
      duration: "4:32",
      category: "Tutorial",
      views: 12400,
      poster: "https://picsum.photos/seed/vid1/640/360",
    },
    {
      title: "Advanced Patterns",
      description: "Deep dive into composition strategies.",
      duration: "18:07",
      category: "Advanced",
      views: 5890,
      poster: "https://picsum.photos/seed/vid2/640/360",
    },
  ];
  return (
    <Frame label="Video Card — thumbnail with play overlay and metadata">
      <div className="flex flex-wrap gap-4 justify-center">
        {cards.map((c) => (
          <VideoCard key={c.title} {...c} className="w-64" />
        ))}
      </div>
    </Frame>
  );
}

function CommandBarDemo() {
  const actions = [
    { id: "home", label: "Go to Home", icon: "🏠", shortcut: ["G", "H"], group: "Navigation", onSelect: () => {} },
    { id: "cn", label: "Open CN Library", icon: "🎨", shortcut: ["G", "C"], group: "Navigation", onSelect: () => {} },
    { id: "theme", label: "Toggle Dark Mode", icon: "🌙", shortcut: ["⌘", "\\"], group: "Actions", onSelect: () => {} },
    { id: "copy", label: "Copy Page URL", icon: "📋", shortcut: ["⌘", "K"], group: "Actions", onSelect: () => {} },
    { id: "logout", label: "Sign Out", icon: "👋", group: "Account", onSelect: () => {} },
  ];
  return (
    <Frame label="Command Bar — inline command search with groups and shortcuts">
      <div className="w-full max-w-sm mx-auto">
        <CommandBar actions={actions} placeholder="Search commands…" />
      </div>
    </Frame>
  );
}

function QuickActionsDemo() {
  const PlusIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
  const EditIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
  const ShareIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
  const TrashIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
  const actions = [
    { id: "new", icon: <PlusIcon />, label: "New item", intent: "primary" as const, onClick: () => {} },
    { id: "edit", icon: <EditIcon />, label: "Edit", intent: "neutral" as const, onClick: () => {} },
    { id: "share", icon: <ShareIcon />, label: "Share", intent: "success" as const, onClick: () => {} },
    { id: "del", icon: <TrashIcon />, label: "Delete", intent: "danger" as const, onClick: () => {} },
  ];
  return (
    <Frame label="Quick Actions — expandable FAB with animated action buttons">
      <div className="flex flex-wrap gap-12 justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <QuickActions actions={actions} placement="top" triggerIcon={<PlusIcon />} />
          <span className="text-body-caption text-faint mt-2">top</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <QuickActions actions={actions} placement="right" triggerIcon={<PlusIcon />} />
          <span className="text-body-caption text-faint mt-2">right</span>
        </div>
      </div>
    </Frame>
  );
}

function MiniMapDemo() {
  const sections = [
    { id: "mm-s1", label: "Introdução" },
    { id: "mm-s2", label: "Instalação" },
    { id: "mm-s3", label: "Configuração" },
    { id: "mm-s4", label: "Uso" },
    { id: "mm-s5", label: "API" },
  ];
  const [activeId, setActiveId] = useState("mm-s1");
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = (id: string) => {
    setActiveId(id);
    const el = containerRef.current?.querySelector(`#${id}`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <Frame label="Mini Map — navegação por seções com dots interativos">
      <div className="flex items-start gap-4">
        <MiniMap sections={sections} activeId={activeId} onNavigate={navigate} position="right" />
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto rounded-(--radius-md) border border-rule"
          style={{ height: 200 }}
          onScroll={(e) => {
            const container = e.currentTarget;
            const items = sections.map((s) => ({
              id: s.id,
              top: (container.querySelector(`#${s.id}`) as HTMLElement | null)?.offsetTop ?? 0,
            }));
            const scrollTop = container.scrollTop + 40;
            const active = [...items].reverse().find((s) => s.top <= scrollTop);
            if (active) setActiveId(active.id);
          }}
        >
          {sections.map((s) => (
            <div key={s.id} id={s.id} className="p-4 border-b border-rule last:border-0">
              <p className="text-body-callout font-semibold text-foreground">{s.label}</p>
              <p className="text-body-caption text-muted mt-0.5">Clique no dot para navegar até aqui.</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function ParticleFieldDemo() {
  return (
    <Frame label="Particle Field — canvas animation with floating connected particles">
      <div className="flex flex-col gap-4 w-full">
        <ParticleField count={50} color="120,80,255" speed={0.4} height={200} width="100%" />
        <ParticleField count={90} color="16,185,129" speed={0.8} size={1.5} height={200} width="100%" />
      </div>
    </Frame>
  );
}

function ThemeSelectorDemo() {
  const [theme, setTheme] = useState("ocean");
  const themes = [
    { id: "ocean", label: "Ocean", colors: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#0c4a6e"] },
    { id: "forest", label: "Forest", colors: ["#22c55e", "#4ade80", "#86efac", "#14532d"] },
    { id: "sunset", label: "Sunset", colors: ["#f97316", "#fb923c", "#fdba74", "#7c2d12"] },
    { id: "violet", label: "Violet", colors: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#2e1065"] },
  ];
  return (
    <Frame label="Theme Selector — color palette picker with active checkmark">
      <div className="flex flex-col gap-3 w-full max-w-lg">
        <ThemeSelector themes={themes} value={theme} onChange={setTheme} />
        <p className="text-body-callout text-muted">
          Selected: <code className="text-patina">{theme}</code>
        </p>
      </div>
    </Frame>
  );
}

function CreditCardDemo() {
  const [showBack, setShowBack] = useState(false);
  return (
    <Frame label="Credit Card — 3D flip card with front/back faces">
      <div className="flex flex-col items-center gap-4">
        <CreditCard
          number="4111111111111111"
          name="JANE DOE"
          expiry="12/28"
          cvv="•••"
          brand="visa"
          variant="dark"
          showBack={showBack}
        />
        <Button onClick={() => setShowBack((v) => !v)} variant="outline" intent="neutral" size="sm">
          {showBack ? "Show Front" : "Show Back"}
        </Button>
      </div>
    </Frame>
  );
}

function AvatarGroupDemo() {
  const avatars = [
    { name: "Alice Johnson" },
    { name: "Bob Smith" },
    { name: "Carol Davis" },
    { name: "Dan Wilson" },
    { name: "Eve Martinez" },
    { name: "Frank Lee" },
    { name: "Grace Kim" },
  ];
  return (
    <Frame label="Avatar Group — overlapping initials stack with overflow counter">
      <div className="flex flex-col items-center gap-6">
        <AvatarGroup avatars={avatars} max={4} size="lg" overlap="md" />
        <AvatarGroup avatars={avatars} max={5} size="md" overlap="sm" />
        <AvatarGroup avatars={avatars.slice(0, 3)} max={4} size="sm" overlap="sm" />
      </div>
    </Frame>
  );
}

function EmptyStateDemo() {
  const Icon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4M12 10v6m-3-3h6"
      />
    </svg>
  );
  return (
    <Frame label="Empty State — placeholder with icon, title, description and action">
      <EmptyState
        icon={<Icon />}
        title="No results found"
        description="Try adjusting your search filters or add new items to see them here."
        action={
          <Button intent="primary" size="sm">
            Add item
          </Button>
        }
      />
    </Frame>
  );
}

function TimelineDemo() {
  const items = [
    {
      title: "Order placed",
      timestamp: "10:00 AM",
      status: "complete" as const,
      description: "Your order #1042 has been confirmed.",
    },
    {
      title: "Processing",
      timestamp: "10:15 AM",
      status: "complete" as const,
      description: "Items picked and packed.",
    },
    {
      title: "Shipped",
      timestamp: "11:30 AM",
      status: "active" as const,
      description: "Package dispatched via courier.",
    },
    { title: "Out for delivery", timestamp: "Expected 3 PM", status: "pending" as const },
    { title: "Delivered", timestamp: "Expected 3–5 PM", status: "pending" as const },
  ];
  return (
    <Frame label="Timeline — vertical event list with status icons and connectors">
      <div className="w-full max-w-sm">
        <Timeline items={items} />
      </div>
    </Frame>
  );
}

function StepperDemo() {
  const ctrl = useStepper(4);
  const steps = [
    { label: "Account", description: "Your email & password" },
    { label: "Profile", description: "Name & avatar" },
    { label: "Plan", description: "Choose a tier" },
    { label: "Confirm", description: "Review & submit" },
  ];
  return (
    <Frame label="Stepper — horizontal step indicator with navigation">
      <div className="flex flex-col gap-6 w-full max-w-lg">
        <Stepper steps={steps} activeStep={ctrl.step} clickable />
        <div className="flex justify-between">
          <Button onClick={ctrl.prev} disabled={ctrl.isFirst} variant="outline" intent="neutral" size="sm">
            Back
          </Button>
          <Button onClick={ctrl.next} disabled={ctrl.isLast} intent="primary" size="sm">
            {ctrl.isLast ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </Frame>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(0);
  return (
    <Frame label="Pagination — navigator with ellipsis, range label and edge buttons">
      <div className="flex flex-col items-center gap-4">
        <Pagination page={page} totalPages={12} onChange={setPage} totalItems={240} pageSize={20} />
        <Pagination page={page} totalPages={12} onChange={setPage} size="sm" showEdges={false} />
      </div>
    </Frame>
  );
}

function MasonryDemo() {
  const items = [
    { h: 120, bg: "var(--ks-primary-soft)", label: "Card A" },
    { h: 180, bg: "var(--ks-violet-soft)", label: "Card B" },
    { h: 100, bg: "var(--ks-success-soft)", label: "Card C" },
    { h: 160, bg: "var(--ks-warning-soft)", label: "Card D" },
    { h: 140, bg: "var(--ks-danger-soft)", label: "Card E" },
    { h: 120, bg: "var(--ks-graphite)", label: "Card F" },
  ];
  return (
    <Frame label="Masonry — CSS column-based grid with variable height items">
      <div className="w-full max-w-lg">
        <Masonry columns={3} gap={12}>
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-[--radius] flex items-center justify-center text-body-caption font-semibold text-foreground"
              style={{ height: item.h, background: item.bg }}
            >
              {item.label}
            </div>
          ))}
        </Masonry>
      </div>
    </Frame>
  );
}

function RichTooltipDemo() {
  const InfoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
  return (
    <Frame label="Rich Tooltip — hover tooltip with icon, title, body and action">
      <div className="flex items-center gap-8">
        <RichTooltip
          icon={<InfoIcon />}
          title="Pro tip"
          content="Rich tooltips can contain formatted text, icons, and interactive actions."
          action={{ label: "Learn more →", onClick: () => {} }}
          placement="top"
        >
          <Button variant="outline" size="sm">
            Hover me (top)
          </Button>
        </RichTooltip>
        <RichTooltip content="A minimal tooltip with just body text and no header." placement="right">
          <Button variant="outline" size="sm">
            Hover me (right)
          </Button>
        </RichTooltip>
      </div>
    </Frame>
  );
}

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"right" | "left" | "bottom">("right");
  return (
    <Frame label="Drawer — slide-in panel from left/right/bottom sides">
      <div className="flex flex-wrap gap-2 justify-center">
        {(["right", "left", "bottom"] as const).map((s) => (
          <Button
            key={s}
            variant="outline"
            size="sm"
            onClick={() => {
              setSide(s);
              setOpen(true);
            }}
            className="capitalize"
          >
            Open {s}
          </Button>
        ))}
      </div>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side={side}
        title="Drawer Panel"
        description="This is a slide-in drawer component."
        footer={
          <>
            <Button variant="outline" intent="neutral" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button intent="primary" size="sm" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-body-callout text-muted leading-relaxed">
          Drawer content goes here. You can put any content inside — forms, settings panels, detail views, etc.
        </p>
      </Drawer>
    </Frame>
  );
}

function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<"danger" | "warning" | "primary">("danger");
  return (
    <Frame label="Alert Dialog — confirmation modal with intent variants">
      <div className="flex flex-wrap gap-2 justify-center">
        {(["danger", "warning", "primary"] as const).map((i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            onClick={() => {
              setIntent(i);
              setOpen(true);
            }}
            className="capitalize"
          >
            {i}
          </Button>
        ))}
      </div>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        intent={intent}
        title="Delete this item?"
        description="This action cannot be undone. The item will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => setOpen(false)}
      />
    </Frame>
  );
}

function ContextCardDemo() {
  return (
    <Frame label="Context Card — CSS-only hover popup with placement">
      <div className="flex items-center gap-12">
        <ContextCard
          placement="top"
          trigger={
            // <button> em vez de <span>: precisa ser focavel nativamente pra :focus-within
            // revelar o popup no teclado (ver JSDoc do componente) — tabIndex num elemento
            // nao-interativo seria um erro de a11y (jsx-a11y/no-noninteractive-tabindex)
            <button
              type="button"
              className="bg-transparent border-none p-0 text-body-callout font-semibold text-patina underline decoration-dashed cursor-help"
            >
              Hover me
            </button>
          }
        >
          <div className="p-4">
            <p className="text-body-callout font-semibold text-foreground mb-1">Context Card</p>
            <p className="text-body-callout text-muted">Rich popup with any custom content.</p>
          </div>
        </ContextCard>
        <ContextCard
          placement="right"
          trigger={
            <button
              type="button"
              className="bg-transparent border-none p-0 text-body-callout font-semibold text-kinpaku underline decoration-dashed cursor-help"
            >
              Right side
            </button>
          }
        >
          <div className="p-4">
            <p className="text-body-callout text-muted">Opens to the right of the trigger element.</p>
          </div>
        </ContextCard>
      </div>
    </Frame>
  );
}

function ActivityFeedDemo() {
  const items = [
    {
      id: "1",
      title: "Alice commented on your post",
      time: "2m ago",
      intent: "primary" as const,
      avatarFallback: "Alice Johnson",
    },
    { id: "2", title: "Build #142 passed successfully", time: "15m ago", intent: "success" as const },
    { id: "3", title: "Payment of $249 received", time: "1h ago", intent: "info" as const },
    { id: "4", title: "Disk usage exceeded 90%", time: "3h ago", intent: "warning" as const },
    {
      id: "5",
      title: "Bob left the workspace",
      time: "5h ago",
      intent: "neutral" as const,
      avatarFallback: "Bob Smith",
    },
  ];
  return (
    <Frame label="Activity Feed — chronological list with intents and timestamps">
      <div className="w-full max-w-sm">
        <ActivityFeed items={items} />
      </div>
    </Frame>
  );
}

function UserCardDemo() {
  return (
    <Frame label="User Card — profile card with cover, bio, stats and follow">
      <div className="flex flex-wrap gap-4 justify-center">
        <UserCard
          name="Jane Doe"
          username="janedoe"
          bio="Product designer & coffee enthusiast. Building things at Acme Corp."
          stats={[
            { label: "Posts", value: "142" },
            { label: "Followers", value: "3.4K" },
            { label: "Following", value: "218" },
          ]}
          badge="Pro"
          onFollow={() => {}}
        />
        <UserCard
          name="Alex Kim"
          coverColor="linear-gradient(135deg,#667eea,#764ba2)"
          stats={[
            { label: "Repos", value: "48" },
            { label: "Stars", value: "1.2K" },
          ]}
        />
      </div>
    </Frame>
  );
}

function StatusPageDemo() {
  const groups = [
    {
      group: "Core Services",
      services: [
        { name: "API Gateway", status: "operational" as const },
        { name: "Auth Service", status: "operational" as const, description: "v2.1.4" },
        { name: "Database", status: "degraded" as const, description: "Elevated latency" },
      ],
    },
    {
      group: "Infrastructure",
      services: [
        { name: "CDN", status: "operational" as const },
        { name: "Email Delivery", status: "maintenance" as const, description: "Scheduled until 4 PM" },
      ],
    },
  ];
  return (
    <Frame label="Status Page — service health grid with grouped sections">
      <div className="w-full max-w-xl">
        <StatusPage groups={groups} overallStatus="degraded" lastUpdated={new Date()} />
      </div>
    </Frame>
  );
}

function StatusBadgeDemo() {
  const statuses = ["online", "offline", "busy", "away", "idle"] as const;
  return (
    <Frame label="Status Badge — colored presence dot with optional pulse and label">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6">
          {statuses.map((s) => (
            <StatusBadge key={s} status={s} showLabel size="md" />
          ))}
        </div>
        <div className="flex items-center gap-6">
          <StatusBadge status="online" showLabel pulse size="lg" />
          <StatusBadge status="busy" showLabel size="lg" />
          <StatusBadge status="away" showLabel size="sm" />
        </div>
      </div>
    </Frame>
  );
}

function TagDemo() {
  return (
    <Frame label="Tag — intent colors, appearance variants, removable">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag intent="primary">Primary</Tag>
          <Tag intent="success">Success</Tag>
          <Tag intent="warning">Warning</Tag>
          <Tag intent="danger">Danger</Tag>
          <Tag intent="info">Info</Tag>
          <Tag intent="neutral">Neutral</Tag>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tag intent="primary" appearance="solid">
            Solid
          </Tag>
          <Tag intent="primary" appearance="outline">
            Outline
          </Tag>
          <Tag intent="primary" appearance="soft">
            Soft
          </Tag>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tag intent="info" removable onRemove={() => {}}>
            Removable
          </Tag>
          <Tag intent="success" onClick={() => {}}>
            Clickable
          </Tag>
        </div>
      </div>
    </Frame>
  );
}

function TagInputDemo() {
  const [tags, setTags] = useState(["design", "react"]);
  return (
    <div className="flex flex-col gap-4">
      <Frame label="Type + Enter/comma to add, Backspace to remove last">
        <div className="w-80">
          <TagInput value={tags} onChange={setTags} placeholder="Add tag…" />
        </div>
      </Frame>
      <Frame label="Max 3 tags + disabled">
        <div className="flex flex-col gap-4 w-80">
          <TagInput defaultValue={["one", "two"]} max={3} placeholder="Add tag (max 3)…" />
          <TagInput defaultValue={["locked"]} disabled placeholder="Disabled tag input" />
        </div>
      </Frame>
    </div>
  );
}

function InlineEditDemo() {
  const [title, setTitle] = useState("Project Alpha");
  const [note, setNote] = useState("Click to add a longer description here…");
  return (
    <div className="flex flex-col gap-4 items-start">
      <Frame label="Single line — click to edit, Enter confirms, Esc cancels">
        <InlineEdit value={title} onConfirm={setTitle} />
      </Frame>
      <Frame label="Multiline — Cmd/Ctrl+Enter confirms">
        <InlineEdit value={note} onConfirm={setNote} multiline />
      </Frame>
      <Frame label="Empty (placeholder) + disabled">
        <div className="flex flex-col gap-2">
          <InlineEdit value="" onConfirm={() => {}} placeholder="Add a name…" />
          <InlineEdit value="Locked value" onConfirm={() => {}} disabled />
        </div>
      </Frame>
    </div>
  );
}

function SplitButtonDemo() {
  const options = [
    { label: "Duplicate", onClick: () => {} },
    { label: "Export", onClick: () => {} },
    { label: "Archive", onClick: () => {}, disabled: true },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Frame label="Intents">
        <div className="flex flex-wrap gap-4">
          <SplitButton label="Save" onClick={() => {}} options={options} intent="primary" />
          <SplitButton label="Save" onClick={() => {}} options={options} intent="secondary" />
          <SplitButton label="Save" onClick={() => {}} options={options} intent="success" />
          <SplitButton label="Delete" onClick={() => {}} options={options} intent="danger" />
          <SplitButton label="More" onClick={() => {}} options={options} intent="neutral" />
        </div>
      </Frame>
      <Frame label="Sizes + disabled">
        <div className="flex flex-wrap items-center gap-4">
          <SplitButton label="Small" onClick={() => {}} options={options} size="sm" />
          <SplitButton label="Large" onClick={() => {}} options={options} size="lg" />
          <SplitButton label="Disabled" onClick={() => {}} options={options} disabled />
        </div>
      </Frame>
    </div>
  );
}

function PingDemo() {
  return (
    <Frame label="Ping — animated status dot with intent colors">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6">
          <Ping intent="primary" />
          <Ping intent="success" />
          <Ping intent="warning" />
          <Ping intent="danger" />
          <Ping intent="info" />
          <Ping intent="neutral" animate={false} />
        </div>
        <div className="flex items-center gap-6">
          <Ping intent="success" size="lg">
            <div className="w-10 h-10 rounded-(--radius-md) bg-raised border border-rule" />
          </Ping>
          <Ping intent="danger" size="sm">
            <div className="w-10 h-10 rounded-(--radius-md) bg-raised border border-rule" />
          </Ping>
        </div>
      </div>
    </Frame>
  );
}

function RatingDemo() {
  const [val, setVal] = useState(3.5);
  const [hearts, setHearts] = useState(4);
  return (
    <Frame label="Rating — star rating with half-star, custom icons, label, showValue">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Rating label="Sua avaliação" value={val} onChange={setVal} size="lg" allowHalf showValue />
          <p className="text-body-callout text-muted">
            Value: <code className="text-patina">{val}</code>
          </p>
        </div>
        <Rating
          label="Nível de amor"
          value={hearts}
          onChange={setHearts}
          icon="♥"
          emptyIcon="♡"
          max={6}
          size="lg"
          showValue
        />
        <div className="flex items-center gap-6">
          <Rating value={4} readOnly size="sm" />
          <Rating value={3} readOnly size="md" />
          <Rating value={5} readOnly size="lg" />
        </div>
        <div className="flex items-center gap-6">
          <Rating value={2} readOnly size="sm" icon="★" emptyIcon="☆" />
          <Rating value={3} readOnly size="md" icon="★" emptyIcon="☆" />
        </div>
      </div>
    </Frame>
  );
}

function ScrollAreaDemo() {
  return (
    <Frame label="Scroll Area — thin custom scrollbar with webkit/firefox styling">
      <div className="flex gap-6">
        <div className="w-48 border border-rule rounded-[--radius]">
          <ScrollArea maxHeight={200}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="px-4 py-2 text-body-callout text-muted border-b border-rule last:border-0">
                Item {i + 1}
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="border border-rule rounded-[--radius]">
          <ScrollArea orientation="horizontal" maxWidth={240}>
            <div className="flex gap-3 p-4" style={{ width: 640 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-[--radius] bg-graphite shrink-0 flex items-center justify-center text-body-caption font-semibold text-muted"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Frame>
  );
}

function VirtualListDemo() {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    label: `Row ${i + 1}`,
    desc: `Description for row ${i + 1}`,
  }));
  return (
    <Frame label="Virtual List — windowed renderer for 1000+ rows">
      <div className="w-full max-w-xs border border-rule rounded-[--radius] overflow-hidden">
        <VirtualList
          items={items}
          itemHeight={56}
          height={280}
          renderItem={(item) => (
            <div className="flex flex-col justify-center px-4 py-2 border-b border-rule h-full">
              <span className="text-body-callout font-semibold text-foreground">{item.label}</span>
              <span className="text-body-caption text-faint">{item.desc}</span>
            </div>
          )}
        />
      </div>
    </Frame>
  );
}

/* ── Batch 9 demos ── */

function BannerDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      {(["info", "success", "warning", "danger", "neutral"] as const).map((intent) => (
        <Banner key={intent} intent={intent} dismissible>
          {intent.charAt(0).toUpperCase() + intent.slice(1)} banner message — something important to note.
        </Banner>
      ))}
      <Banner
        intent="info"
        icon={<span>🚀</span>}
        action={
          <Button variant="link" size="xs" className="ml-auto shrink-0">
            Learn more
          </Button>
        }
      >
        Banner with custom icon and action button.
      </Banner>
    </div>
  );
}

function CalloutDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <div className="flex flex-col gap-3">
        <p className="text-body-caption font-semibold text-faint uppercase tracking-[0.08em]">Soft (default)</p>
        {(["info", "success", "warning", "danger"] as const).map((intent) => (
          <Callout
            key={intent}
            intent={intent}
            title={intent.charAt(0).toUpperCase() + intent.slice(1)}
            appearance="soft"
          >
            This is a {intent} callout with soft appearance.
          </Callout>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-body-caption font-semibold text-faint uppercase tracking-[0.08em]">Outline</p>
        <Callout intent="warning" title="Heads up" appearance="outline">
          Review your changes before submitting. This action may affect other users.
        </Callout>
        <Callout intent="danger" title="Action required" appearance="solid">
          Your subscription expires in 3 days. Upgrade to keep access.
        </Callout>
      </div>
    </div>
  );
}

function ChecklistDemo() {
  const initial = [
    { id: "1", label: "Design tokens defined", checked: true, description: "Colors, spacing, typography" },
    { id: "2", label: "Component library setup", checked: true, description: "Tailwind v4 + CSS vars" },
    { id: "3", label: "Dark mode configured", checked: false, description: ".dark class on html element" },
    { id: "4", label: "Accessibility audit", checked: false, description: "ARIA + keyboard navigation" },
    { id: "5", label: "Performance review", checked: false },
  ];
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Frame label="Default — progress + strikethrough">
        <Checklist items={initial} showProgress strikethrough />
      </Frame>
      <Frame label="Success intent">
        <Checklist items={initial.slice(0, 3)} showProgress intent="success" />
      </Frame>
    </div>
  );
}

function BreadcrumbDemo() {
  const items = [
    { label: "Home", href: "#" },
    { label: "Library", href: "#" },
    { label: "Components", href: "#" },
    { label: "Breadcrumb" },
  ];
  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <Frame label="Default (md)">
        <Breadcrumb items={items} />
      </Frame>
      <Frame label="Collapsed (maxItems=3)">
        <Breadcrumb items={items} maxItems={3} />
      </Frame>
      <Frame label="Small + custom separator">
        <Breadcrumb items={items} size="sm" separator={<span className="text-faint">/</span>} />
      </Frame>
    </div>
  );
}

function CopyButtonDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <Frame label="Variants">
        <div className="flex flex-wrap gap-4 justify-center">
          <CopyButton text="Copy this!" label="Copy" variant="outline" />
          <CopyButton text="npm install kikito-cn" label="npm install" variant="ghost" />
          <CopyButton text="Solid button" label="Copy code" variant="solid" />
        </div>
      </Frame>
      <Frame label="Sizes">
        <div className="flex items-center gap-4 justify-center">
          <CopyButton text="sm" size="sm" />
          <CopyButton text="md (default)" size="md" />
          <CopyButton text="lg" size="lg" />
        </div>
      </Frame>
    </div>
  );
}

function GaugeDemo() {
  return (
    <Frame label="Sizes + intents">
      <div className="flex flex-wrap gap-8 justify-center items-end">
        <Gauge value={72} intent="primary" size="lg" label="CPU" showValue />
        <Gauge value={45} intent="success" size="md" label="Memory" showValue />
        <Gauge value={88} intent="warning" size="md" label="Disk" showValue />
        <Gauge value={23} intent="danger" size="sm" label="Net" showValue />
        <Gauge value={60} intent="default" size="sm" label="I/O" showValue />
      </div>
    </Frame>
  );
}

function SkillBarDemo() {
  const skills = [
    { label: "TypeScript", value: 92, intent: "primary" as const, sublabel: "Expert" },
    { label: "React", value: 88, intent: "success" as const, sublabel: "Expert" },
    { label: "CSS", value: 80, intent: "secondary" as const },
    { label: "Node.js", value: 70, intent: "primary" as const },
    { label: "Python", value: 55, intent: "warning" as const, sublabel: "Intermediate" },
    { label: "Rust", value: 30, intent: "danger" as const, sublabel: "Learning" },
  ];
  return (
    <Frame label="Skills with animated entry + values">
      <div className="w-full max-w-md">
        <SkillBar skills={skills} animate showValues />
      </div>
    </Frame>
  );
}

function TableOfContentsDemo() {
  const [active, setActive] = useState("intro");
  const items = [
    { id: "intro", label: "Introduction", level: 1 as const },
    { id: "install", label: "Installation", level: 1 as const },
    { id: "config", label: "Configuration", level: 1 as const },
    { id: "tokens", label: "Design Tokens", level: 2 as const },
    { id: "colors", label: "Colors", level: 3 as const },
    { id: "typography", label: "Typography", level: 3 as const },
    { id: "usage", label: "Usage", level: 1 as const },
    { id: "api", label: "API Reference", level: 1 as const },
  ];
  return (
    <Frame label="TOC with active tracking (click to select)">
      <div className="flex gap-6 w-full max-w-lg">
        <div className="w-56 shrink-0">
          <TableOfContents items={items} title="On this page" activeId={active} onItemClick={setActive} />
        </div>
        <div className="flex-1 text-body-callout text-muted leading-relaxed">
          Click an item in the TOC to set it as active. In real use, IntersectionObserver drives the active ID as you
          scroll.
        </div>
      </div>
    </Frame>
  );
}

function WordCounterDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <Frame label="Uncontrolled — word + char limit">
        <WordCounter
          label="Project description"
          placeholder="Describe your project…"
          maxWords={50}
          maxChars={300}
          showSentences
          showReadTime
          rows={4}
          className="w-full"
        />
      </Frame>
      <Frame label="No limit — sentence and read-time only">
        <WordCounter
          label="Notes"
          placeholder="Write your notes…"
          showSentences
          showReadTime
          rows={3}
          className="w-full"
        />
      </Frame>
    </div>
  );
}

function AnimatedListDemo() {
  const directions = ["up", "down", "left", "right", "fade"] as const;
  const [dir, setDir] = useState<(typeof directions)[number]>("up");
  const [key, setKey] = useState(0);

  return (
    <Frame label="Staggered list entry — pick a direction">
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div className="flex gap-2 flex-wrap justify-center">
          {directions.map((d) => (
            <Button
              key={d}
              onClick={() => {
                setDir(d);
                setKey((k) => k + 1);
              }}
              variant={d === dir ? "solid" : "outline"}
              intent={d === dir ? "primary" : "neutral"}
              size="xs"
            >
              {d}
            </Button>
          ))}
        </div>
        <AnimatedList key={key} direction={dir} staggerMs={80} animationMs={320}>
          {["Design System", "Token Bridge", "Dark Mode", "Accessibility", "SSG Routes"].map((item) => (
            <div
              key={item}
              className="px-4 py-2.5 rounded-(--radius-sm) bg-raised border border-rule text-body-callout text-foreground"
            >
              {item}
            </div>
          ))}
        </AnimatedList>
      </div>
    </Frame>
  );
}

function LabelDemo() {
  return (
    <Frame label="Label — Tier 0 Primitive">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Label>Default Label</Label>
        <Label required>Required Field</Label>
        <Label optional>Optional Field</Label>
        <Label size="sm">Small Label</Label>
        <Label size="lg">Large Label</Label>
        <Label hint="This field accepts your full legal name.">With Hint</Label>
        <Label disabled>Disabled Label</Label>
      </div>
    </Frame>
  );
}

function InputDemo() {
  const [val, setVal] = React.useState("");
  const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Outline (default)" align="start">
          <div className="w-full max-w-sm">
            <Input label="Outline" placeholder="Type something…" variant="outline" />
          </div>
        </Frame>
        <Frame label="Filled" align="start">
          <div className="w-full max-w-sm">
            <Input label="Filled" placeholder="Type something…" variant="filled" />
          </div>
        </Frame>
        <Frame label="Flushed (ghost)" align="start">
          <div className="w-full max-w-sm">
            <Input label="Flushed" placeholder="Type something…" variant="flushed" />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes">
        <Frame label="SM · MD · LG" align="start">
          <div className="w-full max-w-sm flex flex-col gap-4">
            <Input label="Small" size="sm" placeholder="Small input" />
            <Input label="Medium" size="md" placeholder="Medium input" />
            <Input label="Large" size="lg" placeholder="Large input" />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Status States">
        <Frame label="Error" align="start">
          <div className="w-full max-w-sm">
            <Input label="Email" status="error" error="This field is required." defaultValue="bad value" />
          </div>
        </Frame>
        <Frame label="Success" align="start">
          <div className="w-full max-w-sm">
            <Input label="Email" status="success" hint="Looks good!" defaultValue="valid@email.com" />
          </div>
        </Frame>
        <Frame label="Warning" align="start">
          <div className="w-full max-w-sm">
            <Input label="Password" status="warning" hint="Password strength: weak." />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Icons">
        <Frame label="Icon left" align="start">
          <div className="w-full max-w-sm">
            <Input label="Search" iconLeft={<SearchIcon />} placeholder="Search…" />
          </div>
        </Frame>
        <Frame label="Icon right" align="start">
          <div className="w-full max-w-sm">
            <Input label="Password" iconRight={<EyeIcon />} type="password" placeholder="••••••••" />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Prefix / Suffix">
        <Frame label="Prefix" align="start">
          <div className="w-full max-w-sm">
            <Input label="URL" prefix="https://" placeholder="example.com" />
          </div>
        </Frame>
        <Frame label="Suffix" align="start">
          <div className="w-full max-w-sm">
            <Input label="Domain" suffix=".com" placeholder="mysite" />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Character Count">
        <Frame label="Max 50 chars" align="start">
          <div className="w-full max-w-sm">
            <Input
              label="Bio"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              maxLength={50}
              placeholder="Max 50 chars"
              hint={`${val.length} / 50`}
            />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="States">
        <Frame label="Disabled" align="start">
          <div className="w-full max-w-sm">
            <Input label="Read-only field" disabled defaultValue="Cannot edit this" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function BadgeDemo() {
  const [dismissed, setDismissed] = React.useState<string[]>([]);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Solid (default)">
          <div className="flex flex-wrap gap-2">
            {(["primary", "secondary", "danger", "success", "warning", "info", "neutral"] as const).map((i) => (
              <Badge key={i} variant="solid" intent={i}>
                {i}
              </Badge>
            ))}
          </div>
        </Frame>
        <Frame label="Outline">
          <div className="flex flex-wrap gap-2">
            {(["primary", "secondary", "danger", "success", "warning", "info", "neutral"] as const).map((i) => (
              <Badge key={i} variant="outline" intent={i}>
                {i}
              </Badge>
            ))}
          </div>
        </Frame>
        <Frame label="Soft">
          <div className="flex flex-wrap gap-2">
            {(["primary", "secondary", "danger", "success", "warning", "info", "neutral"] as const).map((i) => (
              <Badge key={i} variant="soft" intent={i}>
                {i}
              </Badge>
            ))}
          </div>
        </Frame>
        <Frame label="Dot">
          <div className="flex flex-wrap gap-2">
            {(["primary", "secondary", "danger", "success", "warning", "info", "neutral"] as const).map((i) => (
              <Badge key={i} variant="dot" intent={i}>
                {i}
              </Badge>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes">
        <Frame label="SM · MD · LG">
          <div className="flex flex-wrap items-center gap-3">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Rounded">
        <Frame label="Radius options">
          <div className="flex flex-wrap items-center gap-2">
            <Badge rounded="none">None</Badge>
            <Badge rounded="sm">SM</Badge>
            <Badge rounded="md">MD</Badge>
            <Badge rounded="lg">LG</Badge>
            <Badge rounded="full">Full</Badge>
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Dismissible">
        <Frame label="Click × to dismiss">
          <div className="flex flex-wrap gap-2 items-center">
            {(["primary", "secondary", "danger", "success", "warning", "info"] as const).map((i) =>
              dismissed.includes(i) ? null : (
                <Badge key={i} intent={i} onDismiss={() => setDismissed((p) => [...p, i])}>
                  {i}
                </Badge>
              )
            )}
            {dismissed.length > 0 && (
              <Button variant="link" size="xs" intent="neutral" onClick={() => setDismissed([])}>
                Reset
              </Button>
            )}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ButtonDemo() {
  const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
  const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
  const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Solid (default)">
          <div className="flex flex-wrap gap-3">
            <Button variant="solid">Solid</Button>
            <Button variant="solid" intent="secondary">
              Secondary
            </Button>
            <Button variant="solid" intent="danger">
              Danger
            </Button>
          </div>
        </Frame>
        <Frame label="Outline">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Outline</Button>
            <Button variant="outline" intent="secondary">
              Secondary
            </Button>
            <Button variant="outline" intent="danger">
              Danger
            </Button>
          </div>
        </Frame>
        <Frame label="Ghost">
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost">Ghost</Button>
            <Button variant="ghost" intent="secondary">
              Secondary
            </Button>
            <Button variant="ghost" intent="danger">
              Danger
            </Button>
          </div>
        </Frame>
        <Frame label="Soft">
          <div className="flex flex-wrap gap-3">
            <Button variant="soft">Soft</Button>
            <Button variant="soft" intent="secondary">
              Secondary
            </Button>
            <Button variant="soft" intent="success">
              Success
            </Button>
          </div>
        </Frame>
        <Frame label="Dashed">
          <div className="flex flex-wrap gap-3">
            <Button variant="dashed">Dashed</Button>
            <Button variant="dashed" intent="warning">
              Warning
            </Button>
            <Button variant="dashed" intent="info">
              Info
            </Button>
          </div>
        </Frame>
        <Frame label="Link">
          <div className="flex flex-wrap gap-3">
            <Button variant="link">Link</Button>
            <Button variant="link" intent="danger">
              Danger link
            </Button>
            <Button variant="link" intent="neutral">
              Neutral link
            </Button>
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes">
        <Frame label="XS → XL (solid)">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
          </div>
        </Frame>
        <Frame label="Icon-only sizes">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs" iconOnly iconLeft={<PlusIcon />} />
            <Button size="sm" iconOnly iconLeft={<PlusIcon />} />
            <Button size="md" iconOnly iconLeft={<PlusIcon />} />
            <Button size="lg" iconOnly iconLeft={<PlusIcon />} />
            <Button size="xl" iconOnly iconLeft={<PlusIcon />} />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Intents">
        <Frame label="All intents — solid">
          <div className="flex flex-wrap gap-3">
            <Button intent="primary">Primary</Button>
            <Button intent="secondary">Secondary</Button>
            <Button intent="danger">Danger</Button>
            <Button intent="success">Success</Button>
            <Button intent="warning">Warning</Button>
            <Button intent="info">Info</Button>
            <Button intent="neutral" variant="outline">
              Neutral
            </Button>
          </div>
        </Frame>
        <Frame label="All intents — outline">
          <div className="flex flex-wrap gap-3">
            {(["primary", "secondary", "danger", "success", "warning", "info", "neutral"] as const).map((i) => (
              <Button key={i} intent={i} variant="outline" className="capitalize">
                {i}
              </Button>
            ))}
          </div>
        </Frame>
        <Frame label="All intents — soft">
          <div className="flex flex-wrap gap-3">
            {(["primary", "secondary", "danger", "success", "warning", "info"] as const).map((i) => (
              <Button key={i} intent={i} variant="soft" className="capitalize">
                {i}
              </Button>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Icons">
        <Frame label="Icon left">
          <div className="flex flex-wrap gap-3">
            <Button iconLeft={<PlusIcon />}>Add Item</Button>
            <Button iconLeft={<SearchIcon />} variant="outline">
              Search
            </Button>
          </div>
        </Frame>
        <Frame label="Icon right">
          <div className="flex flex-wrap gap-3">
            <Button iconRight={<XIcon />} variant="outline" intent="danger">
              Delete
            </Button>
            <Button iconRight={<SearchIcon />} intent="secondary">
              Find
            </Button>
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Rounded">
        <Frame label="Radius progression — none → full">
          <div className="flex flex-wrap items-end gap-6">
            {(
              [
                { key: "none", label: "None", px: "0px" },
                { key: "sm", label: "SM", px: "6px" },
                { key: "md", label: "MD", px: "8px" },
                { key: "lg", label: "LG", px: "14px" },
                { key: "xl", label: "XL", px: "20px" },
                { key: "full", label: "Full", px: "9999px" },
              ] as const
            ).map(({ key, label, px }) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <Button size="lg" rounded={key} className="w-28">
                  {label}
                </Button>
                <span className="text-body-caption text-faint font-mono">{px}</span>
              </div>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Loading States">
        <Frame label="Loading — spinner beside text (default, keeps label)">
          <div className="flex flex-wrap gap-3">
            <Button loading>Salvando…</Button>
            <Button loading variant="outline">
              Saving
            </Button>
            <Button loading loadingText="Enviando…" intent="secondary">
              Upload
            </Button>
          </div>
        </Frame>
        <Frame label="Loading — replace mode (spinner only, preserves width)">
          <div className="flex flex-wrap gap-3">
            <Button loading loadingPosition="replace">
              Salvar
            </Button>
            <Button loading loadingPosition="replace" variant="outline" intent="secondary">
              Enviar
            </Button>
          </div>
        </Frame>
        <Frame label="Success / Error — animated check & X (auto from async onClick)">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => new Promise((r) => setTimeout(r, 1400))} successText="Salvo!">
              Save (auto success)
            </Button>
            <Button intent="danger" onClick={() => new Promise((_, rej) => setTimeout(rej, 1400))} errorText="Falhou!">
              Delete (auto error)
            </Button>
            <Button
              variant="soft"
              intent="secondary"
              onClick={() => new Promise((r) => setTimeout(r, 1400))}
              successText="Pronto"
            >
              Baixar
            </Button>
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="States">
        <Frame label="Disabled">
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled solid</Button>
            <Button disabled variant="outline">
              Disabled outline
            </Button>
            <Button disabled variant="ghost">
              Disabled ghost
            </Button>
          </div>
        </Frame>
        <Frame label="Full width">
          <div className="w-full max-w-xs">
            <Button fullWidth>Full Width Button</Button>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

/* ── New component demos ── */

function RatingInputDemo() {
  const [val, setVal] = useState(0);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Default stars (controlled)">
          <div className="flex flex-col items-center gap-2">
            <RatingInput value={val} onChange={setVal} showValue />
            <p className="text-body-caption text-faint">Value: {val}</p>
          </div>
        </Frame>
        <Frame label="Read-only">
          <RatingInput value={3.5} readOnly showValue />
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="SM · MD · LG">
          <div className="flex flex-col gap-4 items-start">
            <RatingInput value={4} size="sm" readOnly />
            <RatingInput value={4} size="md" readOnly />
            <RatingInput value={4} size="lg" readOnly />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Custom icons">
        <Frame label="Heart emoji">
          <RatingInput value={3} readOnly icon="❤️" emptyIcon="🤍" max={5} />
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="States">
        <Frame label="Disabled">
          <RatingInput value={2} disabled />
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function FabDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Position">
        <Frame label="Speed-dial (bottom-right)">
          <div className="relative w-72 h-56 rounded-(--radius-lg) border border-rule bg-base overflow-hidden">
            <Fab
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              }
              position="bottom-right"
              actions={[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  ),
                  label: "Add",
                  onClick: () => {},
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  ),
                  label: "Edit",
                  onClick: () => {},
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                    </svg>
                  ),
                  label: "Delete",
                  onClick: () => {},
                },
              ]}
            />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Intents">
        <Frame label="Intent colors">
          <div className="flex gap-6">
            {(["primary", "secondary", "success", "danger"] as const).map((i) => (
              <Fab
                key={i}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                }
                position="bottom-right"
                intent={i}
                className="static!"
                style={{ position: "static", margin: 0 }}
              />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function FormFieldDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Basic usage">
        <Frame label="Label + hint" align="start">
          <div className="w-full max-w-sm">
            <FormField label="Email address" hint="We'll never share your email.">
              <Input placeholder="you@example.com" />
            </FormField>
          </div>
        </Frame>
        <Frame label="Required" align="start">
          <div className="w-full max-w-sm">
            <FormField label="Username" required>
              <Input placeholder="Enter username" />
            </FormField>
          </div>
        </Frame>
        <Frame label="Error message" align="start">
          <div className="w-full max-w-sm">
            <FormField label="Password" errorMessage="Password must be at least 8 characters.">
              <Input type="password" placeholder="••••••••" status="error" />
            </FormField>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function RibbonDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Positions">
        <Frame label="Top-right (default)">
          <div className="flex gap-6">
            <Ribbon label="New" intent="primary">
              <div className="w-40 h-24 rounded-(--radius-md) border border-rule bg-raised flex items-center justify-center text-body-callout text-foreground">
                Card
              </div>
            </Ribbon>
            <Ribbon label="Hot" intent="danger" position="top-left">
              <div className="w-40 h-24 rounded-(--radius-md) border border-rule bg-raised flex items-center justify-center text-body-callout text-foreground">
                Card
              </div>
            </Ribbon>
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Intents">
        <Frame label="All intent colors">
          <div className="flex flex-wrap gap-4">
            {(["primary", "secondary", "success", "warning", "danger", "neutral"] as const).map((i) => (
              <Ribbon key={i} label={i} intent={i}>
                <div className="w-28 h-20 rounded-(--radius-md) border border-rule bg-raised flex items-center justify-center text-body-caption text-muted capitalize">
                  {i}
                </div>
              </Ribbon>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function FloatingLabelInputDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Outline" align="start">
          <div className="w-full max-w-sm">
            <FloatingLabelInput label="Email address" variant="outline" />
          </div>
        </Frame>
        <Frame label="Filled" align="start">
          <div className="w-full max-w-sm">
            <FloatingLabelInput label="Username" variant="filled" />
          </div>
        </Frame>
        <Frame label="Underline" align="start">
          <div className="w-full max-w-sm">
            <FloatingLabelInput label="Password" type="password" variant="underline" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="SM · MD · LG" align="start">
          <div className="w-full max-w-sm flex flex-col gap-6">
            <FloatingLabelInput label="Small" size="sm" />
            <FloatingLabelInput label="Medium" size="md" />
            <FloatingLabelInput label="Large" size="lg" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Pre-filled">
        <Frame label="Label floated on value" align="start">
          <div className="w-full max-w-sm">
            <FloatingLabelInput label="Full name" defaultValue="Jane Doe" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function NotificationBellDemo() {
  const items = [
    { id: "1", title: "New comment", body: "Alice replied to your post.", intent: "info" as const, read: false },
    { id: "2", title: "Build failed", body: "CI pipeline failed on main.", intent: "danger" as const, read: false },
    { id: "3", title: "PR approved", body: "Your PR was approved.", intent: "success" as const, read: true },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Bell with unread badge + panel">
          <NotificationBell notifications={items} />
        </Frame>
        <Frame label="No unread notifications">
          <NotificationBell notifications={items.map((i) => ({ ...i, read: true }))} />
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function AspectRatioDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Common ratios">
        <Frame label="16:9 (video)">
          <div className="w-72">
            <AspectRatio ratio={16 / 9}>
              <div className="rounded-(--radius-md) bg-patina-soft border border-patina flex items-center justify-center text-body-callout text-patina font-semibold">
                16 : 9
              </div>
            </AspectRatio>
          </div>
        </Frame>
        <Frame label="1:1 (square)">
          <div className="w-48">
            <AspectRatio ratio={1}>
              <div className="rounded-full bg-kinpaku-soft border border-kinpaku flex items-center justify-center text-body-callout text-kinpaku font-semibold">
                1 : 1
              </div>
            </AspectRatio>
          </div>
        </Frame>
        <Frame label="4:3 (classic)">
          <div className="w-64">
            <AspectRatio ratio={4 / 3}>
              <div className="rounded-(--radius-md) bg-success-soft border border-success flex items-center justify-center text-body-callout text-success font-semibold">
                4 : 3
              </div>
            </AspectRatio>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ChipGroupDemo() {
  const [single, setSingle] = useState<string[]>(["react"]);
  const [multi, setMulti] = useState<string[]>(["ts", "tailwind"]);

  const chips = [
    { id: "react", label: "React" },
    { id: "vue", label: "Vue" },
    { id: "svelte", label: "Svelte" },
    { id: "ts", label: "TypeScript" },
    { id: "tailwind", label: "Tailwind" },
  ];

  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Selection modes">
        <Frame label="Single select">
          <div className="flex flex-col gap-3 items-center">
            <ChipGroup chips={chips} value={single} onChange={setSingle} />
            <p className="text-body-caption text-faint">Selected: {single.join(", ") || "none"}</p>
          </div>
        </Frame>
        <Frame label="Multi select">
          <div className="flex flex-col gap-3 items-center">
            <ChipGroup chips={chips} value={multi} onChange={setMulti} multiSelect />
            <p className="text-body-caption text-faint">Selected: {multi.join(", ")}</p>
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Intents">
        <Frame label="Primary (default) · success · danger">
          <div className="flex flex-col gap-3">
            <ChipGroup chips={chips.slice(0, 3)} value={single} onChange={setSingle} intent="primary" />
            <ChipGroup chips={chips.slice(0, 3)} value={single} onChange={setSingle} intent="success" />
            <ChipGroup chips={chips.slice(0, 3)} value={single} onChange={setSingle} intent="danger" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function TagCloudDemo() {
  const tags = [
    { label: "React", weight: 10 },
    { label: "TypeScript", weight: 8 },
    { label: "Next.js", weight: 9 },
    { label: "Tailwind", weight: 7 },
    { label: "Node.js", weight: 6 },
    { label: "GraphQL", weight: 5 },
    { label: "Prisma", weight: 4 },
    { label: "Docker", weight: 5 },
    { label: "AWS", weight: 3 },
    { label: "PostgreSQL", weight: 6 },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Weight-scaled tags">
          <TagCloud items={tags} minSize={12} maxSize={24} />
        </Frame>
        <Frame label="Rotated (randomized angles)">
          <TagCloud items={tags} minSize={11} maxSize={22} randomRotate />
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function AccordionGroupDemo() {
  const rawItems = [
    {
      id: "1",
      title: "What is Kikito CN?",
      content: "A Tailwind v4 component library with semantic token aliases and zero CSS Modules.",
    },
    {
      id: "2",
      title: "How do I install it?",
      content:
        "Copy components to your ui/ directory, add the token bridge to globals.css, import cn() from @/lib/utils.",
    },
    {
      id: "3",
      title: "Does it support dark mode?",
      content: "Yes — all tokens adapt via CSS custom properties. Toggle .dark on the root element.",
    },
  ];
  const items = rawItems.map((i) => ({
    id: i.id,
    trigger: <span>{i.title}</span>,
    content: <p className="text-muted">{i.content}</p>,
  }));
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Types">
        <Frame label="Single open (accordion)" align="start">
          <div className="w-full max-w-lg">
            <AccordionGroup items={items} type="single" />
          </div>
        </Frame>
        <Frame label="Multiple open" align="start">
          <div className="w-full max-w-lg">
            <AccordionGroup items={items} type="multi" defaultOpen={["1", "2"]} />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Variants">
        <Frame label="Default · card · flush" align="start">
          <div className="w-full max-w-lg flex flex-col gap-6">
            <AccordionGroup items={items.slice(0, 2)} variant="default" />
            <AccordionGroup items={items.slice(0, 2)} variant="card" />
            <AccordionGroup items={items.slice(0, 2)} variant="flush" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function DotStepperDemo() {
  const [step, setStep] = useState(1);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Dot (default)">
          <div className="flex flex-col gap-4 items-center">
            <DotStepper steps={5} current={step} variant="dot" onChange={setStep} />
            <div className="flex gap-2">
              <Button size="xs" variant="outline" intent="neutral" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                Prev
              </Button>
              <Button size="xs" onClick={() => setStep((s) => Math.min(4, s + 1))}>
                Next
              </Button>
            </div>
          </div>
        </Frame>
        <Frame label="Dash">
          <DotStepper steps={5} current={step} variant="dash" />
        </Frame>
        <Frame label="Progress bar">
          <div className="w-72">
            <DotStepper steps={5} current={step} variant="progress" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ProgressStepsDemo() {
  const steps = [
    { label: "Order placed", description: "Confirmed #1042" },
    { label: "Processing", description: "Items packed" },
    { label: "Shipped", description: "In transit" },
    { label: "Delivered" },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Orientation">
        <Frame label="Horizontal (step 2 active)">
          <div className="w-full max-w-2xl">
            <ProgressSteps steps={steps} current={2} />
          </div>
        </Frame>
        <Frame label="Vertical" align="start">
          <ProgressSteps steps={steps} current={2} orientation="vertical" />
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Completed state">
        <Frame label="All steps done">
          <div className="w-full max-w-2xl">
            <ProgressSteps steps={steps} current={4} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function TimelineProgressDemo() {
  const steps = [
    { id: "1", label: "Account created", description: "Jan 15, 2024", status: "completed" as const },
    { id: "2", label: "Email verified", description: "Jan 15, 2024", status: "completed" as const },
    { id: "3", label: "Profile setup", description: "In progress…", status: "current" as const },
    { id: "4", label: "First project", description: "Pending", status: "upcoming" as const },
    { id: "5", label: "Invite team", description: "Pending", status: "upcoming" as const },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Vertical timeline progress" align="start">
          <TimelineProgress steps={steps} />
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Error state">
        <Frame label="With failed step" align="start">
          <TimelineProgress
            steps={[
              ...steps.slice(0, 1),
              { id: "err", label: "Payment failed", description: "Card declined", status: "error" as const },
              ...steps.slice(2),
            ]}
          />
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function FloatingBarDemo() {
  const [vis, setVis] = useState(true);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Floating action bar (toggle visibility)">
          <div className="relative w-full h-48 rounded-(--radius-lg) border border-rule bg-base overflow-hidden">
            <FloatingBar visible={vis} position="bottom">
              <div className="flex items-center gap-3">
                <span className="text-body-callout text-foreground font-medium">3 items selected</span>
                <Button size="sm" variant="outline" intent="neutral">
                  Cancel
                </Button>
                <Button size="sm" intent="danger">
                  Delete
                </Button>
              </div>
            </FloatingBar>
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="sm" variant="outline" onClick={() => setVis((v) => !v)}>
                {vis ? "Hide bar" : "Show bar"}
              </Button>
            </div>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function FloatingMenuDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Placements">
        <Frame label="Click trigger → hover menu">
          <div className="flex flex-wrap gap-6 justify-center">
            {(["top", "bottom", "left", "right"] as const).map((placement) => (
              <FloatingMenu
                key={placement}
                placement={placement}
                trigger={
                  <Button variant="outline" size="sm">
                    {placement}
                  </Button>
                }
                items={[
                  { id: "edit", label: "Edit", onClick: () => {} },
                  { id: "dup", label: "Duplicate", onClick: () => {} },
                  { id: "del", label: "Delete", onClick: () => {}, intent: "danger" as const },
                ]}
              />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function MetricCardDemo() {
  const data = [12, 24, 18, 36, 28, 42, 38, 55];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Trend variants">
        <Frame label="Up · down · neutral">
          <div className="flex flex-wrap gap-4">
            <MetricCard label="Revenue" value="$42,890" trend="up" trendValue="+12%" sparkline={data} />
            <MetricCard
              label="Churn Rate"
              value="2.1%"
              trend="down"
              trendValue="-0.4%"
              sparkline={data.map((v) => 60 - v)}
              intent="success"
            />
            <MetricCard
              label="Sessions"
              value="8,214"
              trend="flat"
              trendValue="0%"
              sparkline={[30, 32, 29, 31, 30, 33, 31, 30]}
              intent="info"
            />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Loading">
        <Frame label="Skeleton state">
          <MetricCard label="" value="" loading />
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function StatsCardDemo() {
  const stats = [
    { label: "Users", value: "12,849" },
    { label: "Revenue", value: "$84,200" },
    { label: "Conversion", value: "3.2%" },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Column counts">
        <Frame label="2 columns">
          <div className="w-full max-w-md">
            <StatsCard stats={stats.slice(0, 2)} />
          </div>
        </Frame>
        <Frame label="3 columns">
          <div className="w-full max-w-xl">
            <StatsCard stats={stats} />
          </div>
        </Frame>
        <Frame label="4 columns">
          <div className="w-full max-w-2xl">
            <StatsCard stats={[...stats, { label: "NPS", value: "72" }]} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function NoteCardDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Colors">
        <Frame label="All 6 pastel colors">
          <div className="flex flex-wrap gap-4">
            {(["yellow", "pink", "blue", "green", "purple", "orange"] as const).map((color) => (
              <NoteCard key={color} color={color}>
                <p className="font-semibold capitalize">{color}</p>
                <p className="text-sm mt-1">Quick sticky note with pin decoration and optional rotation.</p>
              </NoteCard>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Rotation">
        <Frame label="Rotated (skewed layout)">
          <div className="flex flex-wrap gap-4">
            <NoteCard color="yellow" rotate={-3}>
              <p className="font-semibold">Note A</p>
              <p className="text-sm">Slight tilt.</p>
            </NoteCard>
            <NoteCard color="pink" rotate={2}>
              <p className="font-semibold">Note B</p>
              <p className="text-sm">Different angle.</p>
            </NoteCard>
            <NoteCard color="blue" rotate={-1}>
              <p className="font-semibold">Note C</p>
              <p className="text-sm">Random rotation.</p>
            </NoteCard>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ReceiptCardDemo() {
  const items = [
    { label: "Coffee (×2)", value: 7.0 },
    { label: "Croissant", value: 3.5 },
    { label: "Orange juice", value: 4.25 },
  ];
  const subtotal = items.reduce((s, i) => s + Number(i.value), 0);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Receipt card with total">
          <ReceiptCard
            from="The Coffee House"
            date={new Date()}
            items={items}
            tax={0.08}
            currency="USD"
            total={subtotal * 1.08}
          />
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function PricingCardDemo() {
  const features = [
    { label: "5 projects", included: true },
    { label: "50 GB storage", included: true },
    { label: "API access", included: true },
    { label: "Priority support", included: false },
    { label: "Custom domain", included: false },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Plans">
        <Frame label="Regular · Highlighted">
          <div className="flex flex-wrap gap-4">
            <PricingCard name="Starter" price="9" period="mo" features={features} cta="Get started" />
            <PricingCard
              name="Pro"
              price="29"
              period="mo"
              features={[
                ...features,
                { label: "Priority support", included: true },
                { label: "Custom domain", included: true },
              ]}
              cta="Start free trial"
              highlighted
              badge="Most popular"
            />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function FeatureListDemo() {
  const features = [
    { title: "Unlimited projects" },
    { title: "API access" },
    { title: "Priority support" },
    { title: "Custom domains" },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Check (default)">
          <FeatureList items={features} variant="check" />
        </Frame>
        <Frame label="Numbered">
          <FeatureList items={features} variant="numbered" />
        </Frame>
        <Frame label="Icon (custom)">
          <FeatureList items={features.map((f) => ({ ...f, icon: <span>⚡</span> }))} variant="icon" />
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Intents">
        <Frame label="All intent colors">
          <div className="flex flex-wrap gap-8">
            {(["primary", "success", "danger"] as const).map((i) => (
              <FeatureList key={i} items={features.slice(0, 3)} intent={i} />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function VerticalNavDemo() {
  const items = [
    { id: "home", label: "Home", href: "#", icon: "🏠" },
    {
      id: "design",
      label: "Design",
      icon: "🎨",
      children: [
        { id: "tokens", label: "Tokens", href: "#" },
        { id: "components", label: "Components", href: "#", badge: "34" },
      ],
    },
    { id: "docs", label: "Documentation", href: "#", icon: "📖" },
    { id: "settings", label: "Settings", href: "#", icon: "⚙️" },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Collapsible tree nav" align="start">
          <div className="w-56 border border-rule rounded-(--radius-lg) bg-base">
            <VerticalNav items={items} activeId="components" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ChatBubbleDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Bubbles">
        <Frame label="Sent · received" align="start">
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <ChatBubble message="Hey! How's the project going?" side="left" senderName="Alice" />
            <ChatBubble message="Great! Almost done with the new components 🎉" side="right" status="read" />
            <ChatBubble message="Can't wait to see them!" side="left" senderName="Alice" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Typing indicator">
        <Frame label="Animated dots">
          <ChatBubble message="" isTyping side="left" senderName="Alice" />
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Message status">
        <Frame label="Sent · delivered · read">
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <ChatBubble message="Sent" side="right" status="sent" />
            <ChatBubble message="Delivered" side="right" status="delivered" />
            <ChatBubble message="Read" side="right" status="read" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function TerminalBlockDemo() {
  const lines: import("@/components/ui/cn/terminal-block/TerminalBlock").TerminalLine[] = [
    { text: "$ npm install @kikito/cn", type: "command" },
    { text: "> Installing packages…", type: "output" },
    { text: "> Added 42 packages in 2.1s", type: "success" },
    { text: "$ npm run dev", type: "command" },
    { text: "> Ready on http://localhost:3000", type: "info" },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Terminal block">
          <div className="w-full max-w-lg">
            <TerminalBlock lines={lines} title="Terminal" />
          </div>
        </Frame>
        <Frame label="Animated typing">
          <div className="w-full max-w-lg">
            <TerminalBlock lines={lines} title="Output" animate />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function PasswordStrengthDemo() {
  const [pwd, setPwd] = useState("");
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Live strength meter" align="start">
          <div className="w-full max-w-sm flex flex-col gap-3">
            <Input
              label="Password"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Enter a password…"
            />
            <PasswordStrength value={pwd} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function WindowFrameDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Chrome styles">
        <Frame label="macOS">
          <div className="w-full max-w-md">
            <WindowFrame variant="macos" title="index.tsx">
              <div className="p-4 font-mono text-body-caption text-foreground bg-[#0d1117]">
                <span className="text-[#79c0ff]">const</span> <span className="text-[#e6edf3]">greeting</span>{" "}
                <span className="text-[#ff7b72]">=</span>{" "}
                <span className="text-[#a5d6ff]">&apos;Hello, world!&apos;</span>
              </div>
            </WindowFrame>
          </div>
        </Frame>
        <Frame label="Windows">
          <div className="w-full max-w-md">
            <WindowFrame variant="windows" title="Notepad — untitled.txt">
              <div className="p-4 text-body-callout text-foreground bg-canvas">Hello, world!</div>
            </WindowFrame>
          </div>
        </Frame>
        <Frame label="Minimal">
          <div className="w-full max-w-md">
            <WindowFrame variant="minimal">
              <div className="p-4 text-body-callout text-muted">Content goes here</div>
            </WindowFrame>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function KeyboardShortcutsDemo() {
  const [open, setOpen] = useState(false);
  const groups = [
    {
      title: "Navigation",
      shortcuts: [
        { label: "Open command palette", keys: ["⌘", "K"] },
        { label: "Toggle sidebar", keys: ["⌘", "/"] },
      ],
    },
    {
      title: "Editing",
      shortcuts: [
        { label: "Save file", keys: ["⌘", "S"] },
        { label: "Undo", keys: ["⌘", "Z"] },
        { label: "Redo", keys: ["⌘", "Shift", "Z"] },
      ],
    },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Click to open shortcuts modal">
          <div className="flex flex-col items-center gap-3">
            <Button onClick={() => setOpen(true)} variant="outline">
              Show keyboard shortcuts
            </Button>
            <p className="text-body-caption text-faint">Press ? to open</p>
            <KeyboardShortcuts groups={groups} isOpen={open} onClose={() => setOpen(false)} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const today = new Date();
  const events = [
    { id: 1, date: new Date(today.getFullYear(), today.getMonth(), 5), title: "Team sync", color: "var(--ks-primary)" },
    { id: 2, date: new Date(today.getFullYear(), today.getMonth(), 12), title: "Release", color: "var(--ks-success)" },
    {
      id: 3,
      date: new Date(today.getFullYear(), today.getMonth(), 20),
      title: "All-hands",
      color: "var(--ks-warning)",
    },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Calendar picker with events">
          <div className="flex flex-col items-center gap-3">
            <Calendar value={date} onChange={setDate} events={events} />
            {date && <p className="text-body-caption text-faint">Selected: {date.toLocaleDateString()}</p>}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SortableListDemo() {
  const [items, setItems] = useState<import("@/components/ui/cn/sortable-list/SortableList").SortableItem[]>([
    { id: "1", content: <span className="text-body-callout text-foreground">Design tokens</span> },
    { id: "2", content: <span className="text-body-callout text-foreground">Button component</span> },
    { id: "3", content: <span className="text-body-callout text-foreground">Input component</span> },
    { id: "4", content: <span className="text-body-callout text-foreground">Badge component</span> },
    { id: "5", content: <span className="text-body-callout text-foreground">Modal overlay</span> },
  ]);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Drag to reorder" align="start">
          <div className="w-full max-w-sm">
            <SortableList items={items} onChange={setItems} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function MediaPlayerDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Simulated audio player">
          <div className="w-full max-w-md">
            <MediaPlayer type="audio" title="Ambient Track 01" artist="Kikito Studio" />
          </div>
        </Frame>
        <Frame label="Video player">
          <div className="w-full max-w-md">
            <MediaPlayer type="video" title="Intro to CN" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function NavigationMenuDemo() {
  const items = [
    { id: "home", label: "Home", href: "#" },
    {
      id: "products",
      label: "Products",
      children: [
        { id: "cn", label: "Kikito CN", href: "#", description: "Component library" },
        { id: "tv", label: "Kikito TV", href: "#", description: "Streaming platform" },
      ],
    },
    { id: "docs", label: "Docs", href: "#" },
    { id: "pricing", label: "Pricing", href: "#" },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Horizontal (top-nav)">
        <Frame label="With dropdown submenu">
          <div className="w-full border border-rule rounded-(--radius-lg) bg-base px-4 py-2">
            <CnNavigationMenu items={items} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function TextEditorDemo() {
  const [html, setHtml] = useState("<p>Type something <strong>rich</strong> here…</p>");
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Rich text editor with toolbar" align="start">
          <div className="w-full max-w-2xl">
            <TextEditor value={html} onChange={setHtml} minHeight={160} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SignaturePadDemo() {
  const [img, setImg] = useState<string | null>(null);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Draw your signature" align="start">
          <div className="flex flex-col gap-3 items-center w-full">
            <SignaturePad width={480} height={180} onSave={setImg} />
            {img && (
              <img
                src={img}
                alt="Signature preview"
                className="max-w-[240px] border border-rule rounded-(--radius-md) p-2"
              />
            )}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Custom color + read-only">
        <div className="flex flex-wrap gap-6">
          <Frame label="Custom stroke color">
            {/* color e literal repassado direto pro canvas strokeStyle (API do browser
                não avalia CSS var) — valor de exemplo, não precisa ser token */}
            <SignaturePad width={320} height={140} color="#2563eb" />
          </Frame>
          <Frame label="Read-only (display only)">
            <SignaturePad width={320} height={140} readOnly />
          </Frame>
        </div>
      </ShowcaseSection>
    </div>
  );
}

function OnboardingTourDemo() {
  const [running, setRunning] = useState(false);
  const steps = [
    {
      target: "#tour-step-1",
      title: "Welcome!",
      content: "This is the first step of the onboarding tour.",
      placement: "bottom" as const,
    },
    {
      target: "#tour-step-2",
      title: "Here's the component",
      content: "This highlights the target element with a ring.",
      placement: "right" as const,
    },
    {
      target: "#tour-step-3",
      title: "Last step",
      content: "Click Done to finish the tour!",
      placement: "top" as const,
    },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Click Start Tour to launch">
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex gap-4 items-start justify-between w-full max-w-sm">
              <div
                id="tour-step-1"
                className="px-3 py-2 rounded-(--radius-md) border border-rule bg-raised text-body-callout text-foreground"
              >
                Step 1
              </div>
              <div
                id="tour-step-2"
                className="px-3 py-2 rounded-(--radius-md) border border-rule bg-raised text-body-callout text-foreground"
              >
                Step 2
              </div>
              <div
                id="tour-step-3"
                className="px-3 py-2 rounded-(--radius-md) border border-rule bg-raised text-body-callout text-foreground"
              >
                Step 3
              </div>
            </div>
            <Button onClick={() => setRunning(true)} intent="primary">
              Start Tour
            </Button>
            {running && (
              <OnboardingTour
                steps={steps}
                isOpen={running}
                onClose={() => setRunning(false)}
                onComplete={() => setRunning(false)}
              />
            )}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SelectDemo() {
  const [value, setValue] = useState("");
  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "solid", label: "SolidJS" },
    { value: "angular", label: "Angular", disabled: true },
  ];
  const grouped = [
    {
      label: "Frontend",
      options: [
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
      ],
    },
    {
      label: "Backend",
      options: [
        { value: "node", label: "Node.js" },
        { value: "deno", label: "Deno" },
      ],
    },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Outline (default)">
          <div className="w-full max-w-xs">
            <Select options={options} placeholder="Choose a framework…" value={value} onChange={setValue} />
          </div>
        </Frame>
        <Frame label="Filled">
          <div className="w-full max-w-xs">
            <Select options={options} variant="filled" placeholder="Choose a framework…" />
          </div>
        </Frame>
        <Frame label="Ghost">
          <div className="w-full max-w-xs">
            <Select options={options} variant="ghost" placeholder="Choose a framework…" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Features">
        <Frame label="With search">
          <div className="w-full max-w-xs">
            <Select options={options} searchable placeholder="Search frameworks…" />
          </div>
        </Frame>
        <Frame label="With groups">
          <div className="w-full max-w-xs">
            <Select options={grouped} placeholder="Choose…" />
          </div>
        </Frame>
        <Frame label="Clearable · error state">
          <div className="w-full max-w-xs">
            <Select options={options} clearable state="error" errorText="Selecione uma opção" placeholder="Required…" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="sm · md · lg">
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Select options={options} size="sm" placeholder="Small" />
            <Select options={options} size="md" placeholder="Medium" />
            <Select options={options} size="lg" placeholder="Large" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function TextareaDemo() {
  const [val, setVal] = useState("");
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="Outline (default)" align="start">
          <div className="w-full max-w-sm">
            <Textarea
              variant="outline"
              label="Message"
              placeholder="Type your message…"
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
          </div>
        </Frame>
        <Frame label="Filled" align="start">
          <div className="w-full max-w-sm">
            <Textarea variant="filled" label="Filled" placeholder="Filled style…" />
          </div>
        </Frame>
        <Frame label="Ghost" align="start">
          <div className="w-full max-w-sm">
            <Textarea variant="ghost" label="Ghost" placeholder="Ghost style…" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="States">
        <Frame label="Error · success" align="start">
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Textarea state="error" errorText="Este campo é obrigatório" defaultValue="" placeholder="Error state" />
            <Textarea state="success" successText="Tudo certo!" defaultValue="Valid content" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Features">
        <Frame label="Auto-resize · char count" align="start">
          <div className="w-full max-w-sm">
            <Textarea
              autoResize
              maxRows={6}
              showCount
              maxLength={200}
              placeholder="Grows automatically…"
              helperText="Expand to up to 6 rows"
            />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="States">
        <Frame label="Unchecked · checked · indeterminate">
          <div className="flex flex-col gap-4">
            <Checkbox label="Unchecked" checked={false} />
            <Checkbox label="Checked" checked={true} />
            <Checkbox label="Indeterminate" indeterminate={true} />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Variants">
        <Frame label="Square · rounded · circle">
          <div className="flex flex-col gap-4">
            <Checkbox label="Square" variant="square" checked={true} />
            <Checkbox label="Rounded" variant="rounded" checked={true} />
            <Checkbox label="Circle" variant="circle" checked={true} />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Intents">
        <Frame label="All intents (checked)">
          <div className="flex flex-wrap gap-4">
            {(["primary", "secondary", "success", "destructive", "warning", "info"] as const).map((i) => (
              <Checkbox key={i} label={i} intent={i} checked={true} />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="With description · controlled">
        <Frame label="Interactive" align="start">
          <div className="flex flex-col gap-4">
            <Checkbox
              label="Enable notifications"
              description="You'll receive alerts via email and push"
              checked={checked}
              onChange={setChecked}
            />
            <Checkbox
              label="Partial selection"
              indeterminate={indeterminate}
              onChange={(v) => {
                setIndeterminate(false);
                setChecked(v);
              }}
            />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="sm · md · lg">
          <div className="flex flex-col gap-4">
            <Checkbox label="Small" size="sm" checked={true} />
            <Checkbox label="Medium" size="md" checked={true} />
            <Checkbox label="Large" size="lg" checked={true} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function RadioDemo() {
  const [plan, setPlan] = useState("pro");
  const options = [
    { value: "free", label: "Free", helperText: "Up to 3 projects" },
    { value: "pro", label: "Pro", helperText: "Unlimited projects + API access" },
    { value: "enterprise", label: "Enterprise", helperText: "Custom SLA and dedicated support" },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="RadioGroup">
        <Frame label="Vertical (default)" align="start">
          <RadioGroup label="Subscription plan" options={options} value={plan} onChange={setPlan} />
        </Frame>
        <Frame label="Horizontal" align="start">
          <RadioGroup
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
            orientation="horizontal"
            defaultValue="system"
          />
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="sm · md · lg">
          <div className="flex flex-col gap-3">
            <Radio value="a" label="Small" size="sm" defaultChecked />
            <Radio value="b" label="Medium" size="md" defaultChecked />
            <Radio value="c" label="Large" size="lg" defaultChecked />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SwitchDemo() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Controlled switches" align="start">
          <div className="flex flex-col gap-5">
            <Switch
              label="Dark mode"
              description="Switch to dark theme globally"
              checked={darkMode}
              onChange={setDarkMode}
            />
            <Switch
              label="Notifications"
              description="Receive email and push alerts"
              checked={notifications}
              onChange={setNotifications}
            />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Intents">
        <Frame label="All intents (on)">
          <div className="flex flex-wrap gap-5">
            {(["primary", "secondary", "success", "destructive", "warning", "info"] as const).map((i) => (
              <Switch key={i} label={i} intent={i} defaultChecked />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Label position">
        <Frame label="Left · right">
          <div className="flex flex-col gap-4">
            <Switch label="Label on right (default)" labelPosition="right" defaultChecked />
            <Switch label="Label on left" labelPosition="left" defaultChecked />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="sm · md · lg">
          <div className="flex flex-col gap-4">
            <Switch label="Small" size="sm" defaultChecked />
            <Switch label="Medium" size="md" defaultChecked />
            <Switch label="Large" size="lg" defaultChecked />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function AlertDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Intents">
        <Frame label="All intents (soft)" align="start">
          <div className="flex flex-col gap-3 w-full max-w-lg">
            {(["info", "success", "warning", "danger", "neutral"] as const).map((i) => (
              <Alert key={i} intent={i} title={i.charAt(0).toUpperCase() + i.slice(1)} variant="soft">
                This is a {i} alert with a short description.
              </Alert>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Variants">
        <Frame label="soft · outline · solid · left-accent" align="start">
          <div className="flex flex-col gap-3 w-full max-w-lg">
            <Alert intent="info" variant="soft" title="Soft">
              Soft appearance with light background.
            </Alert>
            <Alert intent="info" variant="outline" title="Outline">
              Outline border with transparent background.
            </Alert>
            <Alert intent="info" variant="solid" title="Solid">
              Solid fill with high contrast.
            </Alert>
            <Alert intent="info" variant="left-accent" title="Left Accent">
              Left border accent strip.
            </Alert>
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Features">
        <Frame label="Dismissible · with action" align="start">
          <div className="flex flex-col gap-3 w-full max-w-lg">
            <Alert
              intent="warning"
              title="Action required"
              dismissible
              actions={
                <Button size="sm" variant="outline" intent="warning">
                  Resolve
                </Button>
              }
            >
              Your account will be suspended in 3 days.
            </Alert>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function CardDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="default · outlined · elevated · filled · ghost">
          <div className="flex flex-wrap gap-4 justify-center">
            {(["default", "outlined", "elevated", "filled", "ghost"] as const).map((v) => (
              <Card key={v} variant={v} className="w-36">
                <CardBody>
                  <p className="text-body-callout font-medium text-foreground capitalize">{v}</p>
                  <p className="text-body-caption text-faint mt-1">Card variant</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="With CardHeader / CardBody / CardFooter">
        <Frame label="Full composition">
          <Card className="w-full max-w-sm">
            <CardHeader
              title="Project Alpha"
              description="UI component library"
              badge={
                <Badge intent="success" size="sm">
                  Active
                </Badge>
              }
            />
            <CardBody>
              <p className="text-body-callout text-muted">
                A design system with 150+ components for building product UIs.
              </p>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
              <Button size="sm" intent="primary">
                Open
              </Button>
            </CardFooter>
          </Card>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Hoverable / Clickable">
        <Frame label="Interactive cards">
          <div className="flex gap-4">
            <Card hoverable className="w-40">
              <CardBody>
                <p className="text-body-callout font-medium text-foreground">Hoverable</p>
                <p className="text-body-caption text-faint mt-1">Elevates on hover</p>
              </CardBody>
            </Card>
            <Card clickable onClick={() => {}} className="w-40">
              <CardBody>
                <p className="text-body-callout font-medium text-foreground">Clickable</p>
                <p className="text-body-caption text-faint mt-1">Pointer cursor + focus</p>
              </CardBody>
            </Card>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function CodeBlockDemo() {
  const exampleCode = `import { Button } from "@/components/ui/cn/button/Button";

export function Example() {
  async function handleSave() {
    await saveData();
  }

  return (
    <Button intent="primary" onClick={handleSave}>
      Salvar
    </Button>
  );
}`;

  const tsCode = `const greet = (name: string): string => {
  return \`Olá, \${name}!\`;
};

console.log(greet("Mundo"));`;

  return (
    <div className="flex flex-col gap-8">
      <ShowcaseSection title="TSX com filename e linha">
        <Frame label="lang=tsx · filename · showLineNumbers">
          <div className="w-full max-w-2xl">
            <CodeBlock code={exampleCode} language="tsx" filename="Example.tsx" showLineNumbers />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="TypeScript sem filename">
        <Frame label="lang=ts · sem filename · sem linha">
          <div className="w-full max-w-2xl">
            <CodeBlock code={tsCode} language="ts" />
          </div>
        </Frame>
      </ShowcaseSection>

      <ShowcaseSection title="Com maxHeight (scroll)">
        <Frame label="maxHeight=120px">
          <div className="w-full max-w-2xl">
            <CodeBlock code={exampleCode} language="tsx" filename="long-file.tsx" showLineNumbers maxHeight={120} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function AvatarDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Sizes">
        <Frame label="xs · sm · md · lg · xl · 2xl">
          <div className="flex items-end gap-4">
            {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
              <Avatar key={s} name="Kikito" size={s} />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Variants">
        <Frame label="circle · rounded · square">
          <div className="flex gap-4">
            <Avatar name="CK" size="lg" variant="circle" />
            <Avatar name="CK" size="lg" variant="rounded" />
            <Avatar name="CK" size="lg" variant="square" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Status">
        <Frame label="online · offline · away · busy">
          <div className="flex gap-4">
            {(["online", "offline", "away", "busy"] as const).map((s) => (
              <Avatar key={s} name={s[0].toUpperCase()} size="lg" status={s} />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Fallbacks">
        <Frame label="initials · icon · image">
          <div className="flex gap-4 items-center">
            <Avatar name="João Marcos" size="xl" />
            <Avatar
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
                </svg>
              }
              size="xl"
            />
            <Avatar src="https://i.pravatar.cc/80?img=12" alt="User" size="xl" status="online" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function TooltipDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Placements">
        <Frame label="top · bottom · left · right">
          <div className="flex flex-wrap gap-6 justify-center">
            {(["top", "bottom", "left", "right"] as const).map((p) => (
              <Tooltip key={p} content={`Placement: ${p}`} placement={p}>
                <Button variant="outline" size="sm">
                  {p}
                </Button>
              </Tooltip>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Content">
        <Frame label="Text · rich content">
          <div className="flex gap-6 flex-wrap justify-center">
            <Tooltip content="Simple text tooltip">
              <Badge intent="primary">hover me</Badge>
            </Tooltip>
            <Tooltip
              content={
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground">Rich tooltip</span>
                  <span className="text-body-caption text-faint">Supports any ReactNode content</span>
                </div>
              }
            >
              <Badge intent="secondary">rich content</Badge>
            </Tooltip>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function PopoverDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="With title, description and footer">
          <Popover
            title="Save changes?"
            description="Your edits will be persisted to the server."
            showClose
            footer={
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost">
                  Cancel
                </Button>
                <Button size="sm" intent="primary">
                  Save
                </Button>
              </div>
            }
          >
            <Button variant="outline">Open popover</Button>
          </Popover>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Placements">
        <Frame label="top · bottom · left · right">
          <div className="flex gap-4 flex-wrap justify-center">
            {(["top", "bottom", "left", "right"] as const).map((p) => (
              <Popover key={p} title={`Placement: ${p}`} description="Content goes here" placement={p}>
                <Button variant="outline" size="sm">
                  {p}
                </Button>
              </Popover>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function HoverCardDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Hover to preview">
          <HoverCard
            content={
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">Kikito CN</span>
                <span className="text-body-caption text-faint">Design system component library</span>
              </div>
            }
          >
            <Button variant="outline">Hover me</Button>
          </HoverCard>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sides">
        <Frame label="top · bottom · left · right">
          <div className="flex gap-6 flex-wrap justify-center">
            {(["top", "bottom", "left", "right"] as const).map((side) => (
              <HoverCard key={side} side={side} content={<span className="text-body-callout">Side: {side}</span>}>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </HoverCard>
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function TabsDemo() {
  const [activeTab, setActiveTab] = useState("overview");
  const items = [
    { value: "overview", label: "Overview" },
    { value: "settings", label: "Settings" },
    { value: "billing", label: "Billing" },
    { value: "disabled", label: "Disabled", disabled: true },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        {(["line", "pill", "card", "enclosed"] as const).map((v) => (
          <Frame key={v} label={v} align="start">
            <div className="w-full">
              <Tabs items={items} variant={v} defaultValue="overview" />
            </div>
          </Frame>
        ))}
      </ShowcaseSection>
      <ShowcaseSection title="With TabPanel content">
        <Frame label="Controlled with panels" align="start">
          <div className="w-full max-w-lg">
            <Tabs items={items} value={activeTab} onChange={setActiveTab} />
            <div className="mt-4">
              <TabPanel value="overview" activeTab={activeTab}>
                <p className="text-body-callout text-muted">Overview content goes here.</p>
              </TabPanel>
              <TabPanel value="settings" activeTab={activeTab}>
                <p className="text-body-callout text-muted">Settings panel content.</p>
              </TabPanel>
              <TabPanel value="billing" activeTab={activeTab}>
                <p className="text-body-callout text-muted">Billing information panel.</p>
              </TabPanel>
            </div>
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Alignment">
        <Frame label="start · center · end · stretch" align="start">
          <div className="flex flex-col gap-4 w-full">
            {(["start", "center", "end", "stretch"] as const).map((a) => (
              <Tabs key={a} items={items.slice(0, 3)} align={a} defaultValue="overview" />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ProgressDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Intents">
        <Frame label="All intents" align="start">
          <div className="flex flex-col gap-4 w-full max-w-md">
            {(["primary", "info", "success", "warning", "danger"] as const).map((i) => (
              <Progress key={i} value={65} intent={i} label={i} showValue />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="xs · sm · md · lg" align="start">
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Progress value={40} size="xs" label="xs" />
            <Progress value={60} size="sm" label="sm" />
            <Progress value={75} size="md" label="md" />
            <Progress value={90} size="lg" label="lg" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="States">
        <Frame label="Indeterminate · animated" align="start">
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Progress label="Indeterminate" />
            <Progress value={55} animated label="Animated stripes" intent="success" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SpinnerDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Sizes">
        <Frame label="xs · sm · md · lg · xl">
          <div className="flex items-end gap-6">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
              <Spinner key={s} size={s} />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Intents">
        <Frame label="primary · secondary · neutral">
          <div className="flex gap-6">
            <Spinner intent="primary" size="lg" />
            <Spinner intent="secondary" size="lg" />
            <Spinner intent="neutral" size="lg" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Shapes">
        <Frame label="default · rounded · circle · pill" align="start">
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Skeleton height={16} shape="default" />
            <Skeleton height={16} shape="rounded" />
            <Skeleton width={48} height={48} shape="circle" />
            <Skeleton height={24} shape="pill" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Content skeleton">
        <Frame label="Profile card loading state" align="start">
          <div className="flex gap-3 w-full max-w-xs">
            <Skeleton width={48} height={48} shape="circle" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton height={12} width="70%" shape="rounded" />
              <Skeleton height={10} width="50%" shape="rounded" />
              <Skeleton height={10} width="90%" shape="rounded" />
            </div>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function AccordionDemo() {
  const items = [
    {
      value: "install",
      label: "How to install?",
      children: (
        <p className="text-body-callout text-muted">
          Copy the component file into your project and import it. No external dependencies required.
        </p>
      ),
    },
    {
      value: "customize",
      label: "Can I customize the styles?",
      children: (
        <p className="text-body-callout text-muted">
          Yes — all components use Tailwind CSS with design tokens. Override via className or CSS variables.
        </p>
      ),
    },
    {
      value: "typescript",
      label: "TypeScript support?",
      children: (
        <p className="text-body-callout text-muted">
          Full TypeScript support with exported prop types for every component.
        </p>
      ),
    },
    {
      value: "disabled",
      label: "Disabled item",
      disabled: true,
      children: <p>Not reachable</p>,
    },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Variants">
        <Frame label="default" align="start">
          <div className="w-full max-w-md">
            <Accordion items={items} defaultValue="install" />
          </div>
        </Frame>
        <Frame label="separated" align="start">
          <div className="w-full max-w-md">
            <Accordion items={items} variant="separated" defaultValue="customize" />
          </div>
        </Frame>
        <Frame label="ghost" align="start">
          <div className="w-full max-w-md">
            <Accordion items={items} variant="ghost" defaultValue="typescript" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Multiple">
        <Frame label="multiple=true — all panels can be open" align="start">
          <div className="w-full max-w-md">
            <Accordion items={items.slice(0, 3)} multiple defaultValue={["install", "customize"]} />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState<"sm" | "md" | "lg" | "xl" | "full" | null>(null);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Modal with title, body and footer">
          <div className="flex flex-col gap-4 items-center">
            <Button intent="primary" onClick={() => setOpen(true)}>
              Open modal
            </Button>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              title="Confirm deletion"
              description="This action cannot be undone."
            >
              <ModalBody>
                <p className="text-body-callout text-muted">
                  Are you sure you want to delete this item? All associated data will be permanently removed.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button intent="danger" onClick={() => setOpen(false)}>
                  Delete
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="sm · md · lg · xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {(["sm", "md", "lg", "xl"] as const).map((s) => (
              <Button key={s} variant="outline" size="sm" onClick={() => setSizeOpen(s)}>
                {s}
              </Button>
            ))}
            {sizeOpen && (
              <Modal open={true} onClose={() => setSizeOpen(null)} size={sizeOpen} title={`Size: ${sizeOpen}`}>
                <ModalBody>
                  <p className="text-body-callout text-muted">Modal with size=&quot;{sizeOpen}&quot;</p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outline" onClick={() => setSizeOpen(null)}>
                    Close
                  </Button>
                </ModalFooter>
              </Modal>
            )}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SeparatorDemo() {
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Horizontal">
        <Frame label="solid · dashed · dotted" align="start">
          <div className="flex flex-col w-full max-w-md gap-0">
            <p className="text-body-callout text-foreground">Section above</p>
            <Separator variant="solid" />
            <p className="text-body-callout text-foreground">Section above</p>
            <Separator variant="dashed" />
            <p className="text-body-callout text-foreground">Section above</p>
            <Separator variant="dotted" />
            <p className="text-body-callout text-foreground">Section below</p>
          </div>
        </Frame>
        <Frame label="With label" align="start">
          <div className="w-full max-w-md">
            <Separator label="OR" />
            <Separator label={<Badge size="sm">New</Badge>} />
            <Separator label="Start" labelAlign="start" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Vertical">
        <Frame label="Inline vertical separator">
          <div className="flex items-center h-8 gap-3">
            <span className="text-body-callout text-foreground">Left</span>
            <Separator orientation="vertical" />
            <span className="text-body-callout text-foreground">Right</span>
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SliderDemo() {
  const [val, setVal] = useState(50);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Controlled">
        <Frame label="With label and value" align="start">
          <div className="w-full max-w-md">
            <Slider label="Volume" value={val} onChange={setVal} showValue />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Intents">
        <Frame label="All intents" align="start">
          <div className="flex flex-col gap-5 w-full max-w-md">
            {(["primary", "info", "success", "warning", "danger"] as const).map((i) => (
              <Slider key={i} label={i} defaultValue={60} intent={i} showValue />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="With marks">
        <Frame label="Step marks" align="start">
          <div className="w-full max-w-md">
            <Slider
              label="Quality"
              defaultValue={50}
              min={0}
              max={100}
              step={25}
              marks={[
                { value: 0, label: "Low" },
                { value: 25, label: "Fair" },
                { value: 50, label: "Good" },
                { value: 75, label: "High" },
                { value: 100, label: "Max" },
              ]}
              showValue
            />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function RangeSliderDemo() {
  const [range, setRange] = useState<[number, number]>([20, 80]);
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Price range selector" align="start">
          <div className="w-full max-w-md flex flex-col gap-4">
            <RangeSlider
              label="Price range"
              value={range}
              onChange={setRange}
              formatValue={(v) => `$${v}`}
              showValues
            />
            <p className="text-body-caption text-faint">
              Selected: ${range[0]} — ${range[1]}
            </p>
          </div>
        </Frame>
        <Frame label="Disabled" align="start">
          <div className="w-full max-w-md">
            <RangeSlider label="Disabled" defaultValue={[30, 70]} disabled />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function ToggleGroupDemo() {
  const [single, setSingle] = useState<string | string[]>("bold");
  const [multi, setMulti] = useState<string | string[]>(["bold", "italic"]);
  const items = [
    { value: "bold", label: <strong>B</strong> },
    { value: "italic", label: <em>I</em> },
    { value: "underline", label: <span style={{ textDecoration: "underline" }}>U</span> },
    { value: "strike", label: <span style={{ textDecoration: "line-through" }}>S</span> },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Type">
        <Frame label="single · multiple">
          <div className="flex flex-col gap-4">
            <ToggleGroup items={items} type="single" value={single} onChange={setSingle} />
            <ToggleGroup items={items} type="multiple" value={multi} onChange={setMulti} />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Variants">
        <Frame label="outline · solid · ghost">
          <div className="flex flex-col gap-4">
            {(["outline", "solid", "ghost"] as const).map((v) => (
              <ToggleGroup key={v} items={items} variant={v} defaultValue="bold" />
            ))}
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

function SegmentedControlDemo() {
  const [view, setView] = useState("list");
  const options = [
    { value: "list", label: "List" },
    { value: "grid", label: "Grid" },
    { value: "table", label: "Table" },
  ];
  return (
    <div className="flex flex-col">
      <ShowcaseSection title="Default">
        <Frame label="Controlled segmented control">
          <div className="flex flex-col items-center gap-4">
            <SegmentedControl options={options} value={view} onChange={setView} />
            <p className="text-body-caption text-faint">Active: {view}</p>
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Sizes">
        <Frame label="sm · md · lg">
          <div className="flex flex-col gap-4 items-start">
            <SegmentedControl options={options} size="sm" defaultValue="list" />
            <SegmentedControl options={options} size="md" defaultValue="grid" />
            <SegmentedControl options={options} size="lg" defaultValue="table" />
          </div>
        </Frame>
      </ShowcaseSection>
      <ShowcaseSection title="Full width">
        <Frame label="stretch" align="start">
          <div className="w-full max-w-sm">
            <SegmentedControl options={options} fullWidth defaultValue="list" />
          </div>
        </Frame>
      </ShowcaseSection>
    </div>
  );
}

/* ── Super-component demos (variant-aware: switch on ?type / ?effect) ── */

function ChartDemo() {
  const params = useSearchParams();
  const type = (params.get("type") as ChartType) || "line";

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const lineSeries = [
    { label: "Revenue", data: [30, 52, 45, 70, 60, 88, 75], color: "var(--ks-primary)" },
    { label: "Costs", data: [20, 28, 35, 40, 38, 50, 42], color: "var(--ks-danger)" },
  ];
  const barData = [
    { label: "Jan", value: 42 },
    { label: "Feb", value: 68 },
    { label: "Mar", value: 55 },
    { label: "Apr", value: 91 },
    { label: "May", value: 73 },
    { label: "Jun", value: 84 },
  ];
  const areaData = [
    { label: "Jan", users: 1200, sessions: 3400 },
    { label: "Feb", users: 1800, sessions: 4100 },
    { label: "Mar", users: 1600, sessions: 3800 },
    { label: "Apr", users: 2400, sessions: 5200 },
    { label: "May", users: 2100, sessions: 4800 },
    { label: "Jun", users: 3000, sessions: 6500 },
  ];
  const areaSeries = [
    { key: "users", label: "Users" },
    { key: "sessions", label: "Sessions" },
  ];
  const donutSegs = [
    { label: "React", value: 40 },
    { label: "Vue", value: 25 },
    { label: "Angular", value: 20 },
    { label: "Svelte", value: 10 },
    { label: "Other", value: 5 },
  ];
  const radarAxes = [
    { label: "Speed" },
    { label: "Power" },
    { label: "Range" },
    { label: "Defense" },
    { label: "Agility" },
  ];
  const radarSeries = [{ label: "Hero", data: [80, 65, 70, 55, 90], color: "var(--ks-primary)" }];
  const funnelStages = [
    { label: "Visits", value: 1000 },
    { label: "Signups", value: 620 },
    { label: "Active", value: 320 },
    { label: "Paid", value: 120 },
  ];
  const spark = [12, 24, 18, 36, 28, 42, 38, 55, 48, 60];

  let chart: React.ReactNode;
  switch (type) {
    case "area":
      chart = <AreaChart data={areaData} series={areaSeries} height={240} showTooltip showLegend />;
      break;
    case "bar":
      chart = <Chart type="bar" data={barData} height={220} animate />;
      break;
    case "donut":
      chart = (
        <Chart type="donut" segments={donutSegs} size={180} centerValue="100" centerLabel="responses" showLegend />
      );
      break;
    case "radar":
      chart = <Chart type="radar" axes={radarAxes} series={radarSeries} size={240} showLegend />;
      break;
    case "funnel":
      chart = <Chart type="funnel" stages={funnelStages} showPercent showConversion height={240} />;
      break;
    case "sparkline":
      chart = (
        <Chart type="sparkline" sparklineType="area" data={spark} width={220} height={64} color="var(--ks-primary)" />
      );
      break;
    default:
      chart = <Chart type="line" series={lineSeries} labels={labels} height={220} />;
  }

  return <Frame label={`Chart — type="${type}" · selecione a variante acima`}>{chart}</Frame>;
}

function TextEffectDemo() {
  const params = useSearchParams();
  const effect = (params.get("effect") as TextEffectType) || "typewriter";

  let el: React.ReactNode;
  switch (effect) {
    case "morph":
      el = (
        <TextEffect
          effect="morph"
          words={["Design", "Develop", "Deploy", "Delight"]}
          className="text-heading-03 font-bold text-foreground"
        />
      );
      break;
    case "gradient":
      el = (
        <TextEffect
          effect="gradient"
          from="var(--ks-primary)"
          to="var(--ks-kinpaku)"
          animate
          as="span"
          className="text-heading-02 font-bold"
        >
          Kikito Design System
        </TextEffect>
      );
      break;
    case "number":
      el = (
        <TextEffect
          effect="number"
          value={1234567}
          className="text-heading-02 font-bold text-foreground tabular-nums"
        />
      );
      break;
    default:
      el = (
        <TextEffect
          effect="typewriter"
          texts={["Build fast.", "Ship faster.", "Iterate always."]}
          className="text-heading-03 font-semibold text-foreground"
        />
      );
  }

  return <Frame label={`Text Effect — effect="${effect}" · selecione a variante acima`}>{el}</Frame>;
}

/* ── Registry of demos keyed by group/component ── */
const DEMOS: Record<string, React.ComponentType> = {
  "charts/chart": ChartDemo,
  "display/text-effect": TextEffectDemo,
  "tokens/colors": ColorsTokens,
  "tokens/typography": TypographyTokens,
  "inputs/button": ButtonDemo,
  "inputs/badge": BadgeDemo,
  "inputs/input": InputDemo,
  "inputs/label": LabelDemo,
  "inputs/select": SelectDemo,
  "inputs/textarea": TextareaDemo,
  "inputs/checkbox": CheckboxDemo,
  "inputs/radio": RadioDemo,
  "inputs/switch": SwitchDemo,
  "inputs/autocomplete": AutocompleteDemo,
  "inputs/color-picker": ColorPickerDemo,
  "inputs/combobox": ComboboxDemo,
  "inputs/date-picker": DatePickerDemo,
  "inputs/date-range-picker": DateRangePickerDemo,
  "inputs/file-upload": FileUploadDemo,
  "inputs/filter-bar": FilterBarDemo,
  "inputs/multi-select": MultiSelectDemo,
  "inputs/rich-select": RichSelectDemo,
  "inputs/survey-form": SurveyFormDemo,
  "inputs/time-picker": TimePickerDemo,
  "display/animated-number": AnimatedNumberDemo,
  "display/card-stack": CardStackDemo,
  "display/carousel": CarouselDemo,
  "display/event-calendar": EventCalendarDemo,
  "display/image-viewer": ImageViewerDemo,
  "display/markdown-renderer": MarkdownRendererDemo,
  "display/multi-accordion": MultiAccordionDemo,
  "display/scroll-timeline": ScrollTimelineDemo,
  "display/flip-card": FlipCardDemo,
  "display/glow-card": GlowCardDemo,
  "display/marquee-text": MarqueeTextDemo,
  "display/image-compare": ImageCompareDemo,
  "display/price-table": PriceTableDemo,
  "display/gradient-border": GradientBorderDemo,
  "display/glass-card": GlassCardDemo,
  "display/shortcut-key": ShortcutKeyDemo,
  "display/kbd": KbdDemo,
  "charts/sparkline": SparklineDemo,
  "charts/bar-chart": BarChartDemo,
  "charts/line-chart": LineChartDemo,
  "charts/donut-chart": DonutChartDemo,
  "charts/area-chart": AreaChartDemo,
  "data/data-grid": DataGridDemo,
  "data/data-list": DataListDemo,
  "data/table": TableDemo,
  "data/tree-table": TreeTableDemo,
  "data/tree-view": TreeViewDemo,
  "data/comparison-table": ComparisonTableDemo,
  "data/kanban": KanbanDemo,
  "data/json-viewer": JsonViewerDemo,
  "data/code-diff": CodeDiffDemo,
  "layout/bento-grid": BentoGridDemo,
  "layout/scroll-progress": ScrollProgressDemo,
  "layout/draggable": DraggableDemo,
  "layout/image-cropper": ImageCropperDemo,
  "layout/resizable": ResizableDemo,
  "feedback/confirm-button": ConfirmButtonDemo,
  "feedback/stopwatch": StopwatchDemo,
  "feedback/progress-ring": ProgressRingDemo,
  "feedback/log-viewer": LogViewerDemo,
  "feedback/magnetic-button": MagneticButtonDemo,
  "feedback/confetti-button": ConfettiButtonDemo,
  "overlays/command": CommandDemo,
  "overlays/context-menu": ContextMenuDemo,
  "overlays/dropdown-menu": DropdownMenuDemo,
  "overlays/floating-menu": FloatingMenuDemo,
  "overlays/spotlight-search": SpotlightSearchDemo,
  "charts/radar-chart": RadarChartDemo,
  "charts/funnel-chart": FunnelChartDemo,
  "inputs/step-form": StepFormDemo,
  "inputs/currency-input": CurrencyInputDemo,
  "inputs/floating-label-input": FloatingLabelInputDemo,
  "inputs/password-input": PasswordInputDemo,
  "inputs/search-input": SearchInputDemo,
  "inputs/number-input": NumberInputDemo,
  "inputs/pricing-toggle": PricingToggleDemo,
  "feedback/feedback-widget": FeedbackWidgetDemo,
  "layout/infinite-scroll": InfiniteScrollDemo,
  "display/morphing-text": MorphingTextDemo,
  "display/swipe-card": SwipeCardDemo,
  "display/pin-board": PinBoardDemo,
  "display/typewriter": TypewriterDemo,
  "display/audio-waveform": AudioWaveformDemo,
  "display/tilt-card": TiltCardDemo,
  "display/stat": StatDemo,
  "inputs/otp-input": OtpInputDemo,
  "inputs/phone-input": PhoneInputDemo,
  "feedback/countdown-timer": CountdownTimerDemo,
  "feedback/toast": ToastDemo,
  "layout/scroll-spy": ScrollSpyDemo,
  "layout/side-panel": SidePanelDemo,
  "layout/scroll-reveal": ScrollRevealDemo,
  "layout/mini-map": MiniMapDemo,
  "display/text-gradient": TextGradientDemo,
  "display/video-card": VideoCardDemo,
  "display/grid-pattern": GridPatternDemo,
  "display/spotlight": SpotlightDemo,
  "inputs/number-pad": NumberPadDemo,
  "inputs/newsletter-form": NewsletterFormDemo,
  "overlays/command-bar": CommandBarDemo,
  "overlays/quick-actions": QuickActionsDemo,
  "display/particle-field": ParticleFieldDemo,
  "display/theme-selector": ThemeSelectorDemo,
  "display/credit-card": CreditCardDemo,
  "display/avatar-group": AvatarGroupDemo,
  "display/empty-state": EmptyStateDemo,
  "display/timeline": TimelineDemo,
  "display/stepper": StepperDemo,
  "data/pagination": PaginationDemo,
  "layout/masonry": MasonryDemo,
  "overlays/rich-tooltip": RichTooltipDemo,
  "overlays/drawer": DrawerDemo,
  "overlays/alert-dialog": AlertDialogDemo,
  "overlays/context-card": ContextCardDemo,
  "display/activity-feed": ActivityFeedDemo,
  "display/user-card": UserCardDemo,
  "feedback/status-page": StatusPageDemo,
  "display/status-badge": StatusBadgeDemo,
  "display/tag": TagDemo,
  "inputs/tag-input": TagInputDemo,
  "inputs/inline-edit": InlineEditDemo,
  "inputs/split-button": SplitButtonDemo,
  "display/ping": PingDemo,
  "inputs/rating": RatingDemo,
  "layout/scroll-area": ScrollAreaDemo,
  "data/virtual-list": VirtualListDemo,
  "feedback/banner": BannerDemo,
  "feedback/alert": AlertDemo,
  "display/callout": CalloutDemo,
  "display/card": CardDemo,
  "display/code-block": CodeBlockDemo,
  "display/avatar": AvatarDemo,
  "overlays/tooltip": TooltipDemo,
  "overlays/popover": PopoverDemo,
  "display/hover-card": HoverCardDemo,
  "display/tabs": TabsDemo,
  "display/accordion": AccordionDemo,
  "display/collapsible": CollapsibleDemo,
  "feedback/progress": ProgressDemo,
  "feedback/spinner": SpinnerDemo,
  "feedback/skeleton": SkeletonDemo,
  "overlays/modal": ModalDemo,
  "layout/separator": SeparatorDemo,
  "inputs/slider": SliderDemo,
  "inputs/range-slider": RangeSliderDemo,
  "inputs/toggle-group": ToggleGroupDemo,
  "inputs/segmented-control": SegmentedControlDemo,
  "display/checklist": ChecklistDemo,
  "display/breadcrumb": BreadcrumbDemo,
  "display/copy-button": CopyButtonDemo,
  "charts/gauge": GaugeDemo,
  "charts/skill-bar": SkillBarDemo,
  "layout/table-of-contents": TableOfContentsDemo,
  "display/word-counter": WordCounterDemo,
  "display/animated-list": AnimatedListDemo,
  // achado 2026-08-27: as 31 abaixo tinham a funcao Demo escrita mas nunca foram wireadas
  // aqui — pagina real ficava em branco/quebrada pra usuario (mesmo bug de floating-menu/hover-card)
  "display/accordion-group": AccordionGroupDemo,
  "layout/aspect-ratio": AspectRatioDemo,
  "inputs/calendar": CalendarDemo,
  "display/chat-bubble": ChatBubbleDemo,
  "inputs/chip-group": ChipGroupDemo,
  "display/dot-stepper": DotStepperDemo,
  "inputs/fab": FabDemo,
  "display/feature-list": FeatureListDemo,
  "layout/floating-bar": FloatingBarDemo,
  "inputs/form-field": FormFieldDemo,
  "display/keyboard-shortcuts": KeyboardShortcutsDemo,
  "display/media-player": MediaPlayerDemo,
  "display/metric-card": MetricCardDemo,
  "layout/navigation-menu": NavigationMenuDemo,
  "display/note-card": NoteCardDemo,
  "feedback/notification-bell": NotificationBellDemo,
  "feedback/onboarding-tour": OnboardingTourDemo,
  "display/password-strength": PasswordStrengthDemo,
  "display/pricing-card": PricingCardDemo,
  "display/progress-steps": ProgressStepsDemo,
  "inputs/rating-input": RatingInputDemo,
  "display/receipt-card": ReceiptCardDemo,
  "display/ribbon": RibbonDemo,
  "inputs/signature-pad": SignaturePadDemo,
  "layout/sortable-list": SortableListDemo,
  "display/stats-card": StatsCardDemo,
  "display/tag-cloud": TagCloudDemo,
  "display/terminal-block": TerminalBlockDemo,
  "inputs/text-editor": TextEditorDemo,
  "display/timeline-progress": TimelineProgressDemo,
  "layout/vertical-nav": VerticalNavDemo,
  "display/window-frame": WindowFrameDemo,
};

/* ── Showcase wrapper ── */
export function CnShowcase({ group, component }: ShowcaseProps) {
  const key = `${group}/${component}`;
  const DemoComponent = DEMOS[key];

  if (DemoComponent) {
    return (
      <div className="w-full">
        <DemoComponent />
      </div>
    );
  }

  return (
    <div className="rounded-(--radius-lg) border-2 border-dashed border-rule p-12 flex flex-col items-center justify-center gap-3 min-h-[280px]">
      <span className="text-heading-03">🚧</span>
      <p className="text-body-callout font-medium text-foreground">Demo coming soon</p>
      <p className="text-body-caption text-faint">
        Add a demo component to DEMOS in _showcase.tsx for{" "}
        <code className="bg-raised px-1 rounded text-patina">{key}</code>
      </p>
    </div>
  );
}
