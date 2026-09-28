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

/**
 * Fetch all plans
 */
export async function getPlans() {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const response = await fetch('/api/v1/plans', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (response.ok) {
      const json = await response.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend plans fetch fallback to local cache:', err);
  }

  // Local storage cache fallback
  try {
    const saved = localStorage.getItem(STORAGE_PLANS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Could not read cached plans:', err);
  }

  // Initialize with default single-property bed-count-driven plans
  try {
    localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(DEFAULT_PLANS));
  } catch (e) {
    // Ignore storage quota error
  }

  return DEFAULT_PLANS;
}

/**
 * Create a new plan
 */
export async function createPlan(planData) {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  try {
    const response = await fetch('/api/v1/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(planData),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.data) return json.data;
    }
  } catch (err) {
    console.warn('Backend plan creation fallback to local cache:', err);
  }

  // Local fallback
  const plans = await getPlans();
  const newPlan = {
    ...planData,
    id: 'plan_' + Date.now(),
    _id: 'plan_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const updatedPlans = [...plans, newPlan];
  localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(updatedPlans));
  return newPlan;
}

/**
 * Update an existing plan
 */
export async function updatePlan(id, updateData) {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  try {
    const response = await fetch(`/api/v1/plans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.data) return json.data;
    }
  } catch (err) {
    console.warn('Backend plan update fallback to local cache:', err);
  }

  // Local fallback
  const plans = await getPlans();
  const updatedPlans = plans.map((p) => (p.id === id || p._id === id ? { ...p, ...updateData } : p));
  localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(updatedPlans));
  return updatedPlans.find((p) => p.id === id || p._id === id);
}

/**
 * Delete a plan
 */
export async function deletePlan(id) {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  try {
    const response = await fetch(`/api/v1/plans/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (response.ok) return true;
  } catch (err) {
    console.warn('Backend plan deletion fallback to local cache:', err);
  }

  // Local fallback
  const plans = await getPlans();
  const filtered = plans.filter((p) => p.id !== id && p._id !== id);
  localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(filtered));
  return true;
}
