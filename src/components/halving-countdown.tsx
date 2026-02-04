"use client";

import * as React from "react";
import { Clock } from "lucide-react";

type CountdownResponse = {
  targetHeight: number;
  currentHeight: number;
  blocksRemaining: number;
  averageBlockTimeSeconds: number;
  estimatedSecondsRemaining: number;
  estimatedHalvingTimeISO: string;
  updatedAtISO: string;
  source: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function splitDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function HalvingCountdown() {
  const [data, setData] = React.useState<CountdownResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setError(null);
        const res = await fetch("/api/bitcoin-halving", { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = (await res.json()) as CountdownResponse;
        if (!ignore) setData(json);
      } catch (e) {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "Failed to load countdown");
        }
      }
    }

    load();
    const refreshId = window.setInterval(load, 60_000);
    return () => {
      ignore = true;
      window.clearInterval(refreshId);
    };
  }, []);

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const targetMs = data ? Date.parse(data.estimatedHalvingTimeISO) : null;
  const msLeft = targetMs ? targetMs - now : null;
  const duration = msLeft !== null ? splitDuration(msLeft) : null;

  // Calculate progress for the progress bar
  // Current era: 840,000 to 1,050,000
  const startBlock = 840_000;
  const endBlock = 1_050_000;
  const progress = data 
    ? Math.min(100, Math.max(0, ((data.currentHeight - startBlock) / (endBlock - startBlock)) * 100))
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white/40 p-8 shadow-2xl shadow-indigo-500/10 ring-1 ring-white/60 backdrop-blur-2xl transition hover:bg-white/50 dark:bg-black/20 dark:shadow-none dark:ring-white/10 dark:hover:bg-white/5 md:p-10">
      {/* Dynamic background gradient mesh */}
      <div className="absolute -left-20 -top-20 -z-10 h-64 w-64 rounded-full bg-blue-400/20 blur-[80px] transition duration-1000 group-hover:bg-blue-400/30 dark:bg-blue-900/20" />
      <div className="absolute -bottom-20 -right-20 -z-10 h-64 w-64 rounded-full bg-purple-400/20 blur-[80px] transition duration-1000 group-hover:bg-purple-400/30 dark:bg-purple-900/20" />

      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
        <div className="text-center md:text-left">
          <h3 className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-secondary md:justify-start">
            <Clock className="h-4 w-4" />
            Countdown to Halving
          </h3>
          <div className="mt-2 text-sm text-secondary/80">
            Estimated based on current block time
          </div>
        </div>
        
        {data?.updatedAtISO && (
           <div className="rounded-full bg-white/50 px-3 py-1 text-xs font-medium text-secondary shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/10 dark:ring-white/10">
            Updated {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
              -Math.round((now - Date.parse(data.updatedAtISO)) / 1000),
              "second",
            )}
           </div>
        )}
      </div>

      {!data && !error ? (
        <div className="mt-10 animate-pulse space-y-4">
          <div className="mx-auto h-20 w-48 rounded-2xl bg-black/5 dark:bg-white/5" />
          <div className="mx-auto h-8 w-64 rounded-xl bg-black/5 dark:bg-white/5" />
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-2xl bg-red-50 p-6 text-center text-red-600 dark:bg-red-900/10 dark:text-red-400">
          <p className="font-medium">Unable to load halving data</p>
          <p className="mt-1 text-sm opacity-80">{error}</p>
        </div>
      ) : null}

      {data && duration ? (
        <div className="mt-10">
          {/* Main Counter */}
          <div className="grid gap-4 md:grid-cols-[2fr_3fr] md:items-end">
             <div className="flex flex-col items-center md:items-start">
                <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-8xl font-bold leading-none tracking-tighter text-transparent sm:text-9xl">
                  {duration.days}
                </span>
                <span className="mt-2 text-lg font-medium text-secondary">Isolate Days Remaining</span>
             </div>
             
             <div className="grid w-full grid-cols-3 gap-2 sm:gap-4">
                {[
                  { label: "Hours", value: duration.hours },
                  { label: "Minutes", value: duration.minutes },
                  { label: "Seconds", value: duration.seconds },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center justify-center rounded-2xl bg-white/40 p-3 ring-1 ring-white/50 backdrop-blur-md dark:bg-white/5 dark:ring-white/5">
                    <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary/70">
                      {item.label}
                    </span>
                  </div>
                ))}
             </div>
          </div>

          {/* Progress Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between text-xs font-medium text-secondary">
              <span>Block {formatNumber(startBlock)}</span>
              <span className="text-foreground">
                {progress.toFixed(2)}% Complete
              </span>
              <span>Block {formatNumber(endBlock)}</span>
            </div>
            
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-black/5 p-[1px] dark:bg-white/10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-sm transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-4 flex flex-wrap justify-between gap-4 text-sm font-medium">
               <div className="flex items-center gap-2 rounded-xl bg-black/5 px-3 py-1.5 text-secondary dark:bg-white/5">
                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                 Current: {formatNumber(data.currentHeight)}
               </div>
               <div className="flex items-center gap-2 rounded-xl bg-black/5 px-3 py-1.5 text-secondary dark:bg-white/5">
                 <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                 Remaining: {formatNumber(data.blocksRemaining)} blocks
               </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

