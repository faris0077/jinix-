'use client';

import React from 'react';
import Link from 'next/link';
import { useChavaraStore } from '@/lib/store';
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

const ATTENDANCE_DATA = [
  { day: 'Mon', hoursPresent: 24, libraryHours: 3 },
  { day: 'Tue', hoursPresent: 24, libraryHours: 4 },
  { day: 'Wed', hoursPresent: 18, libraryHours: 2 }, // Outpass 6 hours
  { day: 'Thu', hoursPresent: 24, libraryHours: 5 },
  { day: 'Fri', hoursPresent: 24, libraryHours: 1.5 },
  { day: 'Sat', hoursPresent: 16, libraryHours: 6 },
  { day: 'Sun', hoursPresent: 24, libraryHours: 4 },
];

export default function StudentDashboard() {
  const store = useChavaraStore() as any; // Cast to bypass missing export if any
  const { currentUser, studentLeaves, foodOrders, feePayments, complaints, rooms, externalDeliveries } = store;
  const notices = store.notices || [];

  const myRoom = rooms.find((r) => r.roomNumber === currentUser.roomNumber) || rooms[0];
  const roommates = myRoom?.students.filter((s) => s.id !== currentUser.id) || [];
  const pendingLeavesCount = studentLeaves.filter((l) => l.status === 'pending').length;
  const approvedLeaves = studentLeaves.filter((l) => l.status === 'approved');
  const activePass = approvedLeaves[0];
  const mealsOrderedCount = foodOrders.filter((f) => f.ordered).length;
  const pendingFeesAmount = feePayments.filter((f) => f.status === 'pending' || f.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);
  const myActiveDeliveries = externalDeliveries.filter((d: any) => (d.studentId === currentUser.id || currentUser.role !== 'student') && (d.status === 'en-route' || d.status === 'arrived-gate'));

  // Filter notices for this student's block or 'All'
  const myNotices = notices
    .filter((n: any) => n.targetAudience === 'All' || n.targetAudience === currentUser.block)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2); // Show top 2 latest

  const quickActions = [
    { title: 'Log Local Outing', desc: 'City mall, hospital, shopping', icon: MapPin, href: '/student/outpass', color: 'from-violet-600 to-indigo-600' },
    { title: 'Home Leave Application', desc: 'Weekend & vacation leave', icon: Home, href: '/student/home-leave', color: 'from-purple-600 to-pink-600' },
    { title: 'Log Swiggy / Zomato', desc: 'Pre-clear gate delivery', icon: ShoppingBag, href: '/student/food-orders', color: 'from-orange-500 to-rose-500' },
    { title: 'Log Maintenance Issue', desc: 'Plumbing, Wi-Fi, Electrical', icon: AlertCircle, href: '/student/complaints', color: 'from-emerald-600 to-teal-600' },
    { title: 'Library Study Register', desc: 'Study access till 11 PM', icon: BookOpen, href: '/student/library-pass', color: 'from-amber-600 to-orange-600' },
    { title: 'Pay Semester Fee', desc: pendingFeesAmount > 0 ? `$${pendingFeesAmount} due soon` : 'All dues cleared', icon: CreditCard, href: '/student/fee-payment', color: 'from-blue-600 to-cyan-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-purple-900 to-zinc-950 p-6 sm:p-8 text-white shadow-xl border border-violet-500/20">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute right-1/3 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-violet-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Monsoon Semester 2026 — Active Scholar</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl">
              You are currently checked in at <strong className="text-white">Room {currentUser.roomNumber}</strong> ({currentUser.block}). Your campus location register is active.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/student/leave-requests"
              className="px-5 py-3 rounded-2xl bg-white text-violet-900 font-bold text-sm shadow-lg hover:bg-violet-50 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-violet-700" />
              <span>View My Movement Logs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Broadcast Notices */}
      {myNotices.length > 0 && (
        <div className="space-y-4">
          {myNotices.map((notice: any) => (
            <div 
              key={notice.id}
              className={`p-4 sm:p-5 rounded-2xl flex items-start gap-4 border-l-4 shadow-sm transition-all ${
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
                  Broadcast by {notice.author} • {new Date(notice.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Primary KPI Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Widget 1: Today's Status */}
        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
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
          <p className="text-xs text-zinc-500">Curfew check-in at 08:30 PM</p>
        </div>

        {/* Widget 2: Room Allocation */}
        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Room Allocation</span>
            <Building2 className="w-5 h-5 text-violet-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {currentUser.roomNumber || '304A'}
            </span>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/60 px-2 py-0.5 rounded-md">
              Block {myRoom.block}
            </span>
          </div>
          <p className="text-xs text-zinc-500 truncate">Roommate: {roommates[0]?.name || 'Diya Patel'}</p>
        </div>

        {/* Widget 4: Fee Dues */}
        <div className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Outstanding Dues</span>
            <CreditCard className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              ${pendingFeesAmount}
            </span>
            {pendingFeesAmount === 0 ? (
              <StatusBadge status="paid" size="sm" />
            ) : (
              <StatusBadge status="overdue" size="sm" />
            )}
          </div>
          <p className="text-xs text-zinc-500">Next due date: July 31st, 2026</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span>Quick Actions</span>
          </h2>
          <span className="text-xs text-zinc-400">Instant access to student modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between"
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
            );
          })}
        </div>
      </div>

      {/* Middle Section: Attendance Chart & Active Leave / Pass Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Area Chart (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <span>Weekly Campus & Library Movement</span>
              </h3>
              <p className="text-xs text-zinc-500">Hours spent on campus premises vs digital library study</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              98.4% Attendance
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6D28D9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorLib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(9, 9, 11, 0.9)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" name="Campus Hours" dataKey="hoursPresent" stroke="#6D28D9" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                <Area type="monotone" name="Library Study" dataKey="libraryHours" stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#colorLib)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Delivery & Roommate Widget (1 Col) */}
        <div className="space-y-6">
          {/* Live Swiggy/Zomato Delivery Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-950 via-zinc-900 to-zinc-950 text-white border border-orange-500/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl" />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-950/80 px-2.5 py-1 rounded-md border border-orange-800 flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3 text-orange-400" /> Gate Delivery Feed
              </span>
              {myActiveDeliveries.length > 0 ? (
                <span className="text-xs font-bold bg-amber-500 text-white px-2.5 py-0.5 rounded-full animate-pulse">
                  Arriving Today
                </span>
              ) : (
                <span className="text-xs font-semibold text-zinc-400">Gate Clear</span>
              )}
            </div>

            {myActiveDeliveries.length > 0 ? (
              <div className="space-y-2">
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
              </div>
            ) : (
              <div className="space-y-2 py-2">
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
              </div>
            )}
          </div>

          {/* Roommates Card */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-600" />
                <span>Room {currentUser.roomNumber} Residents</span>
              </h4>
              <span className="text-xs text-zinc-400">{myRoom.occupied}/{myRoom.capacity} Beds</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {myRoom.students.map((student) => (
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
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                    Present
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Leave Timeline */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
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
          {studentLeaves.slice(0, 2).map((leave) => (
            <div key={leave.id} className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

