import { User, Mail, Calendar, MapPin, CheckCircle, Shield } from 'lucide-react';

export default function PersonalInformation({
  data,
  isEditing = false,
  errors = {},
  onChange,
}) {
  const handleChange = (field, value) => {
    onChange?.('personal', field, value);
  };

  const handleAddressChange = (field, value) => {
    onChange?.('address', field, value);
  };

  const address = data?.address || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User size={18} className="text-primary-600" />
            Personal Information
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your verified personal identity and residential address.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
          <Shield size={12} className="text-slate-400" /> Common Identity
        </span>
      </div>

      {isEditing ? (
        /* ── Edit Mode Form (3-Column Grid) ── */
        <div className="space-y-4">
          {/* Row 1: First Name | Last Name | DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={data?.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="First Name"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all ${
                  errors.firstName ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200'
                }`}
              />
              {errors.firstName && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={data?.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Last Name"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all ${
                  errors.lastName ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200'
                }`}
              />
              {errors.lastName && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={data?.dob || ''}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email (Immutable) | Sex | Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                  <CheckCircle size={10} /> Verified
                </span>
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={data?.email || ''}
                  readOnly
                  disabled
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed select-none font-mono truncate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sex / Gender
              </label>
              <select
                value={data?.sex || 'Male'}
                onChange={(e) => handleChange('sex', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white text-slate-800 cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={address.country || 'India'}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                placeholder="Country"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 3: Structured Residential Address */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
              <MapPin size={13} className="text-primary-600" />
              Residential Address
            </h4>

            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={address.line1 || ''}
                  onChange={(e) => handleAddressChange('line1', e.target.value)}
                  placeholder="Address Line 1 (Flat/House No, Building)"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                />
                <input
                  type="text"
                  value={address.line2 || ''}
                  onChange={(e) => handleAddressChange('line2', e.target.value)}
                  placeholder="Address Line 2 (Street, Landmark)"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={address.city || ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  value={address.state || ''}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="State"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  value={address.postalCode || ''}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  placeholder="Postal Code"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── View Mode Grid Display (Multi-column aligned) ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6 text-sm">
          {/* Row 1: Full Name | Email Address | Date of Birth */}
          <div>
            <span className="text-xs font-medium text-slate-400 block">Full Name</span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {data?.firstName} {data?.lastName}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">Email Address</span>
            <span className="font-semibold text-slate-800 mt-1 block font-mono text-xs truncate" title={data?.email}>
              {data?.email}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">Date of Birth</span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {data?.dob || '1998-05-15'}
            </span>
          </div>

          {/* Row 2: Sex | Residential Address (spanning 2 columns) */}
          <div>
            <span className="text-xs font-medium text-slate-400 block">Sex</span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {data?.sex || 'Male'}
            </span>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs font-medium text-slate-400 block">Residential Address</span>
            <span className="font-semibold text-slate-800 mt-1 block leading-relaxed text-xs sm:text-sm">
              {address.line1
                ? `${address.line1}, ${address.line2 ? `${address.line2}, ` : ''}${address.city}, ${address.state} - ${address.postalCode}, ${address.country || 'India'}`
                : '124, Green Glen Layout, Bellandur, Near EcoSpace Tech Park, Bengaluru, Karnataka - 560103, India'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
