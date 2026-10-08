import React, { useState } from 'react';
import {
  X,
  User,
  Bed,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Trash2,
  ShieldCheck,
  Wrench,
  Clock,
} from 'lucide-react';
import Button from '../ui/Button';

/**
 * Modal to Allocate Resident, Vacate Bed, or Update Bed Maintenance Status
 */
export default function BedAllocationModal({
  isOpen,
  onClose,
  room,
  bed,
  onSaveAllocation,
}) {
  if (!isOpen || !bed || !room) return null;

  const isOccupied = Boolean(bed.isOccupied);

  const [formData, setFormData] = useState({
    residentName: bed.residentId?.name || bed.residentName || '',
    residentEmail: bed.residentId?.email || bed.residentEmail || '',
    residentPhone: bed.residentId?.phone || bed.residentPhone || '',
    monthlyRent: bed.monthlyRent || room.monthlyRent || 8500,
    status: bed.status || (isOccupied ? 'occupied' : 'available'),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!formData.residentName.trim()) {
      setErrorMsg('Please enter the resident full name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveAllocation(room._id, bed.bedNumber, {
        isOccupied: true,
        status: 'occupied',
        monthlyRent: Number(formData.monthlyRent),
        residentName: formData.residentName.trim(),
        residentEmail: formData.residentEmail.trim(),
        residentPhone: formData.residentPhone.trim(),
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to allocate bed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVacate = async () => {
    if (!window.confirm(`Are you sure you want to vacate Bed ${bed.bedNumber}?`)) return;

    setIsSubmitting(true);
    try {
      await onSaveAllocation(room._id, bed.bedNumber, {
        isOccupied: false,
        residentId: null,
        residentName: '',
        status: 'available',
        monthlyRent: Number(formData.monthlyRent),
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to vacate bed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsSubmitting(true);
    try {
      await onSaveAllocation(room._id, bed.bedNumber, {
        isOccupied: newStatus === 'occupied',
        status: newStatus,
        monthlyRent: Number(formData.monthlyRent),
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isOccupied
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
              }`}
            >
              <Bed size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Bed {bed.bedNumber} Management
              </h3>
              <p className="text-[11px] text-slate-400">
                Room {room.roomNumber} • {room.floorName || `Floor ${room.floorNumber}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Content */}
        {isOccupied ? (
          /* ================= OCCUPIED BED DETAILS ================= */
          <div className="p-5 space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                  Currently Occupied
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  ₹{bed.monthlyRent || room.monthlyRent}/mo
                </span>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                  <User size={15} className="text-rose-500" />
                  <span>{bed.residentId?.name || bed.residentName || 'Active Resident'}</span>
                </div>

                {(bed.residentId?.phone || bed.residentPhone) && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone size={14} />
                    <span>{bed.residentId?.phone || bed.residentPhone}</span>
                  </div>
                )}

                {(bed.residentId?.email || bed.residentEmail) && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail size={14} />
                    <span>{bed.residentId?.email || bed.residentEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('maintenance')}
                disabled={isSubmitting}
                className="text-xs flex items-center gap-1.5"
              >
                <Wrench size={13} />
                Set Maintenance
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleVacate}
                loading={isSubmitting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 size={13} />
                Vacate Bed & Check-out
              </Button>
            </div>
          </div>
        ) : (
          /* ================= ALLOCATE RESIDENT FORM ================= */
          <form onSubmit={handleAllocate} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Resident Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.residentName}
                onChange={(e) => handleChange('residentName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.residentPhone}
                  onChange={(e) => handleChange('residentPhone', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleChange('monthlyRent', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="rahul.sharma@example.com"
                value={formData.residentEmail}
                onChange={(e) => handleChange('residentEmail', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleStatusChange(
                    bed.status === 'maintenance' ? 'available' : 'maintenance'
                  )
                }
                className="text-xs text-slate-500"
              >
                {bed.status === 'maintenance' ? 'Mark Available' : 'Mark Maintenance'}
              </Button>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Allocate & Check-In
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
