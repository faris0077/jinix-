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
import { toast } from 'sonner';

export default function StudentLibraryPassPage() {
  const { currentUser, studentLeaves, addLeaveRequest, logStudentReturn } = useChavaraStore();
  const [section, setSection] = useState('Central Digital AI & Reference Lab (Block C)');
  const [reason, setReason] = useState('');
  const [returnTime, setReturnTime] = useState('22:30');

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
      startTime: '18:30',
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
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-purple-600" />
            <span>Central Library Study Register</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Register evening and post-curfew study sessions at the Chavara Central Library.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-xl border border-purple-300/40 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-600" />
            Library Closing: 11:00 PM
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-600" />
                <span>Register Evening Study Session</span>
              </h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg">
                Curfew Extension Active
              </span>
            </div>

            <form onSubmit={handleLogLibrary} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Library Wing / Reading Section <span className="text-rose-500">*</span>
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                >
                  <option value="Central Digital AI & Reference Lab (Block C)">Central Digital AI & Reference Lab (Block C)</option>
                  <option value="Post-Graduate Silent Reading Hall (Block A)">Post-Graduate Silent Reading Hall (Block A)</option>
                  <option value="Architecture & Design Periodicals Wing (Block D)">Architecture & Design Periodicals Wing (Block D)</option>
                  <option value="24/7 Collaborative Study Center (Main Campus)">24/7 Collaborative Study Center (Main Campus)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Study Topic / Research Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. AI Neural Network thesis reading, Semester end exam prep..."
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
                <p className="text-[11px] text-zinc-400">Library study sessions allow curfew extension up to 11:00 PM.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <BookOpen className="w-4 h-4" /> Log Study Hours in Warden Register
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Active Status */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-purple-500/30 relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Library Status
              </span>
              <StatusBadge status={isCurrentlyInLibrary ? 'library' : activeLibraryLog?.status || 'present'} size="sm" />
            </div>

            <div className="space-y-3 pt-2">
              {isCurrentlyInLibrary || (activeLibraryLog && activeLibraryLog.status === 'approved') ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Clock className="w-4 h-4 text-purple-500 animate-pulse" />
                      <span>Registered at Central Library</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      You are currently logged at <strong className="font-bold">{activeLibraryLog?.destination || section}</strong>. Curfew extension active until {activeLibraryLog?.endTime || '10:30 PM'}.
                    </p>
                  </div>

                  <button
                    onClick={() => logStudentReturn(currentUser.id)}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Mark Returned to Room {currentUser.roomNumber || '304A'}
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">In Residence Wing</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    No active library sessions logged for tonight.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-purple-500" /> Library Log Guidelines
            </h4>
            <p>By registering your study session, the Warden can immediately see your location during evening roll calls without disturbing your research.</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-zinc-800/80">
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-purple-600" />
          <span>Past Library Study Log</span>
        </h3>

        <div className="space-y-2 pt-1">
          {libraryLogs.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-4 text-center">No library study logs recorded yet.</p>
          ) : (
            libraryLogs.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{item.destination || 'Central Library'}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.reason}</p>
                </div>
                <div className="text-left sm:text-right text-xs space-y-0.5">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{item.startDate}</p>
                  <p className="text-zinc-500">Departure: <strong className="font-semibold">{item.startTime || '18:30'}</strong> • Expected: <strong className="font-semibold">{item.endTime || '22:30'}</strong></p>
                  {item.actualArrivalTime ? (
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Returned to Room: {item.actualArrivalTime}
                    </p>
                  ) : (
                    <p className="text-amber-500 font-semibold italic">Awaiting Return Check-in</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
