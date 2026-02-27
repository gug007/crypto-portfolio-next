import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Receipt,
  DollarSign,
  Percent,
  AlertTriangle,
  Banknote,
  ArrowLeftRight,
  ShoppingCart,
  Pickaxe,
  Coins,
  Gift,
  CreditCard,
  Timer,
  Repeat,
  Heart,
  HandHeart,
  FileSpreadsheet,
  ClipboardList,
  FilePlus,
  Briefcase,
  XCircle,
  History,
  Calculator,
  Download,
  Layers,
  ChevronDown,
  Globe,
  type LucideIcon,
} from "lucide-react";

const APP_NAME = "Crypto Portfolio";
const DOWNLOAD_URL = "https://apps.apple.com/app/id6757869052";

const title = "Crypto Tax Guide 2026: How to Report Cryptocurrency Taxes";
const description =
  "The complete 2026 guide to cryptocurrency taxes. Learn about taxable events, capital gains rates, IRS forms, cost basis methods, and how to report crypto on your tax return.";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type KeyStat = {
  icon: LucideIcon;
  iconClass: string;
  value: string;
  label: string;
  description: string;
};

const keyStats: KeyStat[] = [
  {
    icon: DollarSign,
    iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    value: "$600",
    label: "1099-DA reporting threshold",
    description:
      "Exchanges must report transactions to the IRS for users receiving $600 or more in proceeds.",
  },
  {
    icon: Percent,
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    value: "0 – 20%",
    label: "Long-term capital gains rate",
    description:
      "Crypto held for more than one year qualifies for lower long-term capital gains rates.",
  },
  {
    icon: AlertTriangle,
    iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    value: "7+",
    label: "Types of taxable events",
    description:
      "Selling, trading, spending, mining, staking, airdrops, and more can all trigger a tax obligation.",
  },
];

type TaxEvent = { icon: LucideIcon; title: string; description: string };

const taxableEvents: TaxEvent[] = [
  {
    icon: Banknote,
    title: "Selling crypto for fiat",
    description:
      "When you sell Bitcoin, Ethereum, or any crypto for USD or another fiat currency, you realize a capital gain or loss based on the difference between your sale price and cost basis.",
  },
  {
    icon: ArrowLeftRight,
    title: "Trading crypto-to-crypto",
    description:
      "Swapping one cryptocurrency for another (e.g., BTC to ETH) is a taxable disposition. You must calculate gain or loss on the crypto you gave up at the time of the trade.",
  },
  {
    icon: ShoppingCart,
    title: "Spending crypto on goods or services",
    description:
      "Using crypto to buy a coffee, a car, or anything else is treated as selling the crypto at fair market value. The difference from your cost basis is a taxable gain or loss.",
  },
  {
    icon: Pickaxe,
    title: "Mining income",
    description:
      "Mined crypto is taxed as ordinary income at fair market value when received. When you later sell or trade the mined crypto, any additional gain is subject to capital gains tax.",
  },
  {
    icon: Coins,
    title: "Staking rewards",
    description:
      "Staking rewards are generally taxed as ordinary income when you receive or gain dominion and control over them. The fair market value at receipt becomes your cost basis.",
  },
  {
    icon: Gift,
    title: "Airdrops and hard forks",
    description:
      "Tokens received from airdrops or hard forks are taxed as ordinary income at fair market value when you gain the ability to transfer, sell, or otherwise dispose of them.",
  },
];

const nonTaxableEvents: TaxEvent[] = [
  {
    icon: CreditCard,
    title: "Buying crypto with fiat",
    description:
      "Simply purchasing cryptocurrency with USD or another fiat currency is not a taxable event. Your tax obligation begins when you dispose of the crypto.",
  },
  {
    icon: Timer,
    title: "Holding (HODLing)",
    description:
      "Holding crypto in your wallet without selling, trading, or spending it does not trigger any tax. Unrealized gains are not taxed until you dispose of the asset.",
  },
  {
    icon: Repeat,
    title: "Transferring between your own wallets",
    description:
      "Moving crypto from one wallet to another that you own (e.g., exchange to hardware wallet) is not a taxable event, though you should keep records to prove ownership.",
  },
  {
    icon: Heart,
    title: "Gifting crypto (under annual exclusion)",
    description:
      "Gifting crypto up to the annual gift tax exclusion ($19,000 per recipient in 2026) is generally not a taxable event for the giver. The recipient inherits your cost basis.",
  },
  {
    icon: HandHeart,
    title: "Donating to a qualified charity",
    description:
      "Donating appreciated crypto held for more than one year to a qualified 501(c)(3) charity may allow you to deduct the full fair market value without paying capital gains tax.",
  },
];

type Bracket = { rate: string; single: string; marriedJoint: string };

const shortTermBrackets: Bracket[] = [
  { rate: "10%", single: "Up to $11,925", marriedJoint: "Up to $23,850" },
  {
    rate: "12%",
    single: "$11,926 – $48,475",
    marriedJoint: "$23,851 – $96,950",
  },
  {
    rate: "22%",
    single: "$48,476 – $103,350",
    marriedJoint: "$96,951 – $206,700",
  },
  {
    rate: "24%",
    single: "$103,351 – $197,300",
    marriedJoint: "$206,701 – $394,600",
  },
  {
    rate: "32%",
    single: "$197,301 – $250,525",
    marriedJoint: "$394,601 – $501,050",
  },
  {
    rate: "35%",
    single: "$250,526 – $626,350",
    marriedJoint: "$501,051 – $751,600",
  },
  {
    rate: "37%",
    single: "Over $626,350",
    marriedJoint: "Over $751,600",
  },
];

const longTermBrackets: Bracket[] = [
  { rate: "0%", single: "Up to $48,350", marriedJoint: "Up to $96,700" },
  {
    rate: "15%",
    single: "$48,351 – $533,400",
    marriedJoint: "$96,701 – $600,050",
  },
  {
    rate: "20%",
    single: "Over $533,400",
    marriedJoint: "Over $600,050",
  },
];

const calculationSteps = [
  {
    title: "Gather all transaction records",
    description:
      "Collect records of every buy, sell, trade, send, and receive across all wallets and exchanges. Include dates, amounts, and fair market values at the time of each transaction.",
  },
  {
    title: "Determine your cost basis",
    description:
      "Your cost basis is what you originally paid for the crypto, including any fees. For mined or staked crypto, the cost basis is the fair market value at the time you received it.",
  },
  {
    title: "Calculate gains and losses",
    description:
      "For each disposition, subtract your cost basis from the sale price. A positive result is a capital gain; a negative result is a capital loss. Track whether each is short-term or long-term.",
  },
  {
    title: "Choose your accounting method",
    description:
      "Select a cost basis method to determine which specific units of crypto you are disposing of. The method you choose can significantly affect your tax liability.",
  },
  {
    title: "Report on your tax return",
    description:
      "Report each transaction on Form 8949, summarize on Schedule D, and report any ordinary income from mining or staking on Schedule 1 or Schedule C.",
  },
];

const costBasisMethods = [
  {
    abbreviation: "FIFO",
    name: "First In, First Out",
    description:
      "Oldest units are sold first. This is the IRS default method if you do not specify one.",
  },
  {
    abbreviation: "LIFO",
    name: "Last In, First Out",
    description:
      "Newest units are sold first. Can result in lower gains during rising markets if recent purchases are at higher prices.",
  },
  {
    abbreviation: "HIFO",
    name: "Highest In, First Out",
    description:
      "Units with the highest cost basis are sold first. Generally minimizes taxable gains.",
  },
  {
    abbreviation: "Spec ID",
    name: "Specific Identification",
    description:
      "You choose exactly which units to sell. Offers the most control but requires detailed record-keeping.",
  },
];

type IrsForm = {
  icon: LucideIcon;
  form: string;
  title: string;
  description: string;
};

const irsForms: IrsForm[] = [
  {
    icon: FileSpreadsheet,
    form: "Form 8949",
    title: "Sales and Dispositions of Capital Assets",
    description:
      "Report every individual crypto sale, trade, or disposition. Each transaction requires date acquired, date sold, proceeds, cost basis, and gain or loss.",
  },
  {
    icon: ClipboardList,
    form: "Schedule D",
    title: "Capital Gains and Losses",
    description:
      "Summarizes your total short-term and long-term capital gains and losses from Form 8949. This is where your net capital gain or loss flows to your Form 1040.",
  },
  {
    icon: FilePlus,
    form: "Schedule 1",
    title: "Additional Income and Adjustments",
    description:
      "Report ordinary income from mining, staking rewards, airdrops, and other crypto income that is not a capital gain. This income is subject to regular income tax rates.",
  },
  {
    icon: Briefcase,
    form: "Schedule C",
    title: "Profit or Loss from Business",
    description:
      "If you mine or trade crypto as a business, report your income and deductible expenses here. This income is also subject to self-employment tax (15.3%).",
  },
];

const commonMistakes = [
  {
    title: "Not reporting crypto-to-crypto trades",
    description:
      "Every swap is a taxable event, even if you never converted to fiat. The IRS treats it as selling one asset and buying another.",
  },
  {
    title: "Forgetting about airdrops and hard forks",
    description:
      "Free tokens are not free from taxes. Airdrops and fork tokens are taxable income at the time you receive them.",
  },
  {
    title: "Using the wrong cost basis method",
    description:
      "Inconsistent cost basis methods can lead to inaccurate gains calculations and potential IRS scrutiny. Choose a method and apply it consistently.",
  },
  {
    title: "Not keeping adequate records",
    description:
      "The burden of proof is on you. Without transaction records, the IRS may assume a zero cost basis — meaning your entire sale proceeds are taxable.",
  },
  {
    title: "Ignoring DeFi transactions",
    description:
      "Liquidity pool deposits, yield farming, token swaps on DEXs, and wrapping or unwrapping tokens can all trigger taxable events.",
  },
  {
    title: "Missing the $3,000 capital loss deduction",
    description:
      "You can deduct up to $3,000 in net capital losses per year against ordinary income, with excess carrying forward. Do not leave this deduction on the table.",
  },
];

type CountryTax = {
  country: string;
  flag: string;
  agency: string;
  treatment: string;
  shortTerm: string;
  longTerm: string;
  keyNote: string;
};

const internationalOverviews: CountryTax[] = [
  {
    country: "United Kingdom",
    flag: "GB",
    agency: "HMRC",
    treatment: "Capital Gains Tax on disposals; income tax on mining/staking",
    shortTerm: "No separate short-term rate",
    longTerm: "10% (basic rate) or 20% (higher rate) after a tax-free allowance",
    keyNote:
      "The annual Capital Gains Tax allowance is currently very low at around \u00A33,000. Nearly all active crypto traders will exceed this threshold.",
  },
  {
    country: "Canada",
    flag: "CA",
    agency: "CRA",
    treatment: "50% of capital gains are taxable; mining/staking taxed as income",
    shortTerm: "No distinction between short and long term",
    longTerm: "50% inclusion rate taxed at your marginal income tax rate",
    keyNote:
      "Only half of your capital gain is added to your taxable income. Losses can offset gains but not employment income.",
  },
  {
    country: "Australia",
    flag: "AU",
    agency: "ATO",
    treatment: "Capital Gains Tax event on disposal; income tax on mining/staking",
    shortTerm: "Marginal income tax rate (no discount)",
    longTerm: "50% CGT discount for assets held over 12 months",
    keyNote:
      "Personal use asset exemption may apply for crypto purchases under A$10,000 used directly for goods and services.",
  },
  {
    country: "European Union",
    flag: "EU",
    agency: "Varies by member state",
    treatment: "Varies — most treat crypto as property or financial assets",
    shortTerm: "Varies by country (e.g., Germany: taxable if held < 1 year)",
    longTerm: "Some countries offer exemptions (e.g., Germany: tax-free after 1 year holding)",
    keyNote:
      "MiCA regulation is standardizing crypto rules across the EU, but tax treatment still varies by member state. Germany, France, and Portugal each have notably different approaches.",
  },
];

const appBenefits = [
  {
    icon: History,
    title: "Complete transaction history",
    description:
      "Every buy, sell, and trade recorded with timestamps, amounts, and prices in one place.",
  },
  {
    icon: Calculator,
    title: "Cost basis tracking",
    description:
      "Automatic cost basis calculation for each position across all your portfolios.",
  },
  {
    icon: Download,
    title: "CSV export for tax software",
    description:
      "Export your transaction data in formats compatible with popular crypto tax software.",
  },
  {
    icon: Layers,
    title: "Multi-portfolio support",
    description:
      "Organize holdings by exchange, wallet, or strategy — and get a unified tax picture.",
  },
];

const faqs = [
  {
    q: "Do I have to pay taxes on cryptocurrency?",
    a: "Yes. The IRS classifies cryptocurrency as property. Any time you sell, trade, spend, or otherwise dispose of crypto at a gain, you owe capital gains tax. Income from mining, staking, and airdrops is taxed as ordinary income when received.",
  },
  {
    q: "What happens if I don't report crypto on my taxes?",
    a: "Failure to report crypto transactions can result in penalties, interest, and potential criminal prosecution. The IRS receives transaction data from exchanges via Form 1099-DA and uses blockchain analytics to identify unreported activity. Penalties can range from 20% accuracy-related penalties to 75% civil fraud penalties.",
  },
  {
    q: "How does the IRS know about my crypto?",
    a: "Starting in 2025, centralized exchanges and brokers are required to file Form 1099-DA reporting your transactions directly to the IRS. The IRS also uses blockchain analytics firms, John Doe summonses to exchanges, and the digital asset question on Form 1040 to identify non-compliant taxpayers.",
  },
  {
    q: "Are crypto losses tax deductible?",
    a: "Yes. Capital losses from crypto can offset capital gains dollar-for-dollar. If your losses exceed your gains, you can deduct up to $3,000 per year against ordinary income ($1,500 if married filing separately). Remaining losses carry forward to future tax years indefinitely.",
  },
  {
    q: "Do I pay taxes on unrealized gains?",
    a: "No. You only owe taxes when you realize a gain by disposing of your crypto (selling, trading, or spending). Simply holding crypto that has increased in value — unrealized gains — is not a taxable event.",
  },
  {
    q: "Does the wash sale rule apply to crypto in 2026?",
    a: "For the 2025 tax year (filed in 2026), the wash sale rule does not yet apply to cryptocurrency, as crypto is classified as property, not a security. However, the IRS has signaled that future legislation may extend wash sale rules to digital assets. Some tax professionals recommend avoiding wash sale-like patterns to be safe.",
  },
  {
    q: "How are NFTs taxed?",
    a: "NFTs are treated as property by the IRS. Selling an NFT triggers capital gains tax. If the NFT is classified as a collectible, long-term gains may be taxed at the higher collectible rate of up to 28%. Creating and selling NFTs may be taxed as ordinary income or self-employment income.",
  },
  {
    q: "Do I need to report crypto if I didn't sell?",
    a: "You must answer the digital asset question on Form 1040 truthfully. If you only purchased and held crypto, you would answer 'Yes' to the question but would not owe any tax on unrealized gains. However, if you received crypto as income (mining, staking, airdrops), you must report that income even if you did not sell.",
  },
  {
    q: "What if I lost access to my crypto or was hacked?",
    a: "Lost or stolen crypto is a complex area. The Tax Cuts and Jobs Act of 2017 suspended the personal casualty loss deduction through 2025 (except for federally declared disasters). For 2026, consult a tax professional about whether personal casualty loss deductions are available. You may be able to claim an abandonment loss in some circumstances.",
  },
  {
    q: "Can I use crypto tax software with Crypto Portfolio?",
    a: "Yes. Crypto Portfolio lets you export your transaction history as a CSV file, which can be imported into popular crypto tax software like CoinTracker, Koinly, TaxBit, or CoinLedger to generate your tax forms automatically.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/crypto-tax-guide" },
  keywords: [
    "crypto tax",
    "cryptocurrency tax guide",
    "how to report crypto taxes",
    "crypto capital gains tax",
    "bitcoin tax",
    "crypto tax 2026",
    "crypto tax rates",
    "IRS crypto reporting",
    "crypto taxable events",
    "crypto cost basis",
    "form 8949 crypto",
    "crypto tax calculator",
    "crypto tax UK",
    "crypto tax Canada",
    "crypto tax Australia",
    "crypto tax Europe",
  ],
  openGraph: {
    title,
    description,
    url: "/crypto-tax-guide",
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function BracketTable({
  brackets,
  caption,
}: {
  brackets: Bracket[];
  caption: string;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold tracking-tight">{caption}</h3>
      <div className="mt-4 overflow-x-auto rounded-3xl border border-black/5 bg-background/60 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs font-semibold uppercase tracking-wider text-secondary dark:border-white/10">
              <th className="px-5 py-4">Tax Rate</th>
              <th className="px-5 py-4">Single Filer</th>
              <th className="px-5 py-4">Married Filing Jointly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            {brackets.map((b) => (
              <tr
                key={b.rate}
                className="transition-colors hover:bg-blue-500/5"
              >
                <td className="px-5 py-4 font-medium">{b.rate}</td>
                <td className="px-5 py-4 text-secondary">{b.single}</td>
                <td className="px-5 py-4 text-secondary">{b.marriedJoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CryptoTaxGuidePage() {
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
      "@id": "https://crypto-portfolio-tracker.app/crypto-tax-guide",
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
      {/* Background ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[10%] h-[700px] w-[700px] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-500/10" />
        <div className="absolute -right-[15%] top-[40%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[100px] dark:bg-emerald-500/8" />
        <div className="absolute -left-[10%] -bottom-[10%] h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-[100px] dark:bg-amber-500/10" />
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

        <article className="space-y-14 md:space-y-20">
          {/* ── Hero ── */}
          <header>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 backdrop-blur-md dark:text-amber-300">
              <Receipt className="h-3.5 w-3.5" />
              <span>Tax Season 2026</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              The Complete{" "}
              <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Crypto Tax Guide
              </span>{" "}
              for 2026
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
              Cryptocurrency taxes can be confusing, but they don&apos;t have to
              be. This guide covers everything from taxable events and capital
              gains rates to IRS forms and cost basis methods — so you can file
              with confidence this tax season.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 sm:w-auto"
              >
                Download the App
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#tax-rates"
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-all hover:border-blue-500/20 hover:bg-blue-500/10 dark:border-white/10 dark:bg-white/5 sm:w-auto"
              >
                Jump to Tax Rates
              </a>
            </div>
          </header>

          {/* ── Key Stats ── */}
          <section className="grid gap-4 sm:grid-cols-3">
            {keyStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${stat.iconClass}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-lg font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium">{stat.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                  {stat.description}
                </p>
              </div>
            ))}
          </section>

          {/* ── Is Crypto Taxed? ── */}
          <section id="is-crypto-taxed" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Is Cryptocurrency Taxed?
            </h2>
            <div className="mt-4 max-w-3xl space-y-4 text-secondary">
              <p className="leading-relaxed">
                Yes. The IRS treats cryptocurrency as property, not currency.
                This means that virtually every time you dispose of crypto —
                whether by selling, trading, or spending — you may owe taxes on
                any gain in value since you acquired it.
              </p>
              <p className="leading-relaxed">
                This classification has been in effect since IRS Notice 2014-21
                and was reinforced by the Infrastructure Investment and Jobs Act
                of 2021, which introduced new broker reporting requirements that
                took effect for the 2025 tax year.
              </p>
              <p className="leading-relaxed">
                Starting with 2025 tax returns (filed in 2026), centralized
                exchanges and brokers are required to issue Form 1099-DA to
                report digital asset transactions to both users and the IRS.
                This means the IRS now has direct visibility into your crypto
                activity.
              </p>
            </div>

            {/* Callout */}
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 dark:bg-amber-500/10">
              <p className="text-sm font-medium leading-relaxed">
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  Important:
                </span>{" "}
                The IRS has added a digital asset question to the front page of
                Form 1040 since 2019. Answering &quot;No&quot; when you have
                taxable crypto activity can be considered a false statement.
              </p>
            </div>
          </section>

          {/* ── Taxable Events ── */}
          <section id="taxable-events" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Taxable Events
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              These actions trigger a tax obligation. Each one requires you to
              calculate and report a gain or loss.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {taxableEvents.map((event) => (
                <div
                  key={event.title}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-amber-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-amber-500/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
                    <event.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold tracking-tight">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Non-Taxable Events ── */}
          <section id="non-taxable-events" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Non-Taxable Events
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              These actions generally do not trigger a tax obligation, though you
              should still keep records.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nonTaxableEvents.map((event) => (
                <div
                  key={event.title}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-emerald-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-500/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                    <event.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold tracking-tight">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tax Rates ── */}
          <section id="tax-rates" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              2026{" "}
              <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Crypto Tax Rates
              </span>
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              Crypto tax rates depend on how long you held the asset before
              disposing of it. Short-term gains (held one year or less) are taxed
              at your ordinary income rate. Long-term gains (held more than one
              year) receive preferential rates of 0%, 15%, or 20%.
            </p>

            <div className="mt-8 space-y-8">
              <BracketTable
                brackets={shortTermBrackets}
                caption="Short-Term Capital Gains (Ordinary Income Rates)"
              />
              <BracketTable
                brackets={longTermBrackets}
                caption="Long-Term Capital Gains"
              />
            </div>

            {/* NIIT callout */}
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 dark:bg-amber-500/10">
              <p className="text-sm font-medium leading-relaxed">
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  Note:
                </span>{" "}
                An additional 3.8% Net Investment Income Tax (NIIT) applies to
                individuals with modified adjusted gross income above $200,000
                (single) or $250,000 (married filing jointly). This can bring the
                effective top rate on long-term crypto gains to 23.8%.
              </p>
            </div>

            <p className="mt-4 text-xs text-secondary/70">
              Brackets shown are based on IRS Revenue Procedure projections for
              the 2026 tax year and may be subject to final adjustment.
            </p>
          </section>

          {/* ── How to Calculate ── */}
          <section id="how-to-calculate" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              How to Calculate Crypto Taxes
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              Follow these five steps to determine your crypto tax liability for
              the year.
            </p>

            <div className="mt-8 grid gap-4">
              {calculationSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-blue-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/20"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 font-mono text-sm font-bold text-blue-600 dark:from-blue-500/20 dark:to-emerald-500/20 dark:text-blue-400">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost basis methods */}
            <h3 className="mt-10 text-lg font-bold tracking-tight">
              Cost Basis Methods
            </h3>
            <p className="mt-2 text-sm text-secondary">
              The method you choose determines which units of crypto are
              considered &quot;sold&quot; and directly affects your gain or loss.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {costBasisMethods.map((method) => (
                <div
                  key={method.abbreviation}
                  className="rounded-2xl border border-black/5 bg-background/60 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                >
                  <p className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                    {method.abbreviation}
                  </p>
                  <p className="mt-0.5 text-sm font-medium">{method.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── IRS Forms ── */}
          <section id="irs-forms" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              IRS Forms You Need
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              Most crypto investors will need at least Form 8949 and Schedule D.
              If you have mining or staking income, you may also need Schedule 1
              or Schedule C.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {irsForms.map((form) => (
                <div
                  key={form.form}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-violet-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-violet-500/20"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20">
                    <form.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{form.form}</h3>
                  <p className="mt-0.5 text-xs font-medium text-secondary">
                    {form.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {form.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Common Mistakes ── */}
          <section id="common-mistakes" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Common Mistakes to Avoid
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              These are the most frequent errors that lead to underpayment,
              penalties, or missed deductions.
            </p>

            <div className="mt-8 grid gap-3">
              {commonMistakes.map((mistake) => (
                <div
                  key={mistake.title}
                  className="flex items-start gap-4 rounded-2xl border border-black/5 bg-background/60 p-4 backdrop-blur-md transition-all hover:border-rose-500/15 dark:border-white/10 dark:bg-white/5 dark:hover:border-rose-500/20"
                >
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <div>
                    <p className="font-semibold tracking-tight">
                      {mistake.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-secondary">
                      {mistake.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Crypto Tax Around the World ── */}
          <section id="international" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              <Globe className="mr-2 inline-block h-7 w-7 text-blue-500" />
              Crypto Tax Around the World
            </h2>
            <p className="mt-3 max-w-3xl text-secondary">
              Tax rules vary significantly by country. While the detailed
              brackets above focus on the United States, here is a high-level
              overview for other major jurisdictions.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {internationalOverviews.map((c) => (
                <div
                  key={c.country}
                  className="group rounded-3xl border border-black/5 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all hover:border-blue-500/15 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{c.flag === "GB" ? "\uD83C\uDDEC\uD83C\uDDE7" : c.flag === "CA" ? "\uD83C\uDDE8\uD83C\uDDE6" : c.flag === "AU" ? "\uD83C\uDDE6\uD83C\uDDFA" : "\uD83C\uDDEA\uD83C\uDDFA"}</span>
                    <h3 className="font-semibold tracking-tight">
                      {c.country}
                    </h3>
                    <span className="ml-auto rounded-full bg-surface/80 px-2 py-0.5 text-xs font-medium text-secondary dark:bg-white/10">
                      {c.agency}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <p className="text-secondary">
                      <span className="font-medium text-foreground">
                        Treatment:
                      </span>{" "}
                      {c.treatment}
                    </p>
                    <p className="text-secondary">
                      <span className="font-medium text-foreground">
                        Short-term:
                      </span>{" "}
                      {c.shortTerm}
                    </p>
                    <p className="text-secondary">
                      <span className="font-medium text-foreground">
                        Long-term:
                      </span>{" "}
                      {c.longTerm}
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl bg-blue-500/5 p-3 text-xs leading-relaxed text-secondary dark:bg-blue-500/10">
                    {c.keyNote}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-secondary/70">
              International tax information is provided as a general overview
              only. Rules change frequently — consult a tax professional in your
              jurisdiction for current requirements.
            </p>
          </section>

          {/* ── App CTA ── */}
          <section className="rounded-3xl border border-black/5 bg-background/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:p-10">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Simplify Tax Season with{" "}
              <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-secondary">
              Keeping track of every transaction across multiple wallets and
              exchanges is the hardest part of crypto taxes. {APP_NAME} helps you
              stay organized year-round, so tax season is not a scramble.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {appBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-3 rounded-2xl border border-black/5 bg-background/40 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:to-emerald-500/20">
                    <benefit.icon className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{benefit.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-secondary">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

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
                href="/"
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-all hover:border-blue-500/20 hover:bg-blue-500/10 dark:border-white/10 dark:bg-white/5 sm:w-auto"
              >
                Explore {APP_NAME}
              </Link>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Frequently Asked Questions
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

          {/* ── Disclaimer ── */}
          <p className="text-xs leading-relaxed text-secondary/70">
            This guide is for informational purposes only and does not constitute
            tax, legal, or financial advice. Tax laws are complex and change
            frequently. Consult a qualified tax professional for advice specific
            to your situation. {APP_NAME} is a portfolio tracking tool and does
            not provide tax preparation or filing services.
          </p>
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
