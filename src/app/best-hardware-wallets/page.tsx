import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, ChevronDown } from "lucide-react";

const title = "Best Hardware Wallets for Crypto in 2026";
const description =
  "A modern, practical comparison of the best hardware wallets (cold wallets) for crypto. Review security design, connectivity, backups, and which wallet fits your workflow.";

type Wallet = {
  rank: number;
  name: string;
  bestFor: string;
  security: string;
  connectivity: string;
  backup: string;
  priceTier: "$" | "$$" | "$$$";
  summary: string;
  image: string;
  imageAlt: string;
};

const picks: Wallet[] = [
  {
    rank: 1,
    name: "Trezor Safe 7",
    bestFor: "Most people",
    security: "Auditable secure element design with post-quantum update path",
    connectivity: "USB-C, Bluetooth",
    backup: "Seed phrase with optional passphrase",
    priceTier: "$$$",
    summary:
      "Latest Trezor flagship with modern hardware security and a premium on-device experience.",
    image: "/wallets/trezor-safe-7.png",
    imageAlt: "Trezor Safe 7 hardware wallet",
  },
  {
    rank: 2,
    name: "Ledger Nano Gen5",
    bestFor: "Mobile-first users",
    security: "Secure element + Ledger OS with clear-signing workflow",
    connectivity: "USB-C, Bluetooth, NFC",
    backup: "Seed phrase with optional passphrase",
    priceTier: "$$$",
    summary:
      "Latest Ledger Nano model for users who want touch navigation in a compact format.",
    image: "/wallets/ledger-nano-gen5.png",
    imageAlt: "Ledger Nano Gen5 hardware wallet",
  },
  {
    rank: 3,
    name: "Ledger Flex",
    bestFor: "Users who want a larger touchscreen signer",
    security: "Secure element + Ledger OS with clear-signing support",
    connectivity: "USB-C, Bluetooth, NFC",
    backup: "Seed phrase plus optional Ledger recovery options",
    priceTier: "$$$",
    summary:
      "Modern Ledger touchscreen with easy review/sign flow and strong mobile usability.",
    image: "/wallets/ledger-flex.png",
    imageAlt: "Ledger Flex hardware wallet",
  },
  {
    rank: 4,
    name: "Trezor Safe 5",
    bestFor: "Security-focused long-term holders",
    security: "Open-source wallet stack with advanced on-device confirmations",
    connectivity: "USB-C",
    backup: "Seed phrase with optional passphrase",
    priceTier: "$$$",
    summary:
      "Strong Trezor option if you want a premium touchscreen and mature backup flow.",
    image: "/wallets/trezor-safe-5.png",
    imageAlt: "Trezor Safe 5 hardware wallet",
  },
  {
    rank: 5,
    name: "Ledger Stax",
    bestFor: "Premium touchscreen experience",
    security: "Secure element + Ledger OS with clear-signing support",
    connectivity: "USB-C, Bluetooth, NFC",
    backup: "Seed phrase plus optional Ledger recovery options",
    priceTier: "$$$",
    summary:
      "Flagship Ledger device with larger display for easier address and transaction review.",
    image: "/wallets/ledger-stax.png",
    imageAlt: "Ledger Stax hardware wallet",
  },
];

const faq = [
  {
    q: "What are the latest Trezor and Ledger models in this list?",
    a: "This page is now limited to Trezor and Ledger picks only, including Trezor Safe 7 and Trezor Safe 5, plus Ledger Nano Gen5, Ledger Flex, and Ledger Stax.",
  },
  {
    q: "Is a hardware wallet the same as a cold wallet?",
    a: "A hardware wallet is a type of cold wallet. Cold wallet means keys stay offline. Hardware wallets are the most practical cold-storage option for most users.",
  },
  {
    q: "Can I recover funds if the device breaks?",
    a: "Yes, if you still have your recovery phrase and optional passphrase. Your device can fail; your backup process is what protects the funds.",
  },
  {
    q: "What matters most when choosing a hardware wallet?",
    a: "Security model, backup workflow, and whether the signing flow matches how you actually use crypto. Fancy features matter less than reliable recovery.",
  },
  {
    q: "Should beginners start with a hardware wallet?",
    a: "If you hold meaningful value for the long term, yes. Start with a device known for clear onboarding and test recovery with a small amount first.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/best-hardware-wallets" },
  keywords: [
    "best hardware wallet",
    "best hardware wallets",
    "best cold wallet",
    "best cold wallets for crypto",
    "bitcoin hardware wallet",
    "secure crypto wallet",
    "offline crypto storage",
  ],
  openGraph: {
    title,
    description,
    url: "/best-hardware-wallets",
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

export default function BestHardwareWalletsPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://crypto-portfolio-tracker.app/best-hardware-wallets",
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

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best Hardware Wallets for Crypto",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: picks.length,
    itemListElement: picks.map((wallet) => ({
      "@type": "ListItem",
      position: wallet.rank,
      name: wallet.name,
      description: wallet.summary,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-blue-500/20">
      {/* Background ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[10%] h-[700px] w-[700px] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-500/10" />
        <div className="absolute -right-[15%] top-[30%] h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[100px] dark:bg-violet-500/8" />
        <div className="absolute -left-[10%] -bottom-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[100px] dark:bg-cyan-500/10" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-24">
        {/* Back button */}
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-black/5 bg-background/60 px-4 py-2 text-sm font-medium text-secondary shadow-sm backdrop-blur-md transition-all hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-foreground dark:border-white/10 dark:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <article className="space-y-12 md:space-y-16">
          {/* Hero header */}
          <header className="mb-2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 backdrop-blur-md dark:text-blue-300">
              <Shield className="h-3.5 w-3.5" />
              <span>Hardware Wallet Guide &middot; 2026</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Best{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Hardware Wallets
              </span>{" "}
              for Crypto
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
              If you are searching for the best cold wallet, start with a
              hardware wallet shortlist that balances security, backups, and
              everyday usability. This page ranks strong options for 2026.
            </p>

            {/* Selection criteria pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "Key isolation & signing",
                "Recovery & backup quality",
                "Device reliability",
                "Practical workflow fit",
              ].map((rule) => (
                <span
                  key={rule}
                  className="rounded-full border border-black/5 bg-surface/80 px-3 py-1.5 text-xs font-medium text-secondary backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  {rule}
                </span>
              ))}
            </div>
          </header>

          {/* Wallet cards */}
          <section id="top-list">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Top picks
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Updated for 2026 model releases, including the latest Trezor and
              Ledger devices.
            </p>

            <ol className="mt-8 grid gap-5">
              {picks.map((wallet) => (
                <li
                  key={wallet.name}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-blue-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/20 md:p-6"
                >
                  <div className="grid gap-5 md:grid-cols-[64px_180px_1fr]">
                    {/* Rank */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 font-mono text-lg font-bold text-blue-600 dark:from-blue-500/20 dark:to-violet-500/20 dark:text-blue-400">
                      #{wallet.rank}
                    </div>

                    {/* Image */}
                    <figure className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/5 bg-surface/50 dark:border-white/10">
                      <Image
                        src={wallet.image}
                        alt={wallet.imageAlt}
                        width={1200}
                        height={720}
                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </figure>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-xl font-bold tracking-tight">
                        {wallet.name}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                        {wallet.summary}
                      </p>

                      {/* Spec pills */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                          {wallet.bestFor}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-surface/80 px-2.5 py-1 text-xs font-medium text-secondary dark:bg-white/10">
                          {wallet.connectivity}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-surface/80 px-2.5 py-1 text-xs font-medium text-secondary dark:bg-white/10">
                          {wallet.priceTier}
                        </span>
                      </div>

                      {/* Details grid */}
                      <div className="mt-4 grid gap-x-6 gap-y-2 text-sm md:grid-cols-2">
                        <p className="text-secondary">
                          <span className="font-medium text-foreground">Security:</span>{" "}
                          {wallet.security}
                        </p>
                        <p className="text-secondary">
                          <span className="font-medium text-foreground">Backup:</span>{" "}
                          {wallet.backup}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Comparison table */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Quick comparison
            </h2>
            <div className="mt-6 overflow-x-auto rounded-3xl border border-black/5 bg-background/60 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-xs font-semibold uppercase tracking-wider text-secondary dark:border-white/10">
                    <th className="px-5 py-4">Wallet</th>
                    <th className="px-5 py-4">Best for</th>
                    <th className="px-5 py-4">Connectivity</th>
                    <th className="px-5 py-4">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {picks.map((wallet) => (
                    <tr
                      key={wallet.name}
                      className="transition-colors hover:bg-blue-500/5"
                    >
                      <td className="px-5 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <Image
                            src={wallet.image}
                            alt={wallet.imageAlt}
                            width={96}
                            height={58}
                            className="h-10 w-10 rounded-xl border border-black/5 bg-surface/50 object-contain p-0.5 dark:border-white/10"
                          />
                          <span>{wallet.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-secondary">
                        {wallet.bestFor}
                      </td>
                      <td className="px-5 py-4 text-secondary">
                        {wallet.connectivity}
                      </td>
                      <td className="px-5 py-4 text-secondary">
                        {wallet.priceTier}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to choose + FAQ */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* How to choose card */}
            <div className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-8">
              <h2 className="text-xl font-bold tracking-tight">
                How to choose
              </h2>
              <ul className="mt-5 space-y-4">
                {[
                  "Buy from official stores only.",
                  "Set up offline, then verify backup words by hand.",
                  "Use a passphrase if your threat model needs it.",
                  "Test recovery before storing meaningful value.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-secondary">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10 text-xs font-bold text-blue-600 dark:from-blue-500/20 dark:to-violet-500/20 dark:text-blue-400">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ card */}
            <div className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-8">
              <h2 className="text-xl font-bold tracking-tight">FAQ</h2>
              <div className="mt-5 grid gap-2">
                {faq.map((item) => (
                  <details
                    key={item.q}
                    className="group/faq rounded-2xl border border-black/5 px-4 py-3 transition-colors open:bg-blue-500/5 hover:border-blue-500/15 dark:border-white/10 dark:open:bg-blue-500/10 dark:hover:border-blue-500/20"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium">
                      <span>{item.q}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-secondary transition-transform group-open/faq:rotate-180" />
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA section */}
          <section className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-10">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Secure storage first, tracking second
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-secondary">
              Once long-term holdings are moved to hardware storage, track
              performance without exposing private keys in hot-wallet workflows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#download"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 sm:w-auto"
              >
                Download the app
              </Link>
              <Link
                href="/bitcoin-halving"
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-all hover:border-blue-500/20 hover:bg-blue-500/10 dark:border-white/10 dark:bg-white/5 sm:w-auto"
              >
                Read Bitcoin halving guide
              </Link>
            </div>
            <p className="mt-6 text-xs text-secondary">
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </main>
    </div>
  );
}
