import { ROLES } from '../../constants/roles';

export const profileConfig = {
  [ROLES.SUPER_ADMIN]: {
    roleTitle: 'Super Administrator',
    badgeVariant: 'primary',
    sections: ['personal'],
    description: 'Manage your personal profile and platform administrator credentials.',
  },
  [ROLES.TENANT]: {
    roleTitle: 'Hostel Property Manager & Owner',
    badgeVariant: 'emerald',
    sections: ['personal', 'business'],
    description: 'Manage your personal details, business entity, property profile, and license details.',
  },
  [ROLES.END_USER]: {
    roleTitle: 'Hostel Resident & Member',
    badgeVariant: 'indigo',
    sections: ['personal', 'resident'],
    description: 'Manage your personal details, emergency contacts, identity verification, and stay records.',
  },
  [ROLES.STAFF]: {
    roleTitle: 'Hostel Staff Member',
    badgeVariant: 'amber',
    sections: ['personal', 'staff'],
    description: 'Manage your personal details, shift timings, assigned hostels, and operational role.',
  },
};

export function getProfileConfig(role) {
  return profileConfig[role] || profileConfig[ROLES.END_USER];
}
