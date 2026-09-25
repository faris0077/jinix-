'use client';

import React, { useRef, useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { LeaveRequest } from '@/lib/mock-data';
import { Send, UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, springs, Stagger, StaggerItem, Reveal, EASE_OUT } from '@/lib/motion';
import { toast } from 'sonner';

export default function ClassLeavePage() {
  const { currentUser, studentLeaves, addLeaveRequest } = useChavaraStore();
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLeaveRequest({
      type: 'class',
      reason,
      startDate,
      endDate,
      medicalCertName: file || undefined,
    });
    toast.success('Academic Class Leave logged!', {
      description: file ? 'Supporting document attached for verification.' : 'Your request has been submitted for review.',
    });
    setReason('');
    setFile(null);
  };

  const classLeaves = studentLeaves.filter((l) => l.type === 'class');

  const columns: ColumnDef<LeaveRequest>[] = [
    {
      accessorKey: 'id',
      header: 'Request ID',
      cell: ({ row }) => <span className="font-mono font-bold text-xs text-violet-600 dark:text-violet-400">{row.original.id}</span>,
    },
    {
      accessorKey: 'reason',
      header: 'Medical / Academic Reason',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-sm text-zinc-900 dark:text-white">{row.original.reason}</p>
          {row.original.medicalCertName && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <FileText className="w-3 h-3" /> Cert: {row.original.medicalCertName}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Dates',
      cell: ({ row }) => <span className="text-xs font-bold">{row.original.startDate} to {row.original.endDate || 'N/A'}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <Send className="w-6 h-6 text-violet-600" />
          <span>Academic Class Leave & Medical Certificates</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Submit leave applications for course absenteeism. Attach signed medical practitioner certificates for attendance exemption.
        </p>
      </div>

      <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <StaggerItem className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="font-bold text-base text-zinc-900 dark:text-white">Submit Academic Exemption Application</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">From Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">To Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Detailed Reason *</label>
              <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe the reason for your absence" required className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border text-sm font-medium" />
            </div>

            {/* Drag and Drop File Upload Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Medical Certificate / Supporting Document</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  if (picked) setFile(picked.name);
                  e.target.value = '';
                }}
              />
              <AnimatePresence mode="wait" initial={false}>
                {file ? (
                  <motion.div
                    key="cert-uploaded"
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{file} (Uploaded successfully)</span>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setFile(null)}
                      whileTap={{ scale: 0.97 }}
                      transition={springs.snappy}
                      className="text-rose-500 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cert-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="p-8 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-violet-500 transition-all text-center cursor-pointer bg-zinc-50/50 dark:bg-zinc-900/30 space-y-2"
                  >
                    <UploadCloud className="w-8 h-8 text-violet-500 mx-auto" />
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Click to upload or drag & drop medical certificate</p>
                    <p className="text-[10px] text-zinc-400">Supported formats: PDF, PNG, JPG (Max 5MB)</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Class Leave Request
            </motion.button>
          </form>
        </StaggerItem>

        <StaggerItem className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>Attendance Policy</span>
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Attach a supporting document such as a medical certificate where applicable. Your request will be reviewed by the warden.
          </p>
        </StaggerItem>
      </Stagger>

      <Reveal>
        <DataTable columns={columns} data={classLeaves} title="Academic Leave History" />
      </Reveal>
    </div>
  );
}
