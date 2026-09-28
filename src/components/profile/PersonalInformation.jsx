import { User, Mail, Calendar, Phone, CheckCircle, Shield, FileBadge, HeartHandshake } from 'lucide-react';

export default function PersonalInformation({
  data,
  isEditing = false,
  errors = {},
  onChange,
}) {
  const handleChange = (field, value) => {
    onChange?.('personal', field, value);
  };

  const handleEmergencyChange = (field, value) => {
    onChange?.('emergencyContact', field, value);
  };

  const emergency = data?.emergencyContact || {};
  const kyc = data?.kyc || {};

  return (
    <div className="space-y-4">
      {/* ── Main Personal Details Card ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User size={18} className="text-primary-600 dark:text-primary-400" />
              Personal Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your verified personal identity, contact details, and account credentials.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700">
            <Shield size={12} className="text-slate-400 dark:text-slate-500" /> Common Identity
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {/* Row 1: First Name | Last Name | DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={data?.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="First Name"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all ${
                    errors.firstName ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-0.5">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={data?.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Last Name"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all ${
                    errors.lastName ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-0.5">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="date"
                    value={data?.dateOfBirth ? data.dateOfBirth.split('T')[0] : '1998-05-15'}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Email (Readonly) | Phone | Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                    <CheckCircle size={10} /> Verified
                  </span>
                </div>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    value={data?.email || ''}
                    readOnly
                    disabled
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 cursor-not-allowed font-mono truncate"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="tel"
                    value={data?.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={data?.gender || 'male'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="male" className="bg-white dark:bg-slate-900">Male</option>
                  <option value="female" className="bg-white dark:bg-slate-900">Female</option>
                  <option value="other" className="bg-white dark:bg-slate-900">Other</option>
                  <option value="prefer_not_to_say" className="bg-white dark:bg-slate-900">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Row 3: Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bio / About Me
              </label>
              <textarea
                value={data?.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Write a brief intro..."
                rows={2}
                maxLength={500}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6 text-sm">
            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Full Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                {data?.firstName} {data?.lastName}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Email Address</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block font-mono text-xs truncate" title={data?.email}>
                {data?.email}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Phone Number</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block font-mono text-xs">
                {data?.phone || '+91 98765 43210'}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Date of Birth</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                {data?.dateOfBirth ? data.dateOfBirth.split('T')[0] : '1998-05-15'}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Gender</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block capitalize">
                {data?.gender || 'Male'}
              </span>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Bio</span>
              <p className="text-slate-700 dark:text-slate-300 mt-1 text-xs sm:text-sm italic">
                "{data?.bio || 'Super administrator overseeing Hostello network operations, tenant subscriptions, and compliance.'}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Emergency Contact & KYC Status Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emergency Contact */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <HeartHandshake size={15} className="text-rose-500" />
              Emergency Contact
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">SOS Verified</span>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  value={emergency.name || ''}
                  onChange={(e) => handleEmergencyChange('name', e.target.value)}
                  placeholder="Guardian / Emergency Contact Name"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={emergency.relationship || ''}
                    onChange={(e) => handleEmergencyChange('relationship', e.target.value)}
                    placeholder="e.g. Parent / Spouse"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={emergency.phone || ''}
                    onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{emergency.name || 'Prakash Sharma'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Relationship:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{emergency.relationship || 'Father'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Emergency Phone:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{emergency.phone || '+91 98450 11223'}</span>
              </div>
            </div>
          )}
        </div>

        {/* KYC & Identity Document Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileBadge size={15} className="text-primary-600 dark:text-primary-400" />
              KYC & Government ID
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle size={10} /> Verified
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Document Type:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{kyc.documentType || 'Aadhaar Card'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Document ID:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{kyc.documentNumber || '•••• •••• 8921'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Verification Mode:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">UIDAI Instant OTP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
