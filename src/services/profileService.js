import { ROLES, normalizeRole } from '../constants/roles';
import cacheService, { CACHE_KEYS } from './cacheService';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Returns strictly role-based default profile data.
 * Does NOT initialize unused or empty sub-profiles.
 */
export function getDefaultProfileData(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);
  const fullName = user?.name || (role === ROLES.SUPER_ADMIN ? 'Alex Vance' : role === ROLES.TENANT ? 'Sarah Jenkins' : role === ROLES.STAFF ? 'Rajesh Kumar' : 'Michael Chen');
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Common user base fields
  const base = {
    name: fullName,
    firstName,
    lastName,
    email: user?.email || (role === ROLES.SUPER_ADMIN ? 'admin@hostello.com' : role === ROLES.TENANT ? 'tenant@hostello.com' : role === ROLES.STAFF ? 'staff@hostello.com' : 'resident@hostello.com'),
    phone: user?.phone || '+91 98765 43210',
    isPhoneVerified: true,
    isEmailVerified: true,
    gender: 'male',
    dateOfBirth: '1998-05-15',
    bio: user?.bio || (role === ROLES.SUPER_ADMIN ? 'Head Platform Architect & Super Administrator.' : role === ROLES.TENANT ? 'Property Operations Manager managing hostel suites.' : role === ROLES.STAFF ? 'Senior Hostel Warden & Operations Supervisor.' : 'Software engineer & hostel resident.'),
    profilePhoto: user?.profileImage || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'verified',
      documentType: 'aadhaar',
      documentNumber: 'XXXX-XXXX-8921',
      documentUrls: [],
      verifiedAt: new Date('2026-01-15T10:00:00.000Z').valueOf(),
    },
    emergencyContact: {
      name: 'Ramesh Sharma',
      relationship: 'parent',
      phone: '+91 98450 12345',
      alternatePhone: '+91 98450 67890',
      address: '124, Green Glen Layout, Bengaluru, Karnataka',
    },
  };

  // OWNER / TENANT: Only ownerProfile
  if (role === ROLES.TENANT || role === 'OWNER') {
    return {
      ...base,
      ownerProfile: {
        businessName: 'Grand Oak Living Suites',
        businessType: 'private_limited',
        panNumber: 'AAACT1234F',
        gstin: '29AAACT1234F1Z5',
        approvalStatus: 'approved',
        licenseStatus: 'active',
        walletBalance: 12500,
      },
    };
  }

  // RESIDENT / END_USER: Only residentProfile
  if (role === ROLES.END_USER || role === 'RESIDENT') {
    return {
      ...base,
      residentProfile: {
        currentStay: {
          hostelName: 'Grand Oak Living Suites',
          roomNumber: '304-B',
          floorName: 'Floor 3, North Wing',
          bedName: 'Bed 2 (Window Side)',
          checkInDate: new Date('2026-01-01T00:00:00.000Z').valueOf(),
          stayStatus: 'active',
        },
        qrCodeId: 'QR-RES-98214-GOL',
        digitalAgreement: {
          isSigned: true,
          signedAt: new Date('2026-01-02T11:30:00.000Z').valueOf(),
          agreementPdfUrl: '#',
        },
        messSubscription: {
          isOptedIn: true,
          planType: 'standard',
          dietaryType: 'veg',
        },
        roommatePreferences: {
          dietaryPreference: 'veg_only',
          smokingPreference: 'non_smoker_only',
          sleepSchedule: 'early_bird',
          workingStatus: 'working_professional',
          lifestyleNotes: 'Enjoys quiet study hours and weekend cycling.',
        },
        wallet: {
          balance: 2000,
        },
      },
    };
  }

  // STAFF: Only staffProfile (shift timings and employment date in milliseconds)
  if (role === ROLES.STAFF) {
    return {
      ...base,
      staffProfile: {
        assignedHostels: ['Grand Oak Living Suites'],
        designation: 'Senior Floor Warden',
        department: 'Operations',
        shiftStartMs: 32400000, // 09:00 AM (9 * 3600 * 1000)
        shiftEndMs: 64800000,   // 06:00 PM (18 * 3600 * 1000)
        salary: 28000,
        shiftActiveStatus: true,
        permissions: ['MANAGE_CHECKIN', 'GATE_PASS_APPROVE', 'TASK_LOGGING'],
        employmentDate: new Date('2026-01-10T00:00:00.000Z').valueOf(),
      },
    };
  }

  // SUPER_ADMIN / ADMIN: Common user fields ONLY (NO sub-profiles)
  return base;
}

/**
 * Sanitizes profile data according to the user's role.
 * Removes any sub-profile objects that do NOT apply to this role.
 */
export function sanitizeProfileForRole(role, data) {
  if (!data) return {};
  const normalizedRole = normalizeRole(role);
  const sanitized = { ...data };

  // Strip all sub-profiles first if SUPER_ADMIN
  if (normalizedRole === ROLES.SUPER_ADMIN) {
    delete sanitized.ownerProfile;
    delete sanitized.tenantProfile;
    delete sanitized.residentProfile;
    delete sanitized.staffProfile;
    return sanitized;
  }

  // If TENANT / OWNER: retain only ownerProfile
  if (normalizedRole === ROLES.TENANT || normalizedRole === 'OWNER') {
    delete sanitized.residentProfile;
    delete sanitized.staffProfile;
    return sanitized;
  }

  // If END_USER / RESIDENT: retain only residentProfile
  if (normalizedRole === ROLES.END_USER || normalizedRole === 'RESIDENT') {
    delete sanitized.ownerProfile;
    delete sanitized.tenantProfile;
    delete sanitized.staffProfile;
    return sanitized;
  }

  // If STAFF: retain only staffProfile
  if (normalizedRole === ROLES.STAFF) {
    delete sanitized.ownerProfile;
    delete sanitized.tenantProfile;
    delete sanitized.residentProfile;
    return sanitized;
  }

  return sanitized;
}

/**
 * Fetch profile data for the active user
 */
export async function getProfile(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);

  try {
    const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token') || cacheService.get('accessToken');
    if (token) {
      const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        const apiData = json.data || json;

        if (apiData) {
          const nameParts = (apiData.name || '').trim().split(' ');
          const result = {
            ...apiData,
            firstName: apiData.firstName || nameParts[0] || '',
            lastName: apiData.lastName || nameParts.slice(1).join(' ') || '',
            profilePhoto: apiData.avatar || apiData.profilePhoto,
          };

          // Sanitize to ensure no irrelevant profile objects are returned
          const cleanResult = sanitizeProfileForRole(role, result);
          cacheService.setUserProfile(user?.email, cleanResult);
          return cleanResult;
        }
      }
    }
  } catch (err) {
    console.warn('[ProfileService] API profile fetch fallback to cached/default:', err);
  }

  // Local storage fallback via cacheService
  const saved = cacheService.getUserProfile(user?.email);
  if (saved) {
    return sanitizeProfileForRole(role, saved);
  }

  return getDefaultProfileData(user);
}

/**
 * Update profile data (Strictly role-aware: sends only relevant sub-profile)
 */
export async function updateProfile(user, updatedData) {
  const role = normalizeRole(user?.role || ROLES.END_USER);
  const fullName = `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim() || updatedData.name;

  // 1. Build role-sanitized payload
  const rawPayload = {
    ...updatedData,
    name: fullName,
    avatar: updatedData.profilePhoto,
  };

  const payload = sanitizeProfileForRole(role, rawPayload);

  // 2. Persist to API
  try {
    const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token') || cacheService.get('accessToken');
    if (token) {
      const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const json = await response.json();
        const apiData = json.data || json;
        if (apiData) {
          const result = {
            ...apiData,
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            profilePhoto: apiData.avatar || updatedData.profilePhoto,
          };
          const cleanResult = sanitizeProfileForRole(role, result);
          cacheService.setUserProfile(user?.email, cleanResult);
          return cleanResult;
        }
      }
    }
  } catch (err) {
    console.warn('[ProfileService] API update failed, updating local cache:', err);
  }

  // Fallback cache update via cacheService
  cacheService.setUserProfile(user?.email, payload);
  return payload;
}

/**
 * Upload profile photo
 */
export async function uploadProfilePhoto(file) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    throw new Error('Supported image formats: JPG, JPEG, PNG, WEBP');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be less than 5MB');
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Delete profile photo
 */
export async function deleteProfilePhoto() {
  return null;
}

export default {
  getDefaultProfileData,
  sanitizeProfileForRole,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
};
