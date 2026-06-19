/**
 * Sistema de feature flags.
 *
 * Padrão: arquivo de configuração local com override via variável de ambiente.
 * Extensão: trocar getFlagValue por Vercel Edge Config, LaunchDarkly, etc.
 */

/** Defina aqui todas as flags disponíveis no sistema */
export type FeatureFlag = "new_dashboard" | "beta_feature" | "maintenance_mode" | "dark_mode_default";

/** Valores padrão por ambiente */
const FLAG_DEFAULTS: Record<FeatureFlag, boolean> = {
  new_dashboard: false,
  beta_feature: false,
  maintenance_mode: false,
  dark_mode_default: true,
};

/** Overrides via variável de ambiente: FEATURE_FLAGS="new_dashboard=true,beta_feature=false" */
function parseFlagOverrides(): Partial<Record<FeatureFlag, boolean>> {
  const raw = process.env.FEATURE_FLAGS;
  if (!raw) return {};

  return raw.split(",").reduce<Partial<Record<FeatureFlag, boolean>>>((acc, pair) => {
    const [key, value] = pair.trim().split("=");
    if (key && value !== undefined) {
      acc[key as FeatureFlag] = value === "true";
    }
    return acc;
  }, {});
}

/**
 * Verifica se uma feature flag está habilitada.
 * Fallback seguro: retorna false em caso de erro.
 *
 * @example
 * const enabled = await isFeatureEnabled("new_dashboard")
 * if (enabled) return <NewDashboard />
 */
export async function isFeatureEnabled(flag: FeatureFlag): Promise<boolean> {
  try {
    const overrides = parseFlagOverrides();
    return overrides[flag] ?? FLAG_DEFAULTS[flag] ?? false;
  } catch {
    return false;
  }
}

/**
 * Busca todas as flags de uma vez para evitar múltiplas chamadas.
 */
export async function getAllFeatureFlags(): Promise<Record<FeatureFlag, boolean>> {
  try {
    const overrides = parseFlagOverrides();
    return Object.fromEntries(
      Object.keys(FLAG_DEFAULTS).map((key) => [
        key as FeatureFlag,
        overrides[key as FeatureFlag] ?? FLAG_DEFAULTS[key as FeatureFlag] ?? false,
      ])
    ) as Record<FeatureFlag, boolean>;
  } catch {
    return { ...FLAG_DEFAULTS };
  }
}
