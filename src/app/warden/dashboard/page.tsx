'use client';

import React from 'react';
import Link from 'next/link';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Utensils,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  ShoppingBag,
  Truck,
  PackageCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const MOVEMENT_DATA = [
  { time: '06:00', present: 450, outpass: 0, leave: 0 },
  { time: '09:00', present: 420, outpass: 25, leave: 5 },
  { time: '12:00', present: 380, outpass: 60, leave: 10 },
  { time: '15:00', present: 390, outpass: 50, leave: 10 },
  { time: '18:00', present: 410, outpass: 30, leave: 10 },
  { time: '20:30', present: 445, outpass: 2, leave: 3 }, // Curfew check
];

const COURSE_PIE_DATA = [
  { name: 'B.Tech CSE & AI', value: 180, color: '#6D28D9' },
  { name: 'MBA Executive', value: 110, color: '#A855F7' },
  { name: 'M.Sc Biotech', value: 90, color: '#C084FC' },
  { name: 'B.Arch & Design', value: 70, color: '#E879F9' },
];

export default function WardenDashboard() {
  const { currentUser, studentLeaves, users, rooms, complaints, approveLeave, rejectLeave, externalDeliveries, updateDeliveryStatus } = useChavaraStore();

  const totalStudents = users.filter((u) => u.role === 'student').length;
  const pendingLeaves = studentLeaves.filter((l) => l.status === 'pending');
  const activeOutingsCount = studentLeaves.filter((l) => l.type === 'outpass' && l.status === 'approved').length;
  const openComplaintsCount = complaints.filter((c) => c.status !== 'resolved').length;
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const activeDeliveries = externalDeliveries.filter((d) => d.status === 'en-route' || d.status === 'arrived-gate');

  const handleQuickApprove = (id: string, name: string) => {
    approveLeave(id);
    toast.success(`Approved leave request for ${name}!`, {
      description: `Student movement register has been updated.`,
    });
  };

  const handleQuickReject = (id: string, name: string) => {
    rejectLeave(id);
    toast.error(`Rejected request for ${name}.`, {
      description: `Student notified via automated portal alert.`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-purple-900 to-zinc-950 p-6 sm:p-8 text-white shadow-xl border border-violet-500/30">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-violet-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Block B (St. Teresa Wing) Executive Supervisory Console</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Warden Operations Dashboard 🛡️
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl">
              Good day, <strong className="text-white">{currentUser.name}</strong>. You have <strong className="text-amber-400 font-bold">{pendingLeaves.length} pending gate applications</strong> requiring biometric sign-off today.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/warden/approvals"
              className="px-5 py-3 rounded-2xl bg-white text-violet-900 font-bold text-sm shadow-lg hover:bg-violet-50 transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-violet-700" />
              <span>Review Approval Queue ({pendingLeaves.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Bed Occupancy</span>
            <Building2 className="w-5 h-5 text-violet-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {occupiedBeds} / {totalBeds}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              98.8% Full
            </span>
          </div>
          <p className="text-xs text-zinc-500">Total Residents: {totalStudents} Scholars</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group border-amber-500/30">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
            <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {pendingLeaves.length}
            </span>
            <StatusBadge status="pending" size="sm" />
          </div>
          <p className="text-xs text-zinc-500">Needs review before 8:00 PM curfew</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gate Food Orders</span>
            <ShoppingBag className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {activeDeliveries.length}
            </span>
            <span className="text-xs text-orange-600 font-bold bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
              Swiggy / Zomato
            </span>
          </div>
          <p className="text-xs text-zinc-500">External deliveries en route / at gate</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Open Maintenance</span>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {openComplaintsCount}
            </span>
            <span className="text-xs text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Needs IT / Plumbing
            </span>
          </div>
          <p className="text-xs text-zinc-500">Helpdesk tickets in progress</p>
        </div>
      </div>

      {/* Middle Section: Movement Chart & Course Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Movement Area Chart (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <span>24-Hour Campus Gate Movement & Curfew Trajectory</span>
              </h3>
              <p className="text-xs text-zinc-500">Real-time resident check-in/out logs vs curfew threshold</p>
            </div>
            <span className="text-xs font-bold text-violet-600 bg-violet-100 dark:bg-violet-950/60 px-2.5 py-1 rounded-lg">
              Live Register Sync
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOVEMENT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPres" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" vertical={false} />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" name="Scholars Inside Campus" dataKey="present" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPres)" />
                <Area type="monotone" name="Active Outings / Leaves" dataKey="outpass" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Allocation Pie Chart (1 Col) */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              <span>Demographic by Course</span>
            </h3>
            <p className="text-xs text-zinc-500">Distribution of residents in Block B</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COURSE_PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {COURSE_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {COURSE_PIE_DATA.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-zinc-600 dark:text-zinc-400 truncate font-medium">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Swiggy / Zomato Gate Delivery Watchlist */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border-orange-500/25 bg-gradient-to-br from-orange-50/20 via-transparent to-transparent dark:from-orange-950/10">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500 animate-bounce" />
              <span>Gate Delivery Security Watchlist ({activeDeliveries.length} Active Orders)</span>
            </h3>
            <p className="text-xs text-zinc-500">Real-time radar of Swiggy, Zomato, and Instamart couriers arriving at Block B Gate</p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-950/80 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-900">
            Security Gate Feed
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {activeDeliveries.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 italic">
              No active food deliveries en route or waiting at security gate right now.
            </div>
          ) : (
            activeDeliveries.map((deliv) => (
              <div key={deliv.id} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-zinc-900 dark:text-white">{deliv.studentName}</span>
                    <span className="text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded">
                      Room {deliv.roomNumber}
                    </span>
                    <span className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded">
                      {deliv.department || 'B.Tech CS'}
                    </span>
                    <span className="font-bold text-xs bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2.5 py-0.5 rounded-md">
                      {deliv.platform}
                    </span>
                    {deliv.date && (
                      <span className="text-[11px] font-mono text-zinc-400">({deliv.date})</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                    Store: <strong>{deliv.restaurantOrStore}</strong> • Items: {deliv.itemsSummary}
                  </p>
                  <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-2">
                    <span>Expected Gate Arrival: <strong className="text-orange-500">{deliv.expectedTime}</strong></span>
                    {deliv.actualArrivalTime ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Gate Arrival Marked: {deliv.actualArrivalTime}
                      </span>
                    ) : (
                      <span className="text-amber-500 italic">En Route (Awaiting Gate Check-in)</span>
                    )}
                    {deliv.deliveryPartnerPhone && <span>• Partner Phone: {deliv.deliveryPartnerPhone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {deliv.status === 'en-route' ? (
                    <button
                      onClick={() => {
                        updateDeliveryStatus(deliv.id, 'arrived-gate');
                        toast.info(`Marked delivery from ${deliv.platform} as Arrived at Gate! Student alerted.`);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" /> Mark Arrived at Gate
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-xs animate-pulse">
                      🛵 Waiting at Security Gate
                    </span>
                  )}
                  <button
                    onClick={() => {
                      updateDeliveryStatus(deliv.id, 'collected');
                      toast.success(`Delivery collected by ${deliv.studentName}!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <PackageCheck className="w-3.5 h-3.5" /> Sign-off Collected
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Live Approval Feed (Inline Actions) */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border-violet-500/20">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            <span>Live Actionable Approval Queue ({pendingLeaves.length} Pending)</span>
          </h3>
          <Link href="/warden/approvals" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            Open full queue ({studentLeaves.length} total) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3 pt-1">
          {pendingLeaves.length === 0 ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-emerald-800 dark:text-emerald-200">All caught up! Zero pending requests in queue.</p>
            </div>
          ) : (
            pendingLeaves.slice(0, 3).map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-violet-500/40">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-zinc-900 dark:text-white">{req.studentName}</span>
                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/60 px-2 py-0.5 rounded">
                      Room {req.roomNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                      {req.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">{req.reason}</p>
                  <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-2">
                    <span>Expected Window: <strong>{req.startDate}</strong> {req.startTime ? `(${req.startTime} to ${req.endTime})` : `to ${req.endDate || 'N/A'}`}</span>
                    {req.actualArrivalTime ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Arrived at Gate: {req.actualArrivalTime}
                      </span>
                    ) : (
                      <span className="text-amber-500 italic font-medium">Not Arrived Yet</span>
                    )}
                    {req.destination && <span>• Destination: {req.destination}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleQuickApprove(req.id, req.studentName || 'Student')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Pass
                  </button>
                  <button
                    onClick={() => handleQuickReject(req.id, req.studentName || 'Student')}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
