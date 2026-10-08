import cacheService, { CACHE_KEYS } from './cacheService';
import { API_BASE_URL } from './authService';
import { apiRequest } from './apiClient';

const LOCAL_STORAGE_KEY = 'nestify_tenants_cache';

/**
 * Get all tenants from backend API or local cache
 */
export async function getTenants() {
  try {
    const response = await apiRequest('/api/v1/admin/tenants', {
      method: 'GET',
    });

    if (response.ok) {
      const json = await response.json();
      const list = json.data?.tenants || json.data || json;
      if (Array.isArray(list)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
        return list;
      }
    }
  } catch (err) {
    if (err.status === 401) throw err;
    console.warn('[TenantService] Backend API not reachable for tenants:', err);
  }

  // Fallback to local storage if available, otherwise empty list
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore parse error
    }
  }

  return [];
}

/**
 * Onboard a new tenant with initial hostel and auto-assigned trial license
 */
export async function onboardTenant(payload) {
  try {
    const response = await apiRequest('/api/v1/admin/tenants/onboard', {
      method: 'POST',
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
    if (err.status === 401) throw err;
    console.warn('[TenantService] Falling back to local tenant creation:', err);

    // Create local record for instant UI responsiveness
    const nowMs = Date.now();
    const trialDays = payload.trialDays || 14;
    const expiresAt = nowMs + trialDays * 86400000;
    const licenseKey = `TRIAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newTenant = {
      _id: `tnt_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      role: 'TENANT',
      status: 'active',
      avatar: payload.avatar || null,
      bio: `Owner & Operator of ${payload.businessName || payload.hostelName}.`,
      ownerProfile: {
        businessName: payload.businessName || payload.hostelName,
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
          limits: { maxProperties: 1, maxBeds: 50, maxStaffMembers: 5 },
        },
      },
      hostels: [
        {
          _id: `hst_${Date.now()}`,
          name: payload.hostelName,
          hostelType: payload.hostelType || 'co_living',
          address: payload.address || { city: 'Bangalore', state: 'Karnataka', street: '' },
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
  try {
    const response = await apiRequest(`/api/v1/admin/tenants/${tenantId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });

    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    if (err.status === 401) throw err;
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
 * Update Full Tenant Information (Business, Contact, KYC, Primary Hostel)
 * PUT /api/v1/admin/tenants/:id
 */
export async function updateTenant(tenantId, updateData) {
  try {
    const response = await apiRequest(`/api/v1/admin/tenants/${tenantId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const json = await response.json();
      const updatedTenant = json.data || json;
      if (updatedTenant) {
        // Update local cache
        const current = await getTenants();
        const nextList = current.map((t) => (t._id === tenantId ? { ...t, ...updatedTenant } : t));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextList));
        return updatedTenant;
      }
    }
  } catch (err) {
    if (err.status === 401) throw err;
    console.warn('[TenantService] Update tenant notice:', err.message);
  }

  // Local fallback
  const current = await getTenants();
  const nextList = current.map((t) => {
    if (t._id === tenantId) {
      return {
        ...t,
        name: updateData.name || t.name,
        phone: updateData.phone || t.phone,
        bio: updateData.bio !== undefined ? updateData.bio : t.bio,
        status: updateData.status || t.status,
        ownerProfile: {
          ...t.ownerProfile,
          businessName: updateData.businessName || t.ownerProfile?.businessName,
          panNumber: updateData.panNumber || t.ownerProfile?.panNumber,
          gstin: updateData.gstin || t.ownerProfile?.gstin,
          approvalStatus: updateData.approvalStatus || t.ownerProfile?.approvalStatus,
        },
      };
    }
    return t;
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextList));
  return nextList.find((t) => t._id === tenantId);
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
      credentials: 'include',
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
      credentials: 'include',
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
  updateTenant,
  updateTenantStatus,
  getHostelRooms,
  updateBedOccupancy,
};
