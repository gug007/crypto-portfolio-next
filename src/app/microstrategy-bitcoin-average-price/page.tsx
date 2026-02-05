import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, Info, LineChart } from "lucide-react";
import { SvgLineChart, type SvgLineChartSeries } from "@/components/svg-line-chart";

const title = "MicroStrategy’s Average Bitcoin Purchase Price vs Bitcoin Price";
const description =
  "One chart with two lines: Bitcoin’s historical USD price and MicroStrategy’s average BTC purchase price (average cost per BTC), based on Stooq BTCUSD daily closes and SEC EDGAR 8‑K disclosures.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/microstrategy-bitcoin-average-price" },
  keywords: [
    "microstrategy bitcoin",
    "mstr bitcoin average purchase price",
    "microstrategy cost basis",
    "bitcoin price chart",
    "btc price vs cost basis",
  ],
  openGraph: {
    title,
    description,
    url: "/microstrategy-bitcoin-average-price",
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

type StooqOhlcRow = {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
};

type SecSubmissionsResponse = {
  filings?: {
    recent?: {
      accessionNumber?: string[];
      filingDate?: string[];
      form?: string[];
      primaryDocument?: string[];
    };
  };
};

type SecFilingIndexResponse = {
  directory?: {
    item?: Array<{ name?: string }>;
  };
};

type MstrTreasurySnapshot = {
  name: string;
  symbol: string;
  asOfDateLabel: string | null;
  filingDateIso: string | null;
  sourceUrl: string;
  totalHoldingsBtc: number;
  totalEntryValueUsd: number;
  avgPurchasePriceUsd: number;
};

const MSTR_START_DATE_UTC_MS = Date.UTC(2020, 7, 1); // Aug 1, 2020 (UTC)

function formatUsd(value: number, maximumFractionDigits?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maximumFractionDigits ?? (value >= 1000 ? 0 : 2),
  }).format(value);
}

function formatDateUtc(epochMs: number) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(epochMs));
}

function toUtcMsFromIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map((part) => Number(part));
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    throw new Error(`Invalid date: ${isoDate}`);
  }
  return Date.UTC(year, month - 1, day);
}

function formatUtcYyyymmdd(date: Date) {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function parseStooqCsv(csv: string): StooqOhlcRow[] {
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
      const parsed: StooqOhlcRow = {
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
    .filter((row): row is StooqOhlcRow => row !== null);
}

async function fetchStooqDaily(symbol: string, d1: string, d2: string) {
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d&d1=${encodeURIComponent(
    d1,
  )}&d2=${encodeURIComponent(d2)}`;

  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 6 }, // 6 hours
    headers: { "User-Agent": "crypto-portfolio-tracker.app" },
  });

  if (!res.ok) {
    throw new Error(`Bitcoin price request failed (${res.status})`);
  }

  const csv = await res.text();
  const parsed = parseStooqCsv(csv);
  if (parsed.length === 0) {
    throw new Error("No rows returned for the requested range");
  }

  return parsed;
}

async function fetchBtcUsdDailyPricesSinceMstrFirstBuy() {
  const end = formatUtcYyyymmdd(new Date());
  const rows = await fetchStooqDaily("btcusd", "20200801", end);

  return rows
    .map((row) => ({ x: toUtcMsFromIsoDate(row.date), y: row.close }))
    .filter(
      (point) =>
        Number.isFinite(point.x) &&
        Number.isFinite(point.y) &&
        point.x >= MSTR_START_DATE_UTC_MS,
    )
    .sort((a, b) => a.x - b.x);
}

const SEC_CIK = "0001050446";
const SEC_CIK_NUMBER = "1050446";
const SEC_USER_AGENT =
  process.env.SEC_USER_AGENT ??
  "crypto-portfolio-tracker.app (support@crypto-portfolio-tracker.app)";

function normalizeHtmlText(input: string) {
  const withoutScripts = input.replace(/<script[\s\S]*?<\/script>/gi, " ");
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, " ");
  const withoutTags = withoutStyles.replace(/<[^>]+>/g, " ");

  return withoutTags
    .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
    .replace(/&#36;|&#x24;|&#x0024;/gi, () => "$")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumberLike(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseIntLike(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseUsdApprox(value: string, unit: string | undefined) {
  const base = parseNumberLike(value);
  if (base === null) return null;

  const unitNormalized = unit?.toLowerCase();
  if (unitNormalized === "billion") return base * 1_000_000_000;
  if (unitNormalized === "million") return base * 1_000_000;
  return base;
}

function firstMatch(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match;
  }
  return null;
}

type IndexedMatch = RegExpExecArray;

function getAllMatches(text: string, pattern: RegExp): IndexedMatch[] {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  return Array.from(text.matchAll(regex));
}

function extractMstrBtcStatsFromSecFilingHtml(html: string) {
  const text = normalizeHtmlText(html);

  const asOfPatterns = [
    /\bAs of\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\b/i,
    /\bAs of\s+(\d{1,2}\/\d{1,2}\/\d{4})\b/i,
  ];

  const holdingsPatterns = [
    /\bheld\s+(?:an\s+aggregate\s+of\s+|a\s+total\s+of\s+)?(?:approximately\s+)?([\d,]+)\s+(?:btc|bitcoins?)\b/i,
    /\bholds?\s+(?:an\s+aggregate\s+of\s+|a\s+total\s+of\s+)?(?:approximately\s+)?([\d,]+)\s+(?:btc|bitcoins?)\b/i,
    /\bbitcoin\s+holdings[^0-9]{0,40}?(?:approximately\s+)?([\d,]+)\s*(?:btc|bitcoins?)\b/i,
  ];

  const entryPatterns = [
    /\baggregate\s+(?:purchase\s+price|acquisition\s+cost|cost)\b[^$]{0,160}?\$\s*([\d.,]+)\s*(billion|million)?\b/i,
    /\bacquired\b[^$]{0,200}?\baggregate\s+(?:purchase\s+price|cost)\b[^$]{0,120}?\$\s*([\d.,]+)\s*(billion|million)?\b/i,
  ];

  const avgPatterns = [
    /\baverage(?:\s+purchase)?\s+(?:price|cost)[^$]{0,120}?\$\s*([\d,]+(?:\.\d+)?)\s+per\s+(?:bitcoin|btc)\b/i,
    /\baverage(?:\s+purchase)?\s+(?:price|cost)\s+per\s+(?:bitcoin|btc)[^$]{0,120}?\$\s*([\d,]+(?:\.\d+)?)\b/i,
  ];

  const MIN_AVG_USD = 1_000;
  const MAX_AVG_USD = 2_000_000;
  const MAX_HOLDINGS_BTC = 5_000_000;

  const holdingsMatches = holdingsPatterns.flatMap((pattern) => getAllMatches(text, pattern));
  if (holdingsMatches.length === 0) return null;

  type Candidate = {
    asOfDateLabel: string | null;
    totalHoldingsBtc: number;
    totalEntryValueUsd: number;
    avgPurchasePriceUsd: number;
    score: number;
  };

  const candidates: Candidate[] = [];

  for (const holdingsMatch of holdingsMatches) {
    const holdings = parseIntLike(holdingsMatch[1] ?? "");
    if (holdings === null || holdings <= 0 || holdings > MAX_HOLDINGS_BTC) continue;

    const index = holdingsMatch.index;
    const start = Math.max(0, index - 7_500);
    const end = Math.min(text.length, index + 25_000);
    const windowText = text.slice(start, end);

    const asOfMatch = firstMatch(windowText, asOfPatterns);
    const asOfDateLabel = asOfMatch ? asOfMatch[1] : null;

    const avgMatches = avgPatterns.flatMap((pattern) => getAllMatches(windowText, pattern));
    const avgCandidates = avgMatches
      .map((match) => ({
        value: parseNumberLike(match[1] ?? ""),
        index: match.index,
      }))
      .filter((item): item is { value: number; index: number } => item.value !== null)
      .filter((item) => item.value >= MIN_AVG_USD && item.value <= MAX_AVG_USD);

    const entryMatches = entryPatterns.flatMap((pattern) => getAllMatches(windowText, pattern));
    const entryCandidates = entryMatches
      .map((match) => ({
        value: parseUsdApprox(match[1] ?? "", match[2]),
        index: match.index,
      }))
      .filter((item): item is { value: number; index: number } => item.value !== null)
      .filter((item) => item.value >= holdings * MIN_AVG_USD && item.value <= holdings * MAX_AVG_USD);

    let bestAvg: number | null = null;
    let bestEntry: number | null = null;
    let explicitAvg = false;
    let explicitEntry = false;

    if (avgCandidates.length > 0 && entryCandidates.length > 0) {
      let bestScore = Number.NEGATIVE_INFINITY;
      for (const avgCandidate of avgCandidates) {
        for (const entryCandidate of entryCandidates) {
          const derivedAvg = entryCandidate.value / holdings;
          const relDelta = Math.abs(derivedAvg - avgCandidate.value) / avgCandidate.value;
          if (!Number.isFinite(relDelta) || relDelta > 0.35) continue;

          const distancePenalty = Math.min(2, Math.abs(entryCandidate.index - avgCandidate.index) / 800);
          const pairScore = 5 - relDelta * 4 - distancePenalty;
          if (pairScore > bestScore) {
            bestScore = pairScore;
            bestAvg = avgCandidate.value;
            bestEntry = entryCandidate.value;
            explicitAvg = true;
            explicitEntry = true;
          }
        }
      }
    }

    if (bestAvg === null && avgCandidates.length > 0) {
      bestAvg = avgCandidates[0].value;
      bestEntry = bestAvg * holdings;
      explicitAvg = true;
      explicitEntry = false;
    }

    if (bestAvg === null && entryCandidates.length > 0) {
      bestEntry = entryCandidates[0].value;
      bestAvg = bestEntry / holdings;
      explicitAvg = false;
      explicitEntry = true;
    }

    if (
      bestAvg === null ||
      bestEntry === null ||
      !Number.isFinite(bestAvg) ||
      !Number.isFinite(bestEntry) ||
      bestAvg < MIN_AVG_USD ||
      bestAvg > MAX_AVG_USD
    ) {
      continue;
    }

    let score = 0;
    if (explicitAvg) score += 3;
    if (explicitEntry) score += 2;
    if (asOfDateLabel) score += 1;

    candidates.push({
      asOfDateLabel,
      totalHoldingsBtc: holdings,
      totalEntryValueUsd: bestEntry,
      avgPurchasePriceUsd: bestAvg,
      score,
    });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  return {
    asOfDateLabel: best.asOfDateLabel,
    totalHoldingsBtc: best.totalHoldingsBtc,
    totalEntryValueUsd: best.totalEntryValueUsd,
    avgPurchasePriceUsd: best.avgPurchasePriceUsd,
  };
}

async function fetchSecJson<T>(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 }, // 1 hour
    headers: {
      Accept: "application/json",
      "User-Agent": SEC_USER_AGENT,
    },
  });

  if (!res.ok) {
    throw new Error(`SEC request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

async function fetchSecText(url: string, accept: string = "text/html") {
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 }, // 1 hour
    headers: {
      Accept: accept,
      "User-Agent": SEC_USER_AGENT,
    },
  });

  if (!res.ok) {
    throw new Error(`SEC filing request failed (${res.status})`);
  }

  return res.text();
}

function getSecAccessionBaseUrl(accessionNumber: string) {
  const accessionNoDashes = accessionNumber.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${SEC_CIK_NUMBER}/${accessionNoDashes}`;
}

function pushUnique(list: string[], value: string | null) {
  if (!value) return;
  if (list.includes(value)) return;
  list.push(value);
}

async function getSecFilingCandidateDocumentUrls(
  accessionNumber: string,
  primaryDocument: string | null,
) {
  const baseUrl = getSecAccessionBaseUrl(accessionNumber);
  const index = await fetchSecJson<SecFilingIndexResponse>(`${baseUrl}/index.json`);
  const items = index.directory?.item ?? [];

  const htmlDocs = items
    .map((item) => item.name)
    .filter((name): name is string => typeof name === "string" && name.length > 0)
    .filter((name) => /\.(htm|html)$/i.test(name))
    .filter((name) => !name.toLowerCase().includes("index"));

  const candidates: string[] = [];
  pushUnique(candidates, primaryDocument);

  const lower = (name: string) => name.toLowerCase();

  const exhibitLike = htmlDocs.filter((name) => {
    const n = lower(name);
    return (
      n.includes("ex99") ||
      n.includes("99-") ||
      n.includes("99.") ||
      n.includes("press") ||
      n.includes("release")
    );
  });
  for (const name of exhibitLike) pushUnique(candidates, name);

  const eightKLike = htmlDocs.filter((name) => {
    const n = lower(name);
    return n.includes("8k") || n.includes("8-k") || n.includes("d8k");
  });
  for (const name of eightKLike) pushUnique(candidates, name);

  for (const name of htmlDocs) pushUnique(candidates, name);

  return candidates.slice(0, 10).map((name) => ({ url: `${baseUrl}/${name}`, name }));
}

async function tryExtractMstrFromSecAccession(accessionNumber: string, primaryDocument: string | null) {
  const accessionNoDashes = accessionNumber.replace(/-/g, "");
  const baseUrl = `https://www.sec.gov/Archives/edgar/data/${SEC_CIK_NUMBER}/${accessionNoDashes}`;
  let hadSuccessfulFetch = false;
  let lastFetchError: Error | null = null;

  const extractedFrom = async (url: string, accept?: string) => {
    try {
      const body = await fetchSecText(url, accept);
      hadSuccessfulFetch = true;
      const extracted = extractMstrBtcStatsFromSecFilingHtml(body);
      return extracted ? { sourceUrl: url, extracted } : null;
    } catch (error) {
      lastFetchError = error instanceof Error ? error : new Error("SEC fetch failed");
      return null;
    }
  };

  if (primaryDocument) {
    const res = await extractedFrom(`${baseUrl}/${primaryDocument}`, "text/html");
    if (res) return res;
  }

  const completeSubmissionUrl = `${baseUrl}/${accessionNoDashes}.txt`;
  const fullRes = await extractedFrom(completeSubmissionUrl, "text/plain");
  if (fullRes) return fullRes;

  try {
    const candidates = await getSecFilingCandidateDocumentUrls(accessionNumber, primaryDocument);
    for (const candidate of candidates) {
      const res = await extractedFrom(candidate.url, "text/html");
      if (res) return res;
    }
  } catch {
    // If index.json is blocked/rate-limited, we still already tried primaryDocument + full submission.
  }

  if (!hadSuccessfulFetch && lastFetchError) {
    throw lastFetchError;
  }

  return null;
}

async function fetchMicroStrategyBtcCostBasisPerBtcUsd(): Promise<MstrTreasurySnapshot> {
  const submissions = await fetchSecJson<SecSubmissionsResponse>(
    `https://data.sec.gov/submissions/CIK${SEC_CIK}.json`,
  );

  const recent = submissions.filings?.recent;
  const forms = recent?.form ?? [];
  const accessionNumbers = recent?.accessionNumber ?? [];
  const filingDates = recent?.filingDate ?? [];
  const primaryDocuments = recent?.primaryDocument ?? [];

  const scanLength = Math.min(
    forms.length,
    accessionNumbers.length,
    filingDates.length,
    primaryDocuments.length,
  );

  const eightKIndices: number[] = [];
  for (let i = 0; i < scanLength; i += 1) {
    const form = forms[i];
    const accessionNumber = accessionNumbers[i];
    if (!form || !accessionNumber) continue;
    if (!form.startsWith("8-K")) continue;
    eightKIndices.push(i);
    if (eightKIndices.length >= 20) break;
  }

  for (const i of eightKIndices) {
    const accessionNumber = accessionNumbers[i];
    if (!accessionNumber) continue;

    const extractedRes = await tryExtractMstrFromSecAccession(
      accessionNumber,
      primaryDocuments[i] ?? null,
    );

    if (!extractedRes) continue;
    const extracted = extractedRes.extracted;

    return {
      name: "MicroStrategy",
      symbol: "MSTR",
      asOfDateLabel: extracted.asOfDateLabel,
      filingDateIso: filingDates[i] ?? null,
      sourceUrl: extractedRes.sourceUrl,
      totalHoldingsBtc: extracted.totalHoldingsBtc,
      totalEntryValueUsd: extracted.totalEntryValueUsd,
      avgPurchasePriceUsd: extracted.avgPurchasePriceUsd,
    };
  }

  throw new Error(
    "Could not extract MicroStrategy’s Bitcoin holdings / average purchase price from recent SEC filings.",
  );
}

export default async function MicroStrategyBitcoinAveragePricePage() {
  let btcPoints: Array<{ x: number; y: number }> | null = null;
  let treasury: MstrTreasurySnapshot | null = null;
  let errorMessage: string | null = null;
  let treasuryWarning: string | null = null;

  const [btcResult, treasuryResult] = await Promise.allSettled([
    fetchBtcUsdDailyPricesSinceMstrFirstBuy(),
    fetchMicroStrategyBtcCostBasisPerBtcUsd(),
  ]);

  if (btcResult.status === "fulfilled") {
    btcPoints = btcResult.value;
  } else {
    const reason = btcResult.reason;
    errorMessage = reason instanceof Error ? reason.message : "Failed to load Bitcoin price data.";
  }

  if (treasuryResult.status === "fulfilled") {
    treasury = treasuryResult.value;
  } else {
    const reason = treasuryResult.reason;
    treasuryWarning =
      reason instanceof Error
        ? reason.message
        : "Failed to load MicroStrategy treasury data.";
  }

  const latestBtc = btcPoints?.length ? btcPoints[btcPoints.length - 1] : null;
  const firstBtc = btcPoints?.length ? btcPoints[0] : null;

  const series: SvgLineChartSeries[] = [];
  if (btcPoints && btcPoints.length > 1) {
    series.push({
      id: "btc",
      label: "Bitcoin price (USD)",
      color: "#f59e0b",
      points: btcPoints,
      strokeWidth: 2.75,
    });
  }

  if (treasury && firstBtc && latestBtc) {
    series.push({
      id: "mstr",
      label: "MicroStrategy avg purchase price (USD/BTC)",
      color: "#22c55e",
      dashed: true,
      points: [
        { x: firstBtc.x, y: treasury.avgPurchasePriceUsd },
        { x: latestBtc.x, y: treasury.avgPurchasePriceUsd },
      ],
      strokeWidth: 2.5,
    });
  }

  let premiumUsd: number | null = null;
  let premiumPct: number | null = null;

  if (latestBtc && treasury) {
    premiumUsd = latestBtc.y - treasury.avgPurchasePriceUsd;
    premiumPct = (premiumUsd / treasury.avgPurchasePriceUsd) * 100;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-amber-500/20">
      {/* Background ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[10%] h-[700px] w-[700px] rounded-full bg-amber-500/5 blur-[120px] dark:bg-amber-500/10" />
        <div className="absolute -right-[20%] -bottom-[10%] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[100px] dark:bg-emerald-500/10" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-black/5 bg-background/60 px-4 py-2 text-sm font-medium text-secondary shadow-sm backdrop-blur-md transition-all hover:border-amber-500/20 hover:bg-amber-500/10 hover:text-foreground dark:border-white/10 dark:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <section className="mb-10 md:mb-14">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 backdrop-blur-md dark:text-amber-300">
            <LineChart className="h-3.5 w-3.5" />
            <span>Bitcoin Treasury Chart</span>
          </div>

          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            MicroStrategy’s{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              average Bitcoin purchase price
            </span>{" "}
            vs Bitcoin price
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
            One chart, two lines: Bitcoin’s daily USD market price and MicroStrategy’s average{" "}
            BTC cost basis per BTC (from SEC EDGAR 8‑K disclosures).
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
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {errorMessage}
                </p>
                <p className="mt-4 text-sm text-red-700/80 dark:text-red-300/80">
                  Tip: This page depends on public data sources (Stooq and SEC EDGAR) that can occasionally rate‑limit or fail.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {!errorMessage && treasuryWarning ? (
          <div className="mb-8 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 text-sm text-amber-900 shadow-sm backdrop-blur-md dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">MicroStrategy line unavailable</div>
                <div className="mt-1 text-amber-900/80 dark:text-amber-100/80">
                  {treasuryWarning}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {!errorMessage && latestBtc && treasury ? (
          <section className="mb-10 grid gap-4 md:mb-12 md:grid-cols-3">
            <div className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                Bitcoin (latest)
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight">
                {formatUsd(latestBtc.y)}
              </div>
              <div className="mt-1 text-sm text-secondary">
                Data through {formatDateUtc(latestBtc.x)} (UTC)
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                MicroStrategy avg purchase price
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight">
                {formatUsd(treasury.avgPurchasePriceUsd)}
              </div>
              <div className="mt-1 text-sm text-secondary">
                {treasury.totalHoldingsBtc.toLocaleString("en-US")} BTC held (per SEC EDGAR 8‑K)
              </div>
              {treasury.asOfDateLabel || treasury.filingDateIso ? (
                <div className="mt-1 text-xs text-secondary/80">
                  As of{" "}
                  {treasury.asOfDateLabel ??
                    (treasury.filingDateIso
                      ? formatDateUtc(toUtcMsFromIsoDate(treasury.filingDateIso))
                      : "—")}
                </div>
              ) : null}
              <a
                href={treasury.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-xs font-medium text-secondary hover:text-foreground transition-colors"
              >
                View SEC filing
              </a>
            </div>

            <div className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                <Building2 className="h-4 w-4" />
                Price vs cost basis
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight">
                {premiumUsd !== null ? formatUsd(premiumUsd, 0) : "—"}
              </div>
              <div className="mt-1 text-sm text-secondary">
                {premiumPct !== null
                  ? `${premiumPct >= 0 ? "+" : ""}${premiumPct.toFixed(1)}% vs avg purchase price`
                  : "—"}
              </div>
            </div>
          </section>
        ) : null}

        {!errorMessage && series.length > 0 ? (
          <section className="mb-10 md:mb-14">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-secondary">
                {series.map((line) => (
                  <div key={line.id} className="inline-flex items-center gap-2">
                    <span
                      className="inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: line.color }}
                      aria-hidden
                    />
                    <span>{line.label}</span>
                    {line.dashed ? (
                      <span className="text-secondary/60">(avg)</span>
                    ) : null}
                  </div>
                ))}
              </div>

              {firstBtc && latestBtc ? (
                <div className="text-xs text-secondary">
                  Range: {formatDateUtc(firstBtc.x)} → {formatDateUtc(latestBtc.x)} (UTC)
                </div>
              ) : null}
            </div>

            <SvgLineChart
              series={series}
              ariaLabel="Bitcoin price and MicroStrategy average purchase price"
              formatY={(value) => formatUsd(value, 0)}
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

        {!errorMessage && latestBtc && treasury ? (
          <section className="rounded-3xl border border-black/5 bg-background/60 p-8 text-sm leading-relaxed text-secondary shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <h2 className="text-base font-semibold text-foreground">
              Methodology & data sources
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-foreground">Bitcoin price:</span>{" "}
                Stooq BTCUSD daily close (USD).
              </li>
              <li>
                <span className="font-medium text-foreground">MicroStrategy avg purchase price:</span>{" "}
                extracted from the most recent SEC EDGAR Form 8‑K that reports Bitcoin holdings and an average purchase
                price per BTC.
              </li>
              <li>
                <span className="font-medium text-foreground">Note:</span>{" "}
                The MicroStrategy line is flat because it represents the current average cost basis per BTC (not a full
                historical time series of every purchase).
              </li>
            </ul>

            <p className="mt-5 text-xs text-secondary/80">
              This page is for informational purposes only and is not financial advice.
            </p>
          </section>
        ) : null}
      </main>
    </div>
  );
}
