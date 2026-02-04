import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://crypto-portfolio-tracker.app"),
  title: "Crypto Portfolio - Track Your Crypto Assets",
  description:
    "A modern, multi-portfolio cryptocurrency tracker. This app allows users to seamlessly manage their crypto investments through manual tracking or automated exchange connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-itunes-app" content="app-id=6757869052"></meta>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6NY7QNNQLQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6NY7QNNQLQ');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `if (window.location.hostname === 'crypto-portfolio.org') { window.location.hostname = 'crypto-portfolio-tracker.app'; }`,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
