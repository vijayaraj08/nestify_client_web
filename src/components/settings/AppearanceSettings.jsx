import { Palette, Sun, Moon, Laptop, Check } from 'lucide-react';

export default function AppearanceSettings({ settings, onChange }) {
  const appearance = settings?.appearance || { theme: 'light', accentColor: 'indigo' };

  const themes = [
    { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean, crisp high-contrast background' },
    { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Sleek, low-light obsidian background' },
    { id: 'system', label: 'System Mode', icon: Laptop, desc: 'Sync automatically with your device theme' },
  ];

  const accents = [
    { id: 'indigo', label: 'Indigo (Default)', color: 'bg-indigo-600' },
    { id: 'blue', label: 'Ocean Blue', color: 'bg-blue-600' },
    { id: 'emerald', label: 'Emerald Mint', color: 'bg-emerald-600' },
    { id: 'rose', label: 'Rose Crimson', color: 'bg-rose-600' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Palette size={18} className="text-primary-600" />
          Appearance & Themes
        </h3>
        <p className="text-xs text-slate-500">
          Customize how Hostello looks and feels on your current display.
        </p>
      </div>

      {/* Theme Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-3">
          Interface Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = (appearance.theme || 'light') === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange?.('appearance', 'theme', t.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50/50 shadow-xs ring-2 ring-primary-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${
                  isSelected ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Icon size={18} />
                </div>
                <p className="text-sm font-bold text-slate-800">{t.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 mb-3">
          Brand Accent Color
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {accents.map((acc) => {
            const isSelected = (appearance.accentColor || 'indigo') === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => onChange?.('appearance', 'accentColor', acc.id)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 font-bold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${acc.color} shrink-0`} />
                <span className="text-xs text-slate-800">{acc.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
