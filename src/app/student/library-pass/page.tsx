'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Send,
  Building2,
  ShieldCheck,
  History,
  Sparkles,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence, springs, listItem, Stagger, StaggerItem, Reveal, EASE_OUT } from '@/lib/motion';
import { toast } from 'sonner';

export default function StudentLibraryPassPage() {
  const { currentUser, studentLeaves, addLeaveRequest, logStudentReturn } = useChavaraStore();
  const [section, setSection] = useState('');
  const [reason, setReason] = useState('');
  const [returnTime, setReturnTime] = useState('');

  const libraryLogs = studentLeaves.filter((l) => l.type === 'library');
  const activeLibraryLog = libraryLogs.find((l) => l.status === 'approved' || l.status === 'pending');
  const isCurrentlyInLibrary = currentUser.attendanceToday === 'library';

  const handleLogLibrary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please enter study topic / reason');
      return;
    }

    addLeaveRequest({
      type: 'library',
      startDate: new Date().toISOString().split('T')[0],
      startTime: new Date().toTimeString().slice(0, 5),
      endTime: returnTime,
      reason: `Evening Study: ${reason} (${section})`,
      destination: section,
    });

    setReason('');
    toast.success('Library Study Registered!', {
      description: 'Warden notified of evening library study hours.',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-purple-600" />
            <span>Central Library Study Register</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Register evening and post-curfew study sessions at the Central Library.
          </p>
        </div>

      </div>

      <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <StaggerItem className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-600" />
                <span>Register Evening Study Session</span>
              </h3>
            </div>

            <form onSubmit={handleLogLibrary} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Library Wing / Reading Section <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="Where will you study?"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Study Topic / Research Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="What will you study?"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Expected Return to Room <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold max-w-xs"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <BookOpen className="w-4 h-4" /> Log Study Hours in Warden Register
              </motion.button>
            </form>
          </div>
        </StaggerItem>

        {/* Right Column: Active Status */}
        <StaggerItem className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-purple-500/30 relative overflow-hidden bg-gradient-to-br from-teal-900/10 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Library Status
              </span>
              <StatusBadge status={isCurrentlyInLibrary ? 'library' : activeLibraryLog?.status || 'present'} size="sm" />
            </div>

            <div className="space-y-3 pt-2">
              <AnimatePresence mode="wait" initial={false}>
                {isCurrentlyInLibrary || (activeLibraryLog && activeLibraryLog.status === 'approved') ? (
                  <motion.div
                    key="library-active"
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span>Registered at Central Library</span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        You are currently logged at <strong className="font-bold">{activeLibraryLog?.destination || section}</strong>. Expected return: {activeLibraryLog?.endTime || '—'}.
                      </p>
                    </div>

                    <motion.button
                      onClick={() => logStudentReturn(currentUser.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={springs.snappy}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" /> {currentUser.roomNumber ? `Mark Returned to Room ${currentUser.roomNumber}` : 'Mark Returned'}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="library-idle"
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">In Residence Wing</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      No active library sessions logged for tonight.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-purple-500" /> Library Log Guidelines
            </h4>
            <p>By registering your study session, the Warden can immediately see your location during evening roll calls without disturbing your research.</p>
          </div>
        </StaggerItem>
      </Stagger>

      {/* History */}
      <Reveal className="glass-card p-6 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-zinc-800/80">
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-purple-600" />
          <span>Past Library Study Log</span>
        </h3>

        <div className="space-y-2 pt-1">
          {libraryLogs.length === 0 && (
            <p className="text-xs text-zinc-500 italic py-4 text-center">No library study logs recorded yet.</p>
          )}
          <AnimatePresence initial={false}>
            {libraryLogs.map((item) => (
              <motion.div
                key={item.id}
                variants={listItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="p-4 rounded-2xl glass-control flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{item.destination || '—'}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.reason}</p>
                </div>
                <div className="text-left sm:text-right text-xs space-y-0.5">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{item.startDate}</p>
                  <p className="text-zinc-500">Departure: <strong className="font-semibold">{item.startTime || '—'}</strong> • Expected: <strong className="font-semibold">{item.endTime || '—'}</strong></p>
                  {item.actualArrivalTime ? (
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Returned to Room: {item.actualArrivalTime}
                    </p>
                  ) : (
                    <p className="text-amber-500 font-semibold italic">Awaiting Return Check-in</p>
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
