import { useState, useEffect } from 'react';
import {
  Save,
  Check,
  AlertCircle,
  Loader2,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ROLES, normalizeRole } from '../constants/roles';
import { getSettings, updateSettings, getDefaultSettingsData } from '../services/settingsService';
import {
  AccountSettings,
  AppearanceSettings,
  NotificationSettings,
  LanguageSettings,
  TenantSettings,
  EndUserSettings,
  getSettingsTabsForRole,
} from '../components/settings';

export default function Settings() {
  const { user, role: rawRole } = useAuth();
  const role = normalizeRole(rawRole || user?.role);
  const tabs = getSettingsTabsForRole(role);

  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState(() => getDefaultSettingsData(user));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchSavedSettings() {
      try {
        const data = await getSettings(user);
        if (isMounted && data) {
          setSettings(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to sync settings.');
        }
      }
    }

    fetchSavedSettings();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSettingChange = (section, field, value) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateSettings(user, settings);
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-4 pb-8">
      {/* ── Top Feedback Alerts ── */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in shadow-2xs">
          <Check size={18} className="text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in shadow-2xs">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ── Navigation Tabs + Save Action Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Save Changes Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>

      {/* ── Tab Content Views ── */}
      <div className="space-y-4">
        {activeTab === 'account' && (
          <AccountSettings
            settings={settings}
            onChange={handleSettingChange}
          />
        )}

        {activeTab === 'appearance' && (
          <AppearanceSettings
            settings={settings}
            onChange={handleSettingChange}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings
            settings={settings}
            onChange={handleSettingChange}
          />
        )}

        {activeTab === 'language' && (
          <LanguageSettings
            settings={settings}
            onChange={handleSettingChange}
          />
        )}

        {activeTab === 'tenant' && role === ROLES.TENANT && (
          <TenantSettings
            settings={settings}
            onChange={handleSettingChange}
          />
        )}

        {activeTab === 'resident' && role === ROLES.END_USER && (
          <EndUserSettings
            settings={settings}
            onChange={handleSettingChange}
          />
        )}

        {activeTab === 'platform' && role === ROLES.SUPER_ADMIN && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders size={18} className="text-primary-600" />
              Platform Super Administrator Controls
            </h3>
            <p className="text-xs text-slate-500">
              Global system configuration, KYC auto-verification triggers, and audit log policies.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between font-medium">
                <span>Platform Fee Rate:</span>
                <span className="font-bold text-slate-800">2.5% per booking</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>KYC Approval Mode:</span>
                <span className="font-bold text-emerald-700">Manual Review Required</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Audit Logs Retention:</span>
                <span className="font-bold text-slate-800">90 Days</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
