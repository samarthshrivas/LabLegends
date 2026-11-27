import type {
  ExperimentInput,
  ExperimentModel,
  ExperimentResult,
  ValidationResult,
} from "@/types/domain";
import { formatValue } from "@/lib/utils";

/**
 * Ohm's Law — ideal DC resistor.
 *
 * Model: I = V / R
 * Assumptions: single ideal resistor, constant temperature, no internal
 * resistance, no non-ohmic behaviour. This is a teaching idealisation.
 */

export const OHMS_LAW_MODEL_ID = "physics.ohms-law";
export const OHMS_LAW_VERSION = "1.0.0";

export const VOLTAGE_RANGE = { min: 1, max: 24 } as const;
export const RESISTANCE_RANGE = { min: 1, max: 100 } as const;

export function calculateCurrent(voltage: number, resistance: number): number {
  if (!Number.isFinite(voltage) || !Number.isFinite(resistance)) {
    throw new Error("Voltage and resistance must be finite numbers.");
  }
  if (resistance <= 0) {
    throw new Error("Resistance must be greater than zero.");
  }
  return voltage / resistance;
}

function validate(input: ExperimentInput): ValidationResult {
  const errors: string[] = [];
  const voltage = Number(input.parameters.voltage);
  const resistance = Number(input.parameters.resistance);

  if (!Number.isFinite(voltage)) {
    errors.push("Voltage must be a number.");
  } else if (voltage < VOLTAGE_RANGE.min || voltage > VOLTAGE_RANGE.max) {
    errors.push(
      `Voltage must be between ${VOLTAGE_RANGE.min} V and ${VOLTAGE_RANGE.max} V.`,
    );
  }

  if (!Number.isFinite(resistance)) {
    errors.push("Resistance must be a number.");
  } else if (resistance <= 0) {
    errors.push("Resistance must be greater than 0 Ω.");
  } else if (resistance < RESISTANCE_RANGE.min || resistance > RESISTANCE_RANGE.max) {
    errors.push(
      `Resistance must be between ${RESISTANCE_RANGE.min} Ω and ${RESISTANCE_RANGE.max} Ω.`,
    );
  }

  return { isValid: errors.length === 0, errors };
}

function run(input: ExperimentInput): ExperimentResult {
  const voltage = Number(input.parameters.voltage);
  const resistance = Number(input.parameters.resistance);
  const current = calculateCurrent(voltage, resistance);
  const power = voltage * current;

  const warnings: string[] = [];
  if (current > 2) {
    warnings.push(
      "This ideal circuit would draw more than 2 A. Real classroom supplies would need a current limit.",
    );
  }
  if (power > 20) {
    warnings.push(
      "Power dissipation exceeds 20 W in this ideal model — a real resistor would heat up and drift from Ohm's Law.",
    );
  }

  return {
    modelVersion: OHMS_LAW_VERSION,
    explanation:
      `Current is voltage divided by resistance. ${formatValue(voltage, 1)} V ÷ ` +
      `${formatValue(resistance, 1)} Ω = ${formatValue(current, 3)} A.`,
    warnings,
    observations: [
      {
        id: "voltage",
        label: "Supply voltage",
        value: voltage,
        unit: "V",
        description: "The potential difference across the resistor, held by the power supply.",
      },
      {
        id: "resistance",
        label: "Resistance",
        value: resistance,
        unit: "Ω",
        description: "How strongly the component opposes the flow of charge.",
      },
      {
        id: "current",
        label: "Current",
        value: current,
        unit: "A",
        description: "The rate of charge flow that results from voltage and resistance together.",
      },
    ],
  };
}

export const ohmsLawModel: ExperimentModel = {
  id: OHMS_LAW_MODEL_ID,
  version: OHMS_LAW_VERSION,
  validate,
  run,
};

/** Current at a fixed voltage across a range of resistances — used by charts. */
export function currentSeries(voltage: number, samples = 24): { x: number; y: number }[] {
  const step = (RESISTANCE_RANGE.max - RESISTANCE_RANGE.min) / (samples - 1);
  return Array.from({ length: samples }, (_, index) => {
    const resistance = RESISTANCE_RANGE.min + step * index;
    return { x: resistance, y: voltage / resistance };
  });
}
