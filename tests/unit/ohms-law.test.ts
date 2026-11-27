import { describe, expect, it } from "vitest";
import {
  calculateCurrent,
  currentSeries,
  ohmsLawModel,
  RESISTANCE_RANGE,
  VOLTAGE_RANGE,
} from "@/domain/experiments/physics/ohms-law";

describe("Ohm's law model", () => {
  it("calculates current from voltage and resistance", () => {
    expect(calculateCurrent(12, 4)).toBe(3);
    expect(calculateCurrent(24, 100)).toBe(0.24);
    expect(calculateCurrent(1, 1)).toBe(1);
  });

  it("rejects non-finite values and non-positive resistance", () => {
    expect(() => calculateCurrent(Number.NaN, 10)).toThrow(/finite/);
    expect(() => calculateCurrent(10, 0)).toThrow(/greater than zero/);
  });

  it("validates the documented ranges", () => {
    expect(ohmsLawModel.validate({ parameters: { voltage: 12, resistance: 10 } }).isValid).toBe(true);
    expect(ohmsLawModel.validate({ parameters: { voltage: 0, resistance: 10 } }).errors).toContain(
      `Voltage must be between ${VOLTAGE_RANGE.min} V and ${VOLTAGE_RANGE.max} V.`,
    );
    expect(ohmsLawModel.validate({ parameters: { voltage: 12, resistance: 101 } }).errors).toContain(
      `Resistance must be between ${RESISTANCE_RANGE.min} Ω and ${RESISTANCE_RANGE.max} Ω.`,
    );
  });

  it("produces deterministic observations and safety warnings", () => {
    const result = ohmsLawModel.run({ parameters: { voltage: 24, resistance: 2 } });
    expect(result.modelVersion).toBe("1.0.0");
    expect(result.observations.find((item) => item.id === "current")?.value).toBe(12);
    expect(result.warnings.join(" ")).toMatch(/more than 2 A/);
    expect(result.warnings.join(" ")).toMatch(/20 W/);
  });

  it("shows current falling as resistance rises at fixed voltage", () => {
    const series = currentSeries(12, 10);
    expect(series).toHaveLength(10);
    for (let index = 1; index < series.length; index += 1) {
      expect(series[index].y).toBeLessThan(series[index - 1].y);
    }
  });
});
