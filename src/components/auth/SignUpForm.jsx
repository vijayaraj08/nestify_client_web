import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { getDefaultRouteForRole } from '../../auth/role.utils';

export default function SignUpForm({ onLoginSuccess, onSwitchToSignIn }) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Resident',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = useCallback(() => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to the Terms of Service';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const registeredUser = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        password: formData.password,
      });

      if (onLoginSuccess) {
        onLoginSuccess({ user: registeredUser });
      } else {
        const dest = getDefaultRouteForRole(registeredUser.role);
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
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

      {/* Role Selection Segmented Bar */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          I am registering as:
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/[0.04] backdrop-blur-md rounded-xl border border-white/60">
          {['Resident', 'Tenant'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleChange('role', r)}
              className={`
                py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center
                ${formData.role === r
                  ? 'bg-white text-indigo-600 shadow-sm font-bold border border-white/80'
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Full Name<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User size={15} />
          </div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Rahul Sharma"
            disabled={loading}
            className={`
              w-full rounded-xl border bg-white/70 backdrop-blur-md pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-900
              placeholder:text-slate-400 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white
              shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]
              ${errors.name ? 'border-red-400 focus:ring-red-400/20' : 'border-white/80 hover:border-slate-300'}
            `}
          />
        </div>
        {errors.name && (
          <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>
        )}
      </div>

      {/* Email & Phone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Email */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Email<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={15} />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@email.com"
              disabled={loading}
              className={`
                w-full rounded-xl border bg-white/70 backdrop-blur-md pl-10 pr-3 py-2 text-xs text-slate-900
                placeholder:text-slate-400 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white
                shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]
                ${errors.email ? 'border-red-400' : 'border-white/80 hover:border-slate-300'}
              `}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone size={15} />
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              disabled={loading}
              className="w-full rounded-xl border border-white/80 bg-white/70 backdrop-blur-md pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white hover:border-slate-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
            />
          </div>
        </div>
      </div>

      {/* Password & Confirm Password Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Password */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Password<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={15} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Min 6 chars"
              disabled={loading}
              className={`
                w-full rounded-xl border bg-white/70 backdrop-blur-md pl-10 pr-8 py-2 text-xs text-slate-900
                placeholder:text-slate-400 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white
                shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]
                ${errors.password ? 'border-red-400' : 'border-white/80 hover:border-slate-300'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] text-red-500 mt-0.5">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Confirm Password<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={15} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Re-enter password"
              disabled={loading}
              className={`
                w-full rounded-xl border bg-white/70 backdrop-blur-md pl-10 pr-8 py-2 text-xs text-slate-900
                placeholder:text-slate-400 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white
                shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]
                ${errors.confirmPassword ? 'border-red-400' : 'border-white/80 hover:border-slate-300'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] text-red-500 mt-0.5">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Terms Checkbox */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => handleChange('agreeTerms', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 bg-white/80 text-indigo-600 focus:ring-indigo-500/20 accent-indigo-600 mt-0.5 cursor-pointer shrink-0"
          />
          <span className="text-[11px] text-slate-600 leading-tight">
            I agree to the <span className="text-indigo-600 font-semibold underline">Terms of Service</span> and <span className="text-indigo-600 font-semibold underline">Hostel Living Rules</span>.
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-[10px] text-red-500 mt-0.5">{errors.agreeTerms}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg shadow-indigo-600/25 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-1"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <UserPlus size={16} />
            <span>Create Hostello Account</span>
          </>
        )}
      </button>

      {/* Switch to Sign In link */}
      <p className="text-center text-xs text-slate-500 pt-0.5">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 font-bold hover:underline cursor-pointer"
        >
          Sign In Here
        </button>
      </p>
    </form>
  );
}
