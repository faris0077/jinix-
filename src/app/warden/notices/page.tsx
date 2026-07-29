'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { Megaphone, Send, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Notice } from '@/lib/mock-data';

export default function WardenNoticesPage() {
  const store = useChavaraStore() as any; // Cast to any to avoid strict type issues if interface missed export
  const notices: Notice[] = store.notices || [];
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [targetAudience, setTargetAudience] = useState<'All' | 'A' | 'B' | 'C' | 'D'>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    store.addNotice({
      title,
      message,
      priority,
      targetAudience,
    });
    
    setTitle('');
    setMessage('');
    setPriority('normal');
    setTargetAudience('All');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-8 h-8 text-violet-600" />
            Digital Notice Board
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Broadcast important announcements and alerts to all students or specific blocks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Compose Broadcast */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Compose Broadcast</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-600 transition-all font-bold ${
                      priority === 'urgent' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30' :
                      priority === 'high' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' :
                      'bg-zinc-100 dark:bg-zinc-900 border-transparent text-zinc-900 dark:text-white'
                    }`}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Alert</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-transparent focus:border-violet-500 focus:ring-2 focus:ring-violet-600 transition-all"
                  >
                    <option value="All">All Students</option>
                    <option value="A">Block A Only</option>
                    <option value="B">Block B Only</option>
                    <option value="C">Block C Only</option>
                    <option value="D">Block D Only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Notice Title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Scheduled Power Outage"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Message Content *</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type the full announcement here..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-violet-600 min-h-[150px]"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3.5 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Broadcast Notice
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Broadcast History */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-500" />
            Broadcast History
          </h2>
          
          <div className="space-y-4">
            {notices.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8 glass-card rounded-3xl">No past broadcasts.</p>
            ) : (
              notices.map((notice) => (
                <div 
                  key={notice.id} 
                  className={`p-4 rounded-2xl border-l-4 transition-all ${
                    notice.priority === 'urgent' ? 'bg-red-50 dark:bg-red-500/10 border-red-500' :
                    notice.priority === 'high' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500' :
                    'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {notice.priority === 'urgent' && <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                    {notice.priority === 'high' && <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    {notice.priority === 'normal' && <CheckCircle2 className="w-4 h-4 text-zinc-400" />}
                    
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      To: {notice.targetAudience === 'All' ? 'All Students' : `Block ${notice.targetAudience}`}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-1 leading-tight">{notice.title}</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">{notice.message}</p>
                  
                  <div className="mt-3 text-[10px] text-zinc-400 flex justify-between">
                    <span>By {notice.author}</span>
                    <span>{new Date(notice.date).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
