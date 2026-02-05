
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-surface text-secondary py-12 text-[12px] leading-relaxed transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Upper Section: Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 mb-8 border-b border-black/5 pb-8 dark:border-white/5">
           <div className="col-span-2 lg:col-span-2">
             <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
                {/* Small Logo */}
                <div className="relative h-5 w-5 overflow-hidden rounded-md bg-accent">
                  <Image src="/logo.png" alt="Crypto Portfolio" width={20} height={20} className="object-cover" />
                </div>
                <span className="font-semibold text-foreground text-sm group-hover:text-accent-hover transition-colors">Crypto Portfolio</span>
             </Link>
             <p className="max-w-xs mb-4">
               A modern, multi-portfolio cryptocurrency tracker. Secure, fast, and simple.
             </p>
           </div>
           
           <div>
             <h3 className="font-semibold text-foreground mb-3">Explore</h3>
             <ul className="space-y-2">
               <li>
                 <Link href="/bitcoin-halving" className="hover:underline hover:text-foreground transition-colors">
                   Bitcoin Halving
                 </Link>
               </li>
               <li>
                 <Link href="/bitcoin-below-previous-ath" className="hover:underline hover:text-foreground transition-colors">
                   Bitcoin Below Prior ATH
                 </Link>
               </li>
               <li>
                 <a href="#download" className="hover:underline hover:text-foreground transition-colors">
                   Download App
                 </a>
               </li>
             </ul>
           </div>

           <div>
             <h3 className="font-semibold text-foreground mb-3">Support</h3>
             <ul className="space-y-2">
               <li>
                 <a href="mailto:support@crypto-portfolio-tracker.app" className="hover:underline hover:text-foreground transition-colors">
                   Contact Support
                 </a>
               </li>
             </ul>
           </div>

           <div>
             <h3 className="font-semibold text-foreground mb-3">Legal</h3>
             <ul className="space-y-2">
               <li>
                 <Link href="/privacy-policy" className="hover:underline hover:text-foreground transition-colors">
                   Privacy Policy
                 </Link>
               </li>
               <li>
                 <a href="#" className="hover:underline hover:text-foreground transition-colors">
                    Terms of Service
                 </a>
               </li>
             </ul>
           </div>
        </div>

        {/* Lower Section: Copyright & Bottom Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-secondary dark:text-secondary/80">
             Copyright © {new Date().getFullYear()} Crypto Portfolio. All rights reserved.
           </div>
           
           <div className="flex gap-4 md:gap-6">
              <Link href="/privacy-policy" className="hover:underline hover:text-foreground transition-colors">Privacy Policy</Link>
              <span className="hidden md:inline text-black/10 dark:text-white/10">|</span>
              <a href="#" className="hover:underline hover:text-foreground transition-colors">Terms of Use</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
