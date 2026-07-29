'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { Utensils, Download, Flame, Users, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { toast } from 'sonner';

const KITCHEN_TALLY_DATA = [
  { meal: 'Breakfast (07:30 - 09:00)', booked: 380, skipped: 70 },
  { meal: 'Lunch (12:30 - 14:00)', booked: 410, skipped: 40 },
  { meal: 'Evening Tea (16:30 - 17:30)', booked: 350, skipped: 100 },
  { meal: 'Dinner (19:30 - 21:00)', booked: 425, skipped: 25 },
];

export default function WardenFoodAnalyticsPage() {
  const { foodOrders } = useChavaraStore();

  const handleExportMessTally = () => {
    toast.success('Mess Tally Sheet Exported!', {
      description: 'Sent daily headcount report to Head Chef & Campus Catering Dept.',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Utensils className="w-6 h-6 text-violet-600" />
            <span>Kitchen Mess Headcount & Food Analytics</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time meal booking tallies for food waste reduction and raw material procurement optimization.
          </p>
        </div>

        <button
          onClick={handleExportMessTally}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Kitchen Tally Sheet
        </button>
      </div>

      {/* Tally Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KITCHEN_TALLY_DATA.map((item, idx) => (
          <div key={item.meal} className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 block truncate">
              {item.meal.split(' ')[0]}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">{item.booked} Booked</span>
              <span className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                {item.skipped} Skipped
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate">{item.meal.split('(')[1]?.replace(')', '') || 'Campus Mess'}</p>
          </div>
        ))}
      </div>

      {/* Recharts Bar Chart */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <span>Daily Headcount vs Skip Distribution</span>
          </h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
            92.4% Average Dining Attendance
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={KITCHEN_TALLY_DATA} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" vertical={false} />
              <XAxis dataKey="meal" stroke="#9ca3af" fontSize={11} tickFormatter={(val) => val.split(' ')[0]} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} />
              <Bar name="Meals Booked (To Serve)" dataKey="booked" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
              <Bar name="Meals Skipped / Deducted" dataKey="skipped" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
