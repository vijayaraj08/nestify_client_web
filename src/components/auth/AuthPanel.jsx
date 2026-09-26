import { useState } from 'react';
import AuthToggle from './AuthToggle';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { Building2, ShieldCheck } from 'lucide-react';

/**
 * AuthPanel
 * ─────────
 * Liquid Glassmorphic authentication card with dynamic Sign In / Sign Up switching.
 */
export default function AuthPanel({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  return (
    <div className="w-full max-w-[480px] bg-white/[0.78] backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-8 lg:p-9 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.8),inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.05)] border border-white/70 relative text-slate-900 mx-auto lg:mx-0 overflow-hidden">
      {/* ── Top Liquid Specular Light Highlight ── */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

      {/* ── Top Header Badges ── */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        {/* Hostello Portal Badge */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-700 shadow-sm">
            <Building2 size={12} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
            Hostello Portal
          </span>
        </div>

        {/* Encrypted & Verified Badge */}
        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 rounded-full shadow-sm">
          <ShieldCheck size={12} className="text-emerald-700" />
          <span>Encrypted & Verified</span>
        </div>
      </div>

      {/* Dynamic Title & Subtitle */}
      <div className="relative z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight transition-all duration-300 font-sans">
          {authMode === 'signin' ? 'Welcome to Hostello' : 'Join Hostello'}
        </h1>
        <p className="text-xs text-slate-600 mt-1 transition-all duration-300 font-medium">
          {authMode === 'signin'
            ? 'Your hostel, managed beautifully. Please sign in to your account.'
            : 'Create your account to start managing your stay effortlessly.'
          }
        </p>
      </div>

      {/* ── Liquid Mode Toggle ── */}
      <div className="relative z-10">
        <AuthToggle mode={authMode} onToggle={setAuthMode} />
      </div>

      {/* ── Form Animated Container (300ms transition) ── */}
      <div className="relative overflow-hidden transition-all duration-300 z-10">
        {authMode === 'signin' ? (
          <div className="transform transition-all duration-300 ease-out animate-fade-in">
            <SignInForm
              onLoginSuccess={onLoginSuccess}
              onSwitchToSignUp={() => setAuthMode('signup')}
            />
          </div>
        ) : (
          <div className="transform transition-all duration-300 ease-out animate-fade-in">
            <SignUpForm
              onLoginSuccess={onLoginSuccess}
              onSwitchToSignIn={() => setAuthMode('signin')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
