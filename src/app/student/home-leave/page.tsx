'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { LeaveRequest } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Home, Calendar, Utensils, Send, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, springs, Stagger, StaggerItem, Reveal } from '@/lib/motion';
import { toast } from 'sonner';

export default function HomeLeavePage() {
  const { currentUser, studentLeaves, addLeaveRequest } = useChavaraStore();
  
  const [startDate, setStartDate] = useState('2026-07-31');
  const [endDate, setEndDate] = useState('2026-08-03');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('18:00');
  const [reason, setReason] = useState('Attending family religious function and weekend visit');
  const [destination, setDestination] = useState('Indiranagar, Bangalore');
  const [foodReq, setFoodReq] = useState({
    breakfast: true,
    lunch: false,
    tea: false,
    dinner: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please specify a reason for home leave.');
      return;
    }

    addLeaveRequest({
      type: 'home',
      reason,
      destination,
      startDate,
      endDate,
      startTime,
      endTime,
      foodRequirements: foodReq,
    });

    toast.success('Home Leave application submitted! 🏡', {
      description: 'Your food requirement deduction has been logged in the kitchen tally.',
    });
  };

  const homeLeaves = studentLeaves.filter((l) => l.type === 'home');

  const columns: ColumnDef<LeaveRequest>[] = [
    {
      accessorKey: 'id',
      header: 'Pass ID',
      cell: ({ row }) => <span className="font-mono font-bold text-xs text-violet-600 dark:text-violet-400">{row.original.id}</span>,
    },
    {
      accessorKey: 'destination',
      header: 'Hometown / Destination',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-sm text-zinc-900 dark:text-white">{row.original.destination || 'Hometown'}</p>
          <p className="text-xs text-zinc-500 truncate">{row.original.reason}</p>
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Leave Duration / Window',
      cell: ({ row }) => (
        <div className="text-xs font-medium space-y-0.5">
          <div>
            <span className="font-bold text-zinc-900 dark:text-white">{row.original.startDate}</span> to{' '}
            <span className="font-bold text-zinc-900 dark:text-white">{row.original.endDate || 'TBD'}</span>
          </div>
          <p className="text-zinc-500">
            Expected: {row.original.startTime ? `${row.original.startTime} to ${row.original.endTime}` : `Return by ${row.original.endDate || 'N/A'}`}
          </p>
          {row.original.actualArrivalTime ? (
            <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Returned to Campus: {row.original.actualArrivalTime}
            </p>
          ) : (
            <p className="text-amber-500 font-semibold italic">Not Arrived Yet</p>
          )}
        </div>
      ),
    },
    {
      id: 'food',
      header: 'Food Checkboxes',
      cell: ({ row }) => {
        const req = row.original.foodRequirements;
        if (!req) return <span className="text-xs text-zinc-400 italic">None specified</span>;
        const active = Object.entries(req).filter(([_, v]) => v).map(([k]) => k);
        return (
          <div className="flex flex-wrap gap-1">
            {active.length > 0 ? (
              active.map((meal) => (
                <span key={meal} className="text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                  {meal}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-400">All meals skipped</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Approval Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <Home className="w-6 h-6 text-violet-600" />
          <span>Home Leave & Vacation Pass</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Apply for overnight or weekend hometown visits. Specify meal check-in/out requirements for kitchen bill deduction.
        </p>
      </div>

      {/* Grid: Form & Info */}
      <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form (2 Cols) */}
        <StaggerItem className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h2 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-600" />
              <span>New Home Leave Application</span>
            </h2>
            <span className="text-xs font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/60 px-2.5 py-1 rounded-md">
              Room {currentUser.roomNumber} ({currentUser.block})
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Leaving Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Expected Arrival Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Leaving Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Expected Arrival Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Hometown Destination Address *</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Indiranagar, Bangalore / Trivandrum Kerala"
                required
                className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Reason for Home Visit *</label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide details..."
                required
                className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Food Requirement Checkboxes */}
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4" /> Transit Day Food Requirement Checkboxes
                </span>
                <span className="text-[10px] text-zinc-500">Check meals you will consume on departure day</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['breakfast', 'lunch', 'tea', 'dinner'] as const).map((meal) => (
                  <motion.label
                    key={meal}
                    whileTap={{ scale: 0.97 }}
                    transition={springs.snappy}
                    className={cn(
                      'flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none',
                      foodReq[meal]
                        ? 'bg-white dark:bg-zinc-900 border-violet-500/50 shadow-sm font-bold text-violet-700 dark:text-violet-300'
                        : 'bg-transparent border-zinc-200/60 dark:border-zinc-800 text-zinc-500'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={foodReq[meal]}
                      onChange={(e) => setFoodReq({ ...foodReq, [meal]: e.target.checked })}
                      className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
                    />
                    <span className="capitalize text-xs">{meal}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Home Leave Application</span>
            </motion.button>
          </form>
        </StaggerItem>

        {/* Side Info Widget */}
        <StaggerItem className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 border-violet-500/20">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Warden Guidelines</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 list-disc pl-4">
              <li>Home leave requires minimum 24-hour advance submission.</li>
              <li>SMS confirmation will be automatically dispatched to primary parent mobile number upon warden approval.</li>
              <li>Unchecked meals will be deducted from your quarterly mess bill automatically.</li>
            </ul>
          </div>
        </StaggerItem>
      </Stagger>

      {/* History Table */}
      <Reveal className="space-y-4 pt-4">
        <DataTable
          columns={columns}
          data={homeLeaves}
          searchPlaceholder="Search destination or date..."
          title="Home Leave History"
        />
      </Reveal>
    </div>
  );
}
