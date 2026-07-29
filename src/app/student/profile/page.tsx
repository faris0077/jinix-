'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  User as UserIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  GraduationCap,
  Users,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function StudentProfilePage() {
  const { currentUser, rooms } = useChavaraStore();
  const myRoom = rooms.find((r) => r.roomNumber === currentUser.roomNumber) || rooms[0];
  const roommates = myRoom?.students.filter((s) => s.id !== currentUser.id) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-purple-900 to-zinc-950 p-8 text-white shadow-xl border border-violet-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/20 shadow-2xl"
          />
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{currentUser.name}</h1>
              <StatusBadge status="present" size="sm" />
              <span className="text-xs bg-violet-600/40 text-violet-200 px-2.5 py-0.5 rounded-full font-bold border border-violet-400/30">
                Scholar ID: CHV-2024-8891
              </span>
            </div>
            <p className="text-sm text-zinc-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <span>{currentUser.course} ({currentUser.year})</span>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-violet-400" /> {currentUser.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-violet-400" /> {currentUser.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Room Allocation & Emergency Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room & Wing Details */}
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-violet-600" />
              <span>Room & Accommodation Profile</span>
            </h2>
            <span className="text-xs font-bold text-violet-600 bg-violet-100 dark:bg-violet-950/60 px-3 py-1 rounded-full">
              Block {myRoom.block} Wing
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
              <span className="text-xs text-zinc-400 block font-medium">Allocated Room</span>
              <strong className="text-xl font-extrabold text-zinc-900 dark:text-white mt-0.5 block">
                Room {currentUser.roomNumber}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
              <span className="text-xs text-zinc-400 block font-medium">Room Capacity</span>
              <strong className="text-xl font-extrabold text-zinc-900 dark:text-white mt-0.5 block">
                {myRoom.occupied} of {myRoom.capacity} Beds
              </strong>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Roommate(s)</h3>
            {roommates.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No other roommates allocated in this room.</p>
            ) : (
              roommates.map((rm) => (
                <div key={rm.id} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={rm.avatar} alt={rm.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20" />
                    <div>
                      <p className="font-bold text-sm text-zinc-900 dark:text-white">{rm.name}</p>
                      <p className="text-xs text-zinc-500">{rm.course}</p>
                    </div>
                  </div>
                  <StatusBadge status="present" size="sm" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Guardian & Chief Warden Contacts */}
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Guardian & Warden Contacts</span>
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Primary Guardian / Parent
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-zinc-900 dark:text-white">Mr. Rajesh Sharma (Father)</p>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {currentUser.parentPhone || '+91 98765 43211'}
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-1 rounded">
                  Verified SMS
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Assigned Block Warden
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" alt="Warden" className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20" />
                  <div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white">Dr. Sr. Mary Thomas</p>
                    <p className="text-xs text-zinc-500">Chief Warden, Block B (St. Teresa Wing)</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Warden Emergency Helpline: +91 98000 11111')}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Call Helpline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
