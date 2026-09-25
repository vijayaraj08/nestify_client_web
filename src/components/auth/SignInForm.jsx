import { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, KeyRound } from 'lucide-react';
import { loginUser, DEMO_ACCOUNTS } from '../../services/authService';

export default function SignInForm({ onLoginSuccess, onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  const validate = useCallback(() => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Username or Email is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const result = await loginUser({ email: email.trim(), password });
      onLoginSuccess?.(result);
    } catch (err) {
      setApiError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
    setApiError('');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5 animate-fade-in">
      {/* API Error Alert */}
      {apiError && (
        <div
          role="alert"
          className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700 flex items-center gap-2 animate-fade-in"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Username / Email Field */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
          Username / Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Mail size={15} />
          </div>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              if (apiError) setApiError('');
            }}
            placeholder="e.g. resident@nestify.com"
            disabled={loading}
            className={`
              w-full rounded-xl border bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900
              placeholder:text-stone-400 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#8B6238]/20 focus:border-[#8B6238]
              ${errors.email ? 'border-red-400' : 'border-[#E2D5C8] hover:border-[#D0BFB0]'}
            `}
          />
        </div>
        {errors.email && (
          <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-semibold text-stone-600">
            Password
          </label>
          <a
            href="#forgot"
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset link sent to your registered email or administrator.');
            }}
            className="text-[10px] font-medium text-stone-500 hover:text-[#8B6238] cursor-pointer"
          >
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Lock size={15} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              if (apiError) setApiError('');
            }}
            placeholder="Enter your password"
            disabled={loading}
            className={`
              w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-xs sm:text-sm text-stone-900
              placeholder:text-stone-400 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#8B6238]/20 focus:border-[#8B6238]
              ${errors.password ? 'border-red-400' : 'border-[#E2D5C8] hover:border-[#D0BFB0]'}
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[10px] text-red-500 mt-0.5">{errors.password}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-[#D9C8B7] text-[#5C3E26] focus:ring-[#8B6238]/20 accent-[#5C3E26] cursor-pointer"
          />
          <span className="text-[11px] text-stone-600 font-normal">
            Remember me on this device
          </span>
        </label>
      </div>

      {/* Sign In Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-md bg-[#5C3E26] hover:bg-[#4D331E] active:scale-[0.99] transition-all duration-200 cursor-pointer border border-[#48301D] flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <LogIn size={15} />
            <span>Sign In</span>
          </>
        )}
      </button>

      {/* Quick Demo Access Bar */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDemoSelector(!showDemoSelector)}
          className="w-full flex items-center justify-center gap-1.5 text-[10px] text-stone-500 hover:text-[#5C3E26] cursor-pointer"
        >
          <KeyRound size={11} />
          <span>{showDemoSelector ? 'Hide Demo Logins' : 'Quick Demo Logins (Admin / Resident)'}</span>
        </button>

        {showDemoSelector && (
          <div className="grid grid-cols-2 gap-1.5 mt-2 p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DCCF] animate-fade-in">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoSelect(acc)}
                className="text-left p-1.5 rounded-lg bg-white hover:bg-[#F4EBE0] border border-[#E5D5C5] text-[10px] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 block truncate">
                    {acc.label}
                  </span>
                  <span className="text-[8px] px-1 rounded bg-[#FAF3EC] text-[#8B6238] font-semibold">
                    {acc.role}
                  </span>
                </div>
                <span className="text-stone-400 text-[9px] block font-mono mt-0.5 truncate">
                  {acc.email}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
