import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Receipt,
  Wrench,
  DoorOpen,
  UtensilsCrossed,
  Volume2,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';

export default function NotificationSettings({ settings, onChange }) {
  const notifications = settings?.notifications || {
    inAppPush: true,
    emailNotifications: true,
    smsNotifications: false,
    whatsappUpdates: true,
    rentReminders: true,
    maintenanceAlerts: true,
    gatePassAlerts: true,
    messMenuAlerts: true,
    announcements: true,
    frequency: 'instant',
  };

  const [testNotification, setTestNotification] = useState(null);

  const triggerTestNotification = () => {
    setTestNotification({
      title: 'Payment Received: ₹12,500',
      message: 'Rent payment for Bed A-204 verified via UPI. Receipt #REC-8921 generated.',
      time: 'Just now',
    });
    setTimeout(() => {
      setTestNotification(null);
    }, 4500);
  };

  const channels = [
    {
      key: 'inAppPush',
      title: 'In-App Web Push',
      description: 'Real-time browser notifications and top bar alerts.',
      icon: Bell,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50',
    },
    {
      key: 'emailNotifications',
      title: 'Email Delivery',
      description: 'Monthly tax invoices, booking contracts, and KYC confirmations.',
      icon: Mail,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50',
    },
    {
      key: 'whatsappUpdates',
      title: 'WhatsApp Business Alerts',
      description: 'Instant rent payment links, gate passes, and warden check-in notices.',
      icon: MessageSquare,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50',
    },
    {
      key: 'smsNotifications',
      title: 'Direct SMS Gate Alerts',
      description: 'Critical gate curfew reminders and OTP verification messages.',
      icon: Smartphone,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50',
    },
  ];

  const operationalTriggers = [
    {
      key: 'rentReminders',
      title: 'Rent Billing & Overdue Alerts',
      description: 'Automatic reminder sent 3 days before invoice due date.',
      icon: Receipt,
    },
    {
      key: 'maintenanceAlerts',
      title: 'Maintenance & Complaint Resolution',
      description: 'Instant updates when tickets are acknowledged, assigned, or closed.',
      icon: Wrench,
    },
    {
      key: 'gatePassAlerts',
      title: 'Gate Pass & Curfew Verification',
      description: 'Alerts when visitor admissions or late-night permissions are logged.',
      icon: DoorOpen,
    },
    {
      key: 'messMenuAlerts',
      title: 'Daily Mess Menu & Meal Feedback',
      description: 'Daily breakfast, lunch, and dinner menu publication notifications.',
      icon: UtensilsCrossed,
    },
    {
      key: 'announcements',
      title: 'Hostel Announcements & Circulars',
      description: 'Important hostel management notices and platform maintenance news.',
      icon: Volume2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Test Notification Toast ── */}
      {testNotification && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-primary-500 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white">{testNotification.title}</p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {testNotification.time}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{testNotification.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTestNotification(null)}
            className="text-xs text-slate-400 hover:text-white cursor-pointer px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Delivery Channels ── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notification Channels & Routing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure preferred delivery destinations for announcements and invoices.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={triggerTestNotification}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Send size={13} />
            <span>Send Test Alert</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {channels.map((ch) => {
            const Icon = ch.icon;
            const isChecked = notifications[ch.key] ?? true;

            return (
              <div
                key={ch.key}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isChecked
                    ? 'border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-900/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700/80 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${ch.color} shrink-0 mt-0.5`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{ch.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {ch.description}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onChange?.('notifications', ch.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Operational Event Triggers ── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Operational Event Triggers
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Specify which hostel operations should trigger automatic member notifications.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/80">
          {operationalTriggers.map((item) => {
            const Icon = item.icon;
            const isChecked = notifications[item.key] ?? true;

            return (
              <div key={item.key} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onChange?.('notifications', item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Frequency & Digest Preferences ── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Digest & Batching Frequency
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'instant', label: 'Instant Real-Time', desc: 'Deliver alerts immediately as events happen' },
            { id: 'daily_digest', label: 'Daily Morning Digest', desc: 'Consolidated summary sent once at 09:00 AM' },
            { id: 'weekly_summary', label: 'Weekly Executive Brief', desc: 'Weekly roundup of bookings and collections' },
          ].map((freq) => {
            const isSelected = (notifications.frequency || 'instant') === freq.id;
            return (
              <button
                key={freq.id}
                type="button"
                onClick={() => onChange?.('notifications', 'frequency', freq.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/30 ring-2 ring-primary-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {freq.label}
                  </span>
                  {isSelected && <CheckCircle2 size={14} className="text-primary-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{freq.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
