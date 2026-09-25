'use client';

import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Timeline } from '@/components/ui/Timeline';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Complaint } from '@/lib/mock-data';
import { AlertCircle, Send, UploadCloud, Wrench, CheckCircle2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence, Stagger, StaggerItem, Reveal, springs, scaleIn } from '@/lib/motion';

export default function ComplaintsPage() {
  const { complaints, addComplaint } = useChavaraStore();
  const [category, setCategory] = useState<'plumbing' | 'electrical' | 'wifi' | 'food' | 'security' | 'other'>('wifi');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const latest = [...complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const fmt = (d?: string) => {
    const t = d ? new Date(d) : null;
    return t && !isNaN(t.getTime()) ? format(t, 'd MMM, HH:mm') : undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please enter a title and description.');
      return;
    }
    addComplaint({
      category,
      title,
      description,
      imageUrl: image || undefined,
    });
    setTitle('');
    setDescription('');
    setImage(null);
  };

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: 'id',
      header: 'Ticket ID',
      cell: ({ row }) => <span className="font-mono font-bold text-xs text-violet-600 dark:text-violet-400">{row.original.id}</span>,
    },
    {
      accessorKey: 'title',
      header: 'Complaint & Category',
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-white">{row.original.title}</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">{row.original.category}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 max-w-sm truncate">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned Specialist',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          {row.original.assignedTo || 'Pending Assignment'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Resolution Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <div className="space-y-10">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
          <Wrench className="w-6 h-6 text-violet-600" />
          <span>Maintenance Complaint & Helpdesk Ticket System</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Report plumbing, Wi-Fi, electrical, or food issues directly to the campus maintenance engineers.
        </p>
      </div>

      <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <StaggerItem className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-violet-600" />
            <span>Log New Helpdesk Ticket</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border text-sm font-medium capitalize focus:ring-2 focus:ring-violet-500"
                >
                  {['wifi', 'plumbing', 'electrical', 'food', 'security', 'other'].map((c) => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Issue Title / Headline *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary of the issue" required className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Detailed Problem Description *</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe exact location, timings, and symptoms..." required className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border text-sm font-medium" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Attach Photo Proof (Optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  if (picked) setImage(picked.name);
                  e.target.value = '';
                }}
              />
              <AnimatePresence mode="wait" initial={false}>
                {image ? (
                  <motion.div
                    key="attached"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25, ease: 'easeIn' } }}
                    className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-500/30 flex items-center justify-between text-xs font-semibold text-violet-700 dark:text-violet-300"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-violet-500" /> {image}
                    </span>
                    <motion.button type="button" whileTap={{ scale: 0.97 }} transition={springs.snappy} onClick={() => setImage(null)} className="text-rose-500 hover:underline"><Trash2 className="w-4 h-4" /></motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25, ease: 'easeIn' } }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-violet-500 transition-colors text-center cursor-pointer bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1"
                  >
                    <UploadCloud className="w-7 h-7 text-violet-500 mx-auto" />
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Click to upload photo evidence</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Complaint Ticket
            </motion.button>
          </form>
        </StaggerItem>

        <StaggerItem className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white">Latest Ticket Resolution Timeline</h3>
          {latest ? (
            <Timeline
              steps={[
                { title: `Ticket ${latest.id} Logged`, description: latest.title, timestamp: fmt(latest.createdAt), status: 'completed' },
                {
                  title: latest.assignedTo ? `Assigned to ${latest.assignedTo}` : 'Awaiting Assignment',
                  description: latest.assignedTo ? 'Maintenance is handling this ticket' : 'Not yet assigned to a specialist',
                  timestamp: latest.status === 'in-progress' ? 'In Progress' : latest.status === 'resolved' ? 'Done' : 'Pending',
                  status: latest.status === 'resolved' ? 'completed' : latest.status === 'in-progress' ? 'current' : 'pending',
                },
                {
                  title: 'Final Resolution & Sign-off',
                  description: latest.status === 'resolved' ? 'Ticket resolved' : 'Ticket not yet resolved',
                  timestamp: latest.status === 'resolved' ? fmt(latest.resolvedAt) : 'Pending',
                  status: latest.status === 'resolved' ? 'completed' : 'pending',
                },
              ]}
            />
          ) : (
            <p className="text-xs text-zinc-500 italic py-6 text-center">No tickets logged yet.</p>
          )}
        </StaggerItem>
      </Stagger>

      <Reveal delay={0.05}>
        <DataTable columns={columns} data={complaints} title="Helpdesk Complaint Logs" />
      </Reveal>
    </div>
  );
}
