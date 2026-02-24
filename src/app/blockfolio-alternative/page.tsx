import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  Layers,
  Lock,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

const APP_NAME = "Crypto Portfolio";
const DOWNLOAD_URL = "https://apps.apple.com/app/id6757869052";

const title = "Best Blockfolio Alternative | Crypto Portfolio Tracker";
const description =
  "Need a Blockfolio replacement? Track crypto with privacy, reliable multi-portfolio views, P&L, alerts, and flexible imports.";

const reasonsPeopleMovedOn = [
  {
    icon: ShieldCheck,
    title: "Independence concerns",
    text: "Many users wanted an independent tracker after the FTX-era transition.",
  },
  {
    icon: Eye,
    title: "Tracker-first focus",
    text: "Some preferred a dedicated portfolio tracker over an exchange-first flow.",
  },
  {
    icon: Lock,
    title: "Privacy priority",
    text: "Privacy and account control became a bigger priority for daily users.",
  },
  {
    icon: Zap,
    title: "Reliability in volatility",
    text: "Reliable access during volatile markets mattered more for daily check-ins.",
  },
  {
    icon: Layers,
    title: "Multi-portfolio workflows",
    text: "Users wanted easier multi-portfolio management and manual transaction entry.",
  },
];

const benefits = [
  "Independent tracker: built for portfolio visibility, not custody.",
  "Privacy-focused defaults with practical account controls.",
  "Reliable day-to-day performance for routine portfolio monitoring.",
  "Clear balances, cost basis, and P&L tracking.",
  "Multiple portfolios for strategies, accounts, and goals.",
  "Manual transactions to fill gaps and keep records accurate.",
  "Price alerts for key assets and price levels.",
  "Clean UX that stays fast and easy to scan.",
  "CSV import and manual entry for flexible data migration.",
];

const comparisonRows = [
  {
    feature: "Portfolio view",
    blockfolio: "Dashboard with holdings and market data",
    ours: "Clean dashboard with holdings, allocation, and total value",
    highlight: false,
  },
  {
    feature: "Privacy",
    blockfolio: "Tied to exchange ecosystem after acquisition",
    ours: "Privacy-focused tracking with practical controls",
    highlight: true,
  },
  {
    feature: "Reliability",
    blockfolio: "Service disruptions during high-volatility periods",
    ours: "Built for consistent, reliable portfolio visibility",
    highlight: true,
  },
  {
    feature: "Multi-portfolio",
    blockfolio: "Single portfolio view",
    ours: "Create and manage multiple portfolios in one app",
    highlight: true,
  },
  {
    feature: "P&L tracking",
    blockfolio: "Basic gain/loss display",
    ours: "Clear performance views with cost basis and P&L",
    highlight: false,
  },
  {
    feature: "Alerts",
    blockfolio: "Push notifications with promotional content",
    ours: "Focused price alerts with custom thresholds",
    highlight: false,
  },
  {
    feature: "Independence",
    blockfolio: "Owned by exchange (FTX era)",
    ours: "Fully independent, no exchange affiliation",
    highlight: true,
  },
];

const migrationSteps = [
  {
    title: "Download the app",
    text: "Get Crypto Portfolio from the App Store and create your account.",
  },
  {
    title: "Set up portfolios",
    text: "Create one portfolio or split by strategy — long-term, trading, DeFi, etc.",
  },
  {
    title: "Import your data",
    text: "Use CSV import or add transactions manually to recreate your history.",
  },
  {
    title: "Verify your totals",
    text: "Check balances, cost basis, and P&L to make sure everything is accurate.",
  },
  {
    title: "Set up alerts",
    text: "Turn on price alerts for the assets you actively monitor.",
  },
];

const faqs = [
  {
    q: "Is Blockfolio still available?",
    a: "The original Blockfolio experience changed significantly after the FTX acquisition and subsequent events. Many users have since moved to independent portfolio tracking alternatives.",
  },
  {
    q: "What is the best Blockfolio alternative?",
    a: "It depends on what you need. If you want an independent, privacy-focused tracker with multi-portfolio support and clean UX, Crypto Portfolio is a strong option worth trying.",
  },
  {
    q: "Can I import my transactions?",
    a: "Yes. You can import transactions via CSV files and add or edit transactions manually for complete flexibility.",
  },
  {
    q: "Can I track wallets and exchanges in the same app?",
    a: "Yes. You can combine different types of holdings across multiple portfolios, using manual transactions to capture everything in one place.",
  },
  {
    q: "Is Crypto Portfolio a crypto exchange?",
    a: "No. Crypto Portfolio is a portfolio tracking app, not a custodial exchange. Your data stays with you.",
  },
  {
    q: "Does it support multiple portfolios?",
    a: "Yes. You can create multiple portfolios to separate accounts, strategies, or risk levels — all visible from one app.",
  },
  {
    q: "Does it include price alerts?",
    a: "Yes. The app includes price alerts so you can monitor important levels without constantly checking the app.",
  },
  {
    q: "Is my data private?",
    a: "Privacy is a core design principle. The app is built with privacy-focused defaults and gives you practical control over your data.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blockfolio-alternative" },
  keywords: [
    "best blockfolio alternative",
    "blockfolio replacement",
    "blockfolio alternative",
    "app like blockfolio",
    "crypto portfolio tracker",
    "independent crypto tracker",
    "crypto tracker with alerts",
    "crypto P&L tracker",
    "multi portfolio crypto tracker",
    "import crypto transactions",
    "track crypto wallets and exchanges",
  ],
  openGraph: {
    title,
    description,
    url: "/blockfolio-alternative",
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

export default function BlockfolioAlternativePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
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
      "@id": "https://crypto-portfolio-tracker.app/blockfolio-alternative",
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
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-blue-500/20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[10%] h-[700px] w-[700px] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-500/10" />
        <div className="absolute -right-[15%] top-[40%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[100px] dark:bg-emerald-500/8" />
        <div className="absolute -left-[10%] -bottom-[10%] h-[600px] w-[600px] rounded-full bg-violet-500/5 blur-[100px] dark:bg-violet-500/10" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-black/5 bg-background/60 px-4 py-2 text-sm font-medium text-secondary shadow-sm backdrop-blur-md transition-all hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-foreground dark:border-white/10 dark:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <article className="space-y-14 md:space-y-20">
          {/* Hero */}
          <header>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 backdrop-blur-md dark:text-blue-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Independent portfolio tracker</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              The Best{" "}
              <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Blockfolio Alternative
              </span>{" "}
              for Crypto Tracking
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
              {APP_NAME} helps former Blockfolio users track crypto with
              privacy, reliability, and a clean multi-portfolio experience —
              without exchange affiliation.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 sm:w-auto"
              >
                Start Tracking Free
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/best-hardware-wallets"
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-all hover:border-blue-500/20 hover:bg-blue-500/10 dark:border-white/10 dark:bg-white/5 sm:w-auto"
              >
                Explore Guides
              </Link>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-secondary/70">
              Blockfolio and FTX are trademarks of their respective owners.{" "}
              {APP_NAME} is independent and not affiliated with, endorsed by, or
              sponsored by Blockfolio or FTX.
            </p>
          </header>

          {/* Why people moved on */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Why people moved on from Blockfolio
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              Since the FTX-era transition, many users have sought independent
              options that keep the focus on portfolio tracking itself.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reasonsPeopleMovedOn.map((reason) => (
                <div
                  key={reason.title}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-blue-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:to-emerald-500/20">
                    <reason.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold tracking-tight">
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {reason.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Why {APP_NAME} is a{" "}
              <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                great alternative
              </span>
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-2xl border border-black/5 bg-background/60 p-4 backdrop-blur-md transition-all hover:border-emerald-500/15 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-500/20"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm leading-relaxed text-secondary">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Blockfolio vs {APP_NAME}
            </h2>
            <p className="mt-3 text-sm text-secondary">
              How the experience compares for everyday portfolio tracking.
            </p>

            <div className="mt-8 overflow-x-auto rounded-3xl border border-black/5 bg-background/60 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-xs font-semibold uppercase tracking-wider text-secondary dark:border-white/10">
                    <th className="px-5 py-4">Feature</th>
                    <th className="px-5 py-4">Blockfolio (legacy)</th>
                    <th className="px-5 py-4">{APP_NAME}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.feature}
                      className="transition-colors hover:bg-blue-500/5"
                    >
                      <td className="px-5 py-4 font-medium">{row.feature}</td>
                      <td className="px-5 py-4 text-secondary">
                        {row.blockfolio}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            row.highlight
                              ? "font-medium text-emerald-600 dark:text-emerald-400"
                              : "text-secondary"
                          }
                        >
                          {row.ours}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Migration steps */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              How to switch in 5 minutes
            </h2>
            <p className="mt-3 text-sm text-secondary">
              Getting started is straightforward — no account linking required.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {migrationSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-blue-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/20"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 font-mono text-sm font-bold text-blue-600 dark:from-blue-500/20 dark:to-emerald-500/20 dark:text-blue-400">
                    {idx + 1}
                  </span>
                  <h3 className="mt-3 font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Key metrics */}
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                label: "Real-time prices",
                value: "Live data from major exchanges",
              },
              {
                icon: Layers,
                label: "Multi-portfolio",
                value: "Unlimited portfolios in one app",
              },
              {
                icon: Lock,
                label: "Privacy-first",
                value: "No exchange affiliation or data selling",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5"
              >
                <stat.icon className="h-6 w-6 text-blue-500" />
                <p className="mt-3 text-lg font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-secondary">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Frequently asked questions
            </h2>
            <div className="mt-8 grid gap-2">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group/faq rounded-2xl border border-black/5 px-5 py-4 transition-colors open:bg-blue-500/5 hover:border-blue-500/15 dark:border-white/10 dark:open:bg-blue-500/10 dark:hover:border-blue-500/20"
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

          {/* CTA */}
          <section className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-10">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ready to switch from Blockfolio?
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-secondary">
              Download {APP_NAME} for independent crypto tracking with clean UX,
              reliable portfolio monitoring, and practical privacy controls.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 sm:w-auto"
              >
                Download {APP_NAME}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/bitcoin-halving"
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-all hover:border-blue-500/20 hover:bg-blue-500/10 dark:border-white/10 dark:bg-white/5 sm:w-auto"
              >
                Read Bitcoin Halving Guide
              </Link>
            </div>
          </section>
        </article>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </div>
  );
}
