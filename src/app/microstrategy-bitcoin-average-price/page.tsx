import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, Info, LineChart } from "lucide-react";
import { SvgLineChart, type SvgLineChartSeries } from "@/components/svg-line-chart";

const title = "MicroStrategy’s Average Bitcoin Purchase Price vs Bitcoin Price";
const description =
  "One chart with two lines: Bitcoin’s historical USD price and MicroStrategy’s average BTC purchase price (average cost per BTC), based on Stooq BTCUSD daily closes and SEC EDGAR filings (8‑K / 10‑Q / 10‑K).";

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

type SecSubmissionsRecent = {
  accessionNumber?: string[];
  filingDate?: string[];
  form?: string[];
  primaryDocument?: string[];
};

type SecSubmissionsResponse = {
  filings?: {
    recent?: SecSubmissionsRecent;
    files?: Array<{
      name?: string;
      filingFrom?: string;
      filingTo?: string;
      filingCount?: number;
    }>;
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

type MstrTreasurySnapshotPoint = MstrTreasurySnapshot & {
  xUtcMs: number;
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

const MONTH_NAME_TO_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseAsOfDateLabelToUtcMs(label: string) {
  const trimmed = label.trim();

  const monthNameMatch = trimmed.match(
    /^([A-Za-z]+)\s+(\d{1,2})(?:,)?\s*(\d{4})$/,
  );
  if (monthNameMatch) {
    const monthIndex = MONTH_NAME_TO_INDEX[monthNameMatch[1].toLowerCase()];
    const day = Number(monthNameMatch[2]);
    const year = Number(monthNameMatch[3]);
    if (monthIndex !== undefined && Number.isFinite(day) && Number.isFinite(year)) {
      return Date.UTC(year, monthIndex, day);
    }
  }

  const slashedMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashedMatch) {
    const month = Number(slashedMatch[1]);
    const day = Number(slashedMatch[2]);
    const year = Number(slashedMatch[3]);
    if (Number.isFinite(month) && Number.isFinite(day) && Number.isFinite(year)) {
      return Date.UTC(year, month - 1, day);
    }
  }

  return null;
}

function getTreasurySnapshotUtcMs(snapshot: MstrTreasurySnapshot) {
  if (snapshot.asOfDateLabel) {
    const parsed = parseAsOfDateLabelToUtcMs(snapshot.asOfDateLabel);
    if (parsed !== null) return parsed;
  }
  if (snapshot.filingDateIso) {
    try {
      return toUtcMsFromIsoDate(snapshot.filingDateIso);
    } catch {
      // ignore
    }
  }
  return null;
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
    /\bAs of\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})\b/i,
    /\bAs of\s+(\d{1,2}\/\d{1,2}\/\d{4})\b/i,
  ];

  const holdingsPatterns = [
    /\bheld\s+(?:an\s+aggregate\s+of\s+|a\s+total\s+of\s+)?(?:approximately\s+)?([\d,]+)\s+(?:btc|bitcoins?)\b/i,
    /\bholds?\s+(?:an\s+aggregate\s+of\s+|a\s+total\s+of\s+)?(?:approximately\s+)?([\d,]+)\s+(?:btc|bitcoins?)\b/i,
    /\bhad\s+(?:an\s+aggregate\s+of\s+|a\s+total\s+of\s+)?(?:approximately\s+)?([\d,]+)\s+(?:btc|bitcoins?)\b/i,
    /\bbitcoin\s+holdings[^0-9]{0,40}?(?:approximately\s+)?([\d,]+)\s*(?:btc|bitcoins?)\b/i,
    /\btotal\s+bitcoin\s+holdings\s+(?:were|was)\s+(?:approximately\s+)?([\d,]+)\s*(?:btc|bitcoins?)\b/i,
  ];

  const entryPatterns = [
    /\baggregate\s+(?:purchase\s+price|acquisition\s+cost|cost)\b[^$]{0,160}?\$\s*([\d.,]+)\s*(billion|million)?\b/i,
    /\bacquired\b[^$]{0,200}?\baggregate\s+(?:purchase\s+price|cost)\b[^$]{0,120}?\$\s*([\d.,]+)\s*(billion|million)?\b/i,
  ];

  const avgPatterns = [
    /\baverage(?:\s+purchase)?\s+(?:price|cost)[^$]{0,120}?\$\s*([\d,]+(?:\.\d+)?)\s+per\s+(?:bitcoin|btc)\b/i,
    /\baverage(?:\s+purchase)?\s+(?:price|cost)\s+per\s+(?:bitcoin|btc)[^$]{0,120}?\$\s*([\d,]+(?:\.\d+)?)\b/i,
    /\baverage\s+cost\s+basis\b[^$]{0,120}?\$\s*([\d,]+(?:\.\d+)?)\s+per\s+(?:bitcoin|btc)\b/i,
    /\baverage\s+cost\s+basis\s+per\s+(?:bitcoin|btc)[^$]{0,120}?\$\s*([\d,]+(?:\.\d+)?)\b/i,
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

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
) {
  const safeConcurrency = Math.max(1, Math.floor(concurrency));
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  const workers = Array.from({ length: Math.min(safeConcurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(workers);
  return results;
}

function isEightKForm(form: string) {
  return form.startsWith("8-K");
}

function isTreasuryDisclosureForm(form: string) {
  return (
    isEightKForm(form) ||
    form.startsWith("10-Q") ||
    form.startsWith("10-K")
  );
}

function getMonthKeyFromIsoDate(isoDate: string) {
  return isoDate.slice(0, 7); // YYYY-MM
}

async function fetchMicroStrategyBtcCostBasisHistory(): Promise<MstrTreasurySnapshotPoint[]> {
  const submissions = await fetchSecJson<SecSubmissionsResponse>(
    `https://data.sec.gov/submissions/CIK${SEC_CIK}.json`,
  );

  const startIsoDate = "2020-08-01";
  const recentDaysIncludeAll = 180;
  const recentCutoffIsoDate = new Date(Date.now() - recentDaysIncludeAll * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const maxSelectedFilings = 200;

  type FilingRef = {
    accessionNumber: string;
    filingDateIso: string | null;
    primaryDocument: string | null;
    form: string;
  };

  const buildFilingRefsFromRecent = (recent?: SecSubmissionsRecent): FilingRef[] => {
    if (!recent) return [];

    const forms = recent.form ?? [];
    const accessionNumbers = recent.accessionNumber ?? [];
    const filingDates = recent.filingDate ?? [];
    const primaryDocuments = recent.primaryDocument ?? [];

    const scanLength = Math.min(forms.length, accessionNumbers.length);
    const refs: FilingRef[] = [];
    for (let i = 0; i < scanLength; i += 1) {
      const form = forms[i] ?? "";
      const accessionNumber = accessionNumbers[i];
      if (!accessionNumber || !form) continue;
      refs.push({
        accessionNumber,
        filingDateIso: filingDates[i] ?? null,
        primaryDocument: primaryDocuments[i] ?? null,
        form,
      });
    }
    return refs;
  };

  const allFilings: FilingRef[] = [];
  allFilings.push(...buildFilingRefsFromRecent(submissions.filings?.recent));

  const supplementalFileRanges = (submissions.filings?.files ?? [])
    .map((file) => ({
      name: typeof file.name === "string" ? file.name : null,
      filingFrom: typeof file.filingFrom === "string" ? file.filingFrom : null,
      filingTo: typeof file.filingTo === "string" ? file.filingTo : null,
    }))
    .filter(
      (file): file is { name: string; filingFrom: string | null; filingTo: string | null } =>
        file.name !== null,
    )
    .filter((file) => !file.filingTo || file.filingTo >= startIsoDate)
    .sort((a, b) => (b.filingTo ?? "").localeCompare(a.filingTo ?? ""));

  const supplementalFiles: Array<{ name: string }> = [];
  let earliestCoveredIso: string | null = null;
  const maxSupplementalFilesToFetch = 80;

  for (const file of supplementalFileRanges) {
    supplementalFiles.push({ name: file.name });
    const candidateEarliest = file.filingFrom ?? file.filingTo;
    if (candidateEarliest) {
      earliestCoveredIso =
        earliestCoveredIso === null
          ? candidateEarliest
          : candidateEarliest.localeCompare(earliestCoveredIso) < 0
            ? candidateEarliest
            : earliestCoveredIso;
    }

    if (earliestCoveredIso !== null && earliestCoveredIso <= startIsoDate) break;
    if (supplementalFiles.length >= maxSupplementalFilesToFetch) break;
  }

  if (supplementalFiles.length > 0) {
    const supplementalResults = await mapWithConcurrency(supplementalFiles, 2, async (file) => {
      try {
        const fileRes = await fetchSecJson<SecSubmissionsResponse>(
          `https://data.sec.gov/submissions/${file.name}`,
        );
        return buildFilingRefsFromRecent(fileRes.filings?.recent);
      } catch {
        return [];
      }
    });

    for (const refs of supplementalResults) {
      allFilings.push(...refs);
    }
  }

  allFilings.sort((a, b) => (b.filingDateIso ?? "").localeCompare(a.filingDateIso ?? ""));

  const selected: FilingRef[] = [];
  const monthSampleCounts = new Map<string, number>();
  const seenAccessionNumbers = new Set<string>();
  const maxSampledFilingsPerMonth = 2;

  for (const filing of allFilings) {
    const form = filing.form;
    const accessionNumber = filing.accessionNumber;
    if (!accessionNumber || !form || !isTreasuryDisclosureForm(form)) continue;
    if (seenAccessionNumbers.has(accessionNumber)) continue;

    const filingDateIso = filing.filingDateIso;
    if (filingDateIso && filingDateIso < startIsoDate) break;

    if (selected.length >= maxSelectedFilings) break;

    if (filingDateIso && filingDateIso >= recentCutoffIsoDate) {
      selected.push(filing);
      seenAccessionNumbers.add(accessionNumber);
      continue;
    }

    const monthKey = filingDateIso ? getMonthKeyFromIsoDate(filingDateIso) : null;
    if (monthKey) {
      const count = monthSampleCounts.get(monthKey) ?? 0;
      if (count >= maxSampledFilingsPerMonth) continue;
      selected.push(filing);
      monthSampleCounts.set(monthKey, count + 1);
      seenAccessionNumbers.add(accessionNumber);
    }
  }

  let lastError: Error | null = null;

  const snapshots = await mapWithConcurrency(selected, 2, async (filing) => {
    try {
      const extractedRes = await tryExtractMstrFromSecAccession(
        filing.accessionNumber,
        filing.primaryDocument,
      );
      if (!extractedRes) return null;
      const extracted = extractedRes.extracted;

      return {
        name: "MicroStrategy",
        symbol: "MSTR",
        asOfDateLabel: extracted.asOfDateLabel,
        filingDateIso: filing.filingDateIso,
        sourceUrl: extractedRes.sourceUrl,
        totalHoldingsBtc: extracted.totalHoldingsBtc,
        totalEntryValueUsd: extracted.totalEntryValueUsd,
        avgPurchasePriceUsd: extracted.avgPurchasePriceUsd,
      } satisfies MstrTreasurySnapshot;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("SEC filing request failed");
      return null;
    }
  });

  const points = snapshots
    .filter((snapshot): snapshot is MstrTreasurySnapshot => snapshot !== null)
    .map((snapshot) => {
      const xUtcMs = getTreasurySnapshotUtcMs(snapshot);
      if (xUtcMs === null) return null;
      return { ...snapshot, xUtcMs } satisfies MstrTreasurySnapshotPoint;
    })
    .filter((snapshot): snapshot is MstrTreasurySnapshotPoint => snapshot !== null);

  if (points.length === 0) {
    throw lastError ?? new Error(
      "Could not extract MicroStrategy’s Bitcoin holdings / average purchase price from recent SEC filings.",
    );
  }

  const byDate = new Map<number, MstrTreasurySnapshotPoint>();
  for (const point of points) {
    const existing = byDate.get(point.xUtcMs);
    if (!existing || point.totalHoldingsBtc > existing.totalHoldingsBtc) {
      byDate.set(point.xUtcMs, point);
    }
  }

  return [...byDate.values()].sort((a, b) => a.xUtcMs - b.xUtcMs);
}

function buildStepPointsFromTreasuryHistory(
  historyAsc: MstrTreasurySnapshotPoint[],
  startXUtcMs: number,
  endXUtcMs: number,
) {
  if (historyAsc.length === 0) return [];
  if (!Number.isFinite(startXUtcMs) || !Number.isFinite(endXUtcMs)) return [];
  if (endXUtcMs <= startXUtcMs) return [];

  let startIndex = 0;
  for (let i = 0; i < historyAsc.length; i += 1) {
    if (historyAsc[i].xUtcMs <= startXUtcMs) startIndex = i;
    else break;
  }

  let current = historyAsc[startIndex];
  const initialX = Math.max(startXUtcMs, current.xUtcMs);
  if (initialX > endXUtcMs) return [];

  const points: Array<{ x: number; y: number }> = [
    { x: initialX, y: current.avgPurchasePriceUsd },
  ];

  for (const next of historyAsc.slice(startIndex + 1)) {
    if (next.xUtcMs < startXUtcMs) continue;
    if (next.xUtcMs > endXUtcMs) break;

    points.push({ x: next.xUtcMs, y: current.avgPurchasePriceUsd });
    points.push({ x: next.xUtcMs, y: next.avgPurchasePriceUsd });
    current = next;
  }

  points.push({ x: endXUtcMs, y: current.avgPurchasePriceUsd });
  return points;
}

export default async function MicroStrategyBitcoinAveragePricePage() {
  let btcPoints: Array<{ x: number; y: number }> | null = null;
  let treasuryHistory: MstrTreasurySnapshotPoint[] | null = null;
  let treasuryLatest: MstrTreasurySnapshotPoint | null = null;
  let errorMessage: string | null = null;
  let treasuryWarning: string | null = null;

  const [btcResult, treasuryResult] = await Promise.allSettled([
    fetchBtcUsdDailyPricesSinceMstrFirstBuy(),
    fetchMicroStrategyBtcCostBasisHistory(),
  ]);

  if (btcResult.status === "fulfilled") {
    btcPoints = btcResult.value;
  } else {
    const reason = btcResult.reason;
    errorMessage = reason instanceof Error ? reason.message : "Failed to load Bitcoin price data.";
  }

  if (treasuryResult.status === "fulfilled") {
    treasuryHistory = treasuryResult.value;
    treasuryLatest =
      treasuryHistory.length > 0 ? treasuryHistory[treasuryHistory.length - 1] : null;
    if (!treasuryLatest) {
      treasuryWarning =
        "No MicroStrategy treasury snapshots were extracted from the SEC filings scanned.";
    }
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

  if (treasuryHistory && treasuryHistory.length > 0 && firstBtc && latestBtc) {
    const mstrPoints = buildStepPointsFromTreasuryHistory(
      treasuryHistory,
      firstBtc.x,
      latestBtc.x,
    );

    series.push({
      id: "mstr",
      label: "MicroStrategy avg purchase price (USD/BTC)",
      color: "#22c55e",
      dashed: true,
      points: mstrPoints,
      strokeWidth: 2.5,
    });
  }

  let premiumUsd: number | null = null;
  let premiumPct: number | null = null;
  const DAY_MS = 86_400_000;
  const treasuryStalenessDays =
    latestBtc && treasuryLatest ? Math.floor((latestBtc.x - treasuryLatest.xUtcMs) / DAY_MS) : null;

  if (latestBtc && treasuryLatest) {
    premiumUsd = latestBtc.y - treasuryLatest.avgPurchasePriceUsd;
    premiumPct = (premiumUsd / treasuryLatest.avgPurchasePriceUsd) * 100;
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
            BTC cost basis per BTC (from SEC EDGAR disclosures).
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

        {!errorMessage && latestBtc && treasuryLatest ? (
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
                {formatUsd(treasuryLatest.avgPurchasePriceUsd)}
              </div>
              <div className="mt-1 text-sm text-secondary">
                {treasuryLatest.totalHoldingsBtc.toLocaleString("en-US")} BTC held (per SEC EDGAR filing)
              </div>
              {treasuryLatest.asOfDateLabel || treasuryLatest.filingDateIso ? (
                <div className="mt-1 text-xs text-secondary/80">
                  As of{" "}
                  {treasuryLatest.asOfDateLabel
                    ? (parseAsOfDateLabelToUtcMs(treasuryLatest.asOfDateLabel)
                        ? formatDateUtc(parseAsOfDateLabelToUtcMs(treasuryLatest.asOfDateLabel)!)
                        : treasuryLatest.asOfDateLabel)
                    : (treasuryLatest.filingDateIso
                        ? formatDateUtc(toUtcMsFromIsoDate(treasuryLatest.filingDateIso))
                        : formatDateUtc(treasuryLatest.xUtcMs))}
                </div>
              ) : null}
              {treasuryStalenessDays !== null && treasuryStalenessDays > 10 ? (
                <div className="mt-1 text-xs text-secondary/70">
                  Treasury data lags the BTC price series by ~{treasuryStalenessDays} days.
                </div>
              ) : null}
              <a
                href={treasuryLatest.sourceUrl}
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
                    {line.id === "mstr" ? (
                      <span className="text-secondary/60">
                        ({treasuryHistory?.length ?? 0} snapshots)
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              {firstBtc && latestBtc ? (
                <div className="text-xs text-secondary">
                  <div>
                    Range: {formatDateUtc(firstBtc.x)} → {formatDateUtc(latestBtc.x)} (UTC)
                  </div>
                  {treasuryHistory && treasuryHistory.length > 0 ? (
                    <div className="mt-0.5 text-secondary/70">
                      MSTR snapshots: {formatDateUtc(treasuryHistory[0].xUtcMs)} →{" "}
                      {formatDateUtc(
                        treasuryHistory[treasuryHistory.length - 1].xUtcMs,
                      )}{" "}
                      (UTC)
                    </div>
                  ) : null}
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

        {!errorMessage && latestBtc && treasuryLatest ? (
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
                extracted from multiple SEC EDGAR filings (8‑K / 10‑Q / 10‑K) that disclose (1) BTC holdings and (2) an
                average purchase price per BTC. The line is rendered as a step series between disclosure dates.
              </li>
              <li>
                <span className="font-medium text-foreground">Note:</span>{" "}
                Disclosure timing can lag purchases. If there are no filings for a period, the average cost line will
                remain flat until the next disclosure.
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
