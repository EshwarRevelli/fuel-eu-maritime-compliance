export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number; // Compliance Balance in gCO₂e
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  adjustedCbGco2eq: number; // After banking applications
}

// Constants
export const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ (2% below 91.16)
export const ENERGY_PER_TONNE = 41000; // MJ/t

/**
 * Calculate Compliance Balance
 * CB = (Target - Actual) × Energy in scope
 * Energy in scope ≈ fuelConsumption × 41,000 MJ/t
 */
export function calculateComplianceBalance(
  targetIntensity: number,
  actualIntensity: number,
  fuelConsumption: number
): number {
  const energyInScope = fuelConsumption * ENERGY_PER_TONNE;
  return (targetIntensity - actualIntensity) * energyInScope;
}



