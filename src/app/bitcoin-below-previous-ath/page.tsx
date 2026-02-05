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
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="absolute top-0 right-0 p-6 z-10">
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-28">
        <Link
          href="/"
          className="text-secondary hover:text-foreground transition-colors mb-8 md:mb-10 inline-flex items-center gap-2 text-sm md:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <section className="relative isolate overflow-hidden rounded-3xl border border-black/5 bg-background/30 p-8 shadow-sm dark:border-white/10 dark:bg-white/5 md:p-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),white)] opacity-20 dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.900),transparent)]" />

          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-background/50 px-4 py-1.5 text-xs font-medium text-secondary backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-white/5 ring-1 ring-inset ring-black/5 dark:ring-white/5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent font-bold">
              Cycle Context
            </span>
            <span className="text-secondary/60">•</span>
            <span>Data-driven answer</span>
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-6xl">
            Bitcoin below the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
              previous ATH
            </span>
            : how many days?
          </h1>

          <p className="mt-5 max-w-3xl text-base md:text-lg leading-7 md:leading-8 text-secondary">
            In the last major cycle, BTC briefly broke below the previous
            cycle’s peak near{" "}
            <span className="text-foreground font-semibold">$20k</span>. Here’s
            the exact day count (based on daily OHLC data), plus the date range
            and the streaks that made up the drawdown.
          </p>

          {errorMessage ? (
            <div className="mt-10 rounded-2xl border border-black/10 bg-background/60 p-5 text-sm text-secondary dark:border-white/10 dark:bg-background/20">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Couldn’t load market data
                  </div>
                  <div className="mt-1">{errorMessage}</div>
                  <div className="mt-2 text-xs text-secondary">
                    Tip: try again later, or verify your deployment environment
                    allows outbound requests to the data source.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="group rounded-3xl border border-black/5 bg-background/40 p-6 backdrop-blur-xl transition hover:bg-background/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <TrendingDown className="h-4 w-4" />
                  </div>
                  Previous ATH level
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                  {data ? formatUsd(data.previousAth.athHigh.value) : "—"}
                </div>
                <p className="mt-2 text-sm text-secondary">
                  Peak daily high on{" "}
                  {data ? formatDateUtc(data.previousAth.athHigh.date) : "—"}
                </p>
              </div>

              <div className="group rounded-3xl border border-black/5 bg-background/40 p-6 backdrop-blur-xl transition hover:bg-background/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  Total days (close below)
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                  {data ? formatInt(data.closeBelowAthHigh.totalDays) : "—"}
                </div>
                <p className="mt-2 text-sm text-secondary">
                  Across{" "}
                  {data ? formatInt(data.closeBelowAthHigh.streaks.length) : "—"}{" "}
                  streaks in{" "}
                  {data?.analysisWindow.startDate
                    ? data.analysisWindow.startDate.slice(0, 4)
                    : "—"}
                  –
                  {data?.analysisWindow.endDate
                    ? data.analysisWindow.endDate.slice(0, 4)
                    : "—"}
                </p>
              </div>

              <div className="group rounded-3xl border border-black/5 bg-background/40 p-6 backdrop-blur-xl transition hover:bg-background/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  Longest streak
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                  {strongestAnswer ? `${formatInt(strongestAnswer)} days` : "—"}
                </div>
                <p className="mt-2 text-sm text-secondary">
                  {data?.closeBelowAthHigh.longestStreak
                    ? `${formatDateUtc(
                        data.closeBelowAthHigh.longestStreak.startDate,
                      )} → ${formatDateUtc(data.closeBelowAthHigh.longestStreak.endDate)}`
                    : "—"}
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="mt-14 space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Quick answer
            </h2>
            <div className="rounded-2xl border border-black/5 bg-surface/60 p-6 dark:border-white/10 dark:bg-surface/40">
              <p className="text-secondary leading-relaxed">
                {data?.closeBelowAthHigh.longestStreak ? (
                  <>
                    Using BTCUSD <span className="text-foreground font-medium">daily closes</span>{" "}
                    versus the prior cycle’s ATH level{" "}
                    <span className="text-foreground font-medium">
                      ({formatUsd(data.closeBelowAthHigh.threshold)})
                    </span>
                    , Bitcoin’s <span className="text-foreground font-medium">longest</span>{" "}
                    uninterrupted stretch below that level lasted{" "}
                    <span className="text-foreground font-semibold">
                      {formatInt(data.closeBelowAthHigh.longestStreak.days)} days
                    </span>{" "}
                    ({formatDateUtc(data.closeBelowAthHigh.longestStreak.startDate)} →{" "}
                    {formatDateUtc(data.closeBelowAthHigh.longestStreak.endDate)}).
                  </>
                ) : (
                  <>Load the page with market data enabled to see the computed result.</>
                )}
              </p>

              {data?.closeBelowAthHigh.spanDays !== null &&
              data?.closeBelowAthHigh.firstBelow &&
              data?.closeBelowAthHigh.lastBelow ? (
                <p className="mt-3 text-xs leading-relaxed text-secondary">
                  Context: from the <span className="text-foreground/90">first</span>{" "}
                  close below the level ({formatDateUtc(data.closeBelowAthHigh.firstBelow.startDate)}) to the{" "}
                  <span className="text-foreground/90">last</span>{" "}
                  close below it ({formatDateUtc(data.closeBelowAthHigh.lastBelow.endDate)}), the span was{" "}
                  {formatInt(data.closeBelowAthHigh.spanDays)} calendar days.
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              The streaks (top 5)
            </h2>
            <p className="text-secondary leading-relaxed">
              “Stayed below” can mean different things. This table uses{" "}
              <span className="text-foreground/90">daily close &lt; prior ATH level</span>{" "}
              and groups consecutive days into streaks.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-black/5 bg-background/50 dark:border-white/10 dark:bg-background/20">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-black/5 bg-surface/60 text-secondary dark:border-white/10 dark:bg-surface/40">
                  <tr>
                    <th className="px-5 py-3 font-medium">Rank</th>
                    <th className="px-5 py-3 font-medium">Start</th>
                    <th className="px-5 py-3 font-medium">End</th>
                    <th className="px-5 py-3 font-medium">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.closeBelowAthHigh.topStreaks?.length ? (
                    data.closeBelowAthHigh.topStreaks.map((streak, index) => (
                      <tr
                        key={`${streak.startDate}-${streak.endDate}-${index}`}
                        className="border-b border-black/5 last:border-0 dark:border-white/10"
                      >
                        <td className="px-5 py-4 font-medium text-foreground">
                          #{index + 1}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {formatDateUtc(streak.startDate)}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {formatDateUtc(streak.endDate)}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {formatInt(streak.days)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="dark:border-white/10">
                      <td className="px-5 py-4 text-secondary" colSpan={4}>
                        {errorMessage ? "Data unavailable." : "Loading…"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data ? (
              <p className="text-xs leading-relaxed text-secondary">
                Data source: {data.source}. Analysis window:{" "}
                {data.analysisWindow.startDate
                  ? formatDateUtc(data.analysisWindow.startDate)
                  : "—"}{" "}
                →{" "}
                {data.analysisWindow.endDate
                  ? formatDateUtc(data.analysisWindow.endDate)
                  : "—"}
                .
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Methodology (simple + transparent)
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Define the level",
                  body: data
                    ? `Prior ATH = 2017 peak daily high (${formatUsd(
                        data.previousAth.athHigh.value,
                      )}) from BTCUSD daily OHLC.`
                    : "Prior ATH = 2017 peak daily high (BTCUSD daily OHLC).",
                  icon: <TrendingDown className="h-4 w-4 text-accent" />,
                },
                {
                  title: "Choose the rule",
                  body: "“Below” = daily close is strictly less than that level. Consecutive days are grouped into streaks.",
                  icon: <BarChart3 className="h-4 w-4 text-accent" />,
                },
                {
                  title: "Count the days",
                  body: "Days are counted from the daily rows returned by the data source (BTC trades 24/7, so weekends are included).",
                  icon: <CalendarDays className="h-4 w-4 text-accent" />,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/5 bg-surface/60 p-6 dark:border-white/10 dark:bg-surface/40"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {item.icon}
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-black/5 bg-background/50 p-6 dark:border-white/10 dark:bg-background/20">
              <p className="text-sm leading-relaxed text-secondary">
                Important: different exchanges and indexes can report slightly
                different ATH values and daily closes. If you need an exact
                replication for research, use a single data source end‑to‑end
                (same exchange/index, same time zone cutoff) and stick to one
                rule (close vs intraday).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              FAQ
            </h2>
            <div className="grid gap-3">
              {faq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-black/5 bg-background/50 p-5 transition-colors dark:border-white/10 dark:bg-background/20"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium text-foreground outline-none">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
                      ?
                    </span>
                    {item.q}
                    <span className="float-right text-secondary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-secondary">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-surface/60 p-6 dark:border-white/10 dark:bg-surface/40 md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Track your crypto portfolio with clarity
            </h2>
            <p className="mt-3 max-w-2xl text-secondary leading-relaxed">
              Want a cleaner way to follow your holdings through cycles? Track
              assets, cost basis, and performance across portfolios—without
              spreadsheet chaos.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#download"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[color:var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                Download the app
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-black/10 bg-background/60 px-5 py-3 text-sm font-medium text-foreground hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 dark:border-white/10 dark:bg-background/30"
              >
                Explore Crypto Portfolio
              </Link>
            </div>
          </div>
        </section>

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
