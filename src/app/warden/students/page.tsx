'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/lib/mock-data';
import { Users, Mail, Phone, Building2, GraduationCap, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence, springs, EASE_OUT, Reveal } from '@/lib/motion';

export default function WardenStudentsPage() {
  const { users } = useChavaraStore();
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const students = users.filter((u) => u.role === 'student');

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Resident Scholar',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.avatar ? (
            <img src={row.original.avatar} alt={row.original.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0" />
          ) : (
            <span className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 font-extrabold text-sm flex items-center justify-center ring-2 ring-violet-500/20 shrink-0">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <p className="font-extrabold text-sm text-zinc-900 dark:text-white leading-tight">{row.original.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'roomNumber',
      header: 'Room Allocation',
      cell: ({ row }) => (
        <div>
          <span className="font-extrabold text-sm text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/60 px-2.5 py-1 rounded-lg">
            {row.original.roomNumber ? `Room ${row.original.roomNumber}` : '—'}
          </span>
          <span className="text-[11px] text-zinc-400 block mt-1 font-semibold">{row.original.block ? `Block ${row.original.block}` : '—'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'course',
      header: 'Course & Academic Year',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-xs text-zinc-900 dark:text-white">{row.original.course || '—'}</p>
          <p className="text-[10px] text-zinc-500 uppercase font-semibold">{row.original.year || '—'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Contact Numbers',
      cell: ({ row }) => (
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
            <Phone className="w-3 h-3 text-violet-500" /> {row.original.phone || '—'}
          </p>
          <p className="text-[10px] text-zinc-400">Parent: {row.original.parentPhone || '—'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'attendanceToday',
      header: 'Today\'s Gate Status',
      cell: ({ row }) => row.original.attendanceToday ? <StatusBadge status={row.original.attendanceToday} /> : <span className="text-xs text-zinc-400">—</span>,
    },
    {
      id: 'actions',
      header: 'Profile Modal',
      cell: ({ row }) => (
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
          onClick={() => setSelectedStudent(row.original)}
          className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-violet-600 hover:text-white text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3 h-3" />
        </motion.button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-violet-600" />
          <span>Resident Scholars Directory</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Complete directory of registered resident scholars. Filter by room number, course, or attendance status.
        </p>
      </div>

      <Reveal>
        <DataTable
          columns={columns}
          data={students}
          searchPlaceholder="Search resident name, email, course, or room number..."
          title="Resident Scholars Directory"
        />
      </Reveal>

      {/* Student Profile Modal */}
      <AnimatePresence>
      {selectedStudent && (
        <motion.div
          key="student-profile-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.25, ease: 'easeIn' } }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </motion.button>

            <div className="flex items-center gap-4">
              {selectedStudent.avatar ? (
                <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-violet-500/20" />
              ) : (
                <span className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 font-extrabold text-xl flex items-center justify-center ring-4 ring-violet-500/20">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">{selectedStudent.name}</h3>
                {selectedStudent.attendanceToday && <StatusBadge status={selectedStudent.attendanceToday} size="sm" className="mt-1" />}
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-2.5">
              <div className="flex justify-between"><span className="text-zinc-400 font-medium">Room & Block:</span><strong className="text-zinc-900 dark:text-white font-bold">{selectedStudent.roomNumber ? `Room ${selectedStudent.roomNumber}` : '—'}{selectedStudent.block ? ` (Block ${selectedStudent.block})` : ''}</strong></div>
              <div className="flex justify-between"><span className="text-zinc-400 font-medium">Course:</span><strong className="text-zinc-900 dark:text-white font-bold">{selectedStudent.course || '—'}</strong></div>
              <div className="flex justify-between"><span className="text-zinc-400 font-medium">Student Mobile:</span><strong className="text-zinc-900 dark:text-white font-bold">{selectedStudent.phone || '—'}</strong></div>
              <div className="flex justify-between"><span className="text-zinc-400 font-medium">Guardian Contact:</span><strong className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedStudent.parentPhone || '—'}</strong></div>
            </div>

            <div className="flex justify-end pt-2">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                onClick={() => setSelectedStudent(null)}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Close Profile
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
