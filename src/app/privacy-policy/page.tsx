import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="absolute top-0 right-0 p-6 z-10">
        <ThemeToggle />
      </header>
      <main className="container mx-auto px-6 py-20 md:py-32 max-w-4xl">
        <Link 
          href="/" 
          className="text-muted-foreground hover:text-foreground transition-colors mb-8 inline-flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: January 19, 2026</p>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="leading-relaxed text-secondary-foreground/80">
              Welcome to Crypto Portfolio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-secondary-foreground/80 leading-relaxed">
              <p>
                We collect information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application, or otherwise when you contact us.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the application, such as your native actions that are integral to the application, including liking, re-blogging, or replying to a post.</li>
                <li><strong>Financial Data:</strong> We do not store your financial data or private keys. All portfolio data is stored locally on your device or encrypted in the cloud if you choose to sync.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed text-secondary-foreground/80">
              We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-secondary-foreground/80">
              <li>To facilitate account creation and logon process.</li>
              <li>To send you marketing and promotional communications.</li>
              <li>To send administrative information to you.</li>
              <li>To protect our Services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
            <p className="leading-relaxed text-secondary-foreground/80">
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, and Legal Obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Security of Your Information</h2>
            <p className="leading-relaxed text-secondary-foreground/80">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p className="leading-relaxed text-secondary-foreground/80">
              If you have questions or comments about this policy, you may email us at support@crypto-portfolio-tracker.app
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
