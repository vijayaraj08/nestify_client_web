import {
  UserCheck,
  Shield,
  Palette,
  Bell,
  Globe,
  Building2,
  Sliders,
} from 'lucide-react';
import { ROLES } from '../../constants/roles';

export function getSettingsTabsForRole(role) {
  const commonTabs = [
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'language', label: 'Language & Region', icon: Globe },
  ];

  if (role === ROLES.TENANT) {
    return [
      ...commonTabs,
      { id: 'tenant', label: 'Hostel Business Rules', icon: Building2 },
    ];
  }

  if (role === ROLES.END_USER) {
    return [
      ...commonTabs,
      { id: 'resident', label: 'Resident Preferences', icon: UserCheck },
    ];
  }

  if (role === ROLES.SUPER_ADMIN) {
    return [
      ...commonTabs,
      { id: 'platform', label: 'Platform Controls', icon: Sliders },
    ];
  }

  return commonTabs;
}
