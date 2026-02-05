type ChartPoint = {
  x: number; // epoch ms
  y: number;
};

export type SvgLineChartSeries = {
  id: string;
  label: string;
  color: string;
  points: ChartPoint[];
  strokeWidth?: number;
  dashed?: boolean;
};

export type SvgLineChartProps = {
  series: SvgLineChartSeries[];
  height?: number;
  width?: number;
  yTickCount?: number;
  formatY?: (value: number) => string;
  formatX?: (epochMs: number) => string;
  ariaLabel?: string;
};

function getNiceLinearTicks(minValue: number, maxValue: number, tickCount: number) {
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    return null;
  }

  if (tickCount < 2) {
    return [minValue];
  }

  if (minValue === maxValue) {
    const fallback = minValue === 0 ? 1 : Math.abs(minValue) * 0.1;
    const paddedMin = minValue - fallback;
    const paddedMax = maxValue + fallback;
    return getNiceLinearTicks(paddedMin, paddedMax, tickCount);
  }

  const range = maxValue - minValue;
  const roughStep = range / (tickCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const residual = roughStep / magnitude;

  let niceResidual = 10;
  if (residual <= 1) niceResidual = 1;
  else if (residual <= 2) niceResidual = 2;
  else if (residual <= 5) niceResidual = 5;

  const step = niceResidual * magnitude;
  const niceMin = Math.floor(minValue / step) * step;
  const niceMax = Math.ceil(maxValue / step) * step;

  const ticks: number[] = [];
  for (let value = niceMin; value <= niceMax + step / 2; value += step) {
    ticks.push(value);
    if (ticks.length > 1000) break;
  }
  return ticks;
}

function buildLinePath(points: ChartPoint[], scaleX: (x: number) => number, scaleY: (y: number) => number) {
  const filtered = points
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
    .sort((a, b) => a.x - b.x);

  if (filtered.length === 0) return "";

  let path = `M ${scaleX(filtered[0].x).toFixed(2)} ${scaleY(filtered[0].y).toFixed(2)}`;
  for (const point of filtered.slice(1)) {
    path += ` L ${scaleX(point.x).toFixed(2)} ${scaleY(point.y).toFixed(2)}`;
  }

  return path;
}

export function SvgLineChart({
  series,
  height = 420,
  width = 1000,
  yTickCount = 5,
  formatY = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(value),
  formatX = (epochMs) =>
    new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(
      new Date(epochMs),
    ),
  ariaLabel = "Line chart",
}: SvgLineChartProps) {
  const allPoints = series.flatMap((line) => line.points);
  const xValues = allPoints.map((point) => point.x).filter(Number.isFinite);
  const yValues = allPoints.map((point) => point.y).filter(Number.isFinite);

  if (xValues.length === 0 || yValues.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-surface/60 p-6 text-sm text-secondary dark:border-white/10 dark:bg-white/5">
        No data available to render the chart.
      </div>
    );
  }

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const padding = { top: 20, right: 20, bottom: 48, left: 72 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const ticksY = getNiceLinearTicks(yMin, yMax, yTickCount) ?? [];
  const yDomainMin = ticksY.length > 0 ? ticksY[0] : yMin;
  const yDomainMax = ticksY.length > 0 ? ticksY[ticksY.length - 1] : yMax;

  const scaleX = (x: number) => {
    if (xMax === xMin) return padding.left + plotWidth / 2;
    const t = (x - xMin) / (xMax - xMin);
    return padding.left + t * plotWidth;
  };

  const scaleY = (y: number) => {
    if (yDomainMax === yDomainMin) return padding.top + plotHeight / 2;
    const t = (y - yDomainMin) / (yDomainMax - yDomainMin);
    return padding.top + (1 - t) * plotHeight;
  };

  const xTickCount = Math.min(6, Math.max(2, Math.floor(plotWidth / 160)));
  const ticksX = Array.from({ length: xTickCount }, (_, i) => {
    return xMin + (i * (xMax - xMin)) / (xTickCount - 1);
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-background/50 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="chart-clip">
            <rect
              x={padding.left}
              y={padding.top}
              width={plotWidth}
              height={plotHeight}
              rx="8"
            />
          </clipPath>
        </defs>

        {/* Grid + Y axis ticks */}
        {ticksY.map((tick) => {
          const y = scaleY(tick);
          return (
            <g key={`y-${tick}`}>
              <line
                x1={padding.left}
                x2={padding.left + plotWidth}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-black/5 dark:text-white/10"
                strokeWidth={1}
              />
              <text
                x={padding.left - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-secondary text-[11px]"
              >
                {formatY(tick)}
              </text>
            </g>
          );
        })}

        {/* X axis ticks */}
        {ticksX.map((tick, i) => {
          const x = scaleX(tick);
          return (
            <g key={`x-${i}`}>
              <line
                x1={x}
                x2={x}
                y1={padding.top}
                y2={padding.top + plotHeight}
                stroke="currentColor"
                className="text-black/5 dark:text-white/10"
                strokeWidth={1}
              />
              <text
                x={x}
                y={padding.top + plotHeight + 28}
                textAnchor="middle"
                className="fill-secondary text-[11px]"
              >
                {formatX(tick)}
              </text>
            </g>
          );
        })}

        {/* Data lines */}
        <g clipPath="url(#chart-clip)">
          {series.map((line) => {
            const path = buildLinePath(line.points, scaleX, scaleY);
            if (!path) return null;

            return (
              <path
                key={line.id}
                d={path}
                fill="none"
                stroke={line.color}
                strokeWidth={line.strokeWidth ?? 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={line.dashed ? "7 6" : undefined}
              />
            );
          })}
        </g>

        {/* Axes */}
        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={padding.top + plotHeight}
          stroke="currentColor"
          className="text-black/10 dark:text-white/15"
          strokeWidth={1}
        />
        <line
          x1={padding.left}
          x2={padding.left + plotWidth}
          y1={padding.top + plotHeight}
          y2={padding.top + plotHeight}
          stroke="currentColor"
          className="text-black/10 dark:text-white/15"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
