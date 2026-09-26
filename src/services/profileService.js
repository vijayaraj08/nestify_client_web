import { ROLES, normalizeRole } from '../constants/roles';

const STORAGE_PROFILE_KEY = 'hostello_user_profile_data';

// Default initial data generator based on user & role
export function getDefaultProfileData(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);
  const nameParts = (user?.name || '').trim().split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';

  const base = {
    firstName,
    lastName,
    email: user?.email || 'user@hostello.com',
    dob: '1998-05-15',
    sex: 'Male',
    address: {
      line1: '124, Green Glen Layout, Bellandur',
      line2: 'Near EcoSpace Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
    },
    profilePhoto: user?.profileImage || null,
  };

  if (role === ROLES.TENANT) {
    return {
      ...base,
      business: {
        businessName: 'Sunshine Grand Hostels & Living',
        businessType: 'Co-Living & PG Management',
        businessEmail: 'contact@sunshinehostels.com',
        businessPhone: '+91 98765 43210',
        registrationNo: 'GSTIN29AABCT1332F1Z6',
        description: 'Premium student and working professional accommodation with modern amenities.',
        address: {
          line1: 'Plot 45, Sarjapur Main Road',
          line2: 'Opposite Wipro Gate 2',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560035',
          country: 'India',
        },
        photos: [
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80',
        ],
      },
    };
  }

  if (role === ROLES.END_USER) {
    return {
      ...base,
      resident: {
        emergencyContactName: 'Ramesh Sharma',
        emergencyContactPhone: '+91 98450 12345',
        emergencyRelation: 'Father',
        governmentIdType: 'Aadhaar Card',
        governmentIdNumber: 'XXXX-XXXX-8921',
        occupation: 'Software Engineer',
        status: 'Working Professional',
        employerOrCollege: 'Initech Systems India Pvt Ltd',
      },
    };
  }

  // Super Admin
  return base;
}

/**
 * Fetch profile data for the active user
 */
export async function getProfile(user) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  try {
    const saved = localStorage.getItem(`${STORAGE_PROFILE_KEY}_${user?.email}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Could not read cached profile:', err);
  }
  const defaultData = getDefaultProfileData(user);
  return defaultData;
}

/**
 * Update profile data
 */
export async function updateProfile(user, updatedData) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!updatedData.firstName?.trim()) {
    throw new Error('First Name is required');
  }
  if (!updatedData.lastName?.trim()) {
    throw new Error('Last Name is required');
  }

  try {
    localStorage.setItem(
      `${STORAGE_PROFILE_KEY}_${user?.email}`,
      JSON.stringify(updatedData)
    );
  } catch (err) {
    console.warn('Could not cache profile:', err);
  }

  return updatedData;
}

/**
 * Upload profile photo
 */
export async function uploadProfilePhoto(file) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Validate format
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    throw new Error('Supported image formats: JPG, JPEG, PNG, WEBP');
  }

  // Validate size (max 5MB)
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
  await new Promise((resolve) => setTimeout(resolve, 300));
  return null;
}
