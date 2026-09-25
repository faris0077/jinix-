'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion, springs, hoverLift, Stagger, StaggerItem, Reveal, AnimatedNumber } from '@/lib/motion';
import { FileText, Download, TrendingUp, Users, AlertTriangle, IndianRupee } from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0d9488', '#2563eb', '#d97706'];

const DIETARY_LABELS: Record<string, string> = { veg: 'Vegetarian', 'non-veg': 'Non-Vegetarian', vegan: 'Vegan' };

export default function WardenReportsPage() {
  const { leaveRequests, complaints, feePayments, users, foodOrders } = useChavaraStore();
  
  const students = users.filter((u) => u.role === 'student');
  const totalStudents = students.length;
  const attendanceData = [
    { name: 'Present', key: 'present' },
    { name: 'On Leave', key: 'on-leave' },
    { name: 'Outpass', key: 'outpass' },
    { name: 'Library', key: 'library' },
  ].map(({ name, key }) => ({ name, Residents: students.filter((u) => u.attendanceToday === key).length }));
  const hasAttendance = attendanceData.some((d) => d.Residents > 0);
  const messData = Object.entries(DIETARY_LABELS)
    .map(([key, name]) => ({ name, value: foodOrders.filter((f) => f.dietary === key).length }))
    .filter((d) => d.value > 0);
  const activeComplaints = complaints.filter((c) => c.status !== 'resolved').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending').length;
  const totalFeesPaid = feePayments
    .filter((f) => f.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const stats: {
    title: string;
    value: number;
    format?: (n: number) => string;
    icon: React.ElementType;
    color: string;
    bg: string;
  }[] = [
    { title: 'Total Students', value: totalStudents, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Pending Leaves', value: pendingLeaves, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Active Complaints', value: activeComplaints, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Fees Collected', value: totalFeesPaid, format: (n) => `₹${Math.round(n).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  // Derive financial data grouped by block
  const financialData = ['A', 'B', 'C', 'D'].map((block) => {
    const studentsInBlock = users.filter((u) => u.role === 'student' && u.block === block).map((u) => u.id);
    const blockFees = feePayments.filter((f) => f.studentId !== undefined && studentsInBlock.includes(f.studentId));
    
    return {
      block: `Block ${block}`,
      Paid: blockFees.filter((f) => f.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0),
      Pending: blockFees.filter((f) => f.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0),
      Overdue: blockFees.filter((f) => f.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0),
    };
  });

  const hasFinancial = financialData.some((d) => d.Paid + d.Pending + d.Overdue > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-violet-600" />
            Audit Reports & Analytics
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            System-wide statistics and downloadable audit reports.
          </p>
        </div>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold flex items-center gap-2 shadow-lg transition-colors"
          onClick={() => alert("Report generation will be available in the next release.")}
        >
          <Download className="w-4 h-4" />
          Export PDF
        </motion.button>
      </div>

      {/* KPI Stats */}
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.title}>
              <motion.div {...hoverLift} className="glass-card p-6 rounded-3xl flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                    <AnimatedNumber value={stat.value} format={stat.format} />
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Line Chart */}
        <Reveal>
        <div className="glass-card p-6 rounded-3xl">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-500" />
            Resident Attendance Today
          </h2>
          <div className="h-72 w-full">
            {!hasAttendance ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.18} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#94a3b8', opacity: 0.08 }}
                  />
                  <Bar dataKey="Residents" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        </Reveal>

        {/* Mess Utilization Pie Chart */}
        <Reveal delay={0.08}>
        <div className="glass-card p-6 rounded-3xl">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Meal Menu by Dietary Type
          </h2>
          <div className="h-72 w-full flex items-center justify-center">
            {messData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={messData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {messData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        </Reveal>

        {/* Financial Audit Bar Chart */}
        <Reveal className="lg:col-span-2" delay={0.12}>
        <div className="glass-card p-6 rounded-3xl">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-blue-500" />
            Fee Collection Status by Block
          </h2>
          <div className="h-80 w-full">
            {!hasFinancial ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.18} vertical={false} />
                  <XAxis dataKey="block" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip
                    cursor={{ fill: '#94a3b8', opacity: 0.08 }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${(value ?? 0).toLocaleString()}`, undefined]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="Paid" stackId="a" fill="#0d9488" radius={[0, 0, 4, 4]} barSize={40} />
                  <Bar dataKey="Pending" stackId="a" fill="#d97706" />
                  <Bar dataKey="Overdue" stackId="a" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        </Reveal>
      </div>
    </div>
  );
}
