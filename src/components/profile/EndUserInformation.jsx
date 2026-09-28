import { Home, QrCode, FileCheck, UtensilsCrossed, Users, Sparkles } from 'lucide-react';

export default function EndUserInformation({
  data,
  isEditing = false,
  onChange,
}) {
  const resident = data?.residentProfile || {};
  const currentStay = resident?.currentStay || {};
  const roommate = resident?.roommatePreferences || {};
  const mess = resident?.messSubscription || {};
  const agreement = resident?.digitalAgreement || {};

  const handleRoommateChange = (field, value) => {
    onChange?.('residentRoommate', field, value);
  };

  const handleMessChange = (field, value) => {
    onChange?.('residentMess', field, value);
  };

  return (
    <div className="space-y-4">
      {/* ── Active Stay & Digital Identity Card ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Home size={18} className="text-indigo-600 dark:text-indigo-400" />
              Room Assignment & Digital Identity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current room allocation, digital resident ID card, and rental agreement.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 rounded-full">
            Resident Scope
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Hostel & Property</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
              {currentStay.hostelName || 'Grand Oak Living Suites'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Room & Bed Allocated</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
              {currentStay.roomNumber || '304-B'} ({currentStay.bedName || 'Bed 2 - Window'})
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Stay Status</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 mt-1 block capitalize">
              {currentStay.stayStatus || 'Active'} Resident
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Digital ID Card (QR)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 inline-flex items-center gap-1.5 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              <QrCode size={14} className="text-slate-600 dark:text-slate-400" />
              {resident.qrCodeId || 'QR-RES-98214-GOL'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Digital Rental Agreement</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 mt-1 inline-flex items-center gap-1 text-xs">
              <FileCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              {agreement.isSigned ? 'Signed & Verified' : 'Pending Signature'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Mess & Food Plan</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 inline-flex items-center gap-1 text-xs">
              <UtensilsCrossed size={14} className="text-amber-600 dark:text-amber-400" />
              {mess.isOptedIn !== false ? `Subscribed (${(mess.dietaryType || 'veg').toUpperCase()})` : 'Opted Out'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Roommate Matching & Lifestyle Preferences (US-032) ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-violet-600 dark:text-violet-400" />
              Roommate Compatibility & Lifestyle Preferences
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Preferences used to recommend compatible roommates in shared suites.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 border border-violet-100 dark:border-violet-800 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles size={11} /> Matchmaking
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dietary Preference
                </label>
                <select
                  value={roommate.dietaryPreference || 'any'}
                  onChange={(e) => handleRoommateChange('dietaryPreference', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  <option value="veg_only" className="bg-white dark:bg-slate-900">Vegetarian Only</option>
                  <option value="non_veg_ok" className="bg-white dark:bg-slate-900">Non-Vegetarian Friendly</option>
                  <option value="any" className="bg-white dark:bg-slate-900">No Preference / Any</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Smoking Policy
                </label>
                <select
                  value={roommate.smokingPreference || 'non_smoker_only'}
                  onChange={(e) => handleRoommateChange('smokingPreference', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  <option value="non_smoker_only" className="bg-white dark:bg-slate-900">Non-Smoker Only</option>
                  <option value="any" className="bg-white dark:bg-slate-900">Flexible / Any</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sleep Schedule
                </label>
                <select
                  value={roommate.sleepSchedule || 'flexible'}
                  onChange={(e) => handleRoommateChange('sleepSchedule', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  <option value="early_bird" className="bg-white dark:bg-slate-900">Early Bird (Before 10 PM)</option>
                  <option value="night_owl" className="bg-white dark:bg-slate-900">Night Owl (Late Nights)</option>
                  <option value="flexible" className="bg-white dark:bg-slate-900">Flexible / Normal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lifestyle & Habits Note
              </label>
              <input
                type="text"
                value={roommate.lifestyleNotes || ''}
                onChange={(e) => handleRoommateChange('lifestyleNotes', e.target.value)}
                placeholder="e.g. Enjoys quiet study hours and weekend cycling."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Dietary Choice</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block capitalize">
                {(roommate.dietaryPreference || 'Any').replace('_', ' ')}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Smoking Policy</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block capitalize">
                {(roommate.smokingPreference || 'Non-Smoker Only').replace('_', ' ')}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Sleep Routine</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block capitalize">
                {(roommate.sleepSchedule || 'Flexible').replace('_', ' ')}
              </span>
            </div>

            {roommate.lifestyleNotes && (
              <div className="sm:col-span-2 lg:col-span-3">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Lifestyle Notes</span>
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 block">
                  {roommate.lifestyleNotes}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
