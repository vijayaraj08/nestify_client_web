import { Sparkles } from 'lucide-react';

/**
 * BrandOverlay
 * ────────────
 * Top-left branding display.
 */
export default function BrandOverlay() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-indigo-300 shadow-lg">
        <Sparkles size={20} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-serif leading-none">
            Hostello
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 backdrop-blur-sm">
            Luxury Co-Living
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-300/80 font-medium block mt-1 sm:hidden">
          LUXURY CO-LIVING
        </span>
      </div>
    </div>
  );
}
