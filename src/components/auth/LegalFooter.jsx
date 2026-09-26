/**
 * LegalFooter
 * ───────────
 * Bottom legal and copyright links with frosted glass badge styling.
 */
export default function LegalFooter() {
  return (
    <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 py-2 select-none">
      {/* Copyright info */}
      <div className="text-[11px] sm:text-xs text-slate-300/80 font-medium tracking-wide drop-shadow">
        <span>&copy; {new Date().getFullYear()} Hostello. All rights reserved.</span>
      </div>

      {/* Floating frosted pill for legal links */}
      <nav 
        aria-label="Legal navigation"
        className="flex items-center gap-3 sm:gap-4 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-sm text-[11px] sm:text-xs"
      >
        <a
          href="#terms"
          onClick={(e) => {
            e.preventDefault();
            alert('Hostello Terms & Conditions');
          }}
          className="!text-slate-200 hover:!text-white transition-colors duration-150 font-medium cursor-pointer"
        >
          Terms &amp; Conditions
        </a>
        <span className="text-white/30 text-[10px]">•</span>
        <a
          href="#privacy"
          onClick={(e) => {
            e.preventDefault();
            alert('Hostello Privacy Policy');
          }}
          className="!text-slate-200 hover:!text-white transition-colors duration-150 font-medium cursor-pointer"
        >
          Privacy Policy
        </a>
        <span className="text-white/30 text-[10px]">•</span>
        <a
          href="#cookies"
          onClick={(e) => {
            e.preventDefault();
            alert('Hostello Cookie Policy');
          }}
          className="!text-slate-200 hover:!text-white transition-colors duration-150 font-medium cursor-pointer"
        >
          Cookie Policy
        </a>
      </nav>
    </footer>
  );
}
