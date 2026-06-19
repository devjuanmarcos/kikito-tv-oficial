/**
 * Constantes de layout para cálculo de largura disponível da tabela.
 * Usadas para max-width da tabela considerar sidebar, padding da página e do card.
 */

/** Breakpoint em que o sidebar vira dialog (não ocupa espaço no layout). Deve bater com useIsMobile. */
export const LAYOUT_MOBILE_BREAKPOINT_PX = 768;

/** Largura do sidebar expandido (igual ao SIDEBAR_WIDTH do sidebar.tsx) */
export const LAYOUT_SIDEBAR_WIDTH_EXPANDED = "16rem";

/** Largura do sidebar recolhido (ícone apenas; igual ao .container.collapsed no globals.css) */
export const LAYOUT_SIDEBAR_WIDTH_COLLAPSED = "4.25rem";

/** Quando em mobile, sidebar é dialog e não ocupa espaço */
export const LAYOUT_SIDEBAR_WIDTH_MOBILE = "0rem";

/** Padding horizontal do SidebarInset (p-2) */
export const LAYOUT_SIDEBAR_INSET_PADDING_X = "0.5rem";

/** Padding horizontal do page container: p-2 (mobile) / p-5 (md+) */
export const LAYOUT_PAGE_PADDING_X_MOBILE = "0.5rem";  /* 8px - p-2 */
export const LAYOUT_PAGE_PADDING_X_DESKTOP = "1.25rem"; /* 20px - p-5 */

/** Padding horizontal do card (BaseCard/TableCard): p-4 (mobile) / p-6 (md+) */
export const LAYOUT_CARD_PADDING_X_MOBILE = "1rem";   /* 16px - p-4 */
export const LAYOUT_CARD_PADDING_X_DESKTOP = "1.5rem"; /* 24px - p-6 */
