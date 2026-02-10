import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-24">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-foreground md:mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <article className="space-y-14">
          <header className="border border-black/10 bg-background dark:border-white/15">
            <div className="grid gap-8 p-7 md:grid-cols-[1.4fr_0.8fr] md:p-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-secondary">
                  Hardware Wallet Guide
                </p>
                <h1 className="mt-5 max-w-4xl text-4xl leading-tight tracking-tight md:text-6xl md:leading-[1.05] [font-family:ui-serif,Georgia,Cambria,'Times_New_Roman',Times,serif]">
                  Best Hardware Wallets for Crypto
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-secondary md:text-lg">
                  If you are searching for the best cold wallet, start with a
                  hardware wallet shortlist that balances security, backups, and
                  everyday usability. This page ranks strong options for 2026.
                </p>
              </div>

              <div className="border-t border-black/10 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0 dark:border-white/15">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-secondary">
                  Selection Rules
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-secondary">
                  <li>1. Key isolation and signing model</li>
                  <li>2. Recovery and backup quality</li>
                  <li>3. Device and app reliability</li>
                  <li>4. Practical fit for real workflows</li>
                </ul>
              </div>
            </div>
          </header>

          <section id="top-list">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Top hardware wallet list
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Updated for 2026 model releases, including the latest Trezor and
              Ledger devices.
            </p>
            <ol className="mt-6 divide-y divide-black/10 border-y border-black/10 dark:divide-white/15 dark:border-white/15">
              {picks.map((wallet) => (
                <li
                  key={wallet.name}
                  className="grid gap-5 py-6 md:grid-cols-[80px_190px_1fr]"
                >
                  <div className="text-4xl leading-none text-secondary [font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation_Mono','Courier_New',monospace]">
                    {String(wallet.rank).padStart(2, "0")}
                  </div>
                  <figure className="aspect-[4/5] w-full overflow-hidden border border-black/10 bg-surface/50 dark:border-white/15">
                    <Image
                      src={wallet.image}
                      alt={wallet.imageAlt}
                      width={1200}
                      height={720}
                      className="h-full w-full bg-surface/50 object-contain p-1"
                    />
                  </figure>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{wallet.name}</h3>
                    <p className="mt-2 text-sm text-secondary">{wallet.summary}</p>
                    <div className="mt-3 grid gap-2 text-sm text-secondary md:grid-cols-2">
                      <p>
                        Best for: <span className="text-foreground">{wallet.bestFor}</span>
                      </p>
                      <p>
                        Price tier: <span className="text-foreground">{wallet.priceTier}</span>
                      </p>
                      <p>
                        Security: <span className="text-foreground">{wallet.security}</span>
                      </p>
                      <p>
                        Connectivity:{" "}
                        <span className="text-foreground">{wallet.connectivity}</span>
                      </p>
                      <p className="md:col-span-2">
                        Backup: <span className="text-foreground">{wallet.backup}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Quick comparison
            </h2>
            <div className="mt-4 overflow-x-auto border border-black/10 dark:border-white/15">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-black/10 dark:border-white/15">
                  <tr className="[font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation_Mono','Courier_New',monospace] text-[11px] uppercase tracking-[0.1em] text-secondary">
                    <th className="px-4 py-3 font-medium">Wallet</th>
                    <th className="px-4 py-3 font-medium">Best for</th>
                    <th className="px-4 py-3 font-medium">Connectivity</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/15">
                  {picks.map((wallet) => (
                    <tr key={wallet.name}>
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-3">
                          <Image
                            src={wallet.image}
                            alt={wallet.imageAlt}
                            width={96}
                            height={58}
                            className="h-12 w-12 border border-black/10 bg-surface/50 object-contain p-0.5 dark:border-white/15"
                          />
                          <span>{wallet.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-secondary">{wallet.bestFor}</td>
                      <td className="px-4 py-3 text-secondary">{wallet.connectivity}</td>
                      <td className="px-4 py-3 text-secondary">{wallet.priceTier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-8 border border-black/10 p-6 md:grid-cols-2 md:p-8 dark:border-white/15">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">How to choose</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-secondary">
                <li>1. Buy from official stores only.</li>
                <li>2. Set up offline, then verify backup words by hand.</li>
                <li>3. Use a passphrase if your threat model needs it.</li>
                <li>4. Test recovery before storing meaningful value.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
              <div className="mt-4 grid gap-3">
                {faq.map((item) => (
                  <details
                    key={item.q}
                    className="border border-black/10 px-4 py-3 dark:border-white/15"
                  >
                    <summary className="cursor-pointer list-none text-sm font-medium">
                      {item.q}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-black/10 p-6 md:p-8 dark:border-white/15">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Secure storage first, tracking second
            </h2>
            <p className="mt-3 max-w-2xl text-secondary leading-relaxed">
              Once long-term holdings are moved to hardware storage, track
              performance without exposing private keys in hot-wallet workflows.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#download"
                className="inline-flex w-full items-center justify-center border border-foreground px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto"
              >
                Download the app
              </Link>
              <Link
                href="/bitcoin-halving"
                className="inline-flex w-full items-center justify-center border border-black/15 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground dark:border-white/20 sm:w-auto"
              >
                Read Bitcoin halving guide
              </Link>
            </div>
            <p className="mt-4 text-xs text-secondary">
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
