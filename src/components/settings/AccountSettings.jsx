import { useState } from 'react';
import { Lock, KeyRound, Check, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { changePassword } from '../../services/settingsService';
import { durationStringToMs, msToDurationString } from '../../utils/timeUtils';

export default function AccountSettings({ settings, onChange }) {
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await changePassword(passData);
      setSuccess('Password updated successfully!');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const security = settings?.security || {};
  const sessionTimeoutMs = security?.sessionTimeoutMs ?? (security?.sessionTimeout ? durationStringToMs(security.sessionTimeout) : 1800000);

  const handleTimeoutChange = (strVal) => {
    const ms = durationStringToMs(strVal);
    onChange?.('security', 'sessionTimeoutMs', ms);
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <KeyRound size={18} className="text-primary-600 dark:text-primary-400" />
          Change Password
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Ensure your account is using a long, random password to stay secure.
        </p>

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={passData.currentPassword}
                onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={passData.newPassword}
                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                placeholder="Min 6 chars"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={passData.confirmPassword}
                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      </div>

      {/* Security & Sessions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
          Two-Factor Authentication & Session
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Add an extra layer of security to your Hostello account.
        </p>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Require an authenticator code when signing in.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.twoFactorEnabled || false}
                onChange={(e) => onChange?.('security', 'twoFactorEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
            </label>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Automatic Session Timeout</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sign out after inactivity (stored in ms: {sessionTimeoutMs}ms).
              </p>
            </div>
            <select
              value={msToDurationString(sessionTimeoutMs)}
              onChange={(e) => handleTimeoutChange(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer text-slate-800 dark:text-slate-200"
            >
              <option value="15m" className="bg-white dark:bg-slate-900">15 Minutes (900,000ms)</option>
              <option value="30m" className="bg-white dark:bg-slate-900">30 Minutes (1,800,000ms)</option>
              <option value="1h" className="bg-white dark:bg-slate-900">1 Hour (3,600,000ms)</option>
              <option value="4h" className="bg-white dark:bg-slate-900">4 Hours (14,400,000ms)</option>
              <option value="never" className="bg-white dark:bg-slate-900">Never (Stay signed in)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
