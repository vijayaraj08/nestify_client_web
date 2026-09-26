import { Globe, Clock, Calendar } from 'lucide-react';

export default function LanguageSettings({ settings, onChange }) {
  const lang = settings?.language || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Globe size={18} className="text-primary-600" />
          Language & Regional Preferences
        </h3>
        <p className="text-xs text-slate-500">
          Set your preferred display language, date format, and regional timezone.
        </p>
      </div>

      <div className="space-y-4 max-w-xl">
        {/* Language */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Display Language
          </label>
          <div className="relative">
            <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={lang.locale || 'en'}
              onChange={(e) => onChange?.('language', 'locale', e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white cursor-pointer text-slate-800"
            >
              <option value="en">English (India / US)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Time Zone
          </label>
          <div className="relative">
            <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={lang.timezone || 'Asia/Kolkata (IST)'}
              onChange={(e) => onChange?.('language', 'timezone', e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white cursor-pointer text-slate-800"
            >
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST +05:30)</option>
              <option value="Asia/Dubai (GST)">Asia/Dubai (GST +04:00)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT +00:00)</option>
              <option value="America/New_York (EST)">America/New_York (EST -05:00)</option>
            </select>
          </div>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Date Display Format
          </label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={lang.dateFormat || 'DD/MM/YYYY'}
              onChange={(e) => onChange?.('language', 'dateFormat', e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white cursor-pointer text-slate-800"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 26/09/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/26/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-26)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
