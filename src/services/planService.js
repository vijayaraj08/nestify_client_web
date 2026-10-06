import { apiRequest } from './apiClient';

const STORAGE_PLANS_KEY = 'nestify_admin_plans_data';

const DEFAULT_PLANS = [
  {
    id: 'plan_trial_3d',
    _id: 'plan_trial_3d',
    planName: '3-Day Free Trial',
    planCode: 'TRIAL_3D',
    description: 'Auto-provisioned on owner signup for 1 property with essential tools to explore the platform.',
    price: 0,
    currency: 'INR',
    billingCycle: 'daily',
    durationInDays: 3,
    isTrial: true,
    limits: {
      maxProperties: 1,
      maxBeds: 30,
      maxStaffMembers: 2,
    },
    featuresConfig: {
      deepAnalytics: false,
      staffShiftManagement: false,
      utilityMeterTracking: false,
      automatedGstInvoicing: false,
      multiLanguageSupport: true,
      prioritySupport: false,
    },
    features: [
      '1 Property Management',
      'Up to 30 Beds Inventory Capacity',
      'Digital Resident ID Cards & QR Access',
      'Automated Rent Reminders (SMS/WhatsApp)',
      'Digital Rental Agreement Generator',
      'Daily Food & Mess Menu Setup',
    ],
    isActive: true,
    isPublic: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'plan_starter_30',
    _id: 'plan_starter_30',
    planName: 'Micro Hostel (30 Beds)',
    planCode: 'MICRO_30_BEDS',
    description: 'Affordable tier for small independent PGs up to 30 beds with core management tools.',
    price: 599,
    currency: 'INR',
    billingCycle: 'monthly',
    durationInDays: 30,
    isTrial: false,
    limits: {
      maxProperties: 1,
      maxBeds: 30,
      maxStaffMembers: 3,
    },
    featuresConfig: {
      deepAnalytics: false,
      staffShiftManagement: false,
      utilityMeterTracking: false,
      automatedGstInvoicing: true,
      multiLanguageSupport: true,
      prioritySupport: false,
    },
    features: [
      '1 Property Management',
      'Up to 30 Beds Inventory Capacity',
      '3 Staff / Warden Account Logins',
      'Automated Rent Reminders & GST Invoicing',
      'Resident Document Wallet & KYC Archiving',
      'Daily Mess Menu Ratings & Opt-Outs',
      'Standard Support',
    ],
    isActive: true,
    isPublic: true,
    displayOrder: 2,
    createdAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'plan_standard_80',
    _id: 'plan_standard_80',
    planName: 'Standard PG (80 Beds)',
    planCode: 'STANDARD_80_BEDS',
    description: 'For mid-size properties with electricity/water sub-meter billing and staff shift tracking.',
    price: 1299,
    currency: 'INR',
    billingCycle: 'monthly',
    durationInDays: 30,
    isTrial: false,
    limits: {
      maxProperties: 1,
      maxBeds: 80,
      maxStaffMembers: 8,
    },
    featuresConfig: {
      deepAnalytics: false,
      staffShiftManagement: true,
      utilityMeterTracking: true,
      automatedGstInvoicing: true,
      multiLanguageSupport: true,
      prioritySupport: false,
    },
    features: [
      '1 Property Management',
      'Up to 80 Beds Total Capacity',
      '8 Staff Logins with Shift Scheduling',
      'Electricity & Water Meter Split Billing',
      'Staff Task Management & Photo Proof',
      'Visitor Passes & Short-Term Leave Tracking',
      'Automated Rent Reminders & GST Invoicing',
    ],
    isActive: true,
    isPublic: true,
    displayOrder: 3,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'plan_pro_180',
    _id: 'plan_pro_180',
    planName: 'Pro Living (180 Beds + Deep Analytics)',
    planCode: 'PRO_180_BEDS',
    description: 'High-capacity plan unlocking Complete Deep Analytics, P&L Reports, and Priority Escalation.',
    price: 2499,
    currency: 'INR',
    billingCycle: 'monthly',
    durationInDays: 30,
    isTrial: false,
    limits: {
      maxProperties: 1,
      maxBeds: 180,
      maxStaffMembers: 20,
    },
    featuresConfig: {
      deepAnalytics: true,
      staffShiftManagement: true,
      utilityMeterTracking: true,
      automatedGstInvoicing: true,
      multiLanguageSupport: true,
      prioritySupport: true,
    },
    features: [
      '1 Property Management',
      'Up to 180 Beds Capacity',
      'Complete Deep Analytics & Profit/Loss Export',
      'Occupancy & ADR Equivalent Trend Forecasts',
      '20 Staff Logins with Granular RBAC',
      'Staff Shift Scheduling & Photo Verification',
      'Emergency SOS Dispatch & Real-Time Escalation',
      'Electricity & Water Sub-Meter Billing',
      'Priority 24/7 Phone & WhatsApp Support SLA',
    ],
    isActive: true,
    isPublic: true,
    displayOrder: 4,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'plan_enterprise_400',
    _id: 'plan_enterprise_400',
    planName: 'Mega Hostel (400 Beds + Deep Analytics)',
    planCode: 'MEGA_400_BEDS',
    description: 'Full suite for large buildings with unlimited staff, deep analytics, and automated bank reconciliation.',
    price: 4999,
    currency: 'INR',
    billingCycle: 'monthly',
    durationInDays: 30,
    isTrial: false,
    limits: {
      maxProperties: 1,
      maxBeds: 400,
      maxStaffMembers: 50,
    },
    featuresConfig: {
      deepAnalytics: true,
      staffShiftManagement: true,
      utilityMeterTracking: true,
      automatedGstInvoicing: true,
      multiLanguageSupport: true,
      prioritySupport: true,
    },
    features: [
      '1 Property Management',
      'Up to 400 Beds Capacity',
      'Complete Deep Financial & Operational Analytics',
      'Unlimited Staff Logins & Departmental RBAC',
      'Automated Bank Reconciliation & Payout Gateway',
      'Asset Depreciation & Move-Out Damage Auditing',
      'Dedicated Account Manager & 99.9% Uptime SLA',
    ],
    isActive: true,
    isPublic: true,
    displayOrder: 5,
    createdAt: '2026-01-20T00:00:00.000Z',
  },
];

const normalizePlan = (p) => ({
  ...p,
  id: p._id ? p._id.toString() : p.id,
  _id: p._id ? p._id.toString() : p.id,
});

/**
 * Fetch all plans from Database via Backend API
 * GET /api/v1/plans
 */
export async function getPlans(options = {}) {
  const query = options.all !== false ? '?all=true' : '';

  try {
    const response = await apiRequest(`/api/v1/plans${query}`, {
      method: 'GET',
    });

    if (response.ok) {
      const json = await response.json();
      const rawPlans = json.data?.plans || json.data || json.plans;
      if (Array.isArray(rawPlans) && rawPlans.length > 0) {
        const normalized = rawPlans.map(normalizePlan);
        try {
          localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(normalized));
        } catch (e) {
          // ignore storage quota
        }
        return normalized;
      }
    }
  } catch (err) {
    if (err.status === 401) throw err;
    console.warn('[PlanService] Plans fetch notice:', err.message);
  }

  // Local storage cache fallback
  try {
    const saved = localStorage.getItem(STORAGE_PLANS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizePlan);
      }
    }
  } catch (err) {
    console.warn('Could not read cached plans:', err);
  }

  return DEFAULT_PLANS.map(normalizePlan);
}

/**
 * Create a new plan in Database
 * POST /api/v1/plans
 */
export async function createPlan(planData) {
  try {
    const response = await apiRequest('/api/v1/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });

    if (response.ok) {
      const json = await response.json();
      const created = json.data?.plan || json.data || json;
      if (created) {
        const normalized = normalizePlan(created);
        const currentPlans = await getPlans();
        localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify([...currentPlans.filter(p => p.id !== normalized.id), normalized]));
        return normalized;
      }
    }
  } catch (err) {
    if (err.status === 401) throw err;
    console.warn('[PlanService] Plan creation notice:', err.message);
  }

  // Local fallback
  const plans = await getPlans();
  const newPlan = normalizePlan({
    ...planData,
    id: 'plan_' + Date.now(),
    _id: 'plan_' + Date.now(),
    createdAt: new Date().toISOString(),
  });
  const updatedPlans = [...plans, newPlan];
  localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(updatedPlans));
  return newPlan;
}

/**
 * Update an existing plan in Database
 * PUT /api/v1/plans/:id
 */
export async function updatePlan(id, updateData) {
  try {
    const response = await apiRequest(`/api/v1/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const json = await response.json();
      const updated = json.data?.plan || json.data || json;
      if (updated) {
        const normalized = normalizePlan(updated);
        const currentPlans = await getPlans();
        const nextPlans = currentPlans.map((p) => (p.id === id || p._id === id ? normalized : p));
        localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(nextPlans));
        return normalized;
      }
    }
  } catch (err) {
    if (err.status === 401) throw err;
    console.warn('[PlanService] Plan update notice:', err.message);
  }

  // Local fallback
  const plans = await getPlans();
  const updatedPlans = plans.map((p) => (p.id === id || p._id === id ? { ...p, ...updateData } : p));
  localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(updatedPlans));
  return updatedPlans.find((p) => p.id === id || p._id === id);
}

/**
 * Delete a plan from Database
 * DELETE /api/v1/plans/:id
 */
export async function deletePlan(id) {
  try {
    const response = await apiRequest(`/api/v1/plans/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const plans = await getPlans();
      const filtered = plans.filter((p) => p.id !== id && p._id !== id);
      localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(filtered));
      return true;
    }
  } catch (err) {
    if (err.status === 401) throw err;
    console.warn('[PlanService] Plan deletion notice:', err.message);
  }

  // Local fallback
  const plans = await getPlans();
  const filtered = plans.filter((p) => p.id !== id && p._id !== id);
  localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(filtered));
  return true;
}
