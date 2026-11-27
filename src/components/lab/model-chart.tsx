"use client";

import { LineChart } from "@/components/ui/line-chart";
import { dilutionSeries } from "@/domain/experiments/chemistry/dilution";
import { lightResponseSeries } from "@/domain/experiments/biology/photosynthesis";
import { currentSeries } from "@/domain/experiments/physics/ohms-law";
import type { Subject } from "@/types/domain";

export function ModelChart({
  subject,
  parameters,
}: {
  subject: Subject;
  parameters: Record<string, number>;
}) {
  if (subject === "physics") {
    const voltage = parameters.voltage ?? 0;
    const resistance = parameters.resistance ?? 1;
    return (
      <LineChart
        data={currentSeries(voltage)}
        ariaLabel={`Current versus resistance at ${voltage} volts`}
        xLabel="Resistance"
        yLabel="Current"
        unitX="Ω"
        unitY="A"
        tone="physics"
        highlight={{ x: resistance, y: voltage / resistance }}
      />
    );
  }

  if (subject === "chemistry") {
    const concentration = parameters.initialConcentration ?? 0;
    const initialVolume = parameters.initialVolume ?? 1;
    const finalVolume = parameters.finalVolume ?? initialVolume;
    return (
      <LineChart
        data={dilutionSeries(concentration, initialVolume)}
        ariaLabel={`Final concentration versus final volume starting from ${concentration} moles per litre`}
        xLabel="Final volume"
        yLabel="Final concentration"
        unitX="mL"
        unitY="mol/L"
        tone="chemistry"
        highlight={{ x: finalVolume, y: (concentration * initialVolume) / finalVolume }}
      />
    );
  }

  const light = parameters.light ?? 0;
  const co2 = parameters.co2 ?? 0;
  return (
    <LineChart
      data={lightResponseSeries(co2)}
      ariaLabel={`Relative photosynthesis rate versus light at ${co2} parts per million carbon dioxide`}
      xLabel="Light intensity"
      yLabel="Relative rate"
      unitX="µmol m⁻² s⁻¹"
      unitY="% of max"
      tone="biology"
      highlight={{ x: light, y: (100 * light * co2) / ((light + 300) * (co2 + 400)) }}
    />
  );
}
