import { useState, useEffect } from 'react';
import {
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ROLES, normalizeRole } from '../constants/roles';
import { getProfile, updateProfile, getDefaultProfileData } from '../services/profileService';
import {
  PersonalInformation,
  ProfilePhoto,
  TenantBusinessInformation,
  EndUserInformation,
  StaffInformation,
  getProfileConfig,
} from '../components/profile';

export default function Profile() {
  const { user, role: rawRole, refreshUser } = useAuth();
  const role = normalizeRole(rawRole || user?.role);
  const config = getProfileConfig(role);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize synchronously with strict role-based data
  const [originalData, setOriginalData] = useState(() => getDefaultProfileData(user));
  const [formData, setFormData] = useState(() => getDefaultProfileData(user));

  useEffect(() => {
    let isMounted = true;

    async function fetchSavedProfile() {
      try {
        const data = await getProfile(user);
        if (isMounted && data) {
          setOriginalData(JSON.parse(JSON.stringify(data)));
          setFormData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to sync profile.');
        }
      }
    }

    fetchSavedProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleFieldChange = (section, field, value) => {
    setFormData((prev) => {
      if (!prev) return prev;
      if (section === 'personal') {
        return { ...prev, [field]: value };
      }
      if (section === 'emergencyContact') {
        return {
          ...prev,
          emergencyContact: { ...prev.emergencyContact, [field]: value },
        };
      }
      if (section === 'ownerProfile' && (role === ROLES.TENANT || role === 'OWNER')) {
        return {
          ...prev,
          ownerProfile: { ...(prev.ownerProfile || {}), [field]: value },
        };
      }
      if (section === 'staffProfile' && role === ROLES.STAFF) {
        return {
          ...prev,
          staffProfile: { ...(prev.staffProfile || {}), [field]: value },
        };
      }
      if (section === 'residentRoommate' && (role === ROLES.END_USER || role === 'RESIDENT')) {
        return {
          ...prev,
          residentProfile: {
            ...(prev.residentProfile || {}),
            roommatePreferences: {
              ...(prev.residentProfile?.roommatePreferences || {}),
              [field]: value,
            },
          },
        };
      }
      if (section === 'residentMess' && (role === ROLES.END_USER || role === 'RESIDENT')) {
        return {
          ...prev,
          residentProfile: {
            ...(prev.residentProfile || {}),
            messSubscription: {
              ...(prev.residentProfile?.messSubscription || {}),
              [field]: value,
            },
          },
        };
      }
      return prev;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoChange = (photoUrl) => {
    setFormData((prev) => ({ ...prev, profilePhoto: photoUrl }));
  };

  const validate = () => {
    const errs = {};
    if (!formData?.firstName?.trim()) {
      errs.firstName = 'First Name is required';
    }
    if (!formData?.lastName?.trim()) {
      errs.lastName = 'Last Name is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const saved = await updateProfile(user, formData);
      setOriginalData(JSON.parse(JSON.stringify(saved)));
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');

      // Update active user in AuthContext
      refreshUser?.({
        name: `${saved.firstName.trim()} ${saved.lastName.trim()}`,
        profileImage: saved.profilePhoto,
      });

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(JSON.parse(JSON.stringify(originalData)));
    setErrors({});
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="w-full space-y-4 pb-8">
      {/* ── Alerts Feedback ── */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in shadow-2xs">
          <Check size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in shadow-2xs">
          <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ── Main Responsive Grid Layout (Horizontal Split) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Avatar Photo & Identity Summary Card */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ProfilePhoto
            photoUrl={formData?.profilePhoto}
            userName={`${formData?.firstName || ''} ${formData?.lastName || ''}`}
            email={formData?.email}
            role={role}
            roleTitle={config.roleTitle}
            userId={user?.id || 'usr-901'}
            isEditing={isEditing}
            saving={saving}
            onPhotoChange={handlePhotoChange}
            onStartEdit={() => setIsEditing(true)}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>

        {/* Right Column: Personal Information & Role Details */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Common Personal Information & Emergency Contact Card */}
          <PersonalInformation
            data={formData}
            isEditing={isEditing}
            errors={errors}
            onChange={handleFieldChange}
          />

          {/* Role-Specific: Owner / Tenant Business & License Information */}
          {(role === ROLES.TENANT || role === 'OWNER') && (
            <TenantBusinessInformation
              data={formData}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
          )}

          {/* Role-Specific: Resident Room & Roommate Preferences Information */}
          {(role === ROLES.END_USER || role === 'RESIDENT') && (
            <EndUserInformation
              data={formData}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
          )}

          {/* Role-Specific: Staff Assignment & Shift Information */}
          {role === ROLES.STAFF && (
            <StaffInformation
              data={formData}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
