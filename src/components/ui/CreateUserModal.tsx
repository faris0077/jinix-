'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { motion, AnimatePresence, springs, scaleIn } from '@/lib/motion';
import { X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from '@/lib/mock-data';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  role: 'student' as UserRole,
  roomNumber: '',
  block: '',
  course: '',
  year: '',
};

export function CreateUserModal({ open, onOpenChange, onCreated }: CreateUserModalProps) {
  const { getAccessToken } = useChavaraStore();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => {
    onOpenChange(false);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error('Could not create account', { description: data.error });
        return;
      }
      toast.success(`Account created for ${form.name}!`, {
        description: `Initial password (their phone number): ${data.initialPassword} — share this with them directly.`,
        duration: 12000,
      });
      onCreated?.();
      close();
    } catch (err) {
      toast.error('Network error creating account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
            className="pointer-events-auto w-full max-w-md glass-strong rounded-2xl shadow-2xl z-50 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-violet-500" /> Create New Account
              </h3>
              <button onClick={close} className="w-7 h-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                {(['student', 'warden', 'director'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
                      form.role === r ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <Field label="Full Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
              <Field label="Email Address" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
              <Field
                label="Phone Number"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                required
                hint="Becomes their initial login password (last 10 digits)."
              />

              {form.role === 'student' && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Room Number" value={form.roomNumber} onChange={(v) => setForm((f) => ({ ...f, roomNumber: v }))} />
                  <Field label="Block" value={form.block} onChange={(v) => setForm((f) => ({ ...f, block: v }))} />
                  <Field label="Course" value={form.course} onChange={(v) => setForm((f) => ({ ...f, course: v }))} />
                  <Field label="Year" value={form.year} onChange={(v) => setForm((f) => ({ ...f, year: v }))} />
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : `Create ${form.role.charAt(0).toUpperCase() + form.role.slice(1)} Account`}
              </motion.button>
            </form>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      {hint && <p className="text-[11px] text-zinc-500">{hint}</p>}
    </div>
  );
}
