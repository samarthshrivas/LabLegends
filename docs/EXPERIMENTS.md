# Experiment Catalogue and Scientific Integrity

## Implementation policy
The invention disclosure proposes adjustable-variable simulations in Physics, Chemistry and Biology and names examples such as temperature, concentration, mass, voltage and light intensity. It does not provide validated equations for each experiment.

Every simulation added to the product must:
1. name the scientific model and version;
2. document assumptions, units and valid ranges;
3. cite a suitable textbook, standard or reviewed source in the mission content;
4. include unit tests for known values and boundary conditions;
5. distinguish idealized simulation from real-world behaviour;
6. avoid unsafe procedural instructions for real hazardous experiments.

## MVP simulation candidates

### Physics — Ohm's Law circuit
- Inputs: voltage (V), resistance (Ω).
- Output: current (A).
- Model: `I = V / R`, for `R > 0`.
- Controls: voltage and resistance sliders with units.
- Observations: displayed voltage, resistance and calculated current.
- Learning objective: explain how current changes when voltage or resistance changes while the other variable is held constant.
- Limitations: ideal DC resistor; excludes temperature dependence, internal resistance and non-ohmic components.

### Chemistry — Dilution simulator
- Inputs: initial concentration `C1`, initial volume `V1`, final volume `V2`.
- Output: final concentration `C2`.
- Model: `C1 × V1 = C2 × V2`, assuming conserved solute amount and compatible units.
- Controls: initial concentration and volumes.
- Learning objective: predict and explain how concentration changes when solvent is added.
- Limitations: ideal dilution; no activity coefficients, reaction, evaporation or volume contraction.
- Safety: virtual model only. Do not present as instructions to prepare or handle chemicals.

### Biology — Photosynthesis factors (conceptual model)
- Inputs: light intensity and CO₂ availability within bounded ranges.
- Output: relative photosynthesis rate, not a real-world measured rate.
- Use a clearly documented saturating response model, reviewed before release by a subject expert. Do not label arbitrary model values as empirical measurements.
- Learning objective: identify limiting factors and explain why increasing one factor eventually stops increasing the modelled rate when another factor is limiting.
- Include an explicit “conceptual model” label and assumptions.

## Future mission ideas from the disclosure
- contaminated water investigation (cross-subject evidence mission);
- satellite power loss (energy/electricity);
- planetary motion;
- nuclear decay (virtual-only);
- particle collisions (virtual-only);
- ecosystem change over long time scales (virtual-only);
- hazardous reaction scenarios (virtual-only, no real-world procedure).

## Simulation UI requirements
- Parameter controls show units, current value and allowed range.
- Include a reset button and a run button.
- Results appear as labelled observations and, where meaningful, a chart.
- Show which variables were changed between runs.
- Keep a run history so students can compare outcomes.
- Include a 2D fallback for any optional 3D scene.

## Implementation status — 2026-11-27
- [x] Physics Ohm's Law model implemented and unit-tested in `src/domain/experiments/physics/ohms-law.ts`.
- [x] Chemistry dilution model implemented and unit-tested in `src/domain/experiments/chemistry/dilution.ts`.
- [x] Biology conceptual model implemented and unit-tested in `src/domain/experiments/biology/photosynthesis.ts`, but still pending subject review; do not use it for assessed scoring.
- [x] Parameter controls show units, current value and allowed range; run and reset controls exist.
- [x] Labelled observations, chart, run history and changed-variable comparison are implemented.
- [x] 2D SVG is the default renderer; WebGL capability detection is present. Phaser/Three.js renderers are not implemented yet.
