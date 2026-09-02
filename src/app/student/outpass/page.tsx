'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  ShieldCheck,
  UserCheck,
  History,
  ArrowLeft,
  Sparkles,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence, springs, listItem, Stagger, StaggerItem, Reveal, EASE_OUT } from '@/lib/motion';
import { toast } from 'sonner';

export default function StudentOutpassPage() {
  const { currentUser, studentLeaves, addLeaveRequest, logStudentReturn } = useChavaraStore();
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [startTime, setStartTime] = useState('15:00');
  const [notifyGuardian, setNotifyGuardian] = useState(true);

  const outpassHistory = studentLeaves.filter((l) => l.type === 'outpass');
  const activeOutpass = outpassHistory.find((l) => l.status === 'approved' || l.status === 'pending');
  const isCurrentlyOut = currentUser.attendanceToday === 'outpass';

  const handleLogOuting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !reason) {
      toast.error('Please enter destination and purpose');
      return;
    }

    addLeaveRequest({
      type: 'outpass',
      startDate: new Date().toISOString().split('T')[0],
      startTime,
      reason: `${reason} (Destination: ${destination})`,
      destination,
    });

    setDestination('');
    setReason('');
    toast.success('Local Outing Logged!', {
      description: 'Your request is visible on the Warden supervisory console.',
    });
  };

  const handleMarkReturn = () => {
    logStudentReturn(currentUser.id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <MapPin className="w-7 h-7 text-violet-600" />
            <span>Local Outing & Movement Log</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Register your local outings to the city, market, or coaching classes. Real-time sync with Warden operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-xl border border-violet-300/40 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            Curfew Timing: 08:30 PM
          </span>
        </div>
      </div>

      <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Register New Outing Form */}
        <StaggerItem className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-violet-600" />
                <span>Log New Local Outing</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                Instant Warden Log
              </span>
            </div>

            <form onSubmit={handleLogOuting} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Destination / Place to Visit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Lulu Mall, MG Road, Apollo Dental Clinic..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Purpose / Reason <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Buying reference books, medical checkup, group study..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Departure Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer select-none p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    checked={notifyGuardian}
                    onChange={(e) => setNotifyGuardian(e.target.checked)}
                    className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
                  />
                  <span>Send automatic movement confirmation SMS to registered guardian ({currentUser.parentPhone || '+91 98765 43211'})</span>
                </label>
              </div>

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4" /> Register Outing in Campus Log
              </motion.button>
            </form>
          </div>
        </StaggerItem>

        {/* Right Column: Active Status & Action */}
        <StaggerItem className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-violet-500/30 relative overflow-hidden bg-gradient-to-br from-violet-900/10 via-purple-900/5 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Current Location Status
              </span>
              <StatusBadge status={isCurrentlyOut ? 'outpass' : activeOutpass?.status || 'present'} size="sm" />
            </div>

            <div className="space-y-3 pt-2">
              <AnimatePresence mode="wait" initial={false}>
                {isCurrentlyOut || (activeOutpass && activeOutpass.status === 'approved') ? (
                  <motion.div
                    key="status-out"
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Currently Logged Outside Campus</span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        Warden has signed off on your outing to <strong className="font-bold">{activeOutpass?.destination || 'City Center'}</strong>. Please ensure return before 08:30 PM curfew.
                      </p>
                    </div>

                    <motion.button
                      onClick={handleMarkReturn}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={springs.snappy}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Mark Returned to Room {currentUser.roomNumber || '304A'}
                    </motion.button>
                  </motion.div>
                ) : activeOutpass && activeOutpass.status === 'pending' ? (
                  <motion.div
                    key="status-pending"
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 space-y-2 text-center"
                  >
                    <Clock className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="font-bold text-sm">Warden Review Pending</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Your request for {activeOutpass.destination} is currently being reviewed by Dr. Sr. Mary Thomas.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="status-present"
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Present Inside Campus</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      You are checked into Room {currentUser.roomNumber || '304A'} (Block B). No active outings logged.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="p-5 rounded-3xl bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Outing Regulations
            </h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>All local outings must be logged at least 30 minutes before departure.</li>
              <li>Late arrivals beyond 08:30 PM will trigger an automated exception log on the Warden console.</li>
              <li>For overnight stays out of station, please use the <strong>Home Leave</strong> module.</li>
            </ul>
          </div>
        </StaggerItem>
      </Stagger>

      {/* Outing History Register */}
      <Reveal className="glass-card p-6 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-zinc-800/80">
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-violet-600" />
          <span>Past Local Outing History Log</span>
        </h3>

        <div className="space-y-2 pt-1">
          {outpassHistory.length === 0 && (
            <p className="text-xs text-zinc-500 italic py-4 text-center">No past outings logged in this semester.</p>
          )}
          <AnimatePresence initial={false}>
            {outpassHistory.map((item) => (
              <motion.div
                key={item.id}
                variants={listItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{item.destination || 'City Center'}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.reason}</p>
                </div>
                <div className="text-left sm:text-right text-xs space-y-0.5">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{item.startDate}</p>
                  <p className="text-zinc-500">Departure: <strong className="font-semibold">{item.startTime || '14:00'}</strong></p>
                  {item.actualArrivalTime ? (
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Arrived at Gate: {item.actualArrivalTime}
                    </p>
                  ) : (
                    <p className="text-amber-500 font-semibold italic">Awaiting Gate Check-in</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Reveal>
    </div>
  );
}
