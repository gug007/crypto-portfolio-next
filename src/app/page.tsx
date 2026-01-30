import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { TypewriterText } from "@/components/typewriter-text";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="absolute top-0 right-0 p-6 z-10">
        <ThemeToggle />
      </header>
      {/* Hero Section */}
      <main>
        <section className="px-6 py-20 md:py-32">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="inline-block bg-gradient-to-br from-[#0071e3] to-[#009e95] bg-clip-text text-5xl font-semibold leading-tight tracking-tight text-transparent md:text-7xl md:leading-tight dark:from-[#2997ff] dark:to-[#64d2ff]">
              <TypewriterText
                words={["Free", "Smart", "Simple", "Best", "Fast", "Secure"]}
                className="inline-block bg-gradient-to-br from-[#0071e3] to-[#009e95] bg-clip-text text-transparent dark:from-[#2997ff] dark:to-[#64d2ff]"
              />
              <br />
              Crypto Portfolio <br />
              Tracker App
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-secondary md:text-2xl">
              A modern, multi-portfolio cryptocurrency tracker.
              <br className="hidden md:block" />
              Manage investments through manual tracking or automated exchange
              connections
            </p>

            {/* App Store Buttons */}
            <div
              className="mt-12 flex flex-col gap-4 sm:flex-row"
              id="download"
            >
              <a
                href="https://apps.apple.com/app/id6757869052"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-black px-5 py-3 text-white shadow-lg shadow-black/20 ring-1 ring-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 hover:ring-white/20 dark:bg-white dark:text-black dark:shadow-white/5 dark:ring-black/10"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <svg
                  className="relative h-9 w-9"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="relative text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wide opacity-80">
                    Download on the
                  </div>
                  <div className="-mt-0.5 text-xl font-semibold tracking-tight">
                    App Store
                  </div>
                </div>
              </a>
              <div className="relative flex cursor-not-allowed items-center gap-3 overflow-hidden rounded-xl bg-black/5 px-5 py-3 text-black/70 ring-1 ring-black/5 dark:bg-white/10 dark:text-white/70 dark:ring-white/10">
                <svg
                  className="h-9 w-9"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.56.69.56 1.19s-.22.92-.56 1.19l-2.11 1.24-2.5-2.5 2.5-2.5 2.11 1.38zm-3.35-4.31l-2.27 2.27-8.49-8.49 10.76 6.22z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wide">
                    Coming soon to
                  </div>
                  <div className="-mt-0.5 text-xl font-semibold tracking-tight">
                    Google Play
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phone Mockup Section */}
        <section className="relative overflow-hidden py-32 lg:py-40">
          <div className="absolute inset-0 bg-surface/50 transition-colors duration-300" />
          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="flex flex-col items-center gap-24 lg:flex-row lg:items-center lg:justify-between">
              {/* Phones */}
              <div className="relative flex flex-shrink-0 justify-center lg:justify-start">
                <div className="relative z-10 -mr-12 md:-mr-20 translate-y-12 rotate-[-5deg] transform transition-transform duration-500 hover:rotate-0 hover:z-30">
                  <div className="relative w-[240px] md:w-[280px]">
                    <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-[#1d1d1f] p-2 shadow-2xl ring-1 ring-white/10 dark:bg-[#2d2d2f]">
                      <div className="relative aspect-[1170/2532] overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-black">
                        <Image
                          src="/iPhone-light.png"
                          alt="App Screenshot"
                          width={1170}
                          height={2532}
                          className="h-full w-full object-cover dark:hidden"
                          priority
                        />
                        <Image
                          src="/iPhone-dark.png"
                          alt="App Screenshot"
                          width={1170}
                          height={2532}
                          className="hidden h-full w-full object-cover dark:block"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-20 rotate-[5deg] transform transition-transform duration-500 hover:rotate-0 hover:z-30">
                  <div className="relative w-[240px] md:w-[280px]">
                    <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-[#1d1d1f] p-2 shadow-2xl ring-1 ring-white/10 dark:bg-[#2d2d2f]">
                      <div className="relative aspect-[1170/2532] overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-black">
                        <Image
                          src="/add-new-page-white.png"
                          alt="Add New Page Screenshot"
                          width={1170}
                          height={2532}
                          className="h-full w-full object-cover dark:hidden"
                          priority
                        />
                        <Image
                          src="/add-new-page-dark.png"
                          alt="Add New Page Screenshot"
                          width={1170}
                          height={2532}
                          className="hidden h-full w-full object-cover dark:block"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-12 lg:max-w-xl lg:pl-16">
                <div className="space-y-4 text-center lg:text-left">
                  <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                    Designed for simplicity
                    <br />
                    <span className="text-secondary">
                      Built for performance
                    </span>
                  </h2>
                  <p className="text-lg leading-relaxed text-secondary md:text-xl">
                    Experience a portfolio tracker that gets out of your way.
                    Clean, fast, and secure by design
                  </p>
                </div>

                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                  {[
                    {
                      icon: (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      ),
                      title: "Super Fast Launch",
                      description:
                        "Opens in under a second. No splash screens, no waiting",
                    },
                    {
                      icon: (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      ),
                      title: "Real-time Tracking",
                      description: "Live prices from major exchanges worldwide",
                    },
                    {
                      icon: (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      ),
                      title: "AI Assistant",
                      description:
                        "Ask questions about your portfolio and get instant answers",
                    },
                    {
                      icon: (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      ),
                      title: "Beautiful Charts",
                      description:
                        "Visualize your performance with interactive graphs",
                    },
                    {
                      icon: (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      ),
                      title: "Private & Secure",
                      description:
                        "Securely connect your exchanges or track manually. Your keys are encrypted and safe",
                    },
                  ].map((feature) => (
                    <div key={feature.title} className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          {feature.icon}
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-secondary pl-11">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-surface transition-colors duration-300 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium text-foreground">
                Crypto Portfolio
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-secondary">
              <Link
                href="/privacy-policy"
                className="transition hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <a href="#" className="transition hover:text-foreground">
                Terms of Service
              </a>
              <a
                href="mailto:support@crypto-portfolio-tracker.app"
                className="transition hover:text-foreground"
              >
                support@crypto-portfolio-tracker.app
              </a>
            </div>
            <div className="text-sm text-secondary">
              © 2026 Crypto Portfolio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
