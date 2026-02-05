import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Clock,
  Info,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { SvgLineChart, type SvgLineChartSeries } from "@/components/svg-line-chart";

const title =
  "How Many Days Was Bitcoin Below the Previous All‑Time High? (2022 Bear Market)";
const description =
  "In the 2022 bear market, Bitcoin dipped below the prior cycle’s peak near $20k. See how many days it stayed below that level—plus dates, streaks, and methodology.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/bitcoin-below-previous-ath" },
  keywords: [
    "bitcoin below previous all time high",
    "bitcoin below prior ath",
    "bitcoin 2017 ath 2022",
    "bitcoin bear market below 20000",
    "btc days below 2017 high",
    "bitcoin cycle analysis",
  ],
  openGraph: {
    title,
    description,
    url: "/bitcoin-below-previous-ath",
    siteName: "Crypto Portfolio",
    type: "article",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Crypto Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/logo.png"],
  },
};

type OhlcRow = {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
};

type Streak = {
  startDate: string;
  endDate: string;
  days: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcMs(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map((part) => Number(part));
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    throw new Error(`Invalid date: ${isoDate}`);
  }
  return Date.UTC(year, month - 1, day);
}

function daysBetweenInclusive(startIsoDate: string, endIsoDate: string) {
  const startMs = toUtcMs(startIsoDate);
  const endMs = toUtcMs(endIsoDate);
  return Math.floor((endMs - startMs) / DAY_MS) + 1;
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatInt(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDateUtc(isoDate: string) {
  const ms = toUtcMs(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(ms));
}

function parseStooqCsv(csv: string): OhlcRow[] {
  const lines = csv.trim().split(/\r?\n/);
  const [header, ...rows] = lines;
  if (!header?.toLowerCase().startsWith("date,open,high,low,close")) {
    throw new Error("Unexpected CSV format");
  }

  return rows
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [date, open, high, low, close, volume] = line.split(",");
      const parsed: OhlcRow = {
        date,
        open: Number.parseFloat(open),
        high: Number.parseFloat(high),
        low: Number.parseFloat(low),
        close: Number.parseFloat(close),
        volume: volume ? Number.parseFloat(volume) : null,
      };

      if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) return null;
      if (
        !Number.isFinite(parsed.open) ||
        !Number.isFinite(parsed.high) ||
        !Number.isFinite(parsed.low) ||
        !Number.isFinite(parsed.close)
      ) {
        return null;
      }

      return parsed;
    })
    .filter((row): row is OhlcRow => row !== null);
}

function sortAscByDate(rows: OhlcRow[]) {
  return [...rows].sort((a, b) => a.date.localeCompare(b.date));
}

function getMaxRow(rows: OhlcRow[], pick: (row: OhlcRow) => number) {
  if (rows.length === 0) return null;
  let max = rows[0];
  let maxValue = pick(rows[0]);

  for (const row of rows.slice(1)) {
    const value = pick(row);
    if (value > maxValue) {
      max = row;
      maxValue = value;
    }
  }

  return { row: max, value: maxValue };
}

function computeBelowStreaks(
  rowsAsc: OhlcRow[],
  threshold: number,
  pick: (row: OhlcRow) => number,
) {
  const streaks: Streak[] = [];
  let currentStart: string | null = null;
  let currentEnd: string | null = null;
  let currentDays = 0;

  for (const row of rowsAsc) {
    const value = pick(row);
    if (value < threshold) {
      if (currentStart === null) currentStart = row.date;
      currentEnd = row.date;
      currentDays += 1;
      continue;
    }

    if (currentStart !== null && currentEnd !== null) {
      streaks.push({ startDate: currentStart, endDate: currentEnd, days: currentDays });
    }
    currentStart = null;
    currentEnd = null;
    currentDays = 0;
  }

  if (currentStart !== null && currentEnd !== null) {
    streaks.push({ startDate: currentStart, endDate: currentEnd, days: currentDays });
  }

  return streaks;
}

async function fetchStooqDaily(symbol: string, d1: string, d2: string) {
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d&d1=${encodeURIComponent(
    d1,
  )}&d2=${encodeURIComponent(d2)}`;

  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 7 }, // 7 days
    headers: { "User-Agent": "crypto-portfolio-tracker.app" },
  });
  if (!res.ok) {
    throw new Error(`Price data request failed (${res.status})`);
  }

  const csv = await res.text();
  const parsed = parseStooqCsv(csv);
  if (parsed.length === 0) {
    throw new Error("No rows returned for the requested range");
  }

  return parsed;
}

async function getBelowPreviousAthStats() {
  const previousAthRange = await fetchStooqDaily("btcusd", "20170101", "20180201");
  const athHigh = getMaxRow(previousAthRange, (row) => row.high);
  const athClose = getMaxRow(previousAthRange, (row) => row.close);
  if (!athHigh || !athClose) {
    throw new Error("Failed to compute previous ATH level");
  }

  const analysisRows = await fetchStooqDaily("btcusd", "20210101", "20231231");
  const analysisRowsAsc = sortAscByDate(analysisRows);

  const closePoints = analysisRowsAsc
    .map((row) => ({ x: toUtcMs(row.date), y: row.close }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
    .sort((a, b) => a.x - b.x);
  const thresholdLine =
    closePoints.length > 1
      ? [
          { x: closePoints[0].x, y: athHigh.value },
          { x: closePoints[closePoints.length - 1].x, y: athHigh.value },
        ]
      : [];

  const closeBelowAthHighStreaks = computeBelowStreaks(
    analysisRowsAsc,
    athHigh.value,
    (row) => row.close,
  );
  const totalDaysCloseBelow = closeBelowAthHighStreaks.reduce(
    (sum, streak) => sum + streak.days,
    0,
  );
  const longestCloseBelow = closeBelowAthHighStreaks.reduce<Streak | null>(
    (best, streak) => (best === null || streak.days > best.days ? streak : best),
    null,
  );

  const firstBelow = closeBelowAthHighStreaks[0] ?? null;
  const lastBelow =
    closeBelowAthHighStreaks.length > 0
      ? closeBelowAthHighStreaks[closeBelowAthHighStreaks.length - 1]
      : null;
  const spanDays =
    firstBelow && lastBelow
      ? daysBetweenInclusive(firstBelow.startDate, lastBelow.endDate)
      : null;

  const topStreaks = [...closeBelowAthHighStreaks]
    .sort((a, b) => b.days - a.days)
    .slice(0, 5);

  return {
    source: "Stooq (BTCUSD daily OHLC)",
    previousAth: {
      athHigh: { date: athHigh.row.date, value: athHigh.value },
      recordClose: { date: athClose.row.date, value: athClose.value },
    },
    analysisWindow: {
      startDate: analysisRowsAsc[0]?.date ?? null,
      endDate: analysisRowsAsc[analysisRowsAsc.length - 1]?.date ?? null,
    },
    chart: {
      closePoints,
      thresholdLine,
    },
    closeBelowAthHigh: {
      streaks: closeBelowAthHighStreaks,
      topStreaks,
      totalDays: totalDaysCloseBelow,
      longestStreak: longestCloseBelow,
      firstBelow,
      lastBelow,
      spanDays,
      threshold: athHigh.value,
    },
  };
}

export default async function BitcoinBelowPreviousAthPage() {
  let data: Awaited<ReturnType<typeof getBelowPreviousAthStats>> | null = null;
  let errorMessage: string | null = null;

  try {
    data = await getBelowPreviousAthStats();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to load market data.";
  }

  const strongestAnswer =
    data?.closeBelowAthHigh.longestStreak?.days ?? null;

  const chartRangeStart = data?.analysisWindow.startDate ?? null;
  const chartRangeEnd = data?.analysisWindow.endDate ?? null;

  const chartClosePoints = data?.chart.closePoints ?? null;
  const chartThresholdLine = data?.chart.thresholdLine ?? null;

  const chartSeries: SvgLineChartSeries[] = [];
  if (chartClosePoints && chartClosePoints.length > 1) {
    chartSeries.push({
      id: "close",
      label: "BTC daily close (USD)",
      color: "#10b981",
      points: chartClosePoints,
      strokeWidth: 2.75,
    });
  }
  if (chartThresholdLine && chartThresholdLine.length > 1) {
    chartSeries.push({
      id: "ath",
      label: "2017 ATH high (level)",
      color: "#64748b",
      dashed: true,
      points: chartThresholdLine,
      strokeWidth: 2.5,
    });
  }

  const faq = [
    {
      q: "What’s the “previous all‑time high” in this analysis?",
      a: data
        ? `The previous cycle’s ATH is taken as the 2017 peak intraday high (BTCUSD daily “High”) from ${data.source}.`
        : "The previous cycle’s ATH is the 2017 peak near $20k (data source: BTCUSD daily OHLC).",
    },
    {
      q: "So how many days did Bitcoin stay below that level in the last cycle?",
      a: data && data.closeBelowAthHigh.longestStreak
        ? `Using daily closes vs that prior ATH level, the longest uninterrupted streak below it lasted ${formatInt(data.closeBelowAthHigh.longestStreak.days)} days (${formatDateUtc(data.closeBelowAthHigh.longestStreak.startDate)} → ${formatDateUtc(data.closeBelowAthHigh.longestStreak.endDate)}).`
        : "It depends on the exact data source and whether you count daily closes or intraday prices.",
    },
    {
      q: "Why might other websites show a slightly different number?",
      a: "ATH values and daily closes differ by exchange/index, time zone cutoffs, and whether you measure intraday highs/lows vs closing prices.",
    },
    {
      q: "Is this financial advice?",
      a: "No. This page is informational only and doesn’t predict future prices or cycles.",
    },
  ] as const;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://crypto-portfolio-tracker.app/bitcoin-below-previous-ath",
    },
    author: { "@type": "Organization", name: "Crypto Portfolio" },
    publisher: {
      "@type": "Organization",
      name: "Crypto Portfolio",
      logo: {
        "@type": "ImageObject",
        url: "https://crypto-portfolio-tracker.app/logo.png",
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-emerald-500/20">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[10%] h-[800px] w-[800px] rounded-full bg-emerald-500/5 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute -right-[20%] -bottom-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[100px] dark:bg-blue-500/10" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-24">
        {/* Navigation */}
        <div className="mb-8 sm:mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:border-emerald-500/20 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <section className="mb-12 sm:mb-16 md:mb-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 backdrop-blur-md dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Market Cycle Analysis</span>
          </div>

          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-7xl">
            Bitcoin below the{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Previous ATH
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:mt-8 sm:text-lg md:text-xl">
            In the 2022 bear market, Bitcoin broke below its 2017 peak of ~$20k. 
            We analyzed daily OHLC data to measure exactly how long it stayed in this historic zone.
          </p>
        </section>

        {errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 dark:border-red-900/30 dark:bg-red-950/10">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-900 dark:text-red-200">
                  Data Unavailable
                </h3>
                <p className="mt-2 text-red-800/80 dark:text-red-300/80">{errorMessage}</p>
                <p className="mt-4 text-sm text-red-700 dark:text-red-400">
                  Please try again later or check your connection.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-14 sm:space-y-16 md:space-y-20">
            {/* Key Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/40 p-6 backdrop-blur-xl transition-all hover:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/60 sm:p-8">
                <div className="absolute -right-6 -top-6 opacity-[0.03] transition-opacity group-hover:opacity-[0.08] dark:opacity-[0.05]">
                  <TrendingDown className="h-32 w-32" />
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <TrendingDown className="h-4 w-4" />
                  </div>
                  Prior ATH Level
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums sm:text-4xl">
                  {data ? formatUsd(data.previousAth.athHigh.value) : "—"}
                </div>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  2017 intraday high ({data ? formatDateUtc(data.previousAth.athHigh.date) : "—"})
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/40 p-6 backdrop-blur-xl transition-all hover:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/60 sm:p-8">
                <div className="absolute -right-6 -top-6 opacity-[0.03] transition-opacity group-hover:opacity-[0.08] dark:opacity-[0.05]">
                  <BarChart3 className="h-32 w-32" />
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  Total Days Below
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums sm:text-4xl">
                  {data ? formatInt(data.closeBelowAthHigh.totalDays) : "—"}
                </div>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Accumulated across {data ? formatInt(data.closeBelowAthHigh.streaks.length) : "—"} separate streaks
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/40 p-6 backdrop-blur-xl transition-all hover:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/60 sm:p-8">
                 <div className="absolute -right-6 -top-6 opacity-[0.03] transition-opacity group-hover:opacity-[0.08] dark:opacity-[0.05]">
                  <Clock className="h-32 w-32" />
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  Longest Streak
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums sm:text-4xl">
                  {strongestAnswer ? `${formatInt(strongestAnswer)} days` : "—"}
                </div>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Uninterrupted daily closes
                </p>
              </div>
            </div>

            {/* Price Chart */}
            {chartSeries.length > 0 ? (
              <section className="rounded-[2.5rem] border border-neutral-200 bg-white/40 p-6 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-8 md:p-10">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white sm:text-xl md:text-2xl">
                      Daily close vs the previous ATH level
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Green is BTCUSD daily close. The dashed line is the 2017 intraday high used as the threshold.
                    </p>
                  </div>

                  {chartRangeStart && chartRangeEnd ? (
                    <div className="w-full rounded-2xl border border-neutral-200 bg-white/50 px-4 py-2 text-center text-xs font-medium text-neutral-600 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-400 sm:w-auto sm:rounded-full sm:text-left sm:whitespace-nowrap">
                      Range: {formatDateUtc(chartRangeStart)} → {formatDateUtc(chartRangeEnd)} (UTC)
                    </div>
                  ) : null}
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {chartSeries.map((line) => (
                    <div key={line.id} className="inline-flex items-center gap-2">
                      <span
                        className="inline-flex h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: line.color }}
                        aria-hidden
                      />
                      <span>{line.label}</span>
                      {line.dashed ? <span className="text-neutral-500/70">(level)</span> : null}
                    </div>
                  ))}
                </div>

                <SvgLineChart
                  series={chartSeries}
                  ariaLabel="Bitcoin daily close vs the previous all-time high level"
                  yTickCount={6}
                  formatY={(value) => formatUsd(value)}
                  formatX={(epochMs) =>
                    new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(epochMs))
                  }
                />
              </section>
            ) : null}

            {/* Insight Section */}
            <div className="rounded-[2.5rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950 sm:p-8 md:p-12">
               <div className="flex flex-col gap-8 lg:flex-row">
                 <div className="flex-1 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
                      The Quick Answer
                    </h2>
                    <div className="prose prose-neutral dark:prose-invert">
                       <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
                         {data?.closeBelowAthHigh.longestStreak ? (
                          <>
                            Using BTCUSD <span className="font-semibold text-neutral-900 dark:text-white">daily closes</span>{" "}
                            versus the prior cycle’s ATH, Bitcoin’s longest stretch spent below water was{" "}
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {formatInt(data.closeBelowAthHigh.longestStreak.days)} days
                            </span>.
                            <span className="mt-2 block text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
                              This streak ran from {formatDateUtc(data.closeBelowAthHigh.longestStreak.startDate)} to {formatDateUtc(data.closeBelowAthHigh.longestStreak.endDate)}.
                            </span>
                          </>
                        ) : (
                          "Loading market analysis..."
                        )}
                       </p>
                    </div>
                 </div>

                 <div className="flex-1 rounded-2xl border border-neutral-200 bg-white/50 p-5 dark:border-neutral-800 dark:bg-neutral-800/20 sm:p-6">
                    <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">
                      Top 5 Streaks
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <div className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900/20 md:hidden">
                        {data?.closeBelowAthHigh.topStreaks?.length ? (
                          data.closeBelowAthHigh.topStreaks.map((streak, index) => (
                            <div
                              key={index}
                              className="flex items-start justify-between gap-4 px-4 py-3"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                  #{index + 1}
                                </div>
                                <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 tabular-nums">
                                  {formatDateUtc(streak.startDate)} → {formatDateUtc(streak.endDate)}
                                </div>
                              </div>
                              <div className="shrink-0 text-right">
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                                  {formatInt(streak.days)} days
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-4 text-center text-sm text-neutral-500">
                            {errorMessage ? "No data available" : "Loading..."}
                          </div>
                        )}
                      </div>

                      <table className="hidden w-full text-left text-sm md:table">
                        <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900/50 dark:text-neutral-400">
                          <tr>
                            <th className="px-4 py-3 font-medium">Rank</th>
                            <th className="px-4 py-3 font-medium">Period</th>
                            <th className="px-4 py-3 font-medium text-right">Duration</th>
                          </tr>
                        </thead>
                         <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-900/20">
                          {data?.closeBelowAthHigh.topStreaks?.length ? (
                            data.closeBelowAthHigh.topStreaks.map((streak, index) => (
                              <tr key={index} className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">#{index + 1}</td>
                                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 tabular-nums">
                                   {formatDateUtc(streak.startDate)} — {formatDateUtc(streak.endDate)}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-neutral-900 dark:text-white tabular-nums">
                                  {formatInt(streak.days)} days
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                               <td colSpan={3} className="px-4 py-4 text-center text-neutral-500">
                                 {errorMessage ? "No data available" : "Loading..."}
                               </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                 </div>
               </div>
            </div>

            {/* Methodology & FAQ Grid */}
            <div className="grid gap-10 lg:grid-cols-2 md:gap-12">
               {/* Methodology */}
               <div className="space-y-8">
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                    Methodology
                  </h2>
                  <div className="space-y-4">
                     {[
                      {
                        title: "Defining the Level",
                        body: data ? `We use the 2017 peak intraday high of ${formatUsd(data.previousAth.athHigh.value)}.` : "We use the 2017 peak intraday high.",
                        icon: TrendingDown
                      },
                      {
                        title: "The Rule",
                        body: "A 'day below' is counted when the daily close is strictly lower than the ATH level.",
                        icon: BarChart3
                      },
                      {
                        title: "Data Source",
                        body: "Stooq Daily OHLC for BTCUSD. Analysis counts calendar days.",
                        icon: CalendarDays
                      }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/30 sm:p-5">
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                             <item.icon className="h-5 w-5" />
                           </div>
                           <div>
                              <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.body}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* FAQ */}
               <div className="space-y-8">
                 <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                    Common Questions
                  </h2>
                  <div className="space-y-4">
                    {faq.map((item, i) => (
                      <details
                        key={i}
                        className="group rounded-xl border border-neutral-200 bg-white/40 p-4 transition-all dark:border-neutral-800 dark:bg-neutral-900/20 open:bg-white dark:open:bg-neutral-900 sm:p-5"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-neutral-900 dark:text-white">
                          {item.q}
                          <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 -rotate-90 text-neutral-400 transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
               </div>
            </div>

            {/* CTA */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900 px-6 py-12 text-center shadow-2xl dark:bg-white/5 sm:px-12 md:py-20">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.emerald.500/20),transparent)]" />
               <div className="relative z-10 mx-auto max-w-2xl text-center">
                 <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                   Track your portfolio with clarity
                 </h2>
                 <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-300">
                   Stop wrestling with spreadsheets. Track your assets, cost basis, and performance across cycles in one beautiful interface.
                 </p>
                 <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                      href="/#download"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 hover:scale-105"
                    >
                      Download App
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Explore Features
                    </Link>
                 </div>
               </div>
            </div>
          </div>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </main>
    </div>
  );
}
