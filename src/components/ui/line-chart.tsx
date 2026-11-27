import { cn } from "@/lib/utils";

export interface ChartPoint {
  x: number;
  y: number;
}

export interface LineChartProps {
  data: ChartPoint[];
  ariaLabel: string;
  xLabel: string;
  yLabel: string;
  unitX?: string;
  unitY?: string;
  tone?: "primary" | "accent" | "physics" | "chemistry" | "biology";
  highlight?: ChartPoint;
  height?: number;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  className?: string;
}

const TONE_TEXT: Record<NonNullable<LineChartProps["tone"]>, string> = {
  primary: "text-primary",
  accent: "text-accent",
  physics: "text-physics",
  chemistry: "text-chemistry",
  biology: "text-biology",
};

const WIDTH = 640;
const HEIGHT = 320;
const PAD = { top: 18, right: 22, bottom: 46, left: 56 };

function defaultFormat(value: number): string {
  if (Math.abs(value) >= 1000) return value.toFixed(0);
  if (Math.abs(value) >= 100) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function ticks(min: number, max: number, count: number): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) return [min];
  return Array.from({ length: count + 1 }, (_, index) => min + ((max - min) / count) * index);
}

export function LineChart({
  data,
  ariaLabel,
  xLabel,
  yLabel,
  unitX,
  unitY,
  tone = "primary",
  highlight,
  height,
  formatX = defaultFormat,
  formatY = defaultFormat,
  className,
}: LineChartProps) {
  const points = data.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  if (points.length < 2) {
    return (
      <p className={cn("rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-faint", className)}>
        Not enough data to plot yet.
      </p>
    );
  }

  const xMin = points[0].x;
  const xMax = points[points.length - 1].x;
  const yMaxRaw = Math.max(...points.map((point) => point.y));
  const yMax = yMaxRaw <= 0 ? 1 : yMaxRaw * 1.08;

  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  const scaleX = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin || 1)) * plotWidth;
  const scaleY = (y: number) => PAD.top + plotHeight - (y / yMax) * plotHeight;

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${scaleX(point.x).toFixed(2)} ${scaleY(point.y).toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${scaleX(xMax).toFixed(2)} ${(PAD.top + plotHeight).toFixed(2)} L ${scaleX(xMin).toFixed(2)} ${(PAD.top + plotHeight).toFixed(2)} Z`;

  const xTicks = ticks(xMin, xMax, 4);
  const yTicks = ticks(0, yMax, 4);
  const highlightPoint = highlight
    ? { x: scaleX(highlight.x), y: scaleY(highlight.y) }
    : null;

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className={cn("h-auto w-full overflow-visible", TONE_TEXT[tone])}
        style={height ? { height, width: "100%" } : undefined}
        preserveAspectRatio="none"
      >
        <title>{ariaLabel}</title>
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={scaleY(tick)}
              y2={scaleY(tick)}
              stroke="var(--line)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={scaleY(tick) + 4}
              textAnchor="end"
              fontSize={11}
              fill="var(--ink-faint)"
              className="numeric"
            >
              {formatY(tick)}
            </text>
          </g>
        ))}

        {xTicks.map((tick) => (
          <text
            key={`x-${tick}`}
            x={scaleX(tick)}
            y={HEIGHT - PAD.bottom + 20}
            textAnchor="middle"
            fontSize={11}
            fill="var(--ink-faint)"
            className="numeric"
          >
            {formatX(tick)}
          </text>
        ))}

        <path d={areaPath} fill="currentColor" opacity={0.1} />
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {highlightPoint ? (
          <g>
            <line
              x1={highlightPoint.x}
              x2={highlightPoint.x}
              y1={PAD.top}
              y2={PAD.top + plotHeight}
              stroke="var(--ink-faint)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <circle cx={highlightPoint.x} cy={highlightPoint.y} r={6} fill="currentColor" opacity={0.25} />
            <circle cx={highlightPoint.x} cy={highlightPoint.y} r={3.5} fill="currentColor" />
          </g>
        ) : null}

        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={PAD.top + plotHeight}
          y2={PAD.top + plotHeight}
          stroke="var(--line-strong)"
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          x2={PAD.left}
          y1={PAD.top}
          y2={PAD.top + plotHeight}
          stroke="var(--line-strong)"
          strokeWidth={1}
        />

        <text
          x={PAD.left + plotWidth / 2}
          y={HEIGHT - 6}
          textAnchor="middle"
          fontSize={11}
          fill="var(--ink-soft)"
        >
          {xLabel}
          {unitX ? ` (${unitX})` : ""}
        </text>
        <text
          x={14}
          y={PAD.top + plotHeight / 2}
          textAnchor="middle"
          fontSize={11}
          fill="var(--ink-soft)"
          transform={`rotate(-90 14 ${PAD.top + plotHeight / 2})`}
        >
          {yLabel}
          {unitY ? ` (${unitY})` : ""}
        </text>
      </svg>
    </figure>
  );
}
