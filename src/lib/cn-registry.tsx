export type CnGroup =
  | 'tokens'
  | 'inputs'
  | 'display'
  | 'data'
  | 'feedback'
  | 'layout'
  | 'overlays'
  | 'charts'

export interface CnComponentMeta {
  name: string
  title: string
  group: CnGroup
  description: string
}

export interface CnGroupMeta {
  id: CnGroup
  label: string
  description: string
  icon: string
}

export const CN_GROUPS: CnGroupMeta[] = [
  { id: 'tokens',   label: 'Tokens',   description: 'Design tokens: cores, tipografia e escala visual', icon: '◈' },
  { id: 'inputs',   label: 'Inputs',   description: 'Form controls and text entry',      icon: '⌨️' },
  { id: 'display',  label: 'Display',  description: 'Content presentation components',   icon: '🎨' },
  { id: 'data',     label: 'Data',     description: 'Tables, lists and data structures', icon: '📊' },
  { id: 'feedback', label: 'Feedback', description: 'Status, alerts and notifications',  icon: '💬' },
  { id: 'layout',   label: 'Layout',   description: 'Structure and arrangement',          icon: '🧩' },
  { id: 'overlays', label: 'Overlays', description: 'Modals, popovers and menus',        icon: '🪟' },
  { id: 'charts',   label: 'Charts',   description: 'Data visualization',                icon: '📈' },
]

export const CN_REGISTRY: CnComponentMeta[] = [
  { name: 'colors',      title: 'Colors',      group: 'tokens',  description: 'Paleta de design tokens: brand intents, semantics, surfaces, texto e escala.' },
  { name: 'typography',  title: 'Typography',  group: 'tokens',  description: 'Escala tipográfica com font switcher, pesos e tokens de espaçamento.' },
  { name: 'banner',           title: 'Banner',           group: 'feedback', description: 'Inline alert strip with intent variants, optional icon, action and dismiss.' },
  { name: 'callout',          title: 'Callout',          group: 'display',  description: 'Block callout with soft / outline / solid appearances and close button.' },
  { name: 'checklist',        title: 'Checklist',        group: 'display',  description: 'Interactive checklist with progress bar, intent colors and strikethrough.' },
  { name: 'breadcrumb',       title: 'Breadcrumb',       group: 'display',  description: 'Breadcrumb trail with separator, maxItems collapse and icon support.' },
  { name: 'copy-button',      title: 'Copy Button',      group: 'display',  description: 'Button that copies text to clipboard with animated success feedback.' },
  { name: 'gauge',            title: 'Gauge',            group: 'charts',   description: 'Circular SVG gauge with animated fill, intent colors and size variants.' },
  { name: 'skill-bar',        title: 'Skill Bar',        group: 'charts',   description: 'Horizontal progress bars for skills with IntersectionObserver animation.' },
  { name: 'table-of-contents',title: 'Table of Contents',group: 'layout',   description: 'Scrollspy TOC with active tracking via IntersectionObserver.' },
  { name: 'word-counter',     title: 'Word Counter',     group: 'display',  description: 'Textarea with live word / char / sentence / read-time counters and limit bar.' },
  { name: 'animated-list',    title: 'Animated List',    group: 'display',  description: 'Staggered entry animation for any list of children with direction control.' },
  { name: 'autocomplete',    title: 'Autocomplete',    group: 'inputs',   description: 'Text input with filtered suggestion dropdown and keyboard navigation.' },
  { name: 'color-picker',    title: 'Color Picker',    group: 'inputs',   description: 'Swatch grid with hex input and native color picker integration.' },
  { name: 'combobox',        title: 'Combobox',        group: 'inputs',   description: 'Multi-select combobox with tag chips and filterable dropdown.' },
  { name: 'date-picker',     title: 'Date Picker',     group: 'inputs',   description: 'Calendar overlay with days/months/years views and keyboard navigation.' },
  { name: 'date-range-picker', title: 'Date Range Picker', group: 'inputs', description: 'Dual-calendar overlay for selecting a start and end date range.' },
  { name: 'file-upload',     title: 'File Upload',     group: 'inputs',   description: 'Drag-and-drop zone or button variant with file list and size validation.' },
  { name: 'filter-bar',      title: 'Filter Bar',      group: 'inputs',   description: 'Pill chip filter set with multi/single select modes and clear action.' },
  { name: 'multi-select',    title: 'Multi Select',    group: 'inputs',   description: 'Multi-value select with tag chips, search filtering and keyboard navigation.' },
  { name: 'rich-select',     title: 'Rich Select',     group: 'inputs',   description: 'Single-value dropdown with icon, description, badge and group support.' },
  { name: 'survey-form',     title: 'Survey Form',     group: 'inputs',   description: 'Form with text, radio, checkbox, scale and star rating question types.' },
  { name: 'animated-number', title: 'Animated Number', group: 'display',  description: 'Number counter with smooth easing animation on value change.' },
  { name: 'card-stack',      title: 'Card Stack',      group: 'display',  description: 'Stacked card carousel with depth, scale and auto-play support.' },
  { name: 'carousel',        title: 'Carousel',        group: 'display',  description: 'Horizontal/vertical image or card carousel with dots and auto-play.' },
  { name: 'event-calendar',  title: 'Event Calendar',  group: 'display',  description: 'Monthly calendar grid with color-coded event chips and day click handler.' },
  { name: 'image-viewer',    title: 'Image Viewer',    group: 'display',  description: 'Thumbnail grid with full-screen lightbox, arrow navigation and captions.' },
  { name: 'markdown-renderer', title: 'Markdown Renderer', group: 'display', description: 'Renders Markdown to styled HTML with code blocks, blockquotes and tables.' },
  { name: 'multi-accordion', title: 'Multi Accordion', group: 'display',  description: 'Accordion allowing multiple panels open simultaneously with intent variants.' },
  { name: 'scroll-timeline', title: 'Scroll Timeline', group: 'display',  description: 'Vertical or horizontal timeline with alternating content layout.' },
  { name: 'aceternity-cards-demo-3',     title: 'Aceternity Cards',    group: 'display',  description: 'Animated AI-tool card with orbiting beam and multi-brand icon bubbles.' },
  { name: 'aceternity-features-section', title: 'Aceternity Features', group: 'display',  description: 'Three-column feature section with chat, file sharing and collaboration demos.' },
  { name: 'flip-card',      title: 'Flip Card',       group: 'display',  description: '3D flip card with hover or click trigger and horizontal/vertical axis.' },
  { name: 'glow-card',      title: 'Glow Card',       group: 'display',  description: 'Card with mouse-tracked radial glow effect via CSS custom properties.' },
  { name: 'marquee-text',   title: 'Marquee Text',    group: 'display',  description: 'Infinite scrolling marquee ticker with speed, size and repeat controls.' },
  { name: 'image-compare',  title: 'Image Compare',   group: 'display',  description: 'Before/after image slider with draggable divider and label overlays.' },
  { name: 'price-table',    title: 'Price Table',     group: 'display',  description: 'Pricing plans table with CTA buttons, feature rows and highlighted plan column.' },
  { name: 'gradient-border', title: 'Gradient Border', group: 'display', description: 'Animated spinning or pulsing gradient border wrapper for any content.' },
  { name: 'glass-card',     title: 'Glass Card',      group: 'display',  description: 'Frosted glass card with configurable backdrop blur, opacity and border.' },
  { name: 'shortcut-key',   title: 'Shortcut Key',    group: 'display',  description: 'Keyboard shortcut display with special key symbols and size/variant options.' },
  { name: 'morphing-text',  title: 'Morphing Text',   group: 'display',  description: 'Animated cycling text that morphs between words with blur transition.' },
  { name: 'swipe-card',     title: 'Swipe Card',      group: 'display',  description: 'Tinder-style stacked cards with mouse drag to dismiss left or right.' },
  { name: 'pin-board',      title: 'Pin Board',       group: 'display',  description: 'Draggable sticky notes on a free-position board with add and delete.' },
  { name: 'sparkline',       title: 'Sparkline',       group: 'charts',   description: 'Compact inline SVG line, area or bar chart for trend visualization.' },
  { name: 'bar-chart',      title: 'Bar Chart',       group: 'charts',   description: 'Animated SVG bar chart with IntersectionObserver reveal and per-bar colors.' },
  { name: 'line-chart',     title: 'Line Chart',      group: 'charts',   description: 'Multi-series SVG line chart with optional area fill and legend.' },
  { name: 'donut-chart',    title: 'Donut Chart',     group: 'charts',   description: 'SVG donut/pie chart with stroke-based segments, center label and legend.' },
  { name: 'area-chart',     title: 'Area Chart',      group: 'charts',   description: 'SVG area chart with gradient fills, tooltip and optional stacking.' },
  { name: 'radar-chart',    title: 'Radar Chart',     group: 'charts',   description: 'Spider/radar polygon chart with multi-series support, level grid and legend.' },
  { name: 'funnel-chart',   title: 'Funnel Chart',    group: 'charts',   description: 'Trapezoid funnel visualization with conversion rates between stages.' },
  { name: 'typewriter',     title: 'Typewriter',      group: 'display',  description: 'Animated typewriter that types, pauses and deletes cycling text strings.' },
  { name: 'audio-waveform', title: 'Audio Waveform',  group: 'display',  description: 'Animated bar waveform visualization that bounces when playing=true.' },
  { name: 'tilt-card',      title: 'Tilt Card',       group: 'display',  description: '3D mouse-tracked tilt effect with optional glare highlight on hover.' },
  { name: 'stat',            title: 'Stat',             group: 'display',  description: 'Stat card with value, trend badge, icon, intent accent and skeleton loading.' },
  { name: 'text-gradient',  title: 'Text Gradient',   group: 'display',  description: 'Inline gradient text with optional animated flow and custom color stops.' },
  { name: 'video-card',     title: 'Video Card',      group: 'display',  description: 'Video thumbnail card with play overlay, duration badge and category pill.' },
  { name: 'grid-pattern',   title: 'Grid Pattern',    group: 'display',  description: 'SVG background pattern (dots, lines, cross, grid) as decorative layer.' },
  { name: 'spotlight',      title: 'Spotlight',       group: 'display',  description: 'Mouse-tracked radial spotlight effect wrapper with configurable color.' },
  { name: 'data-grid',       title: 'Data Grid',       group: 'data',     description: 'Sortable, selectable table with sticky header, striped rows and checkboxes.' },
  { name: 'data-list',       title: 'Data List',       group: 'data',     description: 'Key-value list in horizontal, vertical or grid layout with border/stripe variants.' },
  { name: 'table',           title: 'Table',           group: 'data',     description: 'Primitive table elements and full DataTable with filters, sort and pagination.' },
  { name: 'tree-table',      title: 'Tree Table',      group: 'data',     description: 'Expandable tree hierarchy rendered in a table with inline toggle controls.' },
  { name: 'comparison-table', title: 'Comparison Table', group: 'data',   description: 'Feature comparison table with check/cross cells, group rows and highlighted columns.' },
  { name: 'kanban',          title: 'Kanban',          group: 'data',     description: 'Drag-and-drop kanban board with column intents, cards, labels and assignees.' },
  { name: 'json-viewer',     title: 'JSON Viewer',     group: 'data',     description: 'Interactive collapsible JSON tree with syntax coloring for all value types.' },
  { name: 'code-diff',      title: 'Code Diff',       group: 'data',     description: 'Unified or split-view diff viewer with LCS algorithm and line numbers.' },
  { name: 'bento-grid',     title: 'Bento Grid',      group: 'layout',   description: 'CSS grid layout with configurable column/row span per cell item.' },
  { name: 'scroll-progress', title: 'Scroll Progress', group: 'layout',  description: 'Fixed progress bar that tracks page or element scroll position.' },
  { name: 'draggable',       title: 'Draggable',       group: 'layout',   description: 'Drag-and-drop reorderable list with handle and drop indicator.' },
  { name: 'image-cropper',   title: 'Image Cropper',   group: 'layout',   description: 'Drag-to-crop image overlay with corner handles and optional aspect lock.' },
  { name: 'resizable',       title: 'Resizable',       group: 'layout',   description: 'Split pane with draggable divider for horizontal or vertical resizing.' },
  { name: 'infinite-scroll', title: 'Infinite Scroll', group: 'layout',   description: 'IntersectionObserver sentinel wrapper that triggers onLoadMore when visible.' },
  { name: 'scroll-spy',     title: 'Scroll Spy',      group: 'layout',   description: 'Navigation list that highlights the active section as the user scrolls.' },
  { name: 'side-panel',      title: 'Side Panel',      group: 'layout',   description: 'Collapsible side panel split layout with animated width transition and toggle.' },
  { name: 'scroll-reveal',  title: 'Scroll Reveal',   group: 'layout',   description: 'IntersectionObserver wrapper that animates children into view on scroll.' },
  { name: 'mini-map',       title: 'Mini Map',        group: 'layout',   description: 'Dot-based page section navigator with active indicator and smooth scroll.' },
  { name: 'time-picker',    title: 'Time Picker',     group: 'inputs',   description: 'Dropdown time selector with hour/minute scrollers and 12/24h format support.' },
  { name: 'step-form',      title: 'Step Form',       group: 'inputs',   description: 'Multi-step form with step indicator bar, validation and completion callback.' },
  { name: 'currency-input', title: 'Currency Input',  group: 'inputs',   description: 'Formatted currency input that switches to raw number editing on focus.' },
  { name: 'pricing-toggle', title: 'Pricing Toggle',  group: 'inputs',   description: 'Monthly/yearly billing period toggle with savings badge and sliding thumb.' },
  { name: 'otp-input',      title: 'OTP Input',       group: 'inputs',   description: 'One-time password digit cells with paste, arrow navigation and mask support.' },
  { name: 'phone-input',     title: 'Phone Input',     group: 'inputs',   description: 'Phone number input with country flag/dial-code selector and formatting.' },
  { name: 'number-pad',     title: 'Number Pad',      group: 'inputs',   description: 'PIN-style numeric keypad with masked dot display and completion callback.' },
  { name: 'newsletter-form', title: 'Newsletter Form', group: 'inputs',   description: 'Email subscription form in card, inline or minimal variant with validation.' },
  { name: 'feedback-widget',  title: 'Feedback Widget',  group: 'feedback', description: 'NPS, star rating or emoji feedback collector with comment textarea and submit.' },
  { name: 'countdown-timer', title: 'Countdown Timer',  group: 'feedback', description: 'Countdown display with days/hours/minutes/seconds and completion callback.' },
  { name: 'toast',           title: 'Toast',            group: 'feedback', description: 'Toast notification system with context provider, useToast hook and placement.' },
  { name: 'confirm-button',  title: 'Confirm Button',  group: 'feedback', description: 'Double-click or hold-to-confirm button with progress fill and intent variants.' },
  { name: 'stopwatch',      title: 'Stopwatch',       group: 'feedback', description: 'Stopwatch with start/pause/reset, lap recording and scrollable lap list.' },
  { name: 'progress-ring',  title: 'Progress Ring',   group: 'feedback', description: 'SVG circular progress indicator with animated stroke and intent color variants.' },
  { name: 'log-viewer',    title: 'Log Viewer',      group: 'feedback', description: 'Terminal-style scrollable log list with level badges, timestamps and text filter.' },
  { name: 'magnetic-button', title: 'Magnetic Button', group: 'feedback', description: 'Button that follows mouse cursor with configurable strength and attraction radius.' },
  { name: 'confetti-button', title: 'Confetti Button', group: 'feedback', description: 'Button that fires a canvas confetti burst animation on click.' },
  { name: 'command',         title: 'Command',         group: 'overlays', description: 'Command palette with ⌘K trigger, grouped actions and accent-insensitive search.' },
  { name: 'context-menu',    title: 'Context Menu',    group: 'overlays', description: 'Right-click context menu with grouped items, icons and danger state.' },
  { name: 'spotlight-search', title: 'Spotlight Search', group: 'overlays', description: 'Full-screen search overlay with grouped actions and keyboard navigation.' },
  { name: 'command-bar',    title: 'Command Bar',     group: 'overlays', description: 'Inline command search bar with groups, icons, shortcuts and keyboard nav.' },
  { name: 'quick-actions',  title: 'Quick Actions',   group: 'overlays', description: 'Expandable FAB menu with animated action buttons in configurable placement.' },
  { name: 'particle-field', title: 'Particle Field',  group: 'display',  description: 'Canvas animation with floating particles and connecting lines network.' },
  { name: 'theme-selector', title: 'Theme Selector',  group: 'display',  description: 'Color theme picker showing palette swatches with active selection indicator.' },
  { name: 'credit-card',    title: 'Credit Card',     group: 'display',  description: '3D flip card displaying number, holder name, expiry and CVV faces.' },
  { name: 'avatar-group',   title: 'Avatar Group',    group: 'display',  description: 'Overlapping avatar stack with initials, images and overflow counter.' },
  { name: 'empty-state',    title: 'Empty State',     group: 'display',  description: 'Centered placeholder with icon, title, description and action button.' },
  { name: 'timeline',       title: 'Timeline',        group: 'display',  description: 'Vertical event timeline with status icons, badges and connecting lines.' },
  { name: 'stepper',        title: 'Stepper',         group: 'display',  description: 'Step indicator with horizontal/vertical orientation, status icons and content.' },
  { name: 'pagination',     title: 'Pagination',      group: 'data',     description: 'Page navigator with ellipsis, edge buttons, range label and size variants.' },
  { name: 'masonry',        title: 'Masonry',         group: 'layout',   description: 'CSS column-based masonry grid with configurable columns and gap.' },
  { name: 'rich-tooltip',   title: 'Rich Tooltip',    group: 'overlays', description: 'Hover tooltip with icon, title, body content, action button and placement.' },
  { name: 'drawer',         title: 'Drawer',          group: 'overlays', description: 'Side-anchored panel with CSS-animated slide-in from left/right/top/bottom.' },
  { name: 'alert-dialog',   title: 'Alert Dialog',    group: 'overlays', description: 'Confirmation dialog with intent (danger/warning/primary), portal and spinner.' },
  { name: 'context-card',   title: 'Context Card',    group: 'overlays', description: 'CSS-hover card popup with placement and configurable width.' },
  { name: 'activity-feed',  title: 'Activity Feed',   group: 'display',  description: 'Chronological activity list with avatars, icons, intents and timestamps.' },
  { name: 'user-card',      title: 'User Card',       group: 'display',  description: 'Profile card with cover, avatar, bio, stats and follow toggle.' },
  { name: 'status-page',    title: 'Status Page',     group: 'feedback', description: 'Service status grid with group sections and operational/degraded indicators.' },
  { name: 'status-badge',   title: 'Status Badge',    group: 'display',  description: 'Colored dot presence badge with optional pulse animation and label.' },
  { name: 'rating',         title: 'Rating',          group: 'inputs',   description: 'Star rating with half-star support, hover preview and size variants.' },
  { name: 'scroll-area',    title: 'Scroll Area',     group: 'layout',   description: 'Custom scrollbar overlay with thin styled webkit/firefox scrollbars.' },
  { name: 'virtual-list',   title: 'Virtual List',    group: 'data',     description: 'Windowed list renderer with fixed item height and configurable overscan.' },
]

export function getComponent(group: string, name: string): CnComponentMeta | undefined {
  return CN_REGISTRY.find(c => c.group === group && c.name === name)
}

export function getGroup(id: string): CnGroupMeta | undefined {
  return CN_GROUPS.find(g => g.id === id)
}

export function getComponentsByGroup(group: string): CnComponentMeta[] {
  return CN_REGISTRY.filter(c => c.group === group)
}

export function generateStaticComponentParams() {
  return CN_REGISTRY.map(c => ({ group: c.group, component: c.name }))
}
