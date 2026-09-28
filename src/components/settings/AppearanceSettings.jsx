import React, { useEffect } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
  Sparkles,
  LayoutGrid,
  Zap,
  Layers,
  Sliders,
  Eye,
} from 'lucide-react';

export default function AppearanceSettings({ settings, onChange }) {
  const appearance = settings?.appearance || {
    theme: 'light',
    accentColor: 'indigo',
    density: 'comfortable',
    animationsEnabled: true,
    glassmorphism: true,
  };

  const themes = [
    {
      id: 'light',
      label: 'Light Mode',
      icon: Sun,
      desc: 'Crisp, high-contrast day mode with clean paper surfaces',
      badge: 'Daylight',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: Moon,
      desc: 'Sleek obsidian palette reducing eye fatigue in low light',
      badge: 'Night',
    },
    {
      id: 'system',
      label: 'System Auto',
      icon: Laptop,
      desc: 'Synchronizes dynamically with your OS light/dark schedule',
      badge: 'Auto',
    },
  ];

  const accents = [
    {
      id: 'indigo',
      label: 'Indigo Royale',
      color: 'bg-indigo-600',
      border: 'border-indigo-600',
      ring: 'ring-indigo-500/30',
      lightBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
      hex: '#6366f1',
    },
    {
      id: 'emerald',
      label: 'Emerald Mint',
      color: 'bg-emerald-600',
      border: 'border-emerald-600',
      ring: 'ring-emerald-500/30',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
      hex: '#10b981',
    },
    {
      id: 'blue',
      label: 'Ocean Blue',
      color: 'bg-blue-600',
      border: 'border-blue-600',
      ring: 'ring-blue-500/30',
      lightBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
      hex: '#0284c7',
    },
    {
      id: 'violet',
      label: 'Royal Violet',
      color: 'bg-purple-600',
      border: 'border-purple-600',
      ring: 'ring-purple-500/30',
      lightBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
      hex: '#8b5cf6',
    },
    {
      id: 'amber',
      label: 'Sunset Amber',
      color: 'bg-amber-600',
      border: 'border-amber-600',
      ring: 'ring-amber-500/30',
      lightBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
      hex: '#f59e0b',
    },
    {
      id: 'rose',
      label: 'Crimson Rose',
      color: 'bg-rose-600',
      border: 'border-rose-600',
      ring: 'ring-rose-500/30',
      lightBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
      hex: '#f43f5e',
    },
  ];

  const densities = [
    {
      id: 'compact',
      label: 'Compact Density',
      desc: 'Optimized for high-volume tabular rosters and dense bed grids',
    },
    {
      id: 'comfortable',
      label: 'Comfortable (Standard)',
      desc: 'Standard balanced spacing with optimal legibility and whitespace',
    },
    {
      id: 'spacious',
      label: 'Spacious Touch',
      desc: 'Enlarged hit targets and generous padding for tablet displays',
    },
  ];

  // Apply theme immediately to DOM on change
  const handleThemeChange = (newTheme) => {
    onChange?.('appearance', 'theme', newTheme);
    const isDark =
      newTheme === 'dark' ||
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  };

  const handleAccentChange = (accentId) => {
    onChange?.('appearance', 'accentColor', accentId);
    document.documentElement.setAttribute('data-accent', accentId);
  };

  const selectedAccent = accents.find((a) => a.id === appearance.accentColor) || accents[0];

  return (
    <div className="space-y-6">
      {/* ── Main Appearance Card ── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Appearance & Visual Styling
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize your color theme, brand accent palette, UI density, and visual fidelity.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Theme Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
            Interface Theme Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = (appearance.theme || 'light') === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/30 shadow-xs ring-2 ring-primary-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{t.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Brand Accent Colors */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
            Brand Accent Palette
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {accents.map((acc) => {
              const isSelected = (appearance.accentColor || 'indigo') === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleAccentChange(acc.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? `border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-700/60 shadow-xs ring-2 ${acc.ring}`
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="relative">
                    <span className={`w-7 h-7 rounded-full ${acc.color} shadow-xs block`} />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {acc.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Interface Density */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
            Interface Density & Layout Scaling
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {densities.map((d) => {
              const isSelected = (appearance.density || 'comfortable') === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChange?.('appearance', 'density', d.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/30 ring-2 ring-primary-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/40 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {d.label}
                    </span>
                    {isSelected && <Check size={14} className="text-primary-600" strokeWidth={3} />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{d.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Visual Effects Toggles */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <Zap size={18} className="text-primary-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Micro-Animations & Transitions
                </p>
                <p className="text-[11px] text-slate-500">
                  Enable smooth hover state animations and dynamic chart rendering
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={appearance.animationsEnabled ?? true}
                onChange={(e) => onChange?.('appearance', 'animationsEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <Layers size={18} className="text-primary-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Glassmorphism & Translucency
                </p>
                <p className="text-[11px] text-slate-500">
                  Enable backdrop-blur translucent surfaces on dialogs and tooltips
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={appearance.glassmorphism ?? true}
                onChange={(e) => onChange?.('appearance', 'glassmorphism', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
            </label>
          </div>
        </div>
      </div>

      {/* ── Live UI Sandbox Preview ── */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-primary-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Theme Preview Sandbox
            </span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Theme: {appearance.theme} • Accent: {selectedAccent.label}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Sample Action Button</span>
            <div>
              <button
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform active:scale-95 ${selectedAccent.color}`}
              >
                Confirm Allocation
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Status Badge</span>
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${selectedAccent.lightBg}`}>
                <Sparkles size={12} />
                <span>Active 94.2% Occupancy</span>
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Live Metric Card</span>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Realized Inflow</span>
              <span className="text-sm font-bold font-mono text-white">₹14,85,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
