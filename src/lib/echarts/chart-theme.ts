export interface ChartTheme {
  textColor: string;
  mutedTextColor: string;
  faintTextColor: string;
  axisColor: string;
  surfaceColor: string;
  primaryColor: string;
  palette: string[];
  tokenColors: Record<string, string>;
}

const FALLBACKS: Record<string, string> = {
  "--ks-text": "#171717",
  "--ks-text-muted": "#737373",
  "--ks-text-faint": "#a3a3a3",
  "--ks-rule": "#d4d4d4",
  "--ks-lacquer-raised": "#ffffff",
  "--ks-primary": "#b88a2c",
  "--ks-kinpaku": "#d4af37",
  "--ks-success": "#2f9e68",
  "--ks-warning": "#c58a26",
  "--ks-danger": "#bd4b58",
  "--ks-info": "#4d83b8",
};

function readToken(name: string): string {
  if (typeof document === "undefined") return `var(${name})`;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || FALLBACKS[name] || name;
}

export function resolveChartColor(value: string, tokenColors?: Record<string, string>): string {
  const match = value.trim().match(/^var\((--[\w-]+)(?:,\s*(.+))?\)$/);
  if (!match) return value;
  return tokenColors?.[match[1]] || readToken(match[1]) || match[2] || value;
}

export function resolveChartTheme(): ChartTheme {
  // CSS variables keep SSR and hydration identical. EChartsContainer resolves
  // them to concrete values only after the client has mounted.
  const tokenColors = Object.fromEntries(Object.keys(FALLBACKS).map((name) => [name, `var(${name})`]));
  return {
    textColor: tokenColors["--ks-text"],
    mutedTextColor: tokenColors["--ks-text-muted"],
    faintTextColor: tokenColors["--ks-text-faint"],
    axisColor: tokenColors["--ks-rule"],
    surfaceColor: tokenColors["--ks-lacquer-raised"],
    primaryColor: tokenColors["--ks-primary"],
    palette: ["--ks-primary", "--ks-kinpaku", "--ks-success", "--ks-warning", "--ks-danger", "--ks-info"].map(
      (name) => tokenColors[name]
    ),
    tokenColors,
  };
}

export function withMotionPreference<T extends Record<string, unknown>>(option: T, reducedMotion: boolean): T {
  if (!reducedMotion) return option;
  return { ...option, animation: false, animationDuration: 0 };
}
