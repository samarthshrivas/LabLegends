import type { ExperimentModel, Subject } from "@/types/domain";
import { ohmsLawModel, OHMS_LAW_MODEL_ID } from "./physics/ohms-law";
import { dilutionModel, DILUTION_MODEL_ID } from "./chemistry/dilution";
import {
  photosynthesisModel,
  PHOTOSYNTHESIS_MODEL_ID,
} from "./biology/photosynthesis";

const MODELS: Record<string, ExperimentModel> = {
  [OHMS_LAW_MODEL_ID]: ohmsLawModel,
  [DILUTION_MODEL_ID]: dilutionModel,
  [PHOTOSYNTHESIS_MODEL_ID]: photosynthesisModel,
};

export function getExperimentModel(modelId: string): ExperimentModel | undefined {
  return MODELS[modelId];
}

export function requireExperimentModel(modelId: string): ExperimentModel {
  const model = MODELS[modelId];
  if (!model) {
    throw new Error(`Unknown experiment model: ${modelId}`);
  }
  return model;
}

export const SUBJECT_MODEL_ID: Record<Subject, string> = {
  physics: OHMS_LAW_MODEL_ID,
  chemistry: DILUTION_MODEL_ID,
  biology: PHOTOSYNTHESIS_MODEL_ID,
};

export { ohmsLawModel, dilutionModel, photosynthesisModel };
export { OHMS_LAW_MODEL_ID, DILUTION_MODEL_ID, PHOTOSYNTHESIS_MODEL_ID };
