'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Briefcase,
  ShoppingBag,
  Truck,
  PackageCheck,
  Megaphone,
  AlertTriangle,
  Clock,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { toast } from 'sonner';
import {
  motion,
  AnimatePresence,
  springs,
  listItem,
  hoverLift,
  Stagger,
  StaggerItem,
  Reveal,
  AnimatedNumber,
  TiltCard,
  EASE_OUT,
} from '@/lib/motion';

const ANNUAL_REVENUE_DATA = [
  { month: 'Jan', income: 42000, expense: 28000, budget: 35000 },
  { month: 'Feb', income: 45000, expense: 29000, budget: 35000 },
  { month: 'Mar', income: 68000, expense: 31000, budget: 35000 }, // Spring Fee collection
  { month: 'Apr', income: 41000, expense: 27000, budget: 35000 },
  { month: 'May', income: 38000, expense: 25000, budget: 35000 },
  { month: 'Jun', income: 52000, expense: 32000, budget: 35000 },
  { month: 'Jul', income: 95000, expense: 35000, budget: 35000 }, // Monsoon Semester Intake
];

const BLOCK_OCCUPANCY_DATA = [
  { name: 'Block A (St. Alphonsa Wing)', occupied: 450, capacity: 450, color: '#8d7cc9', warden: 'Sr. Anitha Philip' },
  { name: 'Block B (St. Teresa Wing)', occupied: 445, capacity: 450, color: '#1c9a89', warden: 'Dr. Sr. Mary Thomas' },
  { name: 'Block C (St. Euphrasia Wing)', occupied: 480, capacity: 500, color: '#b3812c', warden: 'Dr. Elizabeth Varghese' },
  { name: 'Block D (Mother Carmel Wing)', occupied: 440, capacity: 450, color: '#4f80b8', warden: 'Sr. Rose Mary' },
];

export default function DirectorDashboard() {
  const { currentUser, externalDeliveries, complaints, leaveRequests, addNotice } = useChavaraStore();

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'normal' | 'high' | 'urgent'>('high');
  
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const highPriorityComplaints = complaints.filter(c => c.status === 'submitted' || c.status === 'in-progress').slice(0, 3);
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').slice(0, 3);

  const totalCapacity = BLOCK_OCCUPANCY_DATA.reduce((acc, b) => acc + b.capacity, 0);
  const totalOccupied = BLOCK_OCCUPANCY_DATA.reduce((acc, b) => acc + b.occupied, 0);
  const occupancyRate = ((totalOccupied / totalCapacity) * 100).toFixed(1);
  const totalDeliveries = externalDeliveries.length;
  const activeDeliveries = externalDeliveries.filter((d) => d.status === 'en-route' || d.status === 'arrived-gate').length;

  const handleExportBriefing = () => {
    toast.success('Executive Board Briefing Exported!', {
      description: 'Chavara Residence OS Quarterly Financial & Security Dossier saved as PDF.',
    });
  };

  const handleSendBroadcast = () => {
    if (!broadcastTitle || !broadcastMessage) {
      toast.error('Please fill out all fields');
      return;
    }
    addNotice({
      title: broadcastTitle,
      message: broadcastMessage,
      priority: broadcastPriority,
    });
    setIsBroadcastModalOpen(false);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastPriority('high');
  };

  return (
    <div className="space-y-8">
      {/* Executive Hero Banner */}
      <TiltCard max={4}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-violet-950 to-indigo-950 p-8 text-white shadow-2xl border border-violet-500/30">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute left-1/3 -bottom-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-violet-200 border border-white/10 shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Board Governance Suite — Chavara Institutions</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Director Executive Dashboard 👑
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Welcome, <strong className="text-white">{currentUser.name}</strong>. Institutional occupancy across all 4 residence blocks is standing at an exceptional <strong className="text-emerald-400 font-bold">{occupancyRate}% ({totalOccupied} female scholars)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              onClick={() => setIsBroadcastModalOpen(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm shadow-xl backdrop-blur-md border border-white/20 transition-colors flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Global Broadcast</span>
            </motion.button>
            <motion.button
              onClick={handleExportBriefing}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Board Report PDF</span>
              <span className="sm:hidden">Export PDF</span>
            </motion.button>
          </div>
        </div>
      </div>
      </TiltCard>

      {/* Action Center - Critical Escalations */}
      {(highPriorityComplaints.length > 0 || pendingLeaves.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Critical Maintenance Escalations</span>
            </h3>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {highPriorityComplaints.map(c => (
                  <motion.div
                    key={c.id}
                    variants={listItem}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{c.title}</p>
                      <p className="text-xs text-zinc-500">Room {c.roomNumber} • {c.category}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-full uppercase">Action Req</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {highPriorityComplaints.length === 0 && (
                <p className="text-sm text-zinc-500">No critical escalations.</p>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-3xl space-y-4 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Pending Warden Approvals (&gt;24h)</span>
            </h3>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {pendingLeaves.map(l => (
                  <motion.div
                    key={l.id}
                    variants={listItem}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{l.studentName}</p>
                      <p className="text-xs text-zinc-500">Type: {l.type.toUpperCase()} • Room {l.roomNumber}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full uppercase">Pending</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {pendingLeaves.length === 0 && (
                <p className="text-sm text-zinc-500">No delayed approvals.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Primary Financial & Operational KPIs */}
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StaggerItem className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden group border-emerald-500/20">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Annual Revenue (2026)</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <AnimatedNumber
              value={480500}
              format={(v) => `$${Math.round(v).toLocaleString()}`}
              className="text-3xl font-extrabold text-zinc-900 dark:text-white"
            />
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              +14.2% YoY
            </span>
          </div>
          <p className="text-xs text-zinc-500">Monsoon semester collections active</p>
        </StaggerItem>

        <StaggerItem className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden group border-violet-500/20">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Campus Occupancy</span>
            <Building2 className="w-5 h-5 text-violet-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <AnimatedNumber
              value={parseFloat(occupancyRate)}
              format={(v) => v.toFixed(1) + '%'}
              className="text-3xl font-extrabold text-zinc-900 dark:text-white"
            />
            <span className="text-xs font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded">
              {totalOccupied} Beds
            </span>
          </div>
          <p className="text-xs text-zinc-500">Across 4 luxury accommodation blocks</p>
        </StaggerItem>

        <StaggerItem className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden group border-purple-500/20">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Security & Audit Index</span>
            <ShieldCheck className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <AnimatedNumber
              value={99.8}
              format={(v) => v.toFixed(1) + '%'}
              className="text-3xl font-extrabold text-zinc-900 dark:text-white"
            />
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              Zero Breaches
            </span>
          </div>
          <p className="text-xs text-zinc-500">Biometric turnstile and location log compliance</p>
        </StaggerItem>

        <StaggerItem className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden group border-blue-500/20">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Active Scholars</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <AnimatedNumber
              value={1815}
              format={(v) => Math.round(v).toLocaleString()}
              className="text-3xl font-extrabold text-zinc-900 dark:text-white"
            />
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
              4 Wings
            </span>
          </div>
          <p className="text-xs text-zinc-500">B.Tech, MBA, Architecture & Science</p>
        </StaggerItem>
      </Stagger>

      {/* Charts Grid */}
      <Reveal className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Operational Expenses Area Chart (2 Cols) */}
        <div id="revenue" className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <span>Financial Trajectory: Fee Collections vs Operational Expenditures</span>
              </h3>
              <p className="text-xs text-zinc-500">Monthly breakdown of student accommodation invoices vs mess food and utility overheads</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-200">
              Net Surplus Active
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANNUAL_REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c7d52" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2c7d52" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c05c7c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c05c7c" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="budgetColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f80b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f80b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" vertical={false} />
                <XAxis dataKey="month" stroke="#8a8799" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8a8799" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(28, 27, 34, 0.95)', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, '']} />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" name="Fee Revenue ($)" dataKey="income" stroke="#2c7d52" strokeWidth={3} fillOpacity={1} fill="url(#incColor)" />
                <Area type="monotone" name="Operational Expenses ($)" dataKey="expense" stroke="#c05c7c" strokeWidth={2} strokeDasharray="1 4" strokeLinecap="round" fillOpacity={1} fill="url(#expColor)" />
                <Area type="monotone" name="Budget Allocation ($)" dataKey="budget" stroke="#4f80b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#budgetColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wing Occupancy Donut Chart (1 Col) */}
        <div id="occupancy" className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-violet-600" />
              <span>Wing Occupancy Ratio</span>
            </h3>
            <p className="text-xs text-zinc-500">Capacity utilization by block</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={BLOCK_OCCUPANCY_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="occupied">
                  {BLOCK_OCCUPANCY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(28, 27, 34, 0.95)', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }} formatter={(val: any) => [`${val || 0} Beds Occupied`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {BLOCK_OCCUPANCY_DATA.map((b) => (
              <div key={b.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                  {b.name.split(' ')[0]} ({b.name.split('(')[1]?.replace(')', '')})
                </span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">{((b.occupied/b.capacity)*100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Executive Gate Logistics & External Delivery Overview */}
      <Reveal>
      <div className="glass-card p-6 rounded-3xl space-y-4 border-orange-500/25 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <span>Institutional External Delivery & Gate Clearance Audit (Swiggy / Zomato)</span>
            </h3>
            <p className="text-xs text-zinc-500">Executive supervision of online food couriers and security turnstile traffic</p>
          </div>
          <span className="text-xs font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">
            {totalDeliveries} Total Registered Orders Today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Active Gate Deliveries</span>
            <div className="flex items-baseline justify-between">
              <AnimatedNumber value={activeDeliveries} className="text-2xl font-extrabold text-orange-500" />
              <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">Waiting / En Route</span>
            </div>
            <p className="text-[11px] text-zinc-400">Main turnstile turnspit clearance</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Top Order Platforms</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-zinc-900 dark:text-white">Swiggy / Zomato</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">92% Volume</span>
            </div>
            <p className="text-[11px] text-zinc-400">Instamart & Zepto grocery share: 8%</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Post-Curfew Compliance</span>
            <div className="flex items-baseline justify-between">
              <AnimatedNumber
                value={100}
                format={(v) => `${Math.round(v)}%`}
                className="text-2xl font-extrabold text-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Zero Unauthorized</span>
            </div>
            <p className="text-[11px] text-zinc-400">All late couriers cleared by Wardens</p>
          </div>
        </div>
      </div>
      </Reveal>

      {/* Block Governance Table */}
      <Reveal delay={0.05}>
      <div className="glass-card p-6 rounded-3xl space-y-4 border-violet-500/20">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-violet-600" />
            <span>Chief Wardens & Block Supervisory Dossier</span>
          </h3>
          <Link href="/director/reports" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            Institutional audit center <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {BLOCK_OCCUPANCY_DATA.map((block) => (
            <motion.div
              key={block.name}
              onClick={() => setSelectedBlock(block.name)}
              {...hoverLift}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm hover:border-violet-500 hover:shadow-violet-500/20 transition-[border-color,box-shadow] cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded">
                  {block.name.split(' ')[0]}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {((block.occupied / block.capacity) * 100).toFixed(0)}% Full
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{block.name.split('(')[1]?.replace(')', '')}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Chief Warden: <strong>{block.warden}</strong></p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span>{block.occupied} / {block.capacity} Beds</span>
                <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Audited</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </Reveal>

      {/* Broadcast Modal */}
      <AnimatePresence>
      {isBroadcastModalOpen && (
        <motion.div
          key="broadcast-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={springs.soft}
            className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-xl flex items-center gap-2"><Megaphone className="text-violet-600" /> New Global Broadcast</h3>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-900 dark:text-zinc-200">Notice Title</label>
                <input 
                  type="text" 
                  value={broadcastTitle} 
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 text-zinc-900 dark:text-zinc-100" 
                  placeholder="e.g. Mandatory Curfew Update" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-900 dark:text-zinc-200">Message Body</label>
                <textarea 
                  value={broadcastMessage} 
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 h-32 resize-none text-zinc-900 dark:text-zinc-100" 
                  placeholder="Enter your announcement here..." 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-zinc-900 dark:text-zinc-200">Priority Level</label>
                <div className="flex gap-3">
                  {(['normal', 'high', 'urgent'] as const).map(p => (
                    <label key={p} className={`relative flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${broadcastPriority === p ? 'border-transparent text-violet-700 dark:text-violet-300' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                      {broadcastPriority === p && (
                        <motion.div
                          layoutId="broadcast-priority-pill"
                          transition={springs.snappy}
                          className="absolute inset-0 rounded-xl border border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                        />
                      )}
                      <input type="radio" name="priority" checked={broadcastPriority === p} onChange={() => setBroadcastPriority(p)} className="sr-only" />
                      <span className="relative z-10 text-sm font-medium capitalize">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-950/50">
              <button onClick={() => setIsBroadcastModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">Cancel</button>
              <motion.button
                onClick={handleSendBroadcast}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-colors"
              >Send Broadcast</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Block Details Modal */}
      <AnimatePresence>
      {selectedBlock && (
        <motion.div
          key="block-details-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={springs.soft}
            className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-violet-50 dark:bg-violet-950/30">
              <h3 className="font-bold text-xl text-violet-900 dark:text-violet-100">{selectedBlock}</h3>
              <button onClick={() => setSelectedBlock(null)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">Occupancy</span>
                  <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                    {BLOCK_OCCUPANCY_DATA.find(b => b.name === selectedBlock)?.occupied} <span className="text-sm font-medium text-emerald-600/70">/ {BLOCK_OCCUPANCY_DATA.find(b => b.name === selectedBlock)?.capacity}</span>
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">Pending Complaints</span>
                  <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                    {complaints.filter(c => c.status === 'submitted' && selectedBlock.includes(c.roomNumber.charAt(0)) || true).length || '0'} {/* Just mock matching logic */}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-violet-600" /> Operational Status</h4>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p className="flex justify-between"><span>Chief Warden:</span> <strong className="text-zinc-900 dark:text-white">{BLOCK_OCCUPANCY_DATA.find(b => b.name === selectedBlock)?.warden}</strong></p>
                  <p className="flex justify-between"><span>Last Security Audit:</span> <strong className="text-zinc-900 dark:text-white">Today, 08:00 AM</strong></p>
                  <p className="flex justify-between"><span>Infrastructure Health:</span> <span className="text-emerald-500 font-bold">Optimal</span></p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
              <button onClick={() => setSelectedBlock(null)} className="w-full py-3 rounded-xl font-bold text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition-all">Close Dossier</button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
