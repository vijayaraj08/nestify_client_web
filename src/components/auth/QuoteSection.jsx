import { ShieldCheck, Star, Sparkles } from 'lucide-react';

/**
 * QuoteSection
 * ────────────
 * Center-left quote section providing a welcoming, premium hospitality tone.
 */
export default function QuoteSection() {
  return (
    <div className="max-w-xl text-white select-none space-y-4">
      {/* Community highlights pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs text-indigo-100 font-medium shadow-sm">
        <Sparkles size={13} className="text-indigo-300" />
        <span>Redefining Student & Professional Co-Living</span>
      </div>

      {/* Main Quote */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white drop-shadow-md leading-[1.15]">
        &ldquo;Find a place that feels like home.&rdquo;
      </h2>

      {/* Supporting Description */}
      <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal max-w-md drop-shadow">
        Modern furnished residences with 24/7 dedicated workspaces, high-speed fiber, housekeeping, and vibrant community living.
      </p>

      {/* Trust Highlights */}
      <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} fill="currentColor" />
            ))}
          </div>
          <span className="font-semibold text-white">4.9 / 5</span>
          <span className="text-slate-400">(1,200+ Residents)</span>
        </div>
        <span className="hidden sm:inline text-white/30">•</span>
        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Verified Security & Access</span>
        </div>
      </div>
    </div>
  );
}
