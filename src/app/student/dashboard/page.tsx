'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useChavaraStore } from '@/lib/store';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Timeline } from '@/components/ui/Timeline';
import {
  Home,
  Plus,
  BookOpen,
  Utensils,
  CreditCard,
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Building2,
  Users,
  ShoppingBag,
  Megaphone
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  motion,
  AnimatePresence,
  TiltCard,
  Stagger,
  StaggerItem,
  Reveal,
  AnimatedNumber,
  hoverLift,
  listItem,
  springs,
} from '@/lib/motion';

export default function StudentDashboard() {
  const store = useChavaraStore() as any; // Cast to bypass missing export if any
  const { currentUser, studentLeaves, foodOrders, feePayments, complaints, rooms, externalDeliveries } = store;
  const notices = store.notices || [];

  const myRoom = currentUser.roomNumber ? rooms.find((r: any) => r.roomNumber === currentUser.roomNumber) : undefined;
  const roommates = myRoom?.students.filter((s: any) => s.id !== currentUser.id) || [];
  const pendingLeavesCount = studentLeaves.filter((l: any) => l.status === 'pending').length;
  const approvedLeaves = studentLeaves.filter((l: any) => l.status === 'approved');
  const activePass = approvedLeaves[0];
  const mealsOrderedCount = foodOrders.filter((f: any) => f.ordered).length;
  const pendingFeesAmount = feePayments.filter((f: any) => f.status === 'pending' || f.status === 'overdue').reduce((acc: any, curr: any) => acc + curr.amount, 0);
  const nextDue = feePayments
    .filter((f: any) => f.status === 'pending' || f.status === 'overdue')
    .map((f: any) => f.dueDate)
    .filter(Boolean)
    .sort()[0];
  const leaveTypeLabels: Record<string, string> = { general: 'General', home: 'Home', outpass: 'Outpass', library: 'Library', class: 'Class' };
  const leaveTypeData = Object.keys(leaveTypeLabels)
    .map((t) => ({ type: leaveTypeLabels[t], count: studentLeaves.filter((l: any) => l.type === t).length }))
    .filter((d) => d.count > 0);
  const myActiveDeliveries = externalDeliveries.filter((d: any) => (d.studentId === currentUser.id || currentUser.role !== 'student') && (d.status === 'en-route' || d.status === 'arrived-gate'));

  // Filter notices for this student's block or 'All'
  const myNotices = notices
    .filter((n: any) => n.targetAudience === 'All' || n.targetAudience === currentUser.block)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2); // Show top 2 latest

  const quickActions = [
    { title: 'Log Local Outing', desc: 'City mall, hospital, shopping', icon: MapPin, href: '/student/outpass', color: 'from-violet-600 to-teal-700' },
    { title: 'Home Leave Application', desc: 'Weekend & vacation leave', icon: Home, href: '/student/home-leave', color: 'from-teal-600 to-pink-600' },
    { title: 'Log Swiggy / Zomato', desc: 'Pre-clear gate delivery', icon: ShoppingBag, href: '/student/food-orders', color: 'from-orange-500 to-rose-500' },
    { title: 'Log Maintenance Issue', desc: 'Plumbing, Wi-Fi, Electrical', icon: AlertCircle, href: '/student/complaints', color: 'from-emerald-600 to-teal-600' },
    { title: 'Library Study Register', desc: 'Request study access', icon: BookOpen, href: '/student/library-pass', color: 'from-amber-600 to-orange-600' },
    { title: 'Pay Semester Fee', desc: pendingFeesAmount > 0 ? `$${pendingFeesAmount} due soon` : 'All dues cleared', icon: CreditCard, href: '/student/fee-payment', color: 'from-blue-600 to-cyan-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <TiltCard max={4} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 hero-surface p-6 sm:p-8 text-white shadow-xl border border-violet-500/20">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-violet-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser.course ? `${currentUser.course}${currentUser.year ? ` — ${currentUser.year}` : ''}` : 'Student'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl">
              {currentUser.roomNumber ? (
                <>You are currently checked in at <strong className="text-white">Room {currentUser.roomNumber}</strong>{currentUser.block ? ` (${currentUser.block})` : ''}. Your campus location register is active.</>
              ) : (
                <>No room has been assigned to you yet. Your campus location register is active.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={springs.snappy}>
              <Link
                href="/student/leave-requests"
                className="px-5 py-3 rounded-2xl bg-white text-violet-900 font-bold text-sm shadow-lg hover:bg-violet-50 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-violet-700" />
                <span>View My Movement Logs</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </TiltCard>

      {/* Broadcast Notices */}
      {myNotices.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
          {myNotices.map((notice: any) => (
            <motion.div
              key={notice.id}
              variants={listItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={`p-4 sm:p-5 rounded-2xl flex items-start gap-4 border-l-4 shadow-sm transition-colors ${
                notice.priority === 'urgent' ? 'bg-red-50 dark:bg-red-500/10 border-red-500' :
                notice.priority === 'high' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500' :
                'bg-violet-50 dark:bg-violet-900/10 border-violet-500'
              }`}
            >
              <Megaphone className={`w-6 h-6 shrink-0 mt-0.5 ${
                notice.priority === 'urgent' ? 'text-red-500' :
                notice.priority === 'high' ? 'text-amber-500' :
                'text-violet-500'
              }`} />
              <div>
                <h3 className={`font-bold text-sm sm:text-base ${
                  notice.priority === 'urgent' ? 'text-red-900 dark:text-red-400' :
                  notice.priority === 'high' ? 'text-amber-900 dark:text-amber-400' :
                  'text-violet-900 dark:text-violet-400'
                }`}>
                  {notice.title}
                </h3>
                <p className={`text-sm mt-1 leading-relaxed ${
                  notice.priority === 'urgent' ? 'text-red-700 dark:text-red-300' :
                  notice.priority === 'high' ? 'text-amber-700 dark:text-amber-300' :
                  'text-violet-700 dark:text-violet-300'
                }`}>
                  {notice.message}
                </p>
                <div className="mt-2 text-[10px] font-medium opacity-60">
                  Broadcast by {notice.author} • {format(new Date(notice.date), 'd MMM yyyy')}
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      )}

      {/* Primary KPI Widgets Grid */}
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Widget 1: Today's Status */}
        <StaggerItem className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Status</span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white capitalize">
              {currentUser.attendanceToday || 'Present'}
            </span>
            <StatusBadge status={currentUser.attendanceToday || 'present'} size="sm" />
          </div>
          <p className="text-xs text-zinc-500">As recorded in the campus register</p>
        </StaggerItem>

        {/* Widget 2: Room Allocation */}
        <StaggerItem className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Room Allocation</span>
            <Building2 className="w-5 h-5 text-violet-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {currentUser.roomNumber || 'Not assigned'}
            </span>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/60 px-2 py-0.5 rounded-md">
              {myRoom?.block || currentUser.block ? `Block ${myRoom?.block || currentUser.block}` : '—'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 truncate">Roommate: {roommates[0]?.name || '—'}</p>
        </StaggerItem>

        {/* Widget 4: Fee Dues */}
        <StaggerItem className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Outstanding Dues</span>
            <CreditCard className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              <AnimatedNumber value={pendingFeesAmount} format={(v) => `$${Math.round(v)}`} />
            </span>
            {pendingFeesAmount === 0 ? (
              <StatusBadge status="paid" size="sm" />
            ) : (
              <StatusBadge status="overdue" size="sm" />
            )}
          </div>
          <p className="text-xs text-zinc-500">{nextDue ? `Next due date: ${nextDue}` : 'No upcoming dues'}</p>
        </StaggerItem>
      </Stagger>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span>Quick Actions</span>
          </h2>
          <span className="text-xs text-zinc-400">Instant access to student modules</span>
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <StaggerItem key={action.title} className="h-full">
              <motion.div {...hoverLift} className="h-full">
              <Link
                href={action.href}
                className="group relative overflow-hidden p-4 rounded-2xl glass-control/80 hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-colors duration-300 shadow-sm hover:shadow-md flex items-center justify-between h-full"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md shadow-violet-500/10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{action.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </Link>
              </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      {/* Middle Section: Requests Chart & Active Leave / Pass Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <span>My Movement Requests by Type</span>
              </h3>
              <p className="text-xs text-zinc-500">Number of requests you have submitted, grouped by type</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {studentLeaves.length} Total
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {leaveTypeData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaveTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" vertical={false} />
                  <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar name="Requests" dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Reveal>

        {/* Active Delivery & Roommate Widget (1 Col) */}
        <div className="space-y-6">
          {/* Live Swiggy/Zomato Delivery Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 text-white border border-orange-500/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl" />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-950/80 px-2.5 py-1 rounded-md border border-orange-800 flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3 text-orange-400" /> Gate Delivery Feed
              </span>
              {myActiveDeliveries.length > 0 ? (
                <span className="text-xs font-bold bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                  Arriving Today
                </span>
              ) : (
                <span className="text-xs font-semibold text-zinc-400">Gate Clear</span>
              )}
            </div>

            <AnimatePresence initial={false} mode="wait">
            {myActiveDeliveries.length > 0 ? (
              <motion.div
                key={myActiveDeliveries[0].id}
                variants={listItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-2"
              >
                <h4 className="font-extrabold text-base text-white">{myActiveDeliveries[0].platform} — {myActiveDeliveries[0].restaurantOrStore}</h4>
                <p className="text-xs text-zinc-300 truncate">{myActiveDeliveries[0].itemsSummary}</p>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs mt-2">
                  <div>
                    <span className="text-zinc-400 block">Expected Gate Arrival • Room {myActiveDeliveries[0].roomNumber}</span>
                    <strong className="text-orange-400 font-bold">{myActiveDeliveries[0].expectedTime} {myActiveDeliveries[0].date && `(${myActiveDeliveries[0].date})`}</strong>
                  </div>
                  <Link
                    href="/student/food-orders"
                    className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
                  >
                    View Log →
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="gate-clear"
                variants={listItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-2 py-2"
              >
                <h4 className="font-bold text-base text-white">No External Deliveries Logged</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ordering from Swiggy, Zomato, or Instamart? Register your order for seamless security gate clearance.
                </p>
                <div className="pt-2">
                  <Link
                    href="/student/food-orders"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/10"
                  >
                    <Plus className="w-3.5 h-3.5 text-orange-400" /> Log Swiggy / Zomato Order
                  </Link>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          {/* Roommates Card */}
          <Reveal delay={0.1} className="glass-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-600" />
                <span>{currentUser.roomNumber ? `Room ${currentUser.roomNumber} Residents` : 'Room Residents'}</span>
              </h4>
              <span className="text-xs text-zinc-400">{myRoom ? `${myRoom.occupied}/${myRoom.capacity} Beds` : '—'}</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {(!myRoom || myRoom.students.length === 0) && (
                <p className="text-xs text-zinc-500 italic">No room assigned yet.</p>
              )}
              {myRoom?.students.map((student: any) => (
                <div key={student.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/20" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white leading-none">
                        {student.name} {student.id === currentUser.id && '(You)'}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{student.course}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Leave Timeline */}
      <Reveal className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-600" />
            <span>Recent Movement Logs & Gate History</span>
          </h3>
          <Link
            href="/student/leave-requests"
            className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
          >
            View all requests <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <AnimatePresence initial={false}>
          {studentLeaves.slice(0, 2).map((leave: any) => (
            <motion.div
              key={leave.id}
              variants={listItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/60 px-2 py-0.5 rounded">
                  {leave.type} Log
                </span>
                <StatusBadge status={leave.status} size="sm" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{leave.reason}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Expected Window: {leave.startDate} ({leave.startTime || 'Full Day'} to {leave.endTime || 'Return'})
                </p>
                {leave.actualArrivalTime && (
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Arrived at Gate: {leave.actualArrivalTime}
                  </p>
                )}
              </div>
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                {leave.actualArrivalTime ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Return Verified in Register
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Pending Arrival Check-in
                  </span>
                )}
                <Link href="/student/leave-requests" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">
                  View Log →
                </Link>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
          {studentLeaves.length === 0 && (
            <p className="text-sm text-zinc-400 md:col-span-2 text-center py-4">No movement logs yet.</p>
          )}
        </div>
      </Reveal>
    </div>
  );
}

