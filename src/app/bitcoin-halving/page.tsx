import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  Coins,
  Hash,
  Layers,
  Pickaxe,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { HalvingCountdown } from "@/components/halving-countdown";

const title = "Bitcoin Halving: What It Is, Dates, History, and Why It Matters";
const description =
  "A complete guide to the Bitcoin halving: how it works, the halving schedule, past halving dates, miner rewards, issuance, and common myths—explained simply.";

const HALVING_INTERVAL_BLOCKS = 210_000;
const INITIAL_SUBSIDY_BTC = 50;
const BLOCKS_PER_YEAR_APPROX = 52_560;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/bitcoin-halving" },
  keywords: [
    "bitcoin halving",
    "btc halving",
    "bitcoin halving dates",
    "bitcoin issuance",
    "block subsidy",
    "mining reward",
    "bitcoin supply",
    "bitcoin inflation",
    "proof of work",
  ],
  openGraph: {
    title,
    description,
    url: "/bitcoin-halving",
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

type HalvingRow = {
  dateLabel: string;
  blockHeight: number;
  subsidyFrom: number;
  subsidyTo: number;
};

const halvings: HalvingRow[] = [
  { dateLabel: "Nov 28, 2012", blockHeight: 210_000, subsidyFrom: 50, subsidyTo: 25 },
  { dateLabel: "Jul 9, 2016", blockHeight: 420_000, subsidyFrom: 25, subsidyTo: 12.5 },
  { dateLabel: "May 11, 2020", blockHeight: 630_000, subsidyFrom: 12.5, subsidyTo: 6.25 },
  { dateLabel: "Apr 2024", blockHeight: 840_000, subsidyFrom: 6.25, subsidyTo: 3.125 },
];

const faq = [
  {
    q: "What is the Bitcoin halving?",
    a: "The Bitcoin halving is a programmed event that cuts the block subsidy (new BTC created per block) in half about every 210,000 blocks (~4 years).",
  },
  {
    q: "Does a halving reduce the number of bitcoins I already own?",
    a: "No. A halving only changes the rate of new BTC issuance to miners. Your existing BTC balance does not change.",
  },
  {
    q: "When is the next Bitcoin halving?",
    a: "The next halving is expected around 2028 at block height 1,050,000. The exact date depends on how quickly blocks are produced.",
  },
  {
    q: "Why do halvings matter?",
    a: "They reduce new supply entering the market, change miner economics, and can influence sentiment and liquidity. Past market cycles often discuss halvings, but outcomes are never guaranteed.",
  },
  {
    q: "Is the halving the same as transaction fees?",
    a: "No. Miners earn (1) the block subsidy and (2) transaction fees. The halving only affects the subsidy—fees are set by users’ demand for block space.",
  },
] as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercentPerYear(value: number) {
  const decimals = value >= 10 ? 1 : 2;
  return `${value.toFixed(decimals)}%/yr`;
}

function estimateSupplyBeforeHeight(height: number) {
  const completedEras = Math.floor(height / HALVING_INTERVAL_BLOCKS);
  let supply = 0;
  let subsidy = INITIAL_SUBSIDY_BTC;

  for (let era = 0; era < completedEras; era += 1) {
    supply += HALVING_INTERVAL_BLOCKS * subsidy;
    subsidy /= 2;
  }

  return supply;
}

function estimateAnnualInflationPercent(height: number, newSubsidyBtc: number) {
  const supply = estimateSupplyBeforeHeight(height);
  if (supply <= 0) return null;

  const issuancePerYear = newSubsidyBtc * BLOCKS_PER_YEAR_APPROX;
  return (issuancePerYear / supply) * 100;
}

export default function BitcoinHalvingPage() {
  const blocksPerDayApprox = 144;
  const subsidyNow = 3.125;
  const issuancePerDayApprox = subsidyNow * blocksPerDayApprox;

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
      "@id": "https://crypto-portfolio-tracker.app/bitcoin-halving",
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

        <section className="relative isolate overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20 dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),transparent)]" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 md:mr-0 lg:mr-0 xl:mr-16 xl:origin-center dark:bg-transparent dark:shadow-none dark:ring-white/5" />
          
          <div className="relative py-8 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-background/50 px-4 py-1.5 text-xs font-medium text-secondary backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-white/5 ring-1 ring-inset ring-black/5 dark:ring-white/5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent font-bold">Bitcoin Essentials</span>
              <span className="text-secondary/60">•</span>
              <span>A complete guide</span>
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Bitcoin <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Halving</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-7 md:leading-8 text-secondary">
              The programmed event that cuts the{" "}
              <span className="text-foreground font-semibold">block subsidy</span> in half
              roughly every four years—slowing new issuance and redefining the
              economics of digital scarcity.
            </p>

            <div className="mt-12">
              <HalvingCountdown />
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-3">
              <div className="group relative rounded-3xl border border-black/5 bg-background/40 p-6 backdrop-blur-xl transition hover:bg-background/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex items-center justify-center sm:justify-start gap-3 text-sm font-medium text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  Halving interval
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                  210,000 <span className="text-base font-normal text-secondary">blocks</span>
                </div>
                <p className="mt-2 text-sm text-secondary">
                  ~4 years (varies with block times)
                </p>
              </div>

              <div className="group relative rounded-3xl border border-black/5 bg-background/40 p-6 backdrop-blur-xl transition hover:bg-background/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex items-center justify-center sm:justify-start gap-3 text-sm font-medium text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Coins className="h-4 w-4" />
                  </div>
                  Current subsidy
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                  {subsidyNow} <span className="text-base font-normal text-secondary">BTC</span>
                </div>
                <p className="mt-2 text-sm text-secondary">
                  Since the April 2024 halving
                </p>
              </div>

              <div className="group relative rounded-3xl border border-black/5 bg-background/40 p-6 backdrop-blur-xl transition hover:bg-background/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex items-center justify-center sm:justify-start gap-3 text-sm font-medium text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  Next halving
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                  ~2028
                </div>
                <p className="mt-2 text-sm text-secondary">
                  At block {formatNumber(1_050_000)}
                </p>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-secondary/80">
              Not financial advice. Information is for education only; dates are approximate as block production speed varies over time.
            </p>
          </div>
        </section>

        <section className="mt-14 flex flex-col gap-10">
          <div className="space-y-4">
            <h2
              id="what-is-a-halving"
              className="scroll-mt-24 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              What is the Bitcoin halving?
            </h2>
            <p className="text-secondary leading-relaxed">
              Bitcoin issues new coins through mining. When miners add a new
              block to the blockchain, they earn a reward made up of{" "}
              <span className="text-foreground/90">two parts</span>: the{" "}
              <span className="text-foreground/90">block subsidy</span>{" "}
              (newly created BTC) and transaction fees paid by users.
            </p>
            <p className="text-secondary leading-relaxed">
              The{" "}
              <span className="text-foreground/90">halving</span> is the
              built‑in rule that reduces the subsidy by 50% every 210,000 blocks.
              This schedule is one of the core mechanisms behind Bitcoin’s
              capped supply (~21 million BTC).
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-surface/60 p-6 dark:border-white/10 dark:bg-surface/40">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Hash className="h-4 w-4 text-accent" />
                Predictable issuance
              </div>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                The subsidy is known in advance and changes only at specific
                block heights.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-surface/60 p-6 dark:border-white/10 dark:bg-surface/40">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Pickaxe className="h-4 w-4 text-accent" />
                Miner economics
              </div>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                Revenue from new BTC per block drops—fees and price matter more.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-surface/60 p-6 dark:border-white/10 dark:bg-surface/40">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="h-4 w-4 text-accent" />
                Supply narrative
              </div>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                New supply entering the market slows over time (not a guarantee
                of price outcomes).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2
              id="how-it-works"
              className="scroll-mt-24 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              How it works (simple version)
            </h2>
            <ol className="grid gap-3 text-secondary leading-relaxed">
              <li className="rounded-2xl border border-black/5 bg-background/50 p-5 dark:border-white/10 dark:bg-background/20">
                <span className="font-medium text-foreground">1)</span>{" "}
                Roughly every 10 minutes, the network targets a new block.
              </li>
              <li className="rounded-2xl border border-black/5 bg-background/50 p-5 dark:border-white/10 dark:bg-background/20">
                <span className="font-medium text-foreground">2)</span>{" "}
                Miners compete to find a valid block (proof‑of‑work).
              </li>
              <li className="rounded-2xl border border-black/5 bg-background/50 p-5 dark:border-white/10 dark:bg-background/20">
                <span className="font-medium text-foreground">3)</span>{" "}
                When the chain reaches a halving height (every 210,000 blocks),
                the subsidy in the block reward automatically halves.
              </li>
            </ol>
            <div className="rounded-2xl border border-black/5 bg-surface/60 p-6 dark:border-white/10 dark:bg-surface/40">
              <p className="text-sm leading-relaxed text-secondary">
                Approximate issuance today:{" "}
                <span className="font-medium text-foreground">
                  {subsidyNow} BTC × {blocksPerDayApprox} blocks/day ≈{" "}
                  {formatNumber(issuancePerDayApprox)} BTC/day
                </span>
                . Actual issuance varies with real block times and reorganizations.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2
              id="history"
              className="scroll-mt-24 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Bitcoin halving dates & history
            </h2>
            <p className="text-secondary leading-relaxed">
              Halvings are defined by block height (not a calendar date). Here’s
              a quick timeline of the subsidy reductions so far:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-black/5 bg-background/50 dark:border-white/10 dark:bg-background/20">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-black/5 bg-surface/60 text-secondary dark:border-white/10 dark:bg-surface/40">
                  <tr>
                    <th className="px-5 py-3 font-medium">Halving</th>
                    <th className="px-5 py-3 font-medium">Block height</th>
                    <th className="px-5 py-3 font-medium">Subsidy change</th>
                    <th className="px-5 py-3 font-medium">Inflation / year</th>
                  </tr>
                </thead>
                <tbody>
                  {halvings.map((row, index) => {
                    const inflation = estimateAnnualInflationPercent(
                      row.blockHeight,
                      row.subsidyTo,
                    );

                    return (
                      <tr
                        key={`${row.blockHeight}-${index}`}
                        className="border-b border-black/5 last:border-0 dark:border-white/10"
                      >
                        <td className="px-5 py-4 font-medium text-foreground">
                          {row.dateLabel}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {formatNumber(row.blockHeight)}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {row.subsidyFrom} → {row.subsidyTo} BTC
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {inflation === null
                            ? "—"
                            : `~${formatPercentPerYear(inflation)}`}
                        </td>
                      </tr>
                    );
                  })}
                  {(() => {
                    const nextHalvingHeight = 1_050_000;
                    const nextSubsidy = 1.5625;
                    const inflation = estimateAnnualInflationPercent(
                      nextHalvingHeight,
                      nextSubsidy,
                    );

                    return (
                      <tr className="dark:border-white/10">
                        <td className="px-5 py-4 font-medium text-foreground">
                          ~2028 (expected)
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {formatNumber(nextHalvingHeight)}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          3.125 → {nextSubsidy} BTC
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {inflation === null
                            ? "—"
                            : `~${formatPercentPerYear(inflation)}`}
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>

            <p className="text-xs leading-relaxed text-secondary">
              Inflation/year is estimated using Bitcoin’s 10‑minute block target
              (~52,560 blocks/year) and the scheduled subsidy after each halving.
            </p>

            <p className="text-xs leading-relaxed text-secondary">
              Tip: if you want the exact moment of a halving, track the block
              height. Different time zones can make the calendar date look
              different even though the halving happens once globally.
            </p>
          </div>

          <div className="space-y-4">
            <h2
              id="myths"
              className="scroll-mt-24 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Common halving myths
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "“The halving cuts my BTC in half.”",
                  body: "False. Only new issuance to miners changes. Your wallet balance stays the same.",
                },
                {
                  title: "“Price will pump because of the halving.”",
                  body: "Not guaranteed. Markets can price in expectations early, and many other factors matter (liquidity, macro, risk appetite).",
                },
                {
                  title: "“Halving equals less security.”",
                  body: "Not directly. Security depends on total mining incentives (subsidy + fees) and the competitive hashrate environment.",
                },
                {
                  title: "“Halving reduces transaction fees.”",
                  body: "Unrelated. Fees are driven by demand for block space, not the subsidy schedule.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/5 bg-surface/60 p-6 dark:border-white/10 dark:bg-surface/40"
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2
              id="faq"
              className="scroll-mt-24 text-2xl font-semibold tracking-tight md:text-3xl"
            >
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
              If you’re building a long‑term view of your holdings, use a clean
              tracker to stay organized across assets and exchanges—without the
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
