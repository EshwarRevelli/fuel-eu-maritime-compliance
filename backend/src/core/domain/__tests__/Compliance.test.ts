import { calculateComplianceBalance, TARGET_INTENSITY_2025, ENERGY_PER_TONNE } from '../Compliance';

describe('Compliance Balance Calculation', () => {
  it('should calculate positive CB for below-target intensity', () => {
    const actualIntensity = 85.0; // Below target
    const fuelConsumption = 1000; // tonnes
    const cb = calculateComplianceBalance(TARGET_INTENSITY_2025, actualIntensity, fuelConsumption);

    expect(cb).toBeGreaterThan(0);
    expect(cb).toBeCloseTo((TARGET_INTENSITY_2025 - actualIntensity) * fuelConsumption * ENERGY_PER_TONNE);
  });

  it('should calculate negative CB for above-target intensity', () => {
    const actualIntensity = 95.0; // Above target
    const fuelConsumption = 1000; // tonnes
    const cb = calculateComplianceBalance(TARGET_INTENSITY_2025, actualIntensity, fuelConsumption);

    expect(cb).toBeLessThan(0);
  });

  it('should return zero CB for target intensity', () => {
    const actualIntensity = TARGET_INTENSITY_2025;
    const fuelConsumption = 1000;
    const cb = calculateComplianceBalance(TARGET_INTENSITY_2025, actualIntensity, fuelConsumption);

    expect(cb).toBe(0);
  });
});



