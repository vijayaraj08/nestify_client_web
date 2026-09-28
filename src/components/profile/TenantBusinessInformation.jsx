import { Building2, FileText, CheckCircle2, Clock, KeyRound, Wallet } from 'lucide-react';

export default function TenantBusinessInformation({
  data,
  isEditing = false,
  onChange,
}) {
  const owner = data?.ownerProfile || {};

  const handleFieldChange = (field, value) => {
    onChange?.('ownerProfile', field, value);
  };

  const getApprovalBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800 px-2.5 py-1 rounded-full">
            <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" /> Platform Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800 px-2.5 py-1 rounded-full">
            <Clock size={12} className="text-amber-600 dark:text-amber-400" /> Under Moderation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full capitalize">
            {status || 'Pending'}
          </span>
        );
    }
  };

  const getLicenseBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 rounded-full">
            <KeyRound size={12} className="text-indigo-600 dark:text-indigo-400" /> Active License
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800 px-2.5 py-1 rounded-full">
            <KeyRound size={12} className="text-blue-600 dark:text-blue-400" /> 3-Day Free Trial
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-800 px-2.5 py-1 rounded-full">
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full capitalize">
            {status || 'None'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 size={18} className="text-emerald-600 dark:text-emerald-400" />
            Hostel & Business Entity Details
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Commercial registration, tax credentials, and platform license status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getLicenseBadge(owner?.licenseStatus)}
          {getApprovalBadge(owner?.approvalStatus)}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Business / Entity Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={owner?.businessName || ''}
                onChange={(e) => handleFieldChange('businessName', e.target.value)}
                placeholder="e.g. Grand Oak Living Suites"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Business Entity Type
              </label>
              <select
                value={owner?.businessType || 'individual'}
                onChange={(e) => handleFieldChange('businessType', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="individual" className="bg-white dark:bg-slate-900">Individual / Proprietorship</option>
                <option value="partnership" className="bg-white dark:bg-slate-900">Partnership Firm</option>
                <option value="private_limited" className="bg-white dark:bg-slate-900">Private Limited (Pvt Ltd)</option>
                <option value="llp" className="bg-white dark:bg-slate-900">Limited Liability Partnership (LLP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                PAN Number
              </label>
              <div className="relative">
                <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={owner?.panNumber || ''}
                  onChange={(e) => handleFieldChange('panNumber', e.target.value.toUpperCase())}
                  placeholder="e.g. AAACT1234F"
                  maxLength={10}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GSTIN Number
              </label>
              <div className="relative">
                <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={owner?.gstin || ''}
                  onChange={(e) => handleFieldChange('gstin', e.target.value.toUpperCase())}
                  placeholder="e.g. 29AAACT1234F1Z5"
                  maxLength={15}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Business / Trade Name</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
              {owner?.businessName || 'Grand Oak Living Suites'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Entity Type</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block capitalize">
              {owner?.businessType ? owner.businessType.replace('_', ' ') : 'Private Limited'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">PAN Number</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block font-mono text-xs">
              {owner?.panNumber || 'AAACT1234F'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">GSTIN Number</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block font-mono text-xs">
              {owner?.gstin || '29AAACT1234F1Z5'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Operating Wallet</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 inline-flex items-center gap-1">
              <Wallet size={14} className="text-emerald-600 dark:text-emerald-400" />
              ₹{(owner?.walletBalance || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">Platform License</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block capitalize">
              {owner?.licenseStatus || 'Active'} Tier
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
