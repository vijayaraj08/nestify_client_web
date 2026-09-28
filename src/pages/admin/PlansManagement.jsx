import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Check,
  X,
  Edit2,
  Trash2,
  Sparkles,
  ShieldCheck,
  Bed,
  Users,
  CreditCard,
  Layers,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Flame,
  Zap,
  Building,
} from 'lucide-react';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../services/planService';

export default function PlansManagement() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Form State (1 Property, Bed Count Driven)
  const initialFormState = {
    planName: '',
    planCode: '',
    description: '',
    price: 1299,
    currency: 'INR',
    billingCycle: 'monthly',
    durationInDays: 30,
    isTrial: false,
    limits: {
      maxProperties: 1, // 1 property per owner
      maxBeds: 80, // Primary tier quota
      maxStaffMembers: 8,
    },
    featuresConfig: {
      deepAnalytics: false, // Complete Deep Analytics & P&L (US-ADM-015)
      staffShiftManagement: true, // Shift scheduling & photo task proof
      utilityMeterTracking: true, // Electricity & Water sub-meter billing
      automatedGstInvoicing: true, // Tax & GST invoice generator
      multiLanguageSupport: true, // Regional language UI
      prioritySupport: false, // 24/7 dedicated support SLA
    },
    features: [
      '1 Property Management',
      'Automated Rent Reminders (SMS/WhatsApp)',
      'Digital Resident ID Cards & QR Access',
      'Digital Rental Agreement Generator',
    ],
    isActive: true,
    isPublic: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err) {
      setErrorMessage('Failed to load plans: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPlanId(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlanId(plan.id || plan._id);
    setFormData({
      planName: plan.planName || '',
      planCode: plan.planCode || '',
      description: plan.description || '',
      price: plan.price ?? 0,
      currency: plan.currency || 'INR',
      billingCycle: plan.billingCycle || 'monthly',
      durationInDays: plan.durationInDays || 30,
      isTrial: Boolean(plan.isTrial),
      limits: {
        maxProperties: 1,
        maxBeds: plan.limits?.maxBeds ?? 50,
        maxStaffMembers: plan.limits?.maxStaffMembers ?? 5,
      },
      featuresConfig: {
        deepAnalytics: Boolean(plan.featuresConfig?.deepAnalytics),
        staffShiftManagement: Boolean(plan.featuresConfig?.staffShiftManagement),
        utilityMeterTracking: Boolean(plan.featuresConfig?.utilityMeterTracking),
        automatedGstInvoicing: Boolean(plan.featuresConfig?.automatedGstInvoicing),
        multiLanguageSupport: plan.featuresConfig?.multiLanguageSupport !== false,
        prioritySupport: Boolean(plan.featuresConfig?.prioritySupport),
      },
      features: Array.isArray(plan.features) ? [...plan.features] : [],
      isActive: Boolean(plan.isActive),
      isPublic: Boolean(plan.isPublic),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlanId(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.planName?.trim()) errs.planName = 'Plan name is required';
    if (!formData.planCode?.trim()) errs.planCode = 'Plan code is required';
    if (formData.price < 0) errs.price = 'Price cannot be negative';
    if (!formData.limits?.maxBeds || formData.limits.maxBeds <= 0) errs.maxBeds = 'Bed capacity must be greater than 0';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingPlanId) {
        await updatePlan(editingPlanId, formData);
        showNotification('Plan updated successfully!');
      } else {
        await createPlan(formData);
        showNotification('New plan created successfully!');
      }
      handleCloseModal();
      loadPlans();
    } catch (err) {
      showNotification(err.message || 'Failed to save plan', true);
    }
  };

  const handleToggleActive = async (plan) => {
    const id = plan.id || plan._id;
    try {
      await updatePlan(id, { isActive: !plan.isActive });
      setPlans((prev) =>
        prev.map((p) => (p.id === id || p._id === id ? { ...p, isActive: !p.isActive } : p))
      );
      showNotification(`Plan ${!plan.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      showNotification(err.message || 'Failed to toggle status', true);
    }
  };

  const handleDeletePlan = async (plan) => {
    const id = plan.id || plan._id;
    if (window.confirm(`Are you sure you want to delete plan "${plan.planName}"?`)) {
      try {
        await deletePlan(id);
        setPlans((prev) => prev.filter((p) => p.id !== id && p._id !== id));
        showNotification('Plan deleted successfully!');
      } catch (err) {
        showNotification(err.message || 'Failed to delete plan', true);
      }
    }
  };

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeatureInput.trim()],
      }));
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Filtered Plans
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.planCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'trial' && plan.isTrial) ||
      (selectedFilter === 'deep_analytics' && plan.featuresConfig?.deepAnalytics) ||
      (selectedFilter === 'under_100_beds' && (plan.limits?.maxBeds || 0) <= 100 && !plan.isTrial) ||
      (selectedFilter === 'over_100_beds' && (plan.limits?.maxBeds || 0) > 100);

    return matchesSearch && matchesFilter;
  });

  const trialPlan = plans.find((p) => p.isTrial);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ── Notification Alerts ── */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in shadow-2xs">
          <Check size={18} className="text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in shadow-2xs">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ── Top Metric Cards (1 Property / Bed Count Focus) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan Model</span>
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Building size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-black text-slate-900 dark:text-white block">1 Property / License</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Sized by Bed Capacities</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deep Analytics Tiers</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {plans.filter((p) => p.featuresConfig?.deepAnalytics).length}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Premium Plans</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Signup Free Trial</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm font-bold text-blue-900 dark:text-blue-300 truncate">
              {trialPlan ? `${trialPlan.durationInDays}-Day Trial (${trialPlan.limits?.maxBeds} Beds)` : 'None'}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/60">
              Auto
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bed Tiers Range</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bed size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">30 – 400+</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Beds</span>
          </div>
        </div>
      </div>

      {/* ── Control Bar & Action Button ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3.5">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans by name, beds..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex-wrap">
            {[
              { id: 'all', label: 'All Plans' },
              { id: 'trial', label: '3-Day Trial' },
              { id: 'deep_analytics', label: '📊 Deep Analytics' },
              { id: 'under_100_beds', label: '≤ 100 Beds' },
              { id: 'over_100_beds', label: '> 100 Beds' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Create Plan CTA */}
        <button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Bed-Sized Plan</span>
        </button>
      </div>

      {/* ── Plans Grid Display ── */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading plans catalog...</div>
      ) : filteredPlans.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <Layers size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No matching plans found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters or create a new plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
          {filteredPlans.map((plan) => {
            const planId = plan.id || plan._id;
            const hasDeepAnalytics = plan.featuresConfig?.deepAnalytics;

            return (
              <div
                key={planId}
                className={`bg-white dark:bg-slate-900 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
                  plan.isTrial
                    ? 'border-blue-200 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900/40'
                    : hasDeepAnalytics
                    ? 'border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-50 dark:ring-indigo-900/40'
                    : plan.isActive
                    ? 'border-slate-200/90 dark:border-slate-800'
                    : 'border-slate-200 dark:border-slate-800 opacity-70 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">{plan.planName}</h4>
                        {plan.isTrial && (
                          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2 py-0.5 rounded-full uppercase">
                            Trial
                          </span>
                        )}
                        {hasDeepAnalytics && (
                          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <BarChart3 size={10} /> Deep Analytics
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 mt-0.5 block">
                        {plan.planCode} • 1 Property Scope
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleActive(plan)}
                      title={plan.isActive ? 'Deactivate plan' : 'Activate plan'}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {plan.isActive ? (
                        <ToggleRight size={26} className="text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <ToggleLeft size={26} className="text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                  </div>

                  {/* Pricing & Primary Bed Capacity */}
                  <div className="p-3.5 bg-slate-50/90 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
                        per {plan.billingCycle} ({plan.durationInDays} days)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center justify-end gap-1">
                        <Bed size={16} /> {plan.limits?.maxBeds || 50}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Bed Capacity
                      </span>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {plan.description}
                    </p>
                  )}

                  {/* Feature Badges Matrix */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hasDeepAnalytics ? (
                      <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/60 flex items-center gap-1">
                        <Check size={11} className="text-indigo-600 dark:text-indigo-400" /> Deep P&L Analytics
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        Basic Metrics Only
                      </span>
                    )}

                    {plan.featuresConfig?.staffShiftManagement && (
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check size={11} className="text-emerald-600 dark:text-emerald-400" /> Staff Shifts & Photo Proof
                      </span>
                    )}

                    {plan.featuresConfig?.utilityMeterTracking && (
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check size={11} className="text-emerald-600 dark:text-emerald-400" /> Meter Split Billing
                      </span>
                    )}

                    {plan.featuresConfig?.prioritySupport && (
                      <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
                        <Zap size={11} className="text-amber-600 dark:text-amber-400" /> 24/7 Priority SLA
                      </span>
                    )}
                  </div>

                  {/* Included Features Bullet Points */}
                  {plan.features && plan.features.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                        Key Entitlements
                      </span>
                      {plan.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 rounded-b-2xl flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      plan.isActive
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60'
                        : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {plan.isActive ? 'Active for Checkout' : 'Draft / Inactive'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(plan)}
                      className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-colors cursor-pointer"
                      title="Edit Plan"
                    >
                      <Edit2 size={14} />
                    </button>
                    {!plan.isTrial && (
                      <button
                        onClick={() => handleDeletePlan(plan)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-colors cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit Bed-Sized Plan Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingPlanId ? 'Edit Bed-Sized Plan' : 'Create Bed-Sized Subscription Plan'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  1 Property per license. Customize plan based on bed counts and feature unlocks (Deep Analytics, etc.).
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePlan} className="p-5 sm:p-6 space-y-5">
              {/* Section 1: Basic Identity */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Plan Name & Identifier</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Plan Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.planName}
                      onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                      placeholder="e.g. Standard PG (80 Beds)"
                      className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 ${
                        formErrors.planName ? 'border-rose-400 dark:border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.planName && (
                      <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.planName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Unique Plan Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.planCode}
                      onChange={(e) => setFormData({ ...formData, planCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. STANDARD_80_BEDS"
                      className={`w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono uppercase text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 ${
                        formErrors.planCode ? 'border-rose-400 dark:border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.planCode && (
                      <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.planCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Marketing Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description for property owners..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* Section 2: Primary Bed Quota & Staff */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Capacity Limits (1 Property)</h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">1 Property per Owner License</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Max Beds Capacity <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Bed size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        value={formData.limits.maxBeds}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            limits: { ...formData.limits, maxBeds: Number(e.target.value) },
                          })
                        }
                        className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 ${
                          formErrors.maxBeds ? 'border-rose-400 dark:border-rose-500' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      />
                    </div>
                    {formErrors.maxBeds && (
                      <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.maxBeds}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Staff Logins</label>
                    <div className="relative">
                      <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        value={formData.limits.maxStaffMembers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            limits: { ...formData.limits, maxStaffMembers: Number(e.target.value) },
                          })
                        }
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Pricing & Duration */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Pricing & Billing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Billing Cycle</label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 cursor-pointer"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="semi_annual">Semi-Annual</option>
                      <option value="annual">Annual (Yearly)</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.durationInDays}
                      onChange={(e) => setFormData({ ...formData, durationInDays: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isTrial"
                    checked={formData.isTrial}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isTrial: e.target.checked,
                        durationInDays: e.target.checked ? 3 : formData.durationInDays,
                        price: e.target.checked ? 0 : formData.price,
                      })
                    }
                    className="rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <label htmlFor="isTrial" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    Mark as Default 3-Day Signup Free Trial (Auto-provisioned to new owners)
                  </label>
                </div>
              </div>

              {/* Section 4: Feature Entitlements & Deep Analytics Unlocks */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" />
                  Feature Entitlements & Pricing Unlocks
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featuresConfig.deepAnalytics}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuresConfig: { ...formData.featuresConfig, deepAnalytics: e.target.checked },
                        })
                      }
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block flex items-center gap-1">
                        📊 Complete Deep Analytics
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Profit & Loss reports, ADR trends, occupancy forecasting, and financial exports (US-ADM-015).
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featuresConfig.staffShiftManagement}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuresConfig: { ...formData.featuresConfig, staffShiftManagement: e.target.checked },
                        })
                      }
                      className="mt-0.5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        👥 Staff Shifts & Photo Proof
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Housekeeping task checklist with photo verification (US-ADM-034).
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featuresConfig.utilityMeterTracking}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuresConfig: { ...formData.featuresConfig, utilityMeterTracking: e.target.checked },
                        })
                      }
                      className="mt-0.5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        ⚡ Utility Sub-Meter Split Billing
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Electricity & water meter reading delta calculation per room (US-ADM-020).
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featuresConfig.prioritySupport}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuresConfig: { ...formData.featuresConfig, prioritySupport: e.target.checked },
                        })
                      }
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        🛡️ 24/7 Priority Support SLA
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Dedicated phone and WhatsApp escalation hotline for tenant emergencies.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 5: Bullet Features Builder */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Custom Bullets</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Type custom feature bullet..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 sticky bottom-0 bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingPlanId ? 'Save Plan Changes' : 'Create Bed-Sized Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
