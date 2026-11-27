import type {
  ExperimentInput,
  ExperimentModel,
  ExperimentResult,
  ValidationResult,
} from "@/types/domain";
import { formatValue } from "@/lib/utils";

/**
 * Dilution — conservation of solute.
 *
 * Model: C1 · V1 = C2 · V2  →  C2 = (C1 · V1) / V2
 * Assumptions: solute amount is conserved, volumes are additive, no reaction,
 * evaporation or volume contraction. Virtual-only teaching model.
 */

export const DILUTION_MODEL_ID = "chemistry.dilution";
export const DILUTION_VERSION = "1.0.0";

export const CONCENTRATION_RANGE = { min: 0.1, max: 2 } as const;
export const INITIAL_VOLUME_RANGE = { min: 10, max: 250 } as const;
export const FINAL_VOLUME_RANGE = { min: 10, max: 500 } as const;

export function calculateDilutedConcentration(
  initialConcentration: number,
  initialVolume: number,
  finalVolume: number,
): number {
  if (![initialConcentration, initialVolume, finalVolume].every(Number.isFinite)) {
    throw new Error("Concentration and volumes must be finite numbers.");
  }
  if (initialConcentration <= 0) throw new Error("Initial concentration must be positive.");
  if (initialVolume <= 0) throw new Error("Initial volume must be positive.");
  if (finalVolume < initialVolume) {
    throw new Error("Final volume cannot be smaller than the initial volume in a dilution.");
  }
  return (initialConcentration * initialVolume) / finalVolume;
}

function validate(input: ExperimentInput): ValidationResult {
  const errors: string[] = [];
  const concentration = Number(input.parameters.initialConcentration);
  const initialVolume = Number(input.parameters.initialVolume);
  const finalVolume = Number(input.parameters.finalVolume);

  if (!Number.isFinite(concentration) || concentration <= 0) {
    errors.push("Initial concentration must be greater than 0 mol/L.");
  }
  if (!Number.isFinite(initialVolume) || initialVolume <= 0) {
    errors.push("Initial volume must be greater than 0 mL.");
  }
  if (!Number.isFinite(finalVolume) || finalVolume <= 0) {
    errors.push("Final volume must be greater than 0 mL.");
  }
  if (Number.isFinite(initialVolume) && Number.isFinite(finalVolume) && finalVolume < initialVolume) {
    errors.push("Final volume must be at least as large as the initial volume.");
  }

  return { isValid: errors.length === 0, errors };
}

function run(input: ExperimentInput): ExperimentResult {
  const initialConcentration = Number(input.parameters.initialConcentration);
  const initialVolume = Number(input.parameters.initialVolume);
  const finalVolume = Number(input.parameters.finalVolume);
  const finalConcentration = calculateDilutedConcentration(
    initialConcentration,
    initialVolume,
    finalVolume,
  );
  const soluteAmount = initialConcentration * initialVolume;
  const dilutionFactor = finalVolume / initialVolume;

  const warnings: string[] = [];
  if (dilutionFactor > 10) {
    warnings.push(
      "A dilution factor above 10 is extreme for a single step; real labs usually dilute in stages to reduce error.",
    );
  }
  if (finalConcentration < 0.01) {
    warnings.push(
      "The modelled concentration is very low. Real measurement uncertainty would dominate at this level.",
    );
  }

  return {
    modelVersion: DILUTION_VERSION,
    explanation:
      `The amount of solute is fixed at ${formatValue(soluteAmount, 1)} mmol. ` +
      `Spreading it through ${formatValue(finalVolume, 0)} mL gives ` +
      `${formatValue(finalConcentration, 3)} mol/L — the volume grew ${formatValue(dilutionFactor, 1)}×, ` +
      `so the concentration fell by the same factor.`,
    warnings,
    observations: [
      {
        id: "initialConcentration",
        label: "Initial concentration",
        value: initialConcentration,
        unit: "mol/L",
        description: "Concentration of the solution before extra solvent is added.",
      },
      {
        id: "initialVolume",
        label: "Initial volume",
        value: initialVolume,
        unit: "mL",
        description: "Volume of solution you start with.",
      },
      {
        id: "finalVolume",
        label: "Final volume",
        value: finalVolume,
        unit: "mL",
        description: "Total volume after adding solvent.",
      },
      {
        id: "finalConcentration",
        label: "Final concentration",
        value: finalConcentration,
        unit: "mol/L",
        description: "Concentration after dilution — solute amount unchanged.",
      },
      {
        id: "soluteAmount",
        label: "Amount of solute",
        value: soluteAmount,
        unit: "mmol",
        description: "Conserved quantity: concentration × volume.",
      },
    ],
  };
}

export const dilutionModel: ExperimentModel = {
  id: DILUTION_MODEL_ID,
  version: DILUTION_VERSION,
  validate,
  run,
};

/** Final concentration as final volume grows — used by charts. */
export function dilutionSeries(
  initialConcentration: number,
  initialVolume: number,
  samples = 24,
): { x: number; y: number }[] {
  const start = initialVolume;
  const end = FINAL_VOLUME_RANGE.max;
  const step = (end - start) / (samples - 1);
  return Array.from({ length: samples }, (_, index) => {
    const finalVolume = start + step * index;
    return { x: finalVolume, y: (initialConcentration * initialVolume) / finalVolume };
  });
}
