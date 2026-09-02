'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { useChavaraStore } from '@/lib/store';
import { Search, Package, Plus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  listItem,
  hoverLift,
  fadeIn,
  springs,
  EASE_OUT,
} from '@/lib/motion';

export default function LostFoundPage() {
  const { lostFoundItems, reportLostFoundItem, resolveLostFoundItem, currentUser } = useChavaraStore();
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'electronics' | 'clothing' | 'books' | 'keys' | 'other'>('electronics');

  const filteredItems = lostFoundItems.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    reportLostFoundItem({
      type,
      title,
      description,
      category,
    });
    
    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Search className="w-8 h-8 text-violet-600" />
            Lost & Found Board
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Report lost items or post items you've found on campus.
          </p>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-violet-600/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Report Item
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-fit">
        {(['all', 'lost', 'found'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${
              activeTab === tab
                ? 'text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="lost-found-tab-pill"
                className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-sm"
                transition={springs.soft}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence initial={false}>
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            variants={listItem}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            {...hoverLift}
            className={`glass-card p-5 rounded-3xl space-y-4 relative overflow-hidden border-2 transition-colors ${
              item.status === 'resolved' 
                ? 'border-emerald-500/20 opacity-70' 
                : item.type === 'lost' 
                  ? 'border-amber-500/20 hover:border-amber-500/40' 
                  : 'border-emerald-500/20 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                item.type === 'lost' 
                  ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400' 
                  : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-400'
              }`}>
                {item.type === 'lost' ? <AlertCircle className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                {item.type}
              </span>
              
              {item.status === 'resolved' ? (
                 <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                   <CheckCircle2 className="w-4 h-4" /> Resolved
                 </span>
              ) : (
                <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Active
                </span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white leading-tight mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="block text-zinc-400">Reported by</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-300">{item.reportedBy}</span>
              </div>
              <div className="text-right">
                <span className="block text-zinc-400">Date</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-300">
                  {format(new Date(item.date), 'd MMM yyyy')}
                </span>
              </div>
            </div>

            {item.status === 'open' && item.studentId === currentUser.id && (
              <div className="pt-2">
                <motion.button
                  onClick={() => resolveLostFoundItem(item.id)}
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  className="w-full py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white transition-colors text-sm font-bold flex justify-center items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800"
        >
          <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No items found</h3>
          <p className="text-zinc-500">There are no {activeTab !== 'all' ? activeTab : ''} items reported currently.</p>
        </motion.div>
      )}

      {/* Modal for reporting item */}
      <AnimatePresence>
      {isModalOpen && (
        <motion.div
          key="report-item-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 relative"
          >
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">Report Item</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${type === 'lost' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-zinc-200 dark:border-zinc-800'}`}>
                  <input type="radio" className="hidden" checked={type === 'lost'} onChange={() => setType('lost')} />
                  <AlertCircle className={`w-6 h-6 mb-2 ${type === 'lost' ? 'text-amber-500' : 'text-zinc-400'}`} />
                  <span className={`block font-bold ${type === 'lost' ? 'text-amber-700 dark:text-amber-500' : 'text-zinc-500'}`}>I Lost Something</span>
                </label>
                <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${type === 'found' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-zinc-200 dark:border-zinc-800'}`}>
                  <input type="radio" className="hidden" checked={type === 'found'} onChange={() => setType('found')} />
                  <Package className={`w-6 h-6 mb-2 ${type === 'found' ? 'text-emerald-500' : 'text-zinc-400'}`} />
                  <span className={`block font-bold ${type === 'found' ? 'text-emerald-700 dark:text-emerald-500' : 'text-zinc-500'}`}>I Found Something</span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Title / Item Name *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Blue Hydroflask Water Bottle"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Description *</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Where was it last seen? Any distinguishing features?"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-violet-600 min-h-[100px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing / Accessories</option>
                  <option value="books">Books / Notes</option>
                  <option value="keys">Keys / Cards</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <motion.button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20"
                >
                  Submit Post
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
