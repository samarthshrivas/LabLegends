"use client";

import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { clamp, formatValue } from "@/lib/utils";
import type { ParameterSpec } from "@/types/domain";

interface StageProps {
  parameters: Record<string, number>;
  observations: { id: string; value: number | string; unit?: string }[];
  specs?: ParameterSpec[];
  onParameterChange?: (id: string, value: number) => void;
}

function observation(observations: StageProps["observations"], id: string): string {
  const found = observations.find((item) => item.id === id);
  if (!found) return "—";
  return `${formatValue(Number(found.value), 2)} ${found.unit ?? ""}`.trim();
}

function InteractiveGroup({
  label,
  onActivate,
  children,
}: {
  label: string;
  onActivate: () => void;
  children: ReactNode;
}) {
  return (
    <g
      className="stage-hotspot"
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate();
        }
      }}
    >
      <title>{label}</title>
      {children}
    </g>
  );
}

function PlusBadge({ x, y }: { x: number; y: number }) {
  return (
    <g className="stage-bob">
      <circle className="stage-hotspot-ring" cx={x} cy={y} r="11" fill="var(--canvas-deep)" stroke="var(--gold)" strokeOpacity="0.6" strokeDasharray="3 3" />
      <circle cx={x} cy={y} r="7.5" fill="var(--gold)" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--gold-ink)">
        +
      </text>
    </g>
  );
}

function StageGrid() {
  return (
    <g stroke="var(--line)" strokeWidth="1" strokeDasharray="2 7">
      {[40, 80, 120, 160, 200].map((y) => (
        <line key={y} x1="0" y1={y} x2="520" y2={y} />
      ))}
    </g>
  );
}

function StageTip({ text }: { text: string }) {
  return (
    <text x="12" y="242" fontSize="10" fill="var(--ink-faint)">
      {text}
    </text>
  );
}

function PhysicsStage({ parameters, specs = [], onParameterChange }: StageProps) {
  const reduced = usePrefersReducedMotion();
  const voltage = parameters.voltage ?? 0;
  const resistance = parameters.resistance ?? 1;
  const current = voltage / resistance;
  const duration = Math.max(0.9, Math.min(6, 5 / Math.max(current, 0.2)));

  const bump = (id: string, amount: number) => {
    const spec = specs.find((item) => item.id === id);
    const base = parameters[id] ?? spec?.defaultValue ?? 0;
    const next = clamp(base + amount, spec?.min ?? -Infinity, spec?.max ?? Infinity);
    onParameterChange?.(id, Number(next.toFixed(spec?.decimals ?? 2)));
  };

  const circuitPath = "M 90 190 L 90 80 L 170 80 L 350 80 L 430 80 L 430 190 L 350 190";

  return (
    <svg
      viewBox="0 0 520 250"
      role="img"
      aria-label={`Interactive circuit with ${voltage} volts, ${resistance} ohms and ${formatValue(current, 2)} amps. Use the plus badges to change voltage or resistance.`}
      className="h-auto w-full"
    >
      <StageGrid />

      <path d="M 90 190 L 90 80 L 170 80" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 350 80 L 430 80 L 430 190 L 350 190" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
      {!reduced ? (
        <path d={circuitPath} fill="none" stroke="var(--gold)" strokeWidth="2" strokeOpacity="0.55" className="stage-flow" />
      ) : null}

      <InteractiveGroup label={`Increase voltage by 2 volts. Currently ${formatValue(voltage, 1)} volts.`} onActivate={() => bump("voltage", 2)}>
        <line x1="130" y1="80" x2="130" y2="60" stroke="var(--primary)" strokeWidth="2" />
        <line x1="130" y1="100" x2="130" y2="80" stroke="var(--primary)" strokeWidth="2" />
        <line x1="121" y1="64" x2="139" y2="64" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="124" y1="76" x2="136" y2="76" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
        <PlusBadge x={130} y={44} />
      </InteractiveGroup>
      <text x="130" y="126" textAnchor="middle" fontSize="12" fill="var(--primary)" className="numeric">
        {formatValue(voltage, 1)} V
      </text>

      <InteractiveGroup label={`Increase resistance by 5 ohms. Currently ${resistance} ohms.`} onActivate={() => bump("resistance", 5)}>
        <ellipse className="stage-pulse" cx="260" cy="80" rx="58" ry="26" fill="var(--accent)" opacity="0.12" />
        <path
          d="M 170 80 L 184 80 L 193 62 L 207 98 L 221 62 L 235 98 L 249 62 L 263 98 L 277 80 L 350 80"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <PlusBadge x={260} y={44} />
      </InteractiveGroup>
      <text x="260" y="126" textAnchor="middle" fontSize="12" fill="var(--accent)" className="numeric">
        {resistance} Ω
      </text>

      <circle className="stage-pulse" cx="390" cy="190" r="34" fill="var(--gold)" opacity="0.08" />
      <circle cx="390" cy="190" r="30" fill="var(--panel-strong)" stroke="var(--primary)" strokeWidth="2" />
      <line
        x1="390"
        y1="190"
        x2={390 + Math.min(22, current * 12)}
        y2={190 - Math.min(22, current * 12)}
        stroke="var(--gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="390" cy="190" r="3" fill="var(--gold)" />
      <text x="390" y="238" textAnchor="middle" fontSize="12" fill="var(--ink-faint)" className="numeric">
        AMMETER
      </text>

      {!reduced ? (
        <>
          {[0, 1, 2].map((index) => (
            <circle key={index} r="4" fill="var(--gold)" opacity={1 - index * 0.22}>
              <animateMotion
                begin={`${(duration / 3) * index}s`}
                dur={`${duration}s`}
                repeatCount="indefinite"
                path={circuitPath}
              />
            </circle>
          ))}
        </>
      ) : null}

      <text x="260" y="20" textAnchor="middle" fontSize="13" fill="var(--ink-soft)" className="numeric">
        I = V ÷ R = {formatValue(current, 3)} A
      </text>
      <StageTip text="Tip: click a + badge to change a variable, then run the model." />
    </svg>
  );
}

function ChemistryStage({ parameters, observations, specs = [], onParameterChange }: StageProps) {
  const reduced = usePrefersReducedMotion();
  const initialVolume = parameters.initialVolume ?? 0;
  const finalVolume = parameters.finalVolume ?? 1;
  const concentration = Number(observations.find((item) => item.id === "finalConcentration")?.value ?? 0);
  const fillRatio = Math.min(1, finalVolume / 500);
  const liquidTop = 210 - fillRatio * 150;
  const opacity = Math.min(0.75, 0.12 + concentration * 0.3);

  const bump = (id: string, amount: number) => {
    const spec = specs.find((item) => item.id === id);
    const base = parameters[id] ?? spec?.defaultValue ?? 0;
    const next = clamp(base + amount, spec?.min ?? -Infinity, spec?.max ?? Infinity);
    onParameterChange?.(id, Number(next.toFixed(spec?.decimals ?? 2)));
  };

  return (
    <svg
      viewBox="0 0 520 250"
      role="img"
      aria-label={`Interactive beaker diluted from ${initialVolume} millilitres to ${finalVolume} millilitres. Click the plus badge to add 25 millilitres of solvent.`}
      className="h-auto w-full"
    >
      <StageGrid />
      <defs>
        <clipPath id="beaker-liquid-clip">
          <rect x="192" y={liquidTop} width="136" height={220 - liquidTop} />
        </clipPath>
      </defs>

      <path d="M 190 45 L 190 200 Q 190 220 210 220 L 310 220 Q 330 220 330 200 L 330 45" fill="var(--panel-soft)" stroke="var(--line-strong)" strokeWidth="2" />
      <line x1="180" y1="45" x2="340" y2="45" stroke="var(--line-strong)" strokeWidth="3" strokeLinecap="round" />

      <InteractiveGroup label={`Add 25 millilitres of solvent. Currently ${finalVolume} millilitres.`} onActivate={() => bump("finalVolume", 25)}>
        <rect x="192" y={liquidTop} width="136" height={220 - liquidTop} fill="var(--chemistry)" opacity={opacity} />
        <g clipPath="url(#beaker-liquid-clip)">
          {!reduced ? (
            <>
              <path
                className="stage-wave"
                d={`M 186 ${liquidTop} q 17 -5 34 0 t 34 0 t 34 0 t 34 0 t 34 0`}
                fill="none"
                stroke="var(--chemistry)"
                strokeWidth="2.5"
              />
              <rect className="stage-sweep" x="180" y={liquidTop} width="34" height={220 - liquidTop} fill="var(--panel)" opacity="0.2" />
              {[0, 1, 2, 3].map((index) => (
                <circle
                  key={index}
                  className="stage-bob"
                  cx={215 + index * 28}
                  cy={190 - (index % 2) * 18}
                  r={3 + (index % 2)}
                  fill="var(--panel)"
                  opacity="0.35"
                  style={{ animationDelay: `${index * 0.35}s` }}
                />
              ))}
            </>
          ) : null}
        </g>
        <line x1="192" y1={liquidTop} x2="328" y2={liquidTop} stroke="var(--chemistry)" strokeWidth="2" />
        <PlusBadge x={330} y={62} />
      </InteractiveGroup>

      {!reduced ? (
        <g fill="var(--chemistry)" opacity="0.55">
          {[0, 1, 2].map((index) => (
            <circle
              key={index}
              className="stage-drop"
              cx={228 + index * 32}
              cy={52}
              r="3"
              style={{ animationDelay: `${index * 0.55}s` }}
            />
          ))}
        </g>
      ) : null}

      {[70, 110, 150, 190].map((y) => (
        <g key={y}>
          <line x1="336" y1={y} x2="350" y2={y} stroke="var(--line-strong)" strokeWidth="1.5" />
          <text x="356" y={y + 4} fontSize="10" fill="var(--ink-faint)" className="numeric">
            {Math.round((220 - y) / 1.5)} mL
          </text>
        </g>
      ))}

      <text x="260" y="30" textAnchor="middle" fontSize="12" fill="var(--ink-faint)">VIRTUAL VOLUMETRIC BENCH</text>
      <text x="260" y="245" textAnchor="middle" fontSize="12" fill="var(--chemistry)" className="numeric">
        C₂ = {observation(observations, "finalConcentration")}
      </text>
      <text x="90" y="120" fontSize="12" fill="var(--ink-soft)" className="numeric">V₁ = {initialVolume} mL</text>
      <text x="90" y="142" fontSize="12" fill="var(--ink-soft)" className="numeric">V₂ = {finalVolume} mL</text>
      <text x="90" y="164" fontSize="11" fill="var(--ink-faint)">solute conserved</text>
      <StageTip text="Tip: click the + badge to add solvent, then run the model." />
    </svg>
  );
}

function BiologyStage({ parameters, observations, specs = [], onParameterChange }: StageProps) {
  const reduced = usePrefersReducedMotion();
  const light = parameters.light ?? 0;
  const co2 = parameters.co2 ?? 0;
  const rate = Number(observations.find((item) => item.id === "rate")?.value ?? 0);
  const lightOpacity = 0.15 + (light / 2000) * 0.85;
  const bubbleCount = Math.max(1, Math.round((co2 / 1200) * 7));

  const bump = (id: string, amount: number) => {
    const spec = specs.find((item) => item.id === id);
    const base = parameters[id] ?? spec?.defaultValue ?? 0;
    const next = clamp(base + amount, spec?.min ?? -Infinity, spec?.max ?? Infinity);
    onParameterChange?.(id, Number(next.toFixed(spec?.decimals ?? 2)));
  };

  return (
    <svg
      viewBox="0 0 520 250"
      role="img"
      aria-label={`Interactive leaf model with light ${light} and carbon dioxide ${co2}. Click the plus badges to increase either input.`}
      className="h-auto w-full"
    >
      <StageGrid />

      <InteractiveGroup label={`Increase light by 100 units. Currently ${light}.`} onActivate={() => bump("light", 100)}>
        <g stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" opacity={lightOpacity} className={reduced ? undefined : "stage-pulse"}>
          {[0, 1, 2, 3].map((index) => (
            <line key={index} x1={70 + index * 26} y1={30 + index * 8} x2={150 + index * 18} y2={90 + index * 6} />
          ))}
        </g>
        <circle cx="80" cy="40" r="18" fill="var(--gold)" opacity={lightOpacity * 0.5} />
        <PlusBadge x={80} y={16} />
      </InteractiveGroup>

      <InteractiveGroup label={`Increase carbon dioxide by 100 units. Currently ${co2}.`} onActivate={() => bump("co2", 100)}>
        <g fill="var(--accent)" opacity={0.18 + (co2 / 1200) * 0.22} className={reduced ? undefined : "stage-bob"}>
          <circle cx="398" cy="62" r="16" />
          <circle cx="422" cy="54" r="20" />
          <circle cx="446" cy="68" r="14" />
          <rect x="382" y="62" width="76" height="18" rx="9" />
        </g>
        <text x="414" y="68" textAnchor="middle" fontSize="10" fill="var(--accent)" className="numeric">CO₂</text>
        <PlusBadge x={446} y={34} />
      </InteractiveGroup>

      <ellipse className={reduced ? undefined : "stage-pulse"} cx="250" cy="125" rx="72" ry="72" fill="var(--biology)" opacity="0.08" />
      <path d="M 250 200 C 180 170 170 90 250 55 C 330 90 320 170 250 200 Z" fill="var(--biology)" opacity="0.18" stroke="var(--biology)" strokeWidth="2" />
      <path d="M 250 200 L 250 60" stroke="var(--biology)" strokeWidth="2" />
      {[0, 1, 2, 3].map((index) => (
        <path
          key={index}
          d={`M 250 ${90 + index * 25} Q ${210 - index * 6} ${75 + index * 25} ${190 - index * 8} ${65 + index * 28}`}
          fill="none"
          stroke="var(--biology)"
          strokeWidth="1.5"
          opacity="0.7"
        />
      ))}

      {Array.from({ length: bubbleCount }, (_, index) => (
        <circle
          key={index}
          cx={360 + (index % 3) * 26}
          cy={190 - Math.floor(index / 3) * 28}
          r="6"
          fill="var(--accent)"
          opacity="0.55"
        >
          {!reduced ? (
            <animate
              attributeName="cy"
              values={`${190 - Math.floor(index / 3) * 28};${150 - Math.floor(index / 3) * 28};${190 - Math.floor(index / 3) * 28}`}
              dur={`${3 + index * 0.3}s`}
              repeatCount="indefinite"
            />
          ) : null}
        </circle>
      ))}

      <text x="250" y="30" textAnchor="middle" fontSize="12" fill="var(--ink-faint)">CONCEPTUAL LEAF MODEL · RELATIVE UNITS</text>
      <rect x="180" y="220" width="140" height="10" rx="5" fill="var(--line)" />
      <rect x="180" y="220" width={Math.max(2, (rate / 100) * 140)} height="10" rx="5" fill="var(--biology)" />
      <text x="250" y="246" textAnchor="middle" fontSize="12" fill="var(--biology)" className="numeric">
        relative rate {formatValue(rate, 1)}%
      </text>
      <StageTip text="Tip: click a + badge to change light or CO₂, then run the model." />
    </svg>
  );
}

export function ExperimentStage({
  subject,
  ...props
}: StageProps & { subject: "physics" | "chemistry" | "biology" }) {
  if (subject === "physics") return <PhysicsStage {...props} />;
  if (subject === "chemistry") return <ChemistryStage {...props} />;
  return <BiologyStage {...props} />;
}
