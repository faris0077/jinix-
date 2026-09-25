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
  const { feePayments, studentLeaves, complaints, rooms, foodOrders } = useChavaraStore();

  const handleDownloadReport = (title: string, format: 'PDF' | 'EXCEL') => {
    toast.success(`Generating ${format} Report: ${title}`, {
      description: `Report requested at ${new Date().toLocaleTimeString()}.`,
    });
  };

  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const mealsBooked = foodOrders.filter((f) => f.ordered).length;

  const reportCategories = [
    {
      title: 'Financial Audit & Fee Reconciliation',
      desc: 'Ledger of student fee payments and outstanding balances.',
      icon: DollarSign,
      color: 'from-emerald-600 to-teal-600',
      records: `${feePayments.length} Invoices`,
      id: 'fin-01',
    },
    {
      title: 'Gate Movement & Curfew Compliance Log',
      desc: 'Student leave, outpass and gate movement records.',
      icon: ShieldCheck,
      color: 'from-violet-600 to-teal-700',
      records: `${studentLeaves.length} Gate Logs`,
      id: 'sec-02',
    },
    {
      title: 'Accommodation & Room Allocation Census',
      desc: 'Bed occupancy across residence blocks.',
      icon: Users,
      color: 'from-blue-600 to-teal-700',
      records: `${totalBeds} Beds / ${rooms.length} Rooms`,
      id: 'occ-03',
    },
    {
      title: 'Mess Headcount & Dietary Consumption Analysis',
      desc: 'Meal booking tallies for catering planning.',
      icon: Utensils,
      color: 'from-amber-600 to-orange-600',
      records: `${mealsBooked} Meals Booked`,
      id: 'food-04',
    },
    {
      title: 'Maintenance & Helpdesk Dossier',
      desc: 'Status of maintenance and helpdesk complaints across all blocks.',
      icon: AlertCircle,
      color: 'from-rose-600 to-pink-600',
      records: `${complaints.length} Tickets`,
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
          Generate financial ledgers, gate compliance logs, and occupancy censuses from current records.
        </p>
      </div>

      {/* Quick Action Top Bar */}
      <TiltCard max={4}>
      <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 hero-surface text-white shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Master Executive Package
          </span>
          <h2 className="text-lg font-bold text-white">Download Board Governance Dossier</h2>
          <p className="text-xs text-zinc-300">Bundles all departmental reports listed below.</p>
        </div>

        <motion.button
          onClick={() => handleDownloadReport('Board Governance Dossier', 'PDF')}
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
