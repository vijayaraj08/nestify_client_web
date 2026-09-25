import { useState } from 'react';
import AuthToggle from './AuthToggle';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { Building2, ShieldCheck } from 'lucide-react';

export default function AuthPanel({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  return (
    <div className="h-full w-full bg-white/95 backdrop-blur-sm p-6 sm:p-8 lg:p-9 rounded-2xl lg:rounded-3xl flex flex-col justify-between shadow-xl border border-[#EAE2D8] relative min-h-[440px] lg:min-h-[490px]">
      {/* ── Top Header Section ── */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Hostello Portal Badge */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#FAF3EC] border border-[#E8DFC8] flex items-center justify-center text-[#8B6238]">
              <Building2 size={12} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6238]">
              Hostello Portal
            </span>
          </div>

          {/* Encrypted & Verified Badge */}
          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Encrypted & Verified</span>
          </div>
        </div>

        {/* Dynamic Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E140F] tracking-tight transition-all duration-300">
          {authMode === 'signin' ? 'Welcome to Hostello' : 'Join Hostello'}
        </h1>
        <p className="text-xs text-stone-500 mt-1 transition-all duration-300">
          {authMode === 'signin'
            ? 'Your hostel, managed beautifully. Please sign in to your account.'
            : 'Create your account to start managing your stay effortlessly.'
          }
        </p>
      </div>

      {/* ── Center: Toggle + Animated Form Container ── */}
      <div className="my-2">
        <AuthToggle mode={authMode} onToggle={setAuthMode} />

        <div className="relative overflow-hidden transition-all duration-300">
          {authMode === 'signin' ? (
            <div className="transform transition-all duration-300 ease-out">
              <SignInForm
                onLoginSuccess={onLoginSuccess}
                onSwitchToSignUp={() => setAuthMode('signup')}
              />
            </div>
          ) : (
            <div className="transform transition-all duration-300 ease-out">
              <SignUpForm
                onLoginSuccess={onLoginSuccess}
                onSwitchToSignIn={() => setAuthMode('signin')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
