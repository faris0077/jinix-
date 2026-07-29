'use client';

import React from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { FeePayment } from '@/lib/mock-data';
import { CreditCard, Download, CheckCircle2, ShieldCheck, Sparkles, DollarSign, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function FeePaymentPage() {
  const { feePayments, payFee } = useChavaraStore();

  const pendingAmount = feePayments.filter((f) => f.status === 'pending' || f.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = feePayments.filter((f) => f.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);

  const handleDownloadReceipt = (receiptNo: string) => {
    toast.success('Downloading PDF Receipt...', {
      description: `Official Chavara digital receipt ${receiptNo}.pdf saved to device.`,
    });
  };

  const columns: ColumnDef<FeePayment>[] = [
    {
      accessorKey: 'id',
      header: 'Invoice ID',
      cell: ({ row }) => <span className="font-mono font-bold text-xs text-violet-600 dark:text-violet-400">{row.original.id}</span>,
    },
    {
      accessorKey: 'title',
      header: 'Fee Category / Description',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-sm text-zinc-900 dark:text-white">{row.original.title}</p>
          <p className="text-[10px] text-zinc-400 uppercase font-semibold">{row.original.category} fee</p>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <span className="font-extrabold text-sm text-zinc-900 dark:text-white">${row.original.amount}</span>,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date / Paid On',
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.status === 'paid' ? (
            <span className="text-emerald-600 font-medium">Paid: {row.original.paidOn}</span>
          ) : (
            <span className="text-amber-600 font-bold">Due: {row.original.dueDate}</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'action',
      header: 'Receipt / Action',
      cell: ({ row }) => {
        const item = row.original;
        if (item.status === 'paid' && item.receiptNo) {
          return (
            <button
              onClick={() => handleDownloadReceipt(item.receiptNo!)}
              className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-violet-50 dark:hover:bg-violet-950/60 text-zinc-700 dark:text-zinc-300 hover:text-violet-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" /> Receipt #{item.receiptNo.split('-')[2]}
            </button>
          );
        }
        return (
          <button
            onClick={() => payFee(item.id)}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" /> Pay Now ${item.amount}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <CreditCard className="w-6 h-6 text-violet-600" />
          <span>Semester Fee Payment & Digital Receipts</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Stripe-secured payment gateway for hostel accommodation, mess advance, and amenities invoices.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-900 via-purple-900 to-zinc-950 text-white border border-violet-500/30 shadow-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <span className="text-xs font-bold uppercase tracking-wider text-violet-300 block">Total Outstanding Due</span>
          <span className="text-3xl font-extrabold block">${pendingAmount}</span>
          <p className="text-xs text-zinc-300">Next billing date: July 31st, 2026</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Cleared Semester Payments</span>
          <span className="text-3xl font-extrabold text-emerald-600 block">${paidAmount}</span>
          <p className="text-xs text-zinc-500">All invoices verified by accounts dept</p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-3 flex flex-col justify-center border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" /> 256-Bit SSL Encrypted
          </div>
          <p className="text-xs text-zinc-500">
            Instant PDF receipt download with Chavara Accounts barcode endorsement.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={feePayments} title="Invoices & Transactions" />
    </div>
  );
}
