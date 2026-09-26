import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { getDefaultRouteForRole } from '../../auth/role.utils';
import DemoCredentials from './DemoCredentials';

export default function SignInForm({ onLoginSuccess, onSwitchToSignUp }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

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
      const loggedInUser = await login({ email: email.trim(), password });
      if (onLoginSuccess) {
        onLoginSuccess({ user: loggedInUser });
      } else {
        const dest = getDefaultRouteForRole(loggedInUser.role);
        navigate(dest, { replace: true });
      }
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
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {/* API Error Alert */}
      {apiError && (
        <div
          role="alert"
          className="p-2.5 rounded-xl border border-red-200/80 bg-red-50/90 backdrop-blur-md text-xs text-red-700 flex items-center gap-2 animate-fade-in shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Username / Email Field */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Username / Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
            placeholder="e.g. admin@hostello.com"
            disabled={loading}
            className={`
              w-full rounded-xl border bg-white/70 backdrop-blur-md pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900
              placeholder:text-slate-400 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white
              shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]
              ${errors.email ? 'border-red-400 focus:ring-red-400/20' : 'border-white/80 hover:border-slate-300'}
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
          <label className="block text-[11px] font-semibold text-slate-700">
            Password
          </label>
          <a
            href="#forgot"
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset instructions sent to registered email.');
            }}
            className="text-[10px] font-medium text-slate-500 hover:text-indigo-600 cursor-pointer"
          >
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
              w-full rounded-xl border bg-white/70 backdrop-blur-md pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900
              placeholder:text-slate-400 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white
              shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]
              ${errors.password ? 'border-red-400' : 'border-white/80 hover:border-slate-300'}
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            className="w-3.5 h-3.5 rounded border-slate-300 bg-white/80 text-indigo-600 focus:ring-indigo-500/20 accent-indigo-600 cursor-pointer"
          />
          <span className="text-[11px] text-slate-600 font-normal">
            Remember me on this device
          </span>
        </label>
      </div>

      {/* Sign In Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg shadow-indigo-600/25 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
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

      {/* Switch to Sign Up quick link */}
      {onSwitchToSignUp && (
        <p className="text-center text-[11px] text-slate-500 pt-0.5">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </p>
      )}

      {/* Demo Accounts Helper */}
      <DemoCredentials onSelectAccount={handleDemoSelect} />
    </form>
  );
}
