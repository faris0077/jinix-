'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/lib/mock-data';
import { Users, Mail, Phone, Building2, GraduationCap, ExternalLink, ShieldCheck, X } from 'lucide-react';

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
          <img src={row.original.avatar} alt={row.original.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20 shrink-0" />
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
            Room {row.original.roomNumber || '304A'}
          </span>
          <span className="text-[11px] text-zinc-400 block mt-1 font-semibold">Block {row.original.block || 'B'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'course',
      header: 'Course & Academic Year',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-xs text-zinc-900 dark:text-white">{row.original.course || 'B.Tech CSE & AI'}</p>
          <p className="text-[10px] text-zinc-500 uppercase font-semibold">{row.original.year || '2nd Year'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Contact Numbers',
      cell: ({ row }) => (
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
            <Phone className="w-3 h-3 text-violet-500" /> {row.original.phone || '+91 98765 43210'}
          </p>
          <p className="text-[10px] text-zinc-400">Parent: {row.original.parentPhone || '+91 98765 43211'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'attendanceToday',
      header: 'Today\'s Gate Status',
      cell: ({ row }) => <StatusBadge status={row.original.attendanceToday || 'present'} />,
    },
    {
      id: 'actions',
      header: 'Profile Modal',
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedStudent(row.original)}
          className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-violet-600 hover:text-white text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-all flex items-center gap-1.5"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-violet-600" />
          <span>Resident Scholars Directory</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Complete database of female scholars in Block B. Filter by room number, course, or attendance status.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search resident name, email, course, or room number..."
        title="Block B Resident Scholars Directory"
      />

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-violet-500/20" />
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">{selectedStudent.name}</h3>
                <StatusBadge status={selectedStudent.attendanceToday || 'present'} size="sm" className="mt-1" />
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-2.5">
              <div className="flex justify-between"><span className="text-zinc-400 font-medium">Room & Block:</span><strong className="text-zinc-900 dark:text-white font-bold">Room {selectedStudent.roomNumber || '304A'} (Block {selectedStudent.block || 'B'})</strong></div>
              <div className="flex justify-between"><span className="text-zinc-400 font-medium">Course:</span><strong className="text-zinc-900 dark:text-white font-bold">{selectedStudent.course || 'B.Tech CSE'}</strong></div>
              <div className="flex justify-between"><span className="text-zinc-400 font-medium">Student Mobile:</span><strong className="text-zinc-900 dark:text-white font-bold">{selectedStudent.phone || '+91 98765 43210'}</strong></div>
              <div className="flex justify-between"><span className="text-zinc-400 font-medium">Guardian Contact:</span><strong className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedStudent.parentPhone || '+91 98765 43211'} (SMS Active)</strong></div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
