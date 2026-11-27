import { describe, expect, it } from "vitest";
import {
  calculateDilutedConcentration,
  dilutionModel,
  dilutionSeries,
} from "@/domain/experiments/chemistry/dilution";

describe("Dilution model", () => {
  it("conserves solute when volume increases", () => {
    expect(calculateDilutedConcentration(2, 100, 200)).toBe(1);
    expect(calculateDilutedConcentration(0.5, 50, 250)).toBeCloseTo(0.1, 10);
    expect(calculateDilutedConcentration(1, 100, 100)).toBe(1);
  });

  it("rejects impossible inputs", () => {
    expect(() => calculateDilutedConcentration(1, 100, 50)).toThrow(/cannot be smaller/);
    expect(() => calculateDilutedConcentration(0, 100, 200)).toThrow(/positive/);
    expect(() => calculateDilutedConcentration(1, Number.NaN, 200)).toThrow(/finite/);
  });

  it("validates ranges and ordering", () => {
    expect(dilutionModel.validate({ parameters: { initialConcentration: 1, initialVolume: 100, finalVolume: 250 } }).isValid).toBe(true);
    expect(
      dilutionModel.validate({ parameters: { initialConcentration: 1, initialVolume: 200, finalVolume: 100 } }).errors[0],
    ).toMatch(/at least as large/);
  });

  it("reports conserved solute and a dilution factor warning", () => {
    const result = dilutionModel.run({ parameters: { initialConcentration: 1, initialVolume: 10, finalVolume: 500 } });
    expect(result.observations.find((item) => item.id === "soluteAmount")?.value).toBe(10);
    expect(result.observations.find((item) => item.id === "finalConcentration")?.value).toBeCloseTo(0.02, 10);
    expect(result.warnings.join(" ")).toMatch(/above 10/);
  });

  it("shows concentration falling as final volume rises", () => {
    const series = dilutionSeries(1, 100, 8);
    for (let index = 1; index < series.length; index += 1) {
      expect(series[index].y).toBeLessThan(series[index - 1].y);
    }
  });
});
