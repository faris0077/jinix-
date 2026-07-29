'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Settings, ShieldCheck, Bell, Lock, Smartphone, CheckCircle2, Moon } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentSettingsPage() {
  const { currentUser } = useChavaraStore();
  
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [curfewAlerts, setCurfewAlerts] = useState(true);
  const [kitchenCutoffSMS, setKitchenCutoffSMS] = useState(true);
  const [parentSMSNotify, setParentSMSNotify] = useState(true);

  const handleSave = () => {
    toast.success('Preferences saved successfully!', {
      description: 'Your biometric security and notification alerts have been updated.',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-violet-600" />
          <span>Security & Notification Preferences</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your campus biometric gate pass settings, SMS curfew reminders, and privacy controls.
        </p>
      </div>

      <div className="space-y-6">
        {/* Security & Gate Pass Settings */}
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">Campus Security & Biometrics</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
              <div className="space-y-0.5">
                <label className="font-bold text-sm text-zinc-900 dark:text-white block">
                  Biometric Facial & Fingerprint Gate Verification
                </label>
                <p className="text-xs text-zinc-500">
                  Allow campus security turnstiles to verify your movement logs using digital ID verification.
                </p>
              </div>
              <input
                type="checkbox"
                checked={biometricAuth}
                onChange={(e) => setBiometricAuth(e.target.checked)}
                className="rounded-full border-zinc-300 text-violet-600 focus:ring-violet-500 w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
              <div className="space-y-0.5">
                <label className="font-bold text-sm text-zinc-900 dark:text-white block">
                  Parent SMS Notification for Outing Departure & Return
                </label>
                <p className="text-xs text-zinc-500">
                  Automatically send SMS check-in/check-out confirmation to primary guardian ({currentUser.parentPhone || '+91 98765 43211'}).
                </p>
              </div>
              <input
                type="checkbox"
                checked={parentSMSNotify}
                onChange={(e) => setParentSMSNotify(e.target.checked)}
                className="rounded-full border-zinc-300 text-violet-600 focus:ring-violet-500 w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Curfew & Kitchen Alerts */}
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <Bell className="w-5 h-5 text-violet-600" />
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">Curfew & Meal Cutoff Reminders</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
              <div className="space-y-0.5">
                <label className="font-bold text-sm text-zinc-900 dark:text-white block">
                  Evening Curfew Warning Alerts (08:00 PM)
                </label>
                <p className="text-xs text-zinc-500">
                  Receive high-priority push notifications 30 minutes before main gate curfew closing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={curfewAlerts}
                onChange={(e) => setCurfewAlerts(e.target.checked)}
                className="rounded-full border-zinc-300 text-violet-600 focus:ring-violet-500 w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
              <div className="space-y-0.5">
                <label className="font-bold text-sm text-zinc-900 dark:text-white block">
                  Kitchen Meal Cutoff Countdown SMS
                </label>
                <p className="text-xs text-zinc-500">
                  Notify me via SMS 1 hour prior to breakfast, lunch, and dinner cutoff timers.
                </p>
              </div>
              <input
                type="checkbox"
                checked={kitchenCutoffSMS}
                onChange={(e) => setKitchenCutoffSMS(e.target.checked)}
                className="rounded-full border-zinc-300 text-violet-600 focus:ring-violet-500 w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
}
