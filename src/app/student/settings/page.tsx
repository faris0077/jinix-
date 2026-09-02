'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Settings, ShieldCheck, Bell, Lock, Smartphone, CheckCircle2, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { motion, Stagger, StaggerItem, springs } from '@/lib/motion';

/** Quiet-luxury toggle: the knob glides between sides via a layout animation. */
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 shrink-0 rounded-full p-0.5 flex items-center cursor-pointer transition-colors',
        checked ? 'bg-violet-600 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'
      )}
    >
      <motion.span
        layout
        transition={springs.snappy}
        className="block w-5 h-5 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

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
    <div className="space-y-8 max-w-4xl mx-auto">
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

      <Stagger className="space-y-6">
        {/* Security & Gate Pass Settings */}
        <StaggerItem className="glass-card p-6 rounded-3xl space-y-6">
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
              <ToggleSwitch checked={biometricAuth} onChange={setBiometricAuth} />
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
              <ToggleSwitch checked={parentSMSNotify} onChange={setParentSMSNotify} />
            </div>
          </div>
        </StaggerItem>

        {/* Curfew & Kitchen Alerts */}
        <StaggerItem className="glass-card p-6 rounded-3xl space-y-6">
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
              <ToggleSwitch checked={curfewAlerts} onChange={setCurfewAlerts} />
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
              <ToggleSwitch checked={kitchenCutoffSMS} onChange={setKitchenCutoffSMS} />
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-colors flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Preferences</span>
        </motion.button>
      </div>
    </div>
  );
}
