import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';

export default function NotificationSettings({ settings, onChange }) {
  const notifications = settings?.notifications || {};

  const toggleItems = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive monthly rent receipts, KYC alerts, and invoices via registered email.',
      icon: Mail,
    },
    {
      key: 'pushNotifications',
      title: 'Web & Mobile Push Alerts',
      description: 'Get real-time updates for complaints, approvals, and hostel announcements.',
      icon: Bell,
    },
    {
      key: 'smsNotifications',
      title: 'SMS Alerts',
      description: 'Receive critical gate pass curfew reminders and OTPs directly via SMS.',
      icon: Smartphone,
    },
    {
      key: 'rentReminders',
      title: 'Payment & Rent Reminders',
      description: 'Notify 3 days before monthly rent invoice due date.',
      icon: MessageSquare,
    },
    {
      key: 'maintenanceAlerts',
      title: 'Maintenance Status Updates',
      description: 'Get notified when an open complaint is assigned, in-progress, or resolved.',
      icon: Bell,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Bell size={18} className="text-primary-600" />
          Notification Preferences
        </h3>
        <p className="text-xs text-slate-500">
          Control how and when you receive communication from Hostello.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {toggleItems.map((item) => {
          const Icon = item.icon;
          const isChecked = notifications[item.key] ?? true;

          return (
            <div key={item.key} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0 mt-0.5">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => onChange?.('notifications', item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
