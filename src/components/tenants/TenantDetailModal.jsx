import { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Bed,
  Layers,
  FileText,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import Button from '../ui/Button';
import { formatMsToHumanTime } from '../../utils/timeUtils';

export default function TenantDetailModal({
  isOpen,
  tenant,
  onClose,
  onStatusUpdate,
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !tenant) return null;

  const ownerProfile = tenant.ownerProfile || {};
  const activeLicense = ownerProfile.activeLicenseId || {};
  const hostels = tenant.hostels || [];

  const handleKycAction = async (status) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate?.(tenant._id, {
        approvalStatus: status,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isTrial = activeLicense.isTrial || activeLicense.status === 'trial';
  const expiresAt = activeLicense.expiresAt ? new Date(activeLicense.expiresAt).toLocaleDateString() : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-primary-500/5 via-indigo-500/5 to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {ownerProfile.businessName?.[0] || tenant.name?.[0] || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {ownerProfile.businessName || tenant.name}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    ownerProfile.approvalStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {ownerProfile.approvalStatus || 'Pending'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Managed by {tenant.name} · {tenant.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Active License / Trial Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-primary-500/5 to-transparent border border-primary-200/80 dark:border-primary-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {activeLicense.planName || 'Nestify Starter Trial'}
                  </span>
                  {isTrial && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                      Active Trial
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Key: {activeLicense.licenseKey || 'TRIAL-ACTIVE'} · Valid until {expiresAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-4">
              <div>
                <span className="text-slate-400 block text-[10px]">Bed Quota</span>
                <span>{activeLicense.limits?.maxBeds || 50} Beds</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Properties</span>
                <span>{activeLicense.limits?.maxProperties || 1} Property</span>
              </div>
            </div>
          </div>

          {/* Business & Tax Details */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Business & Operator Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Operator Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{tenant.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Contact Phone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{tenant.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">PAN Number</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {ownerProfile.panNumber || 'Not Provided'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">GSTIN</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {ownerProfile.gstin || 'Not Provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Hostels & Inventory */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Managed Hostels ({hostels.length})</span>
            </h3>

            {hostels.length === 0 ? (
              <div className="p-6 text-center text-slate-400 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50">
                No active hostels registered for this tenant yet.
              </div>
            ) : (
              <div className="space-y-3">
                {hostels.map((hostel) => (
                  <div
                    key={hostel._id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {hostel.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} />
                          {hostel.address?.street ? `${hostel.address.street}, ` : ''}{hostel.address?.city || 'Bangalore'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-normal">Floors</span>
                        <span>{hostel.stats?.totalFloors || 3}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-normal">Rooms</span>
                        <span>{hostel.stats?.totalRooms || 15}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-normal">Total Beds</span>
                        <span className="text-primary-600 dark:text-primary-400 font-bold">
                          {hostel.stats?.totalBeds || 45}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ownerProfile.approvalStatus !== 'approved' && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleKycAction('approved')}
                loading={isUpdating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                Approve Tenant KYC
              </Button>
            )}
            {ownerProfile.approvalStatus === 'approved' && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={15} />
                Verified & Approved Tenant
              </span>
            )}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
