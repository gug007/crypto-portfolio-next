export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          <span className="text-xl font-semibold">Crypto Portfolio</span>
        </div>
        <a
          href="#download"
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/20"
        >
          Download
        </a>
      </nav>

      {/* Hero Section */}
      <main className="px-6 md:px-12">
        <section className="mx-auto flex max-w-6xl flex-col items-center py-20 text-center md:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live prices updated every second
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl md:leading-tight">
            Track your crypto portfolio{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              effortlessly
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-zinc-400 md:text-xl">
            Real-time prices, beautiful charts, and smart alerts. All your
            crypto assets in one simple app.
          </p>

          {/* App Store Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row" id="download">
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl bg-white px-6 py-3 text-black transition hover:bg-zinc-200"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-zinc-600">Download on the</div>
                <div className="text-base font-semibold">App Store</div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl bg-white px-6 py-3 text-black transition hover:bg-zinc-200"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.56.69.56 1.19s-.22.92-.56 1.19l-2.11 1.24-2.5-2.5 2.5-2.5 2.11 1.38zm-3.35-4.31l-2.27 2.27-8.49-8.49 10.76 6.22z" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-zinc-600">Get it on</div>
                <div className="text-base font-semibold">Google Play</div>
              </div>
            </a>
          </div>

          {/* Phone Mockup */}
          <div className="relative mt-16 w-full max-w-sm">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-2xl" />
            <div className="relative rounded-[2.5rem] border border-white/10 bg-zinc-900 p-2">
              <div className="rounded-[2rem] bg-zinc-950 p-6">
                {/* Mock App Screen */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Portfolio</span>
                  <span className="text-sm text-emerald-500">+12.4%</span>
                </div>
                <div className="mb-8 text-3xl font-bold">$24,831.52</div>

                {/* Mock Coin List */}
                <div className="space-y-4">
                  {[
                    { name: "Bitcoin", symbol: "BTC", price: "$43,250", change: "+2.4%", color: "bg-orange-500" },
                    { name: "Ethereum", symbol: "ETH", price: "$2,280", change: "+5.1%", color: "bg-blue-500" },
                    { name: "Solana", symbol: "SOL", price: "$98.42", change: "+8.7%", color: "bg-purple-500" },
                  ].map((coin) => (
                    <div
                      key={coin.symbol}
                      className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full ${coin.color}`} />
                        <div>
                          <div className="text-sm font-medium">{coin.name}</div>
                          <div className="text-xs text-zinc-500">{coin.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{coin.price}</div>
                        <div className="text-xs text-emerald-500">{coin.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-6xl py-20">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
            Everything you need
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: "Real-time Tracking",
                description: "Live prices from all major exchanges updated every second.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                title: "Smart Alerts",
                description: "Get notified when prices hit your targets or move significantly.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Secure & Private",
                description: "Your data stays on your device. No account required.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 inline-flex rounded-xl bg-violet-500/10 p-3 text-violet-400">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <span>Crypto Portfolio</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <a href="#" className="transition hover:text-white">Contact</a>
          </div>
          <div>© 2026 Crypto Portfolio</div>
        </div>
      </footer>
    </div>
  );
}
