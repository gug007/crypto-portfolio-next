import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-background/75 backdrop-blur-md dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="Crypto Portfolio home"
          className="inline-flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
        >
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt=""
            className="rounded-lg"
          />
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}

