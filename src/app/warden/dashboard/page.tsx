'use client';

import React from 'react';
import Link from 'next/link';
import { useChavaraStore } from '@/lib/store';
import { EmptyState } from '@/components/ui/EmptyState';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  motion,
  AnimatePresence,
  springs,
  fadeIn,
  listItem,
  Stagger,
  StaggerItem,
  Reveal,
  AnimatedNumber,
  TiltCard,
} from '@/lib/motion';
import { toast } from 'sonner';

const CHART_COLORS = ['#0d9488', '#2563eb', '#d97706', '#8b5cf6', '#e11d48'];

export default function WardenDashboard() {
  const { currentUser, studentLeaves, users, rooms, complaints, approveLeave, rejectLeave, externalDeliveries, updateDeliveryStatus } = useChavaraStore();

  const students = users.filter((u) => u.role === 'student');
  const totalStudents = students.length;
  const statusCounts = [
    { label: 'Present', key: 'present' },
    { label: 'On Leave', key: 'on-leave' },
    { label: 'Outpass', key: 'outpass' },
    { label: 'Library', key: 'library' },
  ].map(({ label, key }) => ({ status: label, count: students.filter((u) => u.attendanceToday === key).length }));
  const statusData = statusCounts.some((d) => d.count > 0) ? statusCounts : [];
  const courseMap = students.reduce<Record<string, number>>((acc, u) => {
    const key = u.course?.trim() || 'Not set';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const coursePieData = Object.entries(courseMap).map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }));
  const pendingLeaves = studentLeaves.filter((l) => l.status === 'pending');
  const activeOutingsCount = studentLeaves.filter((l) => l.type === 'outpass' && l.status === 'approved').length;
  const openComplaintsCount = complaints.filter((c) => c.status !== 'resolved').length;
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const occupancyPct = totalBeds > 0 ? `${((occupiedBeds / totalBeds) * 100).toFixed(1)}% Full` : '—';
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
    <div className="space-y-8">
      {/* Hero Banner */}
      <TiltCard max={4} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 hero-surface p-6 sm:p-8 text-white shadow-xl border border-violet-500/30">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-violet-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Warden Supervisory Console</span>
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
      </TiltCard>

      {/* KPI Grid */}
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StaggerItem className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Bed Occupancy</span>
            <Building2 className="w-5 h-5 text-violet-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              <AnimatedNumber value={occupiedBeds} format={(v) => `${Math.round(v)}`} /> / <AnimatedNumber value={totalBeds} format={(v) => `${Math.round(v)}`} />
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              {occupancyPct}
            </span>
          </div>
          <p className="text-xs text-zinc-500">Total Residents: {totalStudents}</p>
        </StaggerItem>

        <StaggerItem className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group border-amber-500/30">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              <AnimatedNumber value={pendingLeaves.length} format={(v) => `${Math.round(v)}`} />
            </span>
            <StatusBadge status="pending" size="sm" />
          </div>
          <p className="text-xs text-zinc-500">Awaiting warden review</p>
        </StaggerItem>

        <StaggerItem className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gate Food Orders</span>
            <ShoppingBag className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              <AnimatedNumber value={activeDeliveries.length} format={(v) => `${Math.round(v)}`} />
            </span>
            <span className="text-xs text-orange-600 font-bold bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
              External
            </span>
          </div>
          <p className="text-xs text-zinc-500">External deliveries en route / at gate</p>
        </StaggerItem>

        <StaggerItem className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Open Maintenance</span>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              <AnimatedNumber value={openComplaintsCount} format={(v) => `${Math.round(v)}`} />
            </span>
            <span className="text-xs text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Open Tickets
            </span>
          </div>
          <p className="text-xs text-zinc-500">Helpdesk tickets in progress</p>
        </StaggerItem>
      </Stagger>

      {/* Middle Section: Movement Chart & Course Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Movement Area Chart (2 Cols) */}
        <Reveal className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <span>Residents by Status Today</span>
              </h3>
              <p className="text-xs text-zinc-500">Current attendance snapshot from the resident register</p>
            </div>
            <span className="text-xs font-bold text-violet-600 bg-violet-100 dark:bg-violet-950/60 px-2.5 py-1 rounded-lg">
              Live Snapshot
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {statusData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" vertical={false} />
                  <XAxis dataKey="status" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }} />
                  <Bar name="Residents" dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Reveal>

        {/* Course Allocation Pie Chart (1 Col) */}
        <Reveal delay={0.08} className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              <span>Demographic by Course</span>
            </h3>
            <p className="text-xs text-zinc-500">Distribution of residents by course</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            {coursePieData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={coursePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {coursePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {coursePieData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-zinc-600 dark:text-zinc-400 truncate font-medium">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Live Swiggy / Zomato Gate Delivery Watchlist */}
      <Reveal className="glass-card p-6 rounded-3xl space-y-4 border-orange-500/25 bg-gradient-to-br from-orange-50/20 via-transparent to-transparent dark:from-orange-950/10">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <span>Gate Delivery Security Watchlist ({activeDeliveries.length} Active Orders)</span>
            </h3>
            <p className="text-xs text-zinc-500">Real-time radar of Swiggy, Zomato, and Instamart couriers arriving at the security gate</p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-950/80 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-900">
            Security Gate Feed
          </span>
        </div>

        <div className="space-y-3 pt-1">
          <AnimatePresence initial={false}>
          {activeDeliveries.length === 0 ? (
            <motion.div key="deliveries-empty" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 italic">
              No active food deliveries en route or waiting at security gate right now.
            </motion.div>
          ) : (
            activeDeliveries.map((deliv) => (
              <motion.div key={deliv.id} variants={listItem} initial="hidden" animate="visible" exit="exit" layout className="p-4 rounded-2xl glass-control shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-zinc-900 dark:text-white">{deliv.studentName}</span>
                    <span className="text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded">
                      Room {deliv.roomNumber}
                    </span>
                    <span className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded">
                      {deliv.department || '—'}
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
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={springs.snappy}
                      onClick={() => {
                        updateDeliveryStatus(deliv.id, 'arrived-gate');
                        toast.info(`Marked delivery from ${deliv.platform} as Arrived at Gate! Student alerted.`);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" /> Mark Arrived at Gate
                    </motion.button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
                      🛵 Waiting at Security Gate
                    </span>
                  )}
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springs.snappy}
                    onClick={() => {
                      updateDeliveryStatus(deliv.id, 'collected');
                      toast.success(`Delivery collected by ${deliv.studentName}!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <PackageCheck className="w-3.5 h-3.5" /> Sign-off Collected
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
          </AnimatePresence>
        </div>
      </Reveal>

      {/* Live Approval Feed (Inline Actions) */}
      <Reveal delay={0.05} className="glass-card p-6 rounded-3xl space-y-4 border-violet-500/20">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Live Actionable Approval Queue ({pendingLeaves.length} Pending)</span>
          </h3>
          <Link href="/warden/approvals" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            Open full queue ({studentLeaves.length} total) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3 pt-1">
          <AnimatePresence initial={false}>
          {pendingLeaves.length === 0 ? (
            <motion.div key="queue-empty" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-emerald-800 dark:text-emerald-200">All caught up! Zero pending requests in queue.</p>
            </motion.div>
          ) : (
            pendingLeaves.slice(0, 3).map((req) => (
              <motion.div key={req.id} variants={listItem} initial="hidden" animate="visible" exit="exit" layout className="p-4 rounded-2xl glass-control shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-violet-500/40">
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
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springs.snappy}
                    onClick={() => handleQuickApprove(req.id, req.studentName || 'Student')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Pass
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springs.snappy}
                    onClick={() => handleQuickReject(req.id, req.studentName || 'Student')}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
          </AnimatePresence>
        </div>
      </Reveal>
    </div>
  );
}
