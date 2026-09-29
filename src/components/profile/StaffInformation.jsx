import { Briefcase, Clock, Shield, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { msToTimeString, timeStringToMs, formatMsToHumanTime, formatTimestamp } from '../../utils/timeUtils';

export default function StaffInformation({
  data,
  isEditing = false,
  onChange,
}) {
  const staff = data?.staffProfile || {};

  const handleFieldChange = (field, value) => {
    onChange?.('staffProfile', field, value);
  };

  const shiftStartMs = staff?.shiftStartMs ?? 32400000; // 9:00 AM (9 * 3600 * 1000)
  const shiftEndMs = staff?.shiftEndMs ?? 64800000; // 6:00 PM (18 * 3600 * 1000)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase size={18} className="text-amber-600 dark:text-amber-400" />
            Staff Assignment & Shift Details
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hostel assignment, shift schedule, department, and operational role.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800 px-2.5 py-1 rounded-full">
          {staff?.shiftActiveStatus ? 'On Duty' : 'Off Duty'}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designation / Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={staff?.designation || ''}
                onChange={(e) => handleFieldChange('designation', e.target.value)}
                placeholder="e.g. Floor Warden & Operations Lead"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={staff?.department || 'Operations'}
                onChange={(e) => handleFieldChange('department', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="Operations" className="bg-white dark:bg-slate-900">Operations & Wardens</option>
                <option value="Housekeeping" className="bg-white dark:bg-slate-900">Housekeeping & Maintenance</option>
                <option value="Security" className="bg-white dark:bg-slate-900">Security & Gate Management</option>
                <option value="Administration" className="bg-white dark:bg-slate-900">Administration & Front Desk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shift Start Time
              </label>
              <input
                type="time"
                value={msToTimeString(shiftStartMs)}
                onChange={(e) => handleFieldChange('shiftStartMs', timeStringToMs(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shift End Time
              </label>
              <input
                type="time"
                value={msToTimeString(shiftEndMs)}
                onChange={(e) => handleFieldChange('shiftEndMs', timeStringToMs(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Designation</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
              {staff?.designation || 'Floor Warden'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Department</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
              {staff?.department || 'Operations & Wardens'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Shift Timing (ms formatted)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 inline-flex items-center gap-1 text-xs">
              <Clock size={14} className="text-primary-600 dark:text-primary-400" />
              {formatMsToHumanTime(shiftStartMs)} – {formatMsToHumanTime(shiftEndMs)}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Assigned Hostel</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
              {staff?.assignedHostels?.[0] || 'Grand Oak Living Suites'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Employment Date</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 inline-flex items-center gap-1 text-xs">
              <Calendar size={14} className="text-slate-500" />
              {formatTimestamp(staff?.employmentDate || '2026-01-10')}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Monthly Compensation</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 mt-1 inline-flex items-center gap-1 text-xs">
              <DollarSign size={14} />
              ₹{(staff?.salary || 24000).toLocaleString('en-IN')} / mo
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
