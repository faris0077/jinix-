'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { LeaveRequest } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function LeaveRequestsPage() {
  const { currentUser, studentLeaves, addLeaveRequest } = useChavaraStore();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<'general' | 'home' | 'outpass' | 'library' | 'class'>('general');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('2026-07-28');
  const [endDate, setEndDate] = useState('2026-07-30');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('18:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please enter a valid reason for your leave request.');
      return;
    }

    addLeaveRequest({
      type,
      reason,
      destination: destination || undefined,
      startDate,
      endDate: type === 'home' || type === 'general' ? endDate : undefined,
      startTime: type === 'outpass' || type === 'library' ? startTime : undefined,
      endTime: type === 'outpass' || type === 'library' ? endTime : undefined,
    });

    // Reset form & go back to step 1
    setReason('');
    setDestination('');
    setStep(1);
  };

  const columns: ColumnDef<LeaveRequest>[] = [
    {
      accessorKey: 'id',
      header: 'Request ID',
      cell: ({ row }) => <span className="font-mono font-bold text-xs text-violet-600 dark:text-violet-400">{row.original.id}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <span className="font-bold text-xs uppercase bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">{row.original.type}</span>,
    },
    {
      accessorKey: 'reason',
      header: 'Reason & Destination',
      cell: ({ row }) => (
        <div className="max-w-xs sm:max-w-sm">
          <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{row.original.reason}</p>
          {row.original.destination && (
            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-violet-500 shrink-0" /> {row.original.destination}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Duration / Window',
      cell: ({ row }) => (
        <div className="text-xs font-medium space-y-0.5">
          <p className="text-zinc-900 dark:text-white font-bold">{row.original.startDate} {row.original.endDate ? `to ${row.original.endDate}` : ''}</p>
          <p className="text-zinc-500">
            Expected: {row.original.startTime ? `${row.original.startTime} to ${row.original.endTime}` : `Return by ${row.original.endDate || 'N/A'}`}
          </p>
          {row.original.actualArrivalTime ? (
            <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Arrived: {row.original.actualArrivalTime}
            </p>
          ) : (
            <p className="text-amber-500 font-semibold italic">Not Arrived Yet</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Warden Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted On',
      cell: ({ row }) => <span className="text-xs text-zinc-400">{new Date(row.original.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <CalendarIcon className="w-6 h-6 text-violet-600" />
          <span>Movement & Leave Register</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Register formal leave applications for warden review. Track approval timeline and location logs in real-time.
        </p>
      </div>

      {/* Multi-step Wizard Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-8 max-w-3xl mx-auto shadow-xl border-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6 relative z-10">
          {[
            { num: 1, label: 'Leave Category' },
            { num: 2, label: 'Date & Timings' },
            { num: 3, label: 'Reason & Submit' },
          ].map((s, idx) => {
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all',
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 scale-110'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={cn('text-xs font-bold hidden sm:inline', isCurrent ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-500')}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && <div className="flex-1 h-0.5 mx-3 bg-zinc-200 dark:bg-zinc-800" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Select Leave Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'general', title: 'General Campus Leave', desc: 'Day outing or personal errand' },
                    { id: 'home', title: 'Home Leave / Vacation', desc: 'Overnight journey to hometown' },
                    { id: 'outpass', title: 'Local Outing Log', desc: 'City mall, hospital, shopping (4-6 hours)' },
                    { id: 'library', title: 'Library Study Register', desc: 'Academic study after curfew (till 11 PM)' },
                  ].map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setType(cat.id as any)}
                      className={cn(
                        'p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2',
                        type === cat.id
                          ? 'bg-violet-50 dark:bg-violet-950/60 border-violet-600 text-violet-900 dark:text-white ring-2 ring-violet-500/30 shadow-md'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                      )}
                    >
                      <span className="font-bold text-sm">{cat.title}</span>
                      <span className="text-xs text-zinc-500">{cat.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Next: Choose Timings</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Specify Dates & Time Windows</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Departure Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  {(type === 'home' || type === 'general') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Expected Return Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  )}

                  {(type === 'outpass' || type === 'library') && (
                    <>
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
                    </>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Next: Reason & Submit</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Reason & Destination Details</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Destination / Purpose of Leave</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Central Tech Library / Indiranagar Bangalore"
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Detailed Reason *</label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide full explanation for warden review..."
                    required
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Once submitted, Dr. Sr. Mary Thomas (Warden) will review your request in the live approval queue.</span>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* History Table */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-violet-600" />
          <span>Application History & Approval Status</span>
        </h2>
        <DataTable
          columns={columns}
          data={studentLeaves}
          searchPlaceholder="Search leave reason or destination..."
          title="My Leave Applications"
        />
      </div>
    </div>
  );
}
