import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CalendarClock,
  ChevronDown,
  Coins,
  Hash,
  Layers,
  Pickaxe,
  Sparkles,
  TrendingUp,
} from "lucide-react";
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

const myths = [
  {
    title: "\u201CThe halving cuts my BTC in half.\u201D",
    body: "False. Only new issuance to miners changes. Your wallet balance stays the same.",
  },
  {
    title: "\u201CPrice will pump because of the halving.\u201D",
    body: "Not guaranteed. Markets can price in expectations early, and many other factors matter (liquidity, macro, risk appetite).",
  },
  {
    title: "\u201CHalving equals less security.\u201D",
    body: "Not directly. Security depends on total mining incentives (subsidy + fees) and the competitive hashrate environment.",
  },
  {
    title: "\u201CHalving reduces transaction fees.\u201D",
    body: "Unrelated. Fees are driven by demand for block space, not the subsidy schedule.",
  },
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
    a: "No. Miners earn (1) the block subsidy and (2) transaction fees. The halving only affects the subsidy\u2014fees are set by users\u2019 demand for block space.",
  },
] as const;

const howItWorksSteps = [
  "Roughly every 10 minutes, the network targets a new block.",
  "Miners compete to find a valid block (proof\u2011of\u2011work).",
  "When the chain reaches a halving height (every 210,000 blocks), the subsidy in the block reward automatically halves.",
];

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
    dateModified: new Date().toISOString(),
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-amber-500/20">
      {/* Background ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[10%] h-[700px] w-[700px] rounded-full bg-amber-500/5 blur-[120px] dark:bg-amber-500/10" />
        <div className="absolute -right-[15%] top-[40%] h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[100px] dark:bg-orange-500/8" />
        <div className="absolute -left-[10%] -bottom-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[100px] dark:bg-blue-500/10" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
        {/* Back button */}
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-black/5 bg-background/60 px-4 py-2 text-sm font-medium text-secondary shadow-sm backdrop-blur-md transition-all hover:border-amber-500/20 hover:bg-amber-500/10 hover:text-foreground dark:border-white/10 dark:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <article className="space-y-14 md:space-y-20">
          {/* ── Hero ── */}
          <header className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 backdrop-blur-md dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bitcoin Essentials</span>
            </div>

            <h1 className="max-w-4xl mx-auto text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Bitcoin{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Halving
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
              The programmed event that cuts the{" "}
              <span className="font-semibold text-foreground">
                block subsidy
              </span>{" "}
              in half roughly every four years — slowing new issuance and
              redefining the economics of digital scarcity.
            </p>

            <div className="mt-12">
              <HalvingCountdown />
            </div>

            {/* Key stats */}
            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              <div className="group rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md transition-all hover:border-blue-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/20">
                <div className="flex items-center justify-center gap-3 text-sm font-medium sm:justify-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/10 dark:from-blue-500/20 dark:to-blue-500/20">
                    <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Halving interval
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight">
                  210,000{" "}
                  <span className="text-base font-normal text-secondary">
                    blocks
                  </span>
                </div>
                <p className="mt-2 text-sm text-secondary">
                  ~4 years (varies with block times)
                </p>
              </div>

              <div className="group rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md transition-all hover:border-emerald-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-500/20">
                <div className="flex items-center justify-center gap-3 text-sm font-medium sm:justify-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/10 dark:from-emerald-500/20 dark:to-emerald-500/20">
                    <Coins className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Current subsidy
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight">
                  {subsidyNow}{" "}
                  <span className="text-base font-normal text-secondary">
                    BTC
                  </span>
                </div>
                <p className="mt-2 text-sm text-secondary">
                  Since the April 2024 halving
                </p>
              </div>

              <div className="group rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md transition-all hover:border-purple-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-purple-500/20">
                <div className="flex items-center justify-center gap-3 text-sm font-medium sm:justify-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/10 dark:from-purple-500/20 dark:to-purple-500/20">
                    <CalendarClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Next halving
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight">
                  ~2028
                </div>
                <p className="mt-2 text-sm text-secondary">
                  At block {formatNumber(1_050_000)}
                </p>
              </div>
            </div>
          </header>

          {/* ── What is the Bitcoin halving? ── */}
          <section id="what-is-a-halving" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              What is the Bitcoin halving?
            </h2>
            <div className="mt-4 max-w-3xl space-y-4 text-secondary">
              <p className="leading-relaxed">
                Bitcoin issues new coins through mining. When miners add a new
                block to the blockchain, they earn a reward made up of{" "}
                <span className="font-medium text-foreground">two parts</span>:
                the{" "}
                <span className="font-medium text-foreground">
                  block subsidy
                </span>{" "}
                (newly created BTC) and transaction fees paid by users.
              </p>
              <p className="leading-relaxed">
                The{" "}
                <span className="font-medium text-foreground">halving</span> is
                the built&#8209;in rule that reduces the subsidy by 50% every
                210,000 blocks. This schedule is one of the core mechanisms
                behind Bitcoin&apos;s capped supply (~21 million BTC).
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Hash,
                  color: "amber",
                  title: "Predictable issuance",
                  text: "The subsidy is known in advance and changes only at specific block heights.",
                },
                {
                  icon: Pickaxe,
                  color: "orange",
                  title: "Miner economics",
                  text: "Revenue from new BTC per block drops\u2014fees and price matter more.",
                },
                {
                  icon: TrendingUp,
                  color: "blue",
                  title: "Supply narrative",
                  text: "New supply entering the market slows over time (not a guarantee of price outcomes).",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-amber-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-amber-500/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
                    <card.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{card.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── How it works ── */}
          <section id="how-it-works" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              How it works (simple version)
            </h2>

            <div className="mt-8 grid gap-4">
              {howItWorksSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-amber-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-amber-500/20"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 font-mono text-sm font-bold text-amber-600 dark:from-amber-500/20 dark:to-orange-500/20 dark:text-amber-400">
                      {idx + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-secondary">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 dark:bg-amber-500/10">
              <p className="text-sm font-medium leading-relaxed">
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  Current issuance:
                </span>{" "}
                {subsidyNow} BTC &times; {blocksPerDayApprox} blocks/day &asymp;{" "}
                {formatNumber(issuancePerDayApprox)} BTC/day. Actual issuance
                varies with real block times and reorganizations.
              </p>
            </div>
          </section>

          {/* ── History table ── */}
          <section id="history" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Bitcoin halving dates &amp; history
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              Halvings are defined by block height (not a calendar date).
              Here&apos;s a quick timeline of the subsidy reductions so far:
            </p>

            <div className="mt-8 overflow-x-auto rounded-3xl border border-black/5 bg-background/60 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-xs font-semibold uppercase tracking-wider text-secondary dark:border-white/10">
                    <th className="px-5 py-4">Halving</th>
                    <th className="px-5 py-4">Block Height</th>
                    <th className="px-5 py-4">Subsidy Change</th>
                    <th className="px-5 py-4">Inflation / Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {halvings.map((row, index) => {
                    const inflation = estimateAnnualInflationPercent(
                      row.blockHeight,
                      row.subsidyTo,
                    );

                    return (
                      <tr
                        key={`${row.blockHeight}-${index}`}
                        className="transition-colors hover:bg-amber-500/5"
                      >
                        <td className="px-5 py-4 font-medium">
                          {row.dateLabel}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {formatNumber(row.blockHeight)}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {row.subsidyFrom} &rarr; {row.subsidyTo} BTC
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {inflation === null
                            ? "\u2014"
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
                      <tr className="transition-colors hover:bg-amber-500/5">
                        <td className="px-5 py-4 font-medium">
                          ~2028 (expected)
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {formatNumber(nextHalvingHeight)}
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          3.125 &rarr; {nextSubsidy} BTC
                        </td>
                        <td className="px-5 py-4 text-secondary">
                          {inflation === null
                            ? "\u2014"
                            : `~${formatPercentPerYear(inflation)}`}
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-secondary/70">
              Inflation/year is estimated using Bitcoin&apos;s 10&#8209;minute
              block target (~52,560 blocks/year) and the scheduled subsidy after
              each halving. Track the block height for the exact halving moment —
              calendar dates vary by time zone.
            </p>
          </section>

          {/* ── Myths ── */}
          <section id="myths" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Common halving myths
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {myths.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-amber-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-amber-500/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Frequently Asked Questions
            </h2>
            <div className="mt-8 grid gap-2">
              {faq.map((item) => (
                <details
                  key={item.q}
                  className="group/faq rounded-2xl border border-black/5 px-5 py-4 transition-colors open:bg-amber-500/5 hover:border-amber-500/15 dark:border-white/10 dark:open:bg-amber-500/10 dark:hover:border-amber-500/20"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                    <span>{item.q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-secondary transition-transform group-open/faq:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-secondary">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-10">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Track your crypto portfolio with clarity
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-secondary">
              If you&apos;re building a long&#8209;term view of your holdings,
              use a clean tracker to stay organized across assets and
              exchanges — without the spreadsheet chaos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#download"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 sm:w-auto"
              >
                Download the App
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-all hover:border-amber-500/20 hover:bg-amber-500/10 dark:border-white/10 dark:bg-white/5 sm:w-auto"
              >
                Explore Crypto Portfolio
              </Link>
            </div>
            <p className="mt-6 text-xs text-secondary/70">
              Editorial note: educational content only, not financial advice.
            </p>
          </section>
        </article>

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
