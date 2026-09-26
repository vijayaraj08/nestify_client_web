import { Sparkles, UserPlus } from 'lucide-react';

/**
 * AuthToggle
 * ──────────
 * Liquid Glass segmented toggle between Sign In and Sign Up modes.
 */
export default function AuthToggle({ mode, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/[0.04] backdrop-blur-md rounded-2xl border border-white/60 my-4 select-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
      <button
        type="button"
        onClick={() => onToggle('signin')}
        className={`
          flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
          ${mode === 'signin'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }
        `}
      >
        <Sparkles size={14} className={mode === 'signin' ? 'text-indigo-200' : 'text-slate-400'} />
        <span>Sign In</span>
      </button>

      <button
        type="button"
        onClick={() => onToggle('signup')}
        className={`
          flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
          ${mode === 'signup'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }
        `}
      >
        <UserPlus size={14} className={mode === 'signup' ? 'text-indigo-200' : 'text-slate-400'} />
        <span>Sign Up</span>
      </button>
    </div>
  );
}
