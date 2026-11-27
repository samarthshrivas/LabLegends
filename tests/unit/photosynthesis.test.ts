import { describe, expect, it } from "vitest";
import {
  lightResponseSeries,
  limitingFactor,
  photosynthesisModel,
  relativeRate,
} from "@/domain/experiments/biology/photosynthesis";

describe("Photosynthesis conceptual model", () => {
  it("returns zero when either factor is zero", () => {
    expect(relativeRate(0, 800)).toBe(0);
    expect(relativeRate(1000, 0)).toBe(0);
  });

  it("increases with each factor but saturates", () => {
    const low = relativeRate(100, 800);
    const medium = relativeRate(300, 800);
    const high = relativeRate(1800, 800);
    expect(medium).toBeGreaterThan(low);
    expect(high).toBeGreaterThan(medium);
    expect(high).toBeLessThan(100);
    expect(relativeRate(2000, 1200)).toBeLessThan(100);
  });

  it("identifies the limiting factor", () => {
    expect(limitingFactor(50, 1000)).toBe("light");
    expect(limitingFactor(1800, 50)).toBe("carbon-dioxide");
    expect(limitingFactor(300, 400)).toBe("co-limited");
  });

  it("labels output as conceptual and relative", () => {
    const result = photosynthesisModel.run({ parameters: { light: 600, co2: 800 } });
    expect(result.modelVersion).toContain("conceptual");
    expect(result.warnings.join(" ")).toMatch(/relative units/);
    expect(result.observations.find((item) => item.id === "rate")?.unit).toBe("% of model max");
  });

  it("produces a saturating light-response curve", () => {
    const series = lightResponseSeries(800, 10);
    expect(series[0].y).toBe(0);
    for (let index = 1; index < series.length; index += 1) {
      expect(series[index].y).toBeGreaterThanOrEqual(series[index - 1].y);
    }
  });
});
