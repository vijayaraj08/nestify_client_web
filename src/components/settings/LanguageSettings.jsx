import React, { useState } from 'react';
import {
  Globe,
  Check,
  Search,
  Languages,
  Sparkles,
} from 'lucide-react';

export default function LanguageSettings({ settings, onChange }) {
  const lang = settings?.language || { locale: 'en' };
  const [searchTerm, setSearchTerm] = useState('');

  const supportedLanguages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      greeting: 'Welcome to Nestify',
      region: 'India / Global',
      badge: 'Default',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      greeting: 'नेस्टिफाई में आपका स्वागत है',
      region: 'National',
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      greeting: 'நெஸ்டிஃபைக்கு நல்வரவு',
      region: 'Tamil Nadu & Puducherry',
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      greeting: 'నెస్టిఫైకి స్వాగతం',
      region: 'Andhra Pradesh & Telangana',
    },
    {
      code: 'kn',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      greeting: 'ನೆಸ್ಟಿಫೈಗೆ ಸುಸ್ವಾಗತ',
      region: 'Karnataka',
    },
    {
      code: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      greeting: 'നെസ്റ്റിഫൈയിലേക്ക് സ്വാഗതം',
      region: 'Kerala',
    },
    {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      greeting: 'नेस्टिफाय मध्ये आपले स्वागत आहे',
      region: 'Maharashtra & Goa',
    },
    {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      greeting: 'নেস্টিফাইতে আপনাকে স্বাগতম',
      region: 'West Bengal & Tripura',
    },
    {
      code: 'gu',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      greeting: 'નેસ્ટિફાયમાં તમારું સ્વાગત છે',
      region: 'Gujarat',
    },
  ];

  const filteredLanguages = supportedLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeLanguage =
    supportedLanguages.find((l) => l.code === (lang.locale || 'en')) || supportedLanguages[0];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
              <Languages size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interface Language
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your primary language for dashboard navigation, notifications, and invoicing.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredLanguages.map((l) => {
            const isSelected = (lang.locale || 'en') === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => onChange?.('language', 'locale', l.code)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/30 shadow-xs ring-2 ring-primary-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                      {l.nativeName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                      ({l.name})
                    </span>
                  </div>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : (
                    l.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {l.badge}
                      </span>
                    )
                  )}
                </div>

                <p className="text-xs text-primary-700 dark:text-primary-300 font-medium italic truncate">
                  "{l.greeting}"
                </p>

                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <Globe size={11} />
                  <span>{l.region}</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Language Preview Banner ── */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-600 text-white shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-mono text-primary-400 block font-semibold">
              Active Language Setting
            </span>
            <p className="text-sm font-bold text-white">
              {activeLanguage.nativeName} ({activeLanguage.name}) — {activeLanguage.greeting}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          Locale code: {activeLanguage.code.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
