import type {
  ExperimentInput,
  ExperimentModel,
  ExperimentResult,
  ValidationResult,
} from "@/types/domain";
import { formatValue } from "@/lib/utils";

/**
 * Photosynthesis limiting factors — CONCEPTUAL model, not empirical data.
 *
 * Model: rate = maxRate · (I / (I + K_light)) · (C / (C + K_co2))
 * This is a saturating (Michaelis–Menten style) response in two factors. It
 * reproduces the qualitative behaviour students must reason about: each factor
 * saturates, and the lower relative factor limits the overall rate.
 *
 * Release gate: a biology subject reviewer must approve the constants below
 * before this model is used for assessment. Output is relative, not a measured
 * rate, and must never be presented as real-world data.
 */

export const PHOTOSYNTHESIS_MODEL_ID = "biology.photosynthesis-limiting-factors";
export const PHOTOSYNTHESIS_VERSION = "0.1.0-conceptual";

export const LIGHT_RANGE = { min: 0, max: 2000 } as const; // µmol m⁻² s⁻¹ (PPFD)
export const CO2_RANGE = { min: 0, max: 1200 } as const; // ppm

const MAX_RELATIVE_RATE = 100;
const LIGHT_HALF_SATURATION = 300; // µmol m⁻² s⁻¹
const CO2_HALF_SATURATION = 400; // ppm

export function relativeRate(light: number, co2: number): number {
  if (!Number.isFinite(light) || !Number.isFinite(co2)) {
    throw new Error("Light intensity and CO₂ must be finite numbers.");
  }
  if (light < 0 || co2 < 0) throw new Error("Light and CO₂ cannot be negative.");
  const lightTerm = light / (light + LIGHT_HALF_SATURATION);
  const co2Term = co2 / (co2 + CO2_HALF_SATURATION);
  return MAX_RELATIVE_RATE * lightTerm * co2Term;
}

export type LimitingFactor = "light" | "carbon-dioxide" | "co-limited";

export function limitingFactor(light: number, co2: number): LimitingFactor {
  const lightTerm = light / (light + LIGHT_HALF_SATURATION);
  const co2Term = co2 / (co2 + CO2_HALF_SATURATION);
  const delta = Math.abs(lightTerm - co2Term);
  if (delta < 0.05) return "co-limited";
  return lightTerm < co2Term ? "light" : "carbon-dioxide";
}

export const LIMITING_FACTOR_LABEL: Record<LimitingFactor, string> = {
  light: "Light intensity",
  "carbon-dioxide": "CO₂ availability",
  "co-limited": "Both factors about equally limiting",
};

function validate(input: ExperimentInput): ValidationResult {
  const errors: string[] = [];
  const light = Number(input.parameters.light);
  const co2 = Number(input.parameters.co2);

  if (!Number.isFinite(light)) errors.push("Light intensity must be a number.");
  else if (light < LIGHT_RANGE.min || light > LIGHT_RANGE.max) {
    errors.push(`Light must be between ${LIGHT_RANGE.min} and ${LIGHT_RANGE.max} µmol m⁻² s⁻¹.`);
  }

  if (!Number.isFinite(co2)) errors.push("CO₂ must be a number.");
  else if (co2 < CO2_RANGE.min || co2 > CO2_RANGE.max) {
    errors.push(`CO₂ must be between ${CO2_RANGE.min} and ${CO2_RANGE.max} ppm.`);
  }

  return { isValid: errors.length === 0, errors };
}

function run(input: ExperimentInput): ExperimentResult {
  const light = Number(input.parameters.light);
  const co2 = Number(input.parameters.co2);
  const rate = relativeRate(light, co2);
  const limiting = limitingFactor(light, co2);
  const lightTerm = light / (light + LIGHT_HALF_SATURATION);
  const co2Term = co2 / (co2 + CO2_HALF_SATURATION);

  const warnings: string[] = [
    "Conceptual model only: values are relative units, not measured photosynthesis rates.",
  ];
  if (light === 0 || co2 === 0) {
    warnings.push("With one factor at zero, the modelled rate is zero regardless of the other.");
  }

  return {
    modelVersion: PHOTOSYNTHESIS_VERSION,
    explanation:
      `Relative rate is ${formatValue(rate, 1)}% of the model maximum. ` +
      `Light is at ${formatValue(lightTerm * 100, 0)}% of its own capacity and CO₂ at ` +
      `${formatValue(co2Term * 100, 0)}%. The smaller of the two pulls the overall rate down, ` +
      `so the limiting factor is: ${LIMITING_FACTOR_LABEL[limiting].toLowerCase()}.`,
    warnings,
    observations: [
      {
        id: "rate",
        label: "Relative photosynthesis rate",
        value: rate,
        unit: "% of model max",
        description: "Model output in relative units — useful for comparisons, not a measurement.",
      },
      {
        id: "light",
        label: "Light intensity",
        value: light,
        unit: "µmol m⁻² s⁻¹",
        description: "Light available to the chloroplasts (PPFD).",
      },
      {
        id: "co2",
        label: "CO₂ availability",
        value: co2,
        unit: "ppm",
        description: "Carbon dioxide concentration around the leaf.",
      },
      {
        id: "limitingFactor",
        label: "Limiting factor",
        value: LIMITING_FACTOR_LABEL[limiting],
        description: "The factor with the smaller relative saturation, which caps the modelled rate.",
      },
    ],
  };
}

export const photosynthesisModel: ExperimentModel = {
  id: PHOTOSYNTHESIS_MODEL_ID,
  version: PHOTOSYNTHESIS_VERSION,
  validate,
  run,
};

/** Rate as light rises at fixed CO₂ — shows saturation. */
export function lightResponseSeries(co2: number, samples = 28): { x: number; y: number }[] {
  const step = LIGHT_RANGE.max / (samples - 1);
  return Array.from({ length: samples }, (_, index) => {
    const light = step * index;
    return { x: light, y: relativeRate(light, co2) };
  });
}
