import { Sparkles, UserPlus } from 'lucide-react';

export default function AuthToggle({ mode, onToggle }) {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <button
        type="button"
        onClick={() => onToggle('signin')}
        className={`
          flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
          ${mode === 'signin'
            ? 'bg-[#5C3E26] text-white shadow-md border border-[#48301D]'
            : 'bg-[#F7EFE6] text-[#7A5B40] hover:bg-[#EFE3D5] border border-[#E8DC CE]'
          }
        `}
      >
        <Sparkles size={13} className={mode === 'signin' ? 'text-[#E5CBA8]' : 'text-[#8B6238]'} />
        <span>Sign In</span>
      </button>

      <button
        type="button"
        onClick={() => onToggle('signup')}
        className={`
          flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
          ${mode === 'signup'
            ? 'bg-[#5C3E26] text-white shadow-md border border-[#48301D]'
            : 'bg-[#F7EFE6] text-[#7A5B40] hover:bg-[#EFE3D5] border border-[#E8DCCE]'
          }
        `}
      >
        <UserPlus size={13} className={mode === 'signup' ? 'text-[#E5CBA8]' : 'text-[#8B6238]'} />
        <span>Sign Up</span>
      </button>
    </div>
  );
}
