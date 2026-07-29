'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { Search, Package, Plus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-300">
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-violet-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Report Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-fit">
        {(['all', 'lost', 'found'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`glass-card p-5 rounded-3xl space-y-4 relative overflow-hidden border-2 transition-all ${
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
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {item.status === 'open' && item.studentId === currentUser.id && (
              <div className="pt-2">
                <button
                  onClick={() => resolveLostFoundItem(item.id)}
                  className="w-full py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white transition-colors text-sm font-bold flex justify-center items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No items found</h3>
          <p className="text-zinc-500">There are no {activeTab !== 'all' ? activeTab : ''} items reported currently.</p>
        </div>
      )}

      {/* Modal for reporting item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 relative">
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
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20"
                >
                  Submit Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
