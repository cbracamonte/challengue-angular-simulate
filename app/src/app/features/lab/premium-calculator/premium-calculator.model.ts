/**
 * Niveles de cobertura de la póliza. Union type literal (no un enum): estos
 * valores solo se usan como claves de un lookup y como opciones de un
 * `<select>` — no necesitan la maquinaria en tiempo de ejecución de un enum
 * de TypeScript, un tipo puramente estructural alcanza.
 */
export type PolicyTier = 'basico' | 'estandar' | 'premium';

/** Prima base y deducible recomendado para un nivel de cobertura. */
export interface TierPricing {
  base: number;
  deductible: number;
}

/**
 * Lookup plano (`Record`, NO un signal): estos valores son configuración
 * estática que no cambia en runtime, así que no hay ningún estado que
 * modelar reactivamente acá — es una tabla de referencia, igual que
 * cualquier constante de configuración del dominio.
 */
export const TIER_PRICING: Record<PolicyTier, TierPricing> = {
  basico: { base: 800, deductible: 500 },
  estandar: { base: 1200, deductible: 300 },
  premium: { base: 2000, deductible: 100 },
};

export const POLICY_TIERS: PolicyTier[] = ['basico', 'estandar', 'premium'];

/** Porcentaje del deducible que se carga a la prima total (carga por riesgo asumido). */
export const DEDUCTIBLE_LOAD_FACTOR = 0.1;

/** Forma de lo que persiste el `effect()` en `localStorage`. */
export interface StoredSelection {
  tier: PolicyTier;
  deductible: number;
}

export const PREMIUM_CALCULATOR_STORAGE_KEY = 'lab.premium-calculator.selection';
