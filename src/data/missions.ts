import type { Mission, Subject } from "@/types/domain";
import { DILUTION_MODEL_ID } from "@/domain/experiments/chemistry/dilution";
import { OHMS_LAW_MODEL_ID } from "@/domain/experiments/physics/ohms-law";
import { PHOTOSYNTHESIS_MODEL_ID } from "@/domain/experiments/biology/photosynthesis";

const DEFAULT_RUBRIC = [
  {
    id: "prediction" as const,
    label: "Prediction clarity",
    weight: 20,
    description: "A testable, directional prediction naming the variable that changes.",
  },
  {
    id: "justification" as const,
    label: "Scientific justification",
    weight: 25,
    description: "A relevant concept or relationship that explains the prediction.",
  },
  {
    id: "control" as const,
    label: "Experimental control",
    weight: 20,
    description: "Fair testing: one variable changed while another is held constant.",
  },
  {
    id: "evidence" as const,
    label: "Evidence use",
    weight: 20,
    description: "Cites actual recorded observations from the run history.",
  },
  {
    id: "conclusion" as const,
    label: "Conclusion & reflection",
    weight: 15,
    description: "Conclusion follows from evidence and acknowledges revision.",
  },
];

export const MISSIONS: Mission[] = [
  {
    id: "satellite-went-dark",
    version: 1,
    title: "The Satellite That Went Dark",
    codename: "Mission 01 · Orbital Power",
    subject: "physics",
    gradeBand: "9-10",
    difficulty: "starter",
    estimatedMinutes: 15,
    baseXp: 120,
    hook: "A research satellite's power bus is failing. The telemetry looks random — until you control the variables.",
    briefing: [
      "Six hours ago the Kestrel-7 research satellite lost power to its instrument deck. The solar arrays are healthy, so the fault is somewhere in the power bus: the path that carries charge from the supply to the instruments.",
      "Downlinked telemetry is incomplete. Engineers suspect the bus resistor has drifted, but they cannot agree on what a higher resistance would do to the current. Some insist more resistance means more current. Others say the opposite.",
      "You have a virtual replica of the bus. Hold the supply voltage steady, change the resistance, and observe the ammeter. Your job is not to guess the answer — it is to produce evidence that settles the argument.",
    ],
    objective:
      "Determine how resistance affects current when voltage is held constant, and justify it with the relationship I = V / R.",
    objectives: [
      "Predict the direction of change before running the experiment.",
      "Hold voltage constant and vary resistance across at least two trials.",
      "Use the observed current values as evidence in your conclusion.",
      "Explain the relationship between voltage, resistance and current.",
    ],
    concepts: ["Ohm's law", "Current", "Voltage", "Resistance", "Fair testing"],
    misconceptions: [
      "“More resistance always means more current.”",
      "“Current is used up as it travels around a circuit.”",
    ],
    apparatus: [
      "Ideal DC supply, adjustable 1–24 V",
      "Single fixed resistor, 1–100 Ω",
      "Ammeter in series with the resistor",
      "Virtual bus replica (no real electrical hazard)",
    ],
    experimentModelId: OHMS_LAW_MODEL_ID,
    parameters: [
      {
        id: "voltage",
        label: "Supply voltage",
        symbol: "V",
        unit: "V",
        min: 1,
        max: 24,
        step: 0.5,
        defaultValue: 12,
        decimals: 1,
        help: "Potential difference provided by the bus. Keep this fixed to test resistance fairly.",
      },
      {
        id: "resistance",
        label: "Bus resistance",
        symbol: "R",
        unit: "Ω",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 10,
        decimals: 0,
        help: "How strongly the component opposes charge flow. Higher resistance means less current at the same voltage.",
      },
    ],
    hypothesisPrompt:
      "If resistance increases while voltage stays the same, what will happen to the current? Explain why.",
    conclusionPrompt:
      "Using your run history, state what happened to current as resistance changed and explain the relationship.",
    hints: [
      {
        id: "h1",
        title: "Find your fixed variable",
        body: "Decide which quantity you are deliberately keeping constant. If voltage changes between runs, you cannot tell whether voltage or resistance caused the difference.",
      },
      {
        id: "h2",
        title: "Inspect the relationship",
        body: "Current equals voltage divided by resistance: I = V / R. If the divisor gets larger while the numerator stays the same, what happens to the result?",
      },
      {
        id: "h3",
        title: "Compare two runs",
        body: "Run 1: 12 V with 10 Ω. Run 2: 12 V with 20 Ω. Compare the two current readings and describe the change as a factor.",
      },
    ],
    rubric: DEFAULT_RUBRIC,
    masteryThreshold: 70,
    limitations:
      "Ideal DC resistor. Temperature dependence, internal resistance, wires and non-ohmic components are excluded, so real readings will differ.",
    references: [
      "Ohm's law — any standard secondary physics textbook (V = IR for an ohmic conductor at constant temperature).",
    ],
    simulated: true,
    available: true,
    reviewStatus: "reviewed",
  },
  {
    id: "mystery-of-concentration",
    version: 1,
    title: "The Mystery of the Concentration",
    codename: "Mission 02 · The Diluted Sample",
    subject: "chemistry",
    gradeBand: "9-10",
    difficulty: "core",
    estimatedMinutes: 18,
    baseXp: 140,
    hook: "A lab report claims a sample got stronger after water was added. The numbers say otherwise.",
    briefing: [
      "A partner lab sent over a report on a copper sulfate sample. Their notes say the solution was diluted with distilled water — yet the recorded concentration went up.",
      "You cannot re-run their experiment, but you can model it. In this virtual dilution bench the amount of dissolved solute is conserved. Only the total volume changes.",
      "Work out what the concentration must do as volume grows, then decide whether the report contains a measurement error or a reasoning error.",
    ],
    objective:
      "Explain how concentration changes when solvent is added while the amount of solute stays constant, using C₁V₁ = C₂V₂.",
    objectives: [
      "Predict the direction of concentration change before running.",
      "Keep the initial solution fixed and vary only the final volume.",
      "Compare the solute amount across runs to show it is conserved.",
      "Use C₁V₁ = C₂V₂ to justify your conclusion.",
    ],
    concepts: ["Concentration", "Solute", "Solvent", "Conservation", "Dilution factor"],
    misconceptions: [
      "“Adding water increases the amount of solute.”",
      "“Concentration stays the same if you only add solvent.”",
    ],
    apparatus: [
      "Virtual volumetric flask, 10–500 mL",
      "Stock solution, 0.1–2.0 mol/L",
      "Distilled water dispenser",
      "Concentration readout (virtual only — no chemicals handled)",
    ],
    experimentModelId: DILUTION_MODEL_ID,
    parameters: [
      {
        id: "initialConcentration",
        label: "Stock concentration",
        symbol: "C₁",
        unit: "mol/L",
        min: 0.1,
        max: 2,
        step: 0.05,
        defaultValue: 1,
        decimals: 2,
        help: "Concentration of the solution before any extra solvent is added.",
      },
      {
        id: "initialVolume",
        label: "Initial volume",
        symbol: "V₁",
        unit: "mL",
        min: 10,
        max: 250,
        step: 5,
        defaultValue: 50,
        decimals: 0,
        help: "Volume of stock solution transferred. This fixes the amount of solute.",
      },
      {
        id: "finalVolume",
        label: "Final volume",
        symbol: "V₂",
        unit: "mL",
        min: 10,
        max: 500,
        step: 5,
        defaultValue: 250,
        decimals: 0,
        help: "Total volume after adding solvent. Must be at least the initial volume.",
      },
    ],
    hypothesisPrompt:
      "What happens to the concentration when the same amount of solute is spread through a larger volume? Explain why.",
    conclusionPrompt:
      "Use the solute amount and final concentration from your runs to explain the dilution relationship.",
    hints: [
      {
        id: "h1",
        title: "Separate solute from solution",
        body: "The solute is the dissolved substance. The solution includes the solvent. Adding water changes the solution volume, not the amount of solute.",
      },
      {
        id: "h2",
        title: "Track the conserved quantity",
        body: "Concentration × volume gives the amount of solute. That number should be identical before and after dilution.",
      },
      {
        id: "h3",
        title: "Use the equation",
        body: "C₁V₁ = C₂V₂. Solve for C₂: divide both sides by V₂. If V₂ doubles while C₁V₁ is fixed, what happens to C₂?",
      },
    ],
    rubric: DEFAULT_RUBRIC,
    masteryThreshold: 70,
    limitations:
      "Ideal dilution: volumes are treated as additive, solute amount is exactly conserved, and no reaction, evaporation or volume contraction occurs.",
    references: [
      "Dilution equation C₁V₁ = C₂V₂ — standard secondary chemistry treatment of solution concentration.",
    ],
    simulated: true,
    available: true,
    reviewStatus: "reviewed",
  },
  {
    id: "greenhouse-signal",
    version: 1,
    title: "The Greenhouse Signal",
    codename: "Mission 03 · Limiting Factors",
    subject: "biology",
    gradeBand: "9-10",
    difficulty: "core",
    estimatedMinutes: 20,
    baseXp: 150,
    hook: "Grow-lights were doubled, but the plants barely responded. Something else is limiting them.",
    briefing: [
      "A school greenhouse added a second bank of grow-lights last term. The caretaker expected growth to double. Instead, the growth indicators barely moved.",
      "The plants are not broken. Photosynthesis depends on more than light: carbon dioxide supply, temperature and water all matter. When one factor is in short supply, adding more of another cannot help.",
      "You have a conceptual model of the photosynthetic response. Change light and CO₂, and find the evidence that explains the plateau.",
    ],
    objective:
      "Identify the limiting factor and explain why the modelled rate stops rising when another factor is scarce.",
    objectives: [
      "Predict whether the rate keeps rising as light increases.",
      "Hold CO₂ low, then raise light across several runs.",
      "Find the point where extra light stops helping.",
      "Name the limiting factor and explain saturation.",
    ],
    concepts: ["Photosynthesis", "Limiting factors", "Saturation", "Rate", "Evidence"],
    misconceptions: [
      "“Increasing any one factor always increases the rate indefinitely.”",
      "“Light is always the limiting factor.”",
    ],
    apparatus: [
      "Conceptual leaf model (relative units only)",
      "Adjustable light source, 0–2000 µmol m⁻² s⁻¹",
      "Adjustable CO₂ supply, 0–1200 ppm",
      "Relative rate readout — not a measurement",
    ],
    experimentModelId: PHOTOSYNTHESIS_MODEL_ID,
    parameters: [
      {
        id: "light",
        label: "Light intensity",
        symbol: "I",
        unit: "µmol m⁻² s⁻¹",
        min: 0,
        max: 2000,
        step: 25,
        defaultValue: 400,
        decimals: 0,
        help: "Light available to the leaf. Raising it only helps until another factor becomes limiting.",
      },
      {
        id: "co2",
        label: "CO₂ availability",
        symbol: "C",
        unit: "ppm",
        min: 0,
        max: 1200,
        step: 25,
        defaultValue: 400,
        decimals: 0,
        help: "Carbon dioxide around the leaf. Low CO₂ caps the rate even in bright light.",
      },
    ],
    hypothesisPrompt:
      "If light intensity rises while CO₂ stays low, will the modelled rate keep rising without limit? Explain.",
    conclusionPrompt:
      "Use your run history to describe the plateau and identify which factor was limiting.",
    hints: [
      {
        id: "h1",
        title: "Hold CO₂ low",
        body: "Keep CO₂ at a low, constant value. Change only light. If the rate stops rising, something other than light is capping it.",
      },
      {
        id: "h2",
        title: "Look for the plateau",
        body: "Compare a run at 400 light with a run at 1600 light. If the rate barely changes, light is no longer limiting.",
      },
      {
        id: "h3",
        title: "Name the limiting factor",
        body: "The limiting factor is the input with the smallest relative supply. With CO₂ low, raising light cannot increase the rate much further.",
      },
    ],
    rubric: DEFAULT_RUBRIC,
    masteryThreshold: 70,
    limitations:
      "Conceptual saturating model in relative units. It is not empirical data, does not model temperature, water stress or photoinhibition, and must not be used for real-world predictions.",
    references: [
      "Limiting-factor and saturation behaviour of photosynthesis — standard secondary biology treatment (conceptual).",
    ],
    simulated: true,
    available: true,
    reviewStatus: "pending-subject-review",
  },
];

export interface UpcomingMission {
  id: string;
  title: string;
  subject: Subject;
  teaser: string;
  tag: string;
}

export const UPCOMING_MISSIONS: UpcomingMission[] = [
  {
    id: "contaminated-water",
    title: "The Contaminated Water Investigation",
    subject: "chemistry",
    teaser: "Cross-subject evidence mission: separate claims from measurements in a fictional water sample.",
    tag: "Evidence mission",
  },
  {
    id: "planetary-motion",
    title: "Why the Orbit Won't Hold",
    subject: "physics",
    teaser: "Manipulate orbital radius and mass to reason about gravitational motion.",
    tag: "Virtual only",
  },
  {
    id: "nuclear-decay",
    title: "The Vanishing Sample",
    subject: "physics",
    teaser: "Model radioactive decay and half-life without any real hazardous material.",
    tag: "Virtual only",
  },
];

export function getMission(id: string): Mission | undefined {
  return MISSIONS.find((mission) => mission.id === id);
}

export function missionsBySubject(subject: Subject): Mission[] {
  return MISSIONS.filter((mission) => mission.subject === subject);
}

export const SUBJECT_META: Record<
  Subject,
  { label: string; tagline: string; icon: "atom" | "flask" | "leaf"; blurb: string }
> = {
  physics: {
    label: "Physics",
    tagline: "Circuits, forces & energy",
    icon: "atom",
    blurb: "Trace cause and effect through circuits and motion, where one clean relationship explains the whole mystery.",
  },
  chemistry: {
    label: "Chemistry",
    tagline: "Solutions, reactions & matter",
    icon: "flask",
    blurb: "Follow conserved quantities through solutions and reactions to explain readings that look impossible.",
  },
  biology: {
    label: "Biology",
    tagline: "Living systems & limits",
    icon: "leaf",
    blurb: "Untangle living systems where several factors compete, and find the one actually limiting the outcome.",
  },
};
