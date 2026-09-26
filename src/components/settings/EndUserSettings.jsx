import { UserCheck, UtensilsCrossed, Volume2, Shield } from 'lucide-react';

export default function EndUserSettings({ settings, onChange }) {
  const us = settings?.endUserSettings || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck size={18} className="text-indigo-600" />
            Resident Stay & Lifestyle Preferences
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure roommate matching preferences, dietary choices, and quiet hours.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
          Resident Settings
        </span>
      </div>

      <div className="space-y-4">
        {/* Roommate Preference */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Roommate Living Preference
          </label>
          <select
            value={us.roommatePreference || 'Quiet / Study Focused'}
            onChange={(e) => onChange?.('endUserSettings', 'roommatePreference', e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
          >
            <option value="Quiet / Study Focused">Quiet / Study Focused (Early Sleeper)</option>
            <option value="Working Night Shift">Working Night Shift (Late Sleeper)</option>
            <option value="Social & Friendly">Social & Friendly</option>
            <option value="Flexible">Flexible / Any</option>
          </select>
        </div>

        {/* Dietary Preference */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Hostel Mess Dietary Preference
          </label>
          <div className="relative">
            <UtensilsCrossed size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={us.dietaryPreference || 'Vegetarian'}
              onChange={(e) => onChange?.('endUserSettings', 'dietaryPreference', e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            >
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Jain Food">Jain Food (No onion / garlic)</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
        </div>

        {/* Silent Hours & Menu Toggles */}
        <div className="pt-2 border-t border-slate-100 divide-y divide-slate-100">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 size={16} className="text-slate-400" />
              <div>
                <p className="text-xs font-bold text-slate-800">Quiet Hours Reminders (11:00 PM)</p>
                <p className="text-[11px] text-slate-500">Mute loud ringtones in room</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={us.silentHoursNotification ?? true}
                onChange={(e) => onChange?.('endUserSettings', 'silentHoursNotification', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield size={16} className="text-slate-400" />
              <div>
                <p className="text-xs font-bold text-slate-800">Share Contact Details with Roommates</p>
                <p className="text-[11px] text-slate-500">Allow assigned room occupants to see your phone number</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={us.shareContactWithRoommates ?? true}
                onChange={(e) => onChange?.('endUserSettings', 'shareContactWithRoommates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
