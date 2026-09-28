import { ROLES, normalizeRole } from '../constants/roles';
import cacheService from './cacheService';

/**
 * Returns default profile data adhering to the backend Mongoose User Schema
 */
export function getDefaultProfileData(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);
  const fullName = user?.name || (role === ROLES.SUPER_ADMIN ? 'Alex Vance' : role === ROLES.TENANT ? 'Sarah Jenkins' : 'Michael Chen');
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const base = {
    name: fullName,
    firstName,
    lastName,
    email: user?.email || (role === ROLES.SUPER_ADMIN ? 'admin@hostello.com' : role === ROLES.TENANT ? 'tenant@hostello.com' : 'resident@hostello.com'),
    phone: user?.phone || '+91 98765 43210',
    isPhoneVerified: true,
    isEmailVerified: true,
    gender: 'male',
    dateOfBirth: '1998-05-15',
    bio: user?.bio || (role === ROLES.SUPER_ADMIN ? 'Head Platform Architect & Super Administrator.' : role === ROLES.TENANT ? 'Property Operations Manager managing hostel suites.' : 'Software engineer & hostel resident.'),
    profilePhoto: user?.profileImage || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    kyc: {
      status: 'verified',
      documentType: 'aadhaar',
      documentNumber: 'XXXX-XXXX-8921',
      documentUrls: [],
      verifiedAt: '2026-01-15T10:00:00.000Z',
    },
    emergencyContact: {
      name: 'Ramesh Sharma',
      relationship: 'parent',
      phone: '+91 98450 12345',
      alternatePhone: '+91 98450 67890',
      address: '124, Green Glen Layout, Bengaluru, Karnataka',
    },
  };

  if (role === ROLES.TENANT || role === ROLES.OWNER) {
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

  if (role === ROLES.END_USER || role === ROLES.RESIDENT) {
    return {
      ...base,
      residentProfile: {
        currentStay: {
          hostelName: 'Grand Oak Living Suites',
          roomNumber: '304-B',
          floorName: 'Floor 3, North Wing',
          bedName: 'Bed 2 (Window Side)',
          checkInDate: '2026-01-01',
          stayStatus: 'active',
        },
        qrCodeId: 'QR-RES-98214-GOL',
        digitalAgreement: {
          isSigned: true,
          signedAt: '2026-01-02T11:30:00.000Z',
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

  return base;
}

/**
 * Fetch profile data for the active user
 */
export async function getProfile(user) {
  try {
    const token = cacheService.get('token') || cacheService.get('hostello_auth_token') || cacheService.get('accessToken');
    if (token) {
      const response = await fetch('/api/v1/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const json = await response.json();
        if (json.data) {
          const apiData = json.data;
          const nameParts = (apiData.name || '').trim().split(' ');
          const result = {
            ...apiData,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            profilePhoto: apiData.avatar || apiData.profilePhoto,
          };
          cacheService.setUserProfile(user?.email, result);
          return result;
        }
      }
    }
  } catch (err) {
    console.warn('API profile fetch fallback to cached/default:', err);
  }

  // Local storage fallback via cacheService
  const saved = cacheService.getUserProfile(user?.email);
  if (saved) {
    return saved;
  }

  return getDefaultProfileData(user);
}

/**
 * Update profile data
 */
export async function updateProfile(user, updatedData) {
  const fullName = `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim() || updatedData.name;
  const payload = {
    ...updatedData,
    name: fullName,
    avatar: updatedData.profilePhoto,
  };

  try {
    const token = cacheService.get('token') || cacheService.get('hostello_auth_token') || cacheService.get('accessToken');
    if (token) {
      const response = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.data) {
          const result = {
            ...json.data,
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            profilePhoto: json.data.avatar || updatedData.profilePhoto,
          };
          cacheService.setUserProfile(user?.email, result);
          return result;
        }
      }
    }
  } catch (err) {
    console.warn('API update failed, updating local storage:', err);
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
