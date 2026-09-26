import { ShieldCheck, Phone, User, Briefcase, FileBadge } from 'lucide-react';

export default function EndUserInformation({
  data,
  isEditing = false,
  onChange,
}) {
  const resident = data?.resident || {};

  const handleFieldChange = (field, value) => {
    onChange?.('resident', field, value);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600" />
            Resident Stay & Emergency Details
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Emergency contacts, verified identity, and occupation status.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
          Resident Scope
        </span>
      </div>

      {isEditing ? (
        /* ── Edit Mode Form ── */
        <div className="space-y-4">
          {/* Emergency Contact Header */}
          <div className="pt-1">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Phone size={14} className="text-rose-500" />
              Emergency Contact (Primary)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={resident.emergencyContactName || ''}
                    onChange={(e) => handleFieldChange('emergencyContactName', e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relationship
                </label>
                <select
                  value={resident.emergencyRelation || 'Parent'}
                  onChange={(e) => handleFieldChange('emergencyRelation', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white cursor-pointer"
                >
                  <option value="Parent">Parent / Guardian</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={resident.emergencyContactPhone || ''}
                    onChange={(e) => handleFieldChange('emergencyContactPhone', e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Occupation & Identity */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Briefcase size={14} className="text-indigo-600" />
              Occupation & KYC Verification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status / Category
                </label>
                <select
                  value={resident.status || 'Working Professional'}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white cursor-pointer"
                >
                  <option value="Working Professional">Working Professional</option>
                  <option value="College Student">College Student</option>
                  <option value="Intern">Intern / Trainee</option>
                  <option value="Freelancer">Freelancer / Self-Employed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Role / Course
                </label>
                <input
                  type="text"
                  value={resident.occupation || ''}
                  onChange={(e) => handleFieldChange('occupation', e.target.value)}
                  placeholder="e.g. Software Engineer / B.Tech"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employer / College Name
                </label>
                <input
                  type="text"
                  value={resident.employerOrCollege || ''}
                  onChange={(e) => handleFieldChange('employerOrCollege', e.target.value)}
                  placeholder="Company / University"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Government ID
                </label>
                <div className="relative">
                  <FileBadge size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={resident.governmentIdNumber || 'XXXX-XXXX-8921'}
                    disabled
                    readOnly
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  KYC verified with Aadhaar. Contact management for document updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── View Mode Display ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Emergency Contact</span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {resident.emergencyContactName || 'Ramesh Sharma'} ({resident.emergencyRelation || 'Father'})
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">Emergency Phone</span>
            <span className="font-semibold text-slate-800 mt-1 block font-mono text-xs">
              {resident.emergencyContactPhone || '+91 98450 12345'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">KYC Verification</span>
            <span className="font-semibold text-emerald-700 mt-1 inline-flex items-center gap-1">
              <ShieldCheck size={14} /> Aadhaar Verified
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">Status</span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {resident.status || 'Working Professional'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">Occupation / Role</span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {resident.occupation || 'Software Engineer'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">Employer / College</span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {resident.employerOrCollege || 'Initech Systems India'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
