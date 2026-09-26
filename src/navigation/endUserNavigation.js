import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  FileText,
  Bell,
  User,
} from 'lucide-react';
import { ROLES } from '../constants/roles';

export const endUserNavigation = [
  {
    id: 'user-dashboard',
    label: 'Dashboard',
    path: '/user/dashboard',
    icon: LayoutDashboard,
    roles: [ROLES.END_USER],
  },
  {
    id: 'user-booking',
    label: 'My Booking',
    path: '/user/booking',
    icon: CalendarCheck,
    roles: [ROLES.END_USER],
  },
  {
    id: 'user-room',
    label: 'Room & Bed',
    path: '/user/room',
    icon: BedDouble,
    roles: [ROLES.END_USER],
  },
  {
    id: 'user-payments',
    label: 'Payments & Rent',
    path: '/user/payments',
    icon: CreditCard,
    roles: [ROLES.END_USER],
  },
  {
    id: 'user-complaints',
    label: 'Complaints & Requests',
    path: '/user/complaints',
    icon: MessageSquareWarning,
    badge: '1',
    roles: [ROLES.END_USER],
  },
  {
    id: 'user-documents',
    label: 'Documents & KYC',
    path: '/user/documents',
    icon: FileText,
    roles: [ROLES.END_USER],
  },
  {
    id: 'user-notifications',
    label: 'Notifications',
    path: '/user/notifications',
    icon: Bell,
    roles: [ROLES.END_USER],
  },
  {
    id: 'user-profile',
    label: 'Profile & Settings',
    path: '/user/profile',
    icon: User,
    roles: [ROLES.END_USER],
  },
];
