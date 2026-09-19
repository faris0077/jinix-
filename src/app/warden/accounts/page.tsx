'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { motion, springs, Stagger, StaggerItem, hoverGlow } from '@/lib/motion';
import { UserPlus, KeyRound, ShieldCheck, ShieldAlert, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { CreateUserModal } from '@/components/ui/CreateUserModal';

export default function ManageAccountsPage() {
  const { users, getAccessToken, isCloudSynced } = useChavaraStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);

  const handleResetPassword = async (userId: string, name: string) => {
    if (!confirm(`Reset ${name}'s password back to their phone number?`)) return;
    setResettingId(userId);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error('Could not reset password', { description: data.error });
        return;
      }
      toast.success(`Password reset for ${name}`, {
        description: `New password: ${data.newPassword} — share this with them directly.`,
        duration: 12000,
      });
    } finally {
      setResettingId(null);
    }
  };

  if (!isCloudSynced) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center space-y-2">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Cloud Login Not Configured</h2>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Account management requires a real Supabase backend. This deployment is running in local demo mode.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <UsersIcon className="w-8 h-8 text-violet-600" />
            Manage Accounts
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Create new student, warden, or director logins, and reset passwords.
          </p>
        </div>
        <motion.button
          onClick={() => setIsCreateOpen(true)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Create New Account
        </motion.button>
      </div>

      <Stagger className="glass-card rounded-3xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
        {users.map((user) => (
          <StaggerItem key={user.id}>
            <motion.div {...hoverGlow} className="p-4 sm:p-5 flex items-center gap-4">
              <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email} · <span className="capitalize">{user.role}</span></p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold shrink-0">
                {user.authUserId ? (
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Login Enabled
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
                    <ShieldAlert className="w-3.5 h-3.5" /> No Login Yet
                  </span>
                )}
              </div>
              <motion.button
                onClick={() => handleResetPassword(user.id, user.name)}
                disabled={!user.authUserId || resettingId === user.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {resettingId === user.id ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>

      <CreateUserModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
