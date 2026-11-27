# UX and Visual Design Direction

## Product feel
A premium science-adventure interface: curious, immersive and playful, but credible enough for schools. Avoid a generic admin template or a noisy arcade aesthetic.

## Visual language
- Dark midnight/navy base for the mission/lab environment, with restrained electric cyan, violet and warm amber accents.
- Light, high-contrast alternative theme for classroom and accessibility use.
- Use clear typography, strong hierarchy, generous spacing and readable scientific units.
- Use cards for mission discovery, but keep the active lab workspace focused and uncluttered.
- Use subtle motion only when it explains state; respect reduced-motion settings.

## Key screens
### Student home
- Greeting and current level/XP.
- “Continue mission” primary action.
- Subject cards and mission progress.
- Recent badges and a small weekly activity summary.

### Mission briefing
- Story title and narrative.
- Mission objective, concepts, estimated effort and subject.
- “Start investigation” action.
- A visible note that the experiment is simulated.

### Lab workspace
- Main experiment scene or schematic.
- Variable controls with units and ranges.
- Run/reset controls.
- Observation panel and run history.
- Hypothesis/justification panel, visible before decisive run.
- Evidence comparison and hint panel.
- Keep critical controls usable on mobile; use stacked layout at narrow widths.

### Results
- Mission status and reasoning score breakdown.
- Feedback by rubric criterion.
- Observation/evidence recap.
- Retry and continue actions.
- XP/badge earned, if eligible.

### Teacher dashboard
- Class selector and summary metrics.
- Mission completion table.
- Concept mastery and misconception categories.
- Student-level details restricted to authorized class.
- CSV export.

## Accessibility
- Keyboard-operable controls and scenes where possible.
- Do not encode correctness only by colour.
- Label sliders and include numeric input alternatives.
- Provide text equivalents for visual outcomes.
- Captions/transcripts for any audio.
- Minimum readable contrast and visible focus.

## Implementation status — 2026-11-27
- [x] Dark/light themes, mission cards, focused lab workspace and responsive stacked layouts.
- [x] Student home, mission briefing, lab, results, progress and teacher screens.
- [x] Keyboard-accessible stage hotspots, sliders with numeric inputs, visible focus styles, reduced-motion CSS and offline indicator.
- [x] First-timer tutorial with guided entry points.
- [ ] Formal contrast audit, screen-reader pass and low-end device performance pass.
- [ ] Audio captions/transcripts are not applicable yet because the MVP has no audio.
