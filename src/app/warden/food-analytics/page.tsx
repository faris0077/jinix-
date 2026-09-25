'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion, springs, hoverLift, Stagger, StaggerItem, Reveal, AnimatedNumber } from '@/lib/motion';
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

const MEALS: { key: 'breakfast' | 'lunch' | 'tea' | 'dinner'; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'tea', label: 'Evening Tea' },
  { key: 'dinner', label: 'Dinner' },
];

export default function WardenFoodAnalyticsPage() {
  const { foodOrders } = useChavaraStore();

  const tallyData = MEALS.map(({ key, label }) => {
    const items = foodOrders.filter((f) => f.mealType === key);
    const booked = items.filter((f) => f.ordered).length;
    return { meal: label, booked, skipped: items.length - booked };
  });
  const totalItems = tallyData.reduce((acc, d) => acc + d.booked + d.skipped, 0);
  const totalBooked = tallyData.reduce((acc, d) => acc + d.booked, 0);
  const bookingRate = totalItems > 0 ? `${((totalBooked / totalItems) * 100).toFixed(1)}% Meals Booked` : '—';

  const handleExportMessTally = () => {
    toast.success('Mess Tally Sheet Exported!', {
      description: 'Sent daily headcount report to Head Chef & Campus Catering Dept.',
    });
  };

  return (
    <div className="space-y-8">
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

        <motion.button
          onClick={handleExportMessTally}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Kitchen Tally Sheet
        </motion.button>
      </div>

      {/* Tally Cards */}
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tallyData.map((item) => (
          <StaggerItem key={item.meal}>
            <motion.div {...hoverLift} className="glass-card p-5 rounded-2xl space-y-3 relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 block truncate">
                {item.meal}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-white"><AnimatedNumber value={item.booked} /> Booked</span>
                <span className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                  <AnimatedNumber value={item.skipped} /> Not Booked
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate">Campus Mess</p>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Recharts Bar Chart */}
      <Reveal delay={0.1}>
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <span>Meals Booked vs Not Booked</span>
          </h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
            {bookingRate}
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          {totalItems === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tallyData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" vertical={false} />
                <XAxis dataKey="meal" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar name="Meals Booked (To Serve)" dataKey="booked" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar name="Meals Not Booked" dataKey="skipped" fill="#e11d48" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      </Reveal>
    </div>
  );
}
