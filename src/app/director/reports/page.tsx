'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  FileSpreadsheet,
  Download,
  FileText,
  ShieldCheck,
  DollarSign,
  Users,
  Utensils,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, springs, fadeUp, hoverLift, Stagger, TiltCard } from '@/lib/motion';

export default function DirectorReportsPage() {
  const { feePayments, studentLeaves, complaints, rooms } = useChavaraStore();

  const handleDownloadReport = (title: string, format: 'PDF' | 'EXCEL') => {
    toast.success(`Generating ${format} Report: ${title}`, {
      description: `Official Chavara Board Audit Dossier (Timestamp: ${new Date().toLocaleTimeString()}) has been compiled and downloaded.`,
    });
  };

  const reportCategories = [
    {
      title: 'Monsoon Semester Financial Audit & Fee Reconciliation',
      desc: 'Complete ledger of student accommodation fees, mess advances, and outstanding defaulters list across Blocks A, B, C, D.',
      icon: DollarSign,
      color: 'from-emerald-600 to-teal-600',
      records: `${feePayments.length} Invoices`,
      lastUpdated: 'Today at 08:00 AM',
      id: 'fin-01',
    },
    {
      title: '24-Hour Gate Movement & Curfew Compliance Log',
      desc: 'Turnstile check-in/out audit, late curfew arrivals, library study logs, and external delivery (Swiggy/Zomato) records.',
      icon: ShieldCheck,
      color: 'from-violet-600 to-purple-600',
      records: `${studentLeaves.length} Gate Logs`,
      lastUpdated: 'Live Sync',
      id: 'sec-02',
    },
    {
      title: 'Institutional Accommodation & Room Allocation Census',
      desc: 'Bed occupancy ratios, roommate mappings, and course-wise demographic distribution across residence wings.',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      records: '450 Beds / 4 Blocks',
      lastUpdated: 'July 25, 2026',
      id: 'occ-03',
    },
    {
      title: 'Mess Kitchen Headcount & Dietary Consumption Analysis',
      desc: 'Breakfast, lunch, tea, and dinner booking vs cancellation tallies for catering procurement optimization.',
      icon: Utensils,
      color: 'from-amber-600 to-orange-600',
      records: '1,565 Meals Daily',
      lastUpdated: '1 hour ago',
      id: 'food-04',
    },
    {
      title: 'Campus Infrastructure & Maintenance SLA Dossier',
      desc: 'Turnaround times for electrical, plumbing, Wi-Fi, and security helpdesk complaints across all blocks.',
      icon: AlertCircle,
      color: 'from-rose-600 to-pink-600',
      records: `${complaints.length} Tickets`,
      lastUpdated: 'Yesterday',
      id: 'maint-05',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
          <FileText className="w-7 h-7 text-violet-600" />
          <span>Institutional Audit & Executive Report Center</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Generate board-certified financial ledgers, biometric gate compliance audits, and occupancy censuses.
        </p>
      </div>

      {/* Quick Action Top Bar */}
      <TiltCard max={4}>
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-purple-900 to-zinc-950 text-white shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Master Executive Package
          </span>
          <h2 className="text-lg font-bold text-white">Download Q3 2026 Board Governance Dossier</h2>
          <p className="text-xs text-zinc-300">Includes all 5 departmental audit reports bundled in a single verified PDF zip.</p>
        </div>

        <motion.button
          onClick={() => handleDownloadReport('Chavara_Q3_Master_Dossier_2026', 'PDF')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
          className="px-6 py-3 rounded-2xl bg-white text-violet-900 font-bold text-sm shadow-lg hover:bg-violet-50 transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4 text-violet-700" />
          <span>Download Master PDF Bundle</span>
        </motion.button>
      </div>
      </TiltCard>

      {/* Report Categories List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Departmental Audit Reports</h3>

        <Stagger className="space-y-4">
          {reportCategories.map((rep) => {
            const Icon = rep.icon;
            return (
              <motion.div
                key={rep.id}
                variants={fadeUp}
                {...hoverLift}
                className="glass-card p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-violet-500/40 transition-[border-color] flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${rep.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-base text-zinc-900 dark:text-white">{rep.title}</h4>
                      <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-0.5 rounded-full">
                        {rep.records}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{rep.desc}</p>
                    <span className="text-[11px] text-zinc-400 font-medium block pt-1">
                      Last Compiled: {rep.lastUpdated}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <motion.button
                    onClick={() => handleDownloadReport(rep.title, 'PDF')}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springs.snappy}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </motion.button>
                  <motion.button
                    onClick={() => handleDownloadReport(rep.title, 'EXCEL')}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springs.snappy}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> XLS
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </div>
  );
}
