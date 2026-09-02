'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { motion, springs, hoverLift, Stagger, StaggerItem, Reveal, AnimatedNumber } from '@/lib/motion';
import { FileText, Download, TrendingUp, Users, AlertTriangle, IndianRupee } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts';

const attendanceData = [
  { name: 'Mon', Present: 290, OnLeave: 10 },
  { name: 'Tue', Present: 295, OnLeave: 5 },
  { name: 'Wed', Present: 292, OnLeave: 8 },
  { name: 'Thu', Present: 288, OnLeave: 12 },
  { name: 'Fri', Present: 275, OnLeave: 25 },
  { name: 'Sat', Present: 250, OnLeave: 50 },
  { name: 'Sun', Present: 260, OnLeave: 40 },
];

const messData = [
  { name: 'Vegetarian', value: 150 },
  { name: 'Non-Vegetarian', value: 100 },
  { name: 'Eggitarian', value: 50 },
];
const COLORS = ['#8d7cc9', '#1c9a89', '#b3812c'];

export default function WardenReportsPage() {
  const { leaveRequests, complaints, feePayments, users } = useChavaraStore();
  
  const totalStudents = users.filter((u) => u.role === 'student').length;
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
      Paid: blockFees.filter((f) => f.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0) || Math.floor(Math.random() * 50000 + 10000), // Fallback if no mock data
      Pending: blockFees.filter((f) => f.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0) || Math.floor(Math.random() * 20000),
      Overdue: blockFees.filter((f) => f.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0) || Math.floor(Math.random() * 10000),
    };
  });

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
            7-Day Attendance Trend
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8a8799" strokeOpacity={0.18} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8a8799' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8a8799' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#8a8799', strokeWidth: 1, strokeOpacity: 0.3 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="Present" stroke="#8d7cc9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="OnLeave" name="On Leave" stroke="#b3812c" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        </Reveal>

        {/* Mess Utilization Pie Chart */}
        <Reveal delay={0.08}>
        <div className="glass-card p-6 rounded-3xl">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Dietary Preferences
          </h2>
          <div className="h-72 w-full flex items-center justify-center">
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8a8799" strokeOpacity={0.18} vertical={false} />
                <XAxis dataKey="block" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8a8799' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8a8799' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip 
                  cursor={{ fill: '#8a8799', opacity: 0.08 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${(value ?? 0).toLocaleString()}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="Paid" stackId="a" fill="#2c7d52" radius={[0, 0, 4, 4]} barSize={40} />
                <Bar dataKey="Pending" stackId="a" fill="#b3812c" />
                <Bar dataKey="Overdue" stackId="a" fill="#ad4954" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </Reveal>
      </div>
    </div>
  );
}
