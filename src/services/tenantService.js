import cacheService, { CACHE_KEYS } from './cacheService';
import { API_BASE_URL } from './authService';

/**
 * Demo fallback tenants for testing and offline mode
 */
const DEMO_TENANTS = [
  {
    _id: 'tnt_demo_001',
    name: 'Sarah Jenkins',
    email: 'tenant@hostello.com',
    phone: '+91 98765 12340',
    role: 'TENANT',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Operations Lead at Grand Oak Living Suites.',
    ownerProfile: {
      businessName: 'Grand Oak Living Suites',
      businessType: 'proprietorship',
      panNumber: 'AAAPL1234C',
      gstin: '29AAAPL1234C1Z5',
      approvalStatus: 'approved',
      licenseStatus: 'trial',
      activeLicenseId: {
        _id: 'lic_demo_001',
        licenseKey: 'TRIAL-8F2A-99B1',
        planName: 'Nestify Starter Trial',
        status: 'trial',
        isTrial: true,
        trialDays: 14,
        startDate: Date.now() - 3 * 86400000,
        expiresAt: Date.now() + 11 * 86400000,
        limits: { maxProperties: 1, maxBeds: 50, maxStaffMembers: 5 },
      },
    },
    hostels: [
      {
        _id: 'hst_demo_001',
        name: 'Grand Oak Executive Hostel',
        hostelType: 'co_living',
        address: { city: 'Bangalore', state: 'Karnataka', street: 'Koramangala 4th Block' },
        rules: { curfewTimeMs: 81000000, noticePeriodDays: 30 },
        stats: { totalFloors: 4, totalRooms: 20, totalBeds: 60, occupiedBeds: 48 },
        status: 'active',
      },
    ],
    hostelCount: 1,
    stats: { totalBeds: 60, totalRooms: 20, occupiedBeds: 48, occupancyRate: 80 },
    createdAt: Date.now() - 30 * 86400000,
  },
  {
    _id: 'tnt_demo_002',
    name: 'David Miller',
    email: 'david.miller@horizonstays.in',
    phone: '+91 98111 22334',
    role: 'TENANT',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Founder & CEO at Horizon Heights Co-living.',
    ownerProfile: {
      businessName: 'Horizon Hospitality LLP',
      businessType: 'llp',
      panNumber: 'AABCH5678D',
      gstin: '36AABCH5678D1Z8',
      approvalStatus: 'approved',
      licenseStatus: 'trial',
      activeLicenseId: {
        _id: 'lic_demo_002',
        licenseKey: 'TRIAL-1C4E-77D2',
        planName: 'Nestify Starter Trial',
        status: 'trial',
        isTrial: true,
        trialDays: 14,
        startDate: Date.now() - 1 * 86400000,
        expiresAt: Date.now() + 13 * 86400000,
        limits: { maxProperties: 2, maxBeds: 120, maxStaffMembers: 10 },
      },
    },
    hostels: [
      {
        _id: 'hst_demo_002',
        name: 'Horizon Heights Luxury PG',
        hostelType: 'boys',
        address: { city: 'Hyderabad', state: 'Telangana', street: 'Hitec City Phase 2' },
        rules: { curfewTimeMs: 82800000, noticePeriodDays: 30 },
        stats: { totalFloors: 5, totalRooms: 35, totalBeds: 105, occupiedBeds: 82 },
        status: 'active',
      },
    ],
    hostelCount: 1,
    stats: { totalBeds: 105, totalRooms: 35, occupiedBeds: 82, occupancyRate: 78 },
    createdAt: Date.now() - 15 * 86400000,
  },
  {
    _id: 'tnt_demo_003',
    name: 'Elena Rostova',
    email: 'elena@apexsuites.com',
    phone: '+91 97777 88990',
    role: 'TENANT',
    status: 'pending_approval',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Apex Student Living Spaces.',
    ownerProfile: {
      businessName: 'Apex Student Living',
      businessType: 'private_limited',
      panNumber: 'AABCA9012E',
      gstin: '27AABCA9012E1Z2',
      approvalStatus: 'pending',
      licenseStatus: 'trial',
      activeLicenseId: {
        _id: 'lic_demo_003',
        licenseKey: 'TRIAL-99AA-33FF',
        planName: 'Nestify Starter Trial',
        status: 'trial',
        isTrial: true,
        trialDays: 14,
        startDate: Date.now(),
        expiresAt: Date.now() + 14 * 86400000,
        limits: { maxProperties: 1, maxBeds: 80, maxStaffMembers: 6 },
      },
    },
    hostels: [
      {
        _id: 'hst_demo_003',
        name: 'Apex Girls Campus Stay',
        hostelType: 'girls',
        address: { city: 'Pune', state: 'Maharashtra', street: 'Viman Nagar' },
        rules: { curfewTimeMs: 77400000, noticePeriodDays: 30 },
        stats: { totalFloors: 3, totalRooms: 24, totalBeds: 72, occupiedBeds: 0 },
        status: 'pending_approval',
      },
    ],
    hostelCount: 1,
    stats: { totalBeds: 72, totalRooms: 24, occupiedBeds: 0, occupancyRate: 0 },
    createdAt: Date.now() - 2 * 86400000,
  },
];

const LOCAL_STORAGE_KEY = 'nestify_tenants_cache';

/**
 * Get all tenants from backend API or local cache fallback
 */
export async function getTenants() {
  const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/tenants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (response.ok) {
      const json = await response.json();
      const list = json.data || json;
      if (Array.isArray(list) && list.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
        return list;
      }
    }
  } catch (err) {
    console.warn('[TenantService] Backend API not reachable, using local fallback:', err);
  }

  // Fallback to local storage or demo tenants
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore parse error
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEMO_TENANTS));
  return DEMO_TENANTS;
}

/**
 * Onboard a new tenant with initial hostel and auto-assigned trial license
 */
export async function onboardTenant(payload) {
  const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/tenants/onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const json = await response.json();
      const result = json.data || json;
      
      // Refresh local cache list
      await getTenants();
      return result;
    } else {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to onboard tenant via API.');
    }
  } catch (err) {
    console.warn('[TenantService] Falling back to local tenant creation:', err);

    // Create local demo tenant with 14-day trial
    const nowMs = Date.now();
    const trialDays = payload.trialDays || 14;
    const expiresAt = nowMs + trialDays * 86400000;
    const licenseKey = `TRIAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newTenant = {
      _id: `tnt_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '+91 99999 00000',
      role: 'TENANT',
      status: 'active',
      avatar: payload.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      bio: `Owner & Operator of ${payload.businessName}.`,
      ownerProfile: {
        businessName: payload.businessName,
        businessType: payload.businessType || 'individual',
        panNumber: payload.panNumber ? payload.panNumber.toUpperCase() : '',
        gstin: payload.gstin ? payload.gstin.toUpperCase() : '',
        approvalStatus: 'approved',
        licenseStatus: 'trial',
        activeLicenseId: {
          _id: `lic_${Date.now()}`,
          licenseKey,
          planName: 'Nestify Starter Trial',
          status: 'trial',
          isTrial: true,
          trialDays,
          startDate: nowMs,
          expiresAt,
          limits: { maxProperties: 1, maxBeds: payload.stats?.totalBeds || 50, maxStaffMembers: 5 },
        },
      },
      hostels: [
        {
          _id: `hst_${Date.now()}`,
          name: payload.hostelName,
          hostelType: payload.hostelType || 'co_living',
          address: payload.address || { city: 'Bangalore', state: 'Karnataka', street: 'Main Road' },
          rules: {
            curfewTimeMs: payload.rules?.curfewTimeMs || 81000000,
            noticePeriodDays: payload.rules?.noticePeriodDays || 30,
          },
          floors: payload.floors || [],
          stats: {
            totalFloors: Array.isArray(payload.floors) && payload.floors.length > 0 ? payload.floors.length : 1,
            totalRooms: Array.isArray(payload.floors) ? payload.floors.reduce((acc, f) => acc + (f.rooms?.length || 0), 0) : 0,
            totalBeds: Array.isArray(payload.floors) ? payload.floors.reduce((acc, f) => acc + (f.rooms?.reduce((rAcc, r) => rAcc + Number(r.capacity || 2), 0) || 0), 0) : 0,
            occupiedBeds: 0,
          },
          status: 'active',
        },
      ],
      hostelCount: 1,
      stats: {
        totalFloors: Array.isArray(payload.floors) && payload.floors.length > 0 ? payload.floors.length : 1,
        totalRooms: Array.isArray(payload.floors) ? payload.floors.reduce((acc, f) => acc + (f.rooms?.length || 0), 0) : 0,
        totalBeds: Array.isArray(payload.floors) ? payload.floors.reduce((acc, f) => acc + (f.rooms?.reduce((rAcc, r) => rAcc + Number(r.capacity || 2), 0) || 0), 0) : 0,
        occupiedBeds: 0,
        occupancyRate: 0,
      },
      createdAt: nowMs,
    };

    const current = await getTenants();
    const updated = [newTenant, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    return { tenant: newTenant, hostel: newTenant.hostels[0], license: newTenant.ownerProfile.activeLicenseId };
  }
}

/**
 * Update tenant KYC / approval status
 */
export async function updateTenantStatus(tenantId, statusData) {
  const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/tenants/${tenantId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(statusData),
    });

    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('[TenantService] Status update fallback:', err);
  }

  // Update in local cache
  const current = await getTenants();
  const updated = current.map((t) => {
    if (t._id === tenantId) {
      return {
        ...t,
        status: statusData.status || t.status,
        ownerProfile: {
          ...t.ownerProfile,
          approvalStatus: statusData.approvalStatus || t.ownerProfile?.approvalStatus,
          approvalNotes: statusData.rejectionReason || t.ownerProfile?.approvalNotes,
        },
      };
    }
    return t;
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated.find((t) => t._id === tenantId);
}

/**
 * Get all rooms with Bed Occupancy for a specific Hostel
 */
export async function getHostelRooms(hostelId) {
  const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/tenant/hostels/${hostelId}/rooms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('[TenantService] getHostelRooms fallback:', err);
  }

  return { rooms: [], stats: { totalRooms: 0, totalBeds: 0, occupiedBeds: 0, availableBeds: 0, occupancyRate: 0 } };
}

/**
 * Update Specific Bed Occupancy (e.g. Check-in, Check-out, Maintenance)
 */
export async function updateBedOccupancy(hostelId, roomId, bedNumber, updateData) {
  const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/tenant/hostels/${hostelId}/rooms/${roomId}/beds/${bedNumber}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('[TenantService] updateBedOccupancy fallback:', err);
  }

  return null;
}

export default {
  getTenants,
  onboardTenant,
  updateTenantStatus,
  getHostelRooms,
  updateBedOccupancy,
  DEMO_TENANTS,
};
