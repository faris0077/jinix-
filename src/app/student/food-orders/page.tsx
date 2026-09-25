'use client';

import React, { useState } from 'react';
import { useChavaraStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import {
  Utensils,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  ShoppingBag,
  Send,
  Phone,
  PackageCheck,
  History,
  Truck,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence, listItem, springs, Stagger, StaggerItem } from '@/lib/motion';
import { toast } from 'sonner';

export default function FoodOrdersPage() {
  const { foodOrders, toggleFoodOrder, externalDeliveries, addExternalDelivery, markDeliveryCollected, currentUser } = useChavaraStore();

  // External delivery form state
  const [platform, setPlatform] = useState<'Swiggy' | 'Zomato' | 'Instamart' | 'Zepto' | 'Blinkit' | 'Domino\'s' | 'Other'>('Swiggy');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState(currentUser.course || '');
  const [roomNo, setRoomNo] = useState(currentUser.roomNumber || '');
  const [expectedTime, setExpectedTime] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');

  const orderedCount = foodOrders.filter((f) => f.ordered).length;
  const myDeliveries = externalDeliveries.filter((d) => d.studentId === currentUser.id || currentUser.role !== 'student');
  const activeDeliveries = myDeliveries.filter((d) => d.status === 'en-route' || d.status === 'arrived-gate');
  const pastDeliveries = myDeliveries.filter((d) => d.status === 'collected');

  const handleLogDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNo || !department || !deliveryDate) {
      toast.error('Please fill in all required delivery details');
      return;
    }

    addExternalDelivery({
      platform,
      date: deliveryDate,
      department,
      roomNumber: roomNo,
      restaurantOrStore: platform,
      itemsSummary: 'Not specified',
      expectedTime,
      deliveryPartnerPhone: partnerPhone || undefined,
    });

    setPartnerPhone('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Utensils className="w-7 h-7 text-violet-600" />
            <span>Dining & External Delivery Register</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage campus mess bookings or register incoming Swiggy, Zomato, and Instamart deliveries for campus gate clearance.
          </p>
        </div>

      </div>

        {/* External Delivery Gate Register Tab */}
        <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Log Form */}
          <div className="lg:col-span-2 space-y-6">
            <StaggerItem className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-orange-500" />
                    <span>Log Incoming External Food Delivery</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Pre-register your Swiggy, Zomato, or Instamart order so campus security permits gate entry.
                  </p>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-lg border border-orange-200 dark:border-orange-900">
                  Gate Clearance
                </span>
              </div>

              <form onSubmit={handleLogDelivery} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Which Delivery Partner <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    >
                      <option value="Swiggy">Swiggy Food / Genie</option>
                      <option value="Zomato">Zomato Delivery</option>
                      <option value="Instamart">Swiggy Instamart</option>
                      <option value="Zepto">Zepto 10-Min</option>
                      <option value="Blinkit">Blinkit Grocery</option>
                      <option value="Domino's">Domino's Pizza</option>
                      <option value="Other">Other Delivery Partner</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Delivery Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Expected Arrival Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={expectedTime}
                      onChange={(e) => setExpectedTime(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Department / Course <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Your department or course"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Room No <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      placeholder="Your room number"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Partner Phone / OTP (Optional)
                    </label>
                    <input
                      type="text"
                      value={partnerPhone}
                      onChange={(e) => setPartnerPhone(e.target.value)}
                      placeholder="Phone number or OTP"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs"
                    />
                  </div>
                </div>



                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <Truck className="w-4 h-4" /> Register Delivery in Warden & Gate Console
                </motion.button>
              </form>
            </StaggerItem>

            {/* Active Deliveries List */}
            <StaggerItem className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-zinc-200/80 dark:border-zinc-800/80">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-orange-500" />
                <span>Active & Incoming Deliveries ({activeDeliveries.length})</span>
              </h3>

              <div className="space-y-3 pt-1">
                {activeDeliveries.length === 0 && (
                  <p className="text-xs text-zinc-500 italic py-6 text-center bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    No active external deliveries en route right now. Register your order above!
                  </p>
                )}
                <AnimatePresence initial={false}>
                    {activeDeliveries.map((deliv) => (
                      <motion.div
                        key={deliv.id}
                        variants={listItem}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className={cn(
                          'p-5 rounded-2xl border transition-colors space-y-3',
                          deliv.status === 'arrived-gate'
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-md'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                        )}
                      >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                            {deliv.platform}
                          </span>
                          <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{deliv.restaurantOrStore}</span>
                        </div>

                        <span className={cn(
                          'text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0',
                          deliv.status === 'arrived-gate'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        )}>
                          {deliv.status === 'arrived-gate' ? '🛵 Arrived at Gate!' : 'En Route to Gate'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex-wrap">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">Room {deliv.roomNumber}</span>
                        <span>•</span>
                        <span>{deliv.department || '—'}</span>
                        <span>•</span>
                        <span>Date: <strong className="text-zinc-700 dark:text-zinc-300">{deliv.date || '—'}</strong></span>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{deliv.itemsSummary}</p>

                      <div className="flex flex-col gap-1 text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                            <Clock className="w-3.5 h-3.5 text-orange-500" /> Expected: {deliv.expectedTime}
                          </span>
                          {deliv.deliveryPartnerPhone && (
                            <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px]">
                              Partner: {deliv.deliveryPartnerPhone}
                            </span>
                          )}
                        </div>
                        {deliv.actualArrivalTime ? (
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> Gate Arrival Marked: {deliv.actualArrivalTime}
                          </p>
                        ) : (
                          <p className="text-amber-500 italic text-[11px] font-medium">Awaiting Arrival at Security Gate</p>
                        )}
                      </div>

                        <motion.button
                          onClick={() => markDeliveryCollected(deliv.id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          transition={springs.snappy}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Mark Collected at Security Gate
                        </motion.button>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </StaggerItem>
          </div>

          {/* Right Column: Gate Regulations & Past Log */}
          <div className="space-y-6">
            <StaggerItem className="glass-card p-6 rounded-3xl space-y-4 border border-orange-500/30 bg-gradient-to-br from-orange-950/20 via-zinc-900/10 to-transparent">
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-500" /> Gate Delivery Rules
              </h4>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed list-disc pl-4">
                <li>All outside food deliveries (Swiggy, Zomato, Domino's) must be logged in advance for security clearance.</li>
                <li>Delivery partners are restricted to the <strong>Main Security Gate</strong>.</li>
                <li>Deliveries arriving after curfew require Warden sign-off to be released from the guard cabin.</li>
                <li>Please collect and dispose of all plastic packaging in the designated recycling bins.</li>
              </ul>
            </StaggerItem>

            {/* Past Delivery History */}
            <StaggerItem className="glass-card p-6 rounded-3xl space-y-4 border border-zinc-200/80 dark:border-zinc-800/80">
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-orange-500" />
                <span>Past Collected Deliveries ({pastDeliveries.length})</span>
              </h3>

              <div className="space-y-2 pt-1 max-h-[350px] overflow-y-auto pr-1">
                {pastDeliveries.length === 0 && (
                  <p className="text-xs text-zinc-500 italic text-center py-4">No past food deliveries logged.</p>
                )}
                <AnimatePresence initial={false}>
                    {pastDeliveries.map((deliv) => (
                      <motion.div
                        key={deliv.id}
                        variants={listItem}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="p-3.5 rounded-2xl glass-control space-y-1.5 text-xs"
                      >
                      <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                        <span>{deliv.platform} - {deliv.restaurantOrStore}</span>
                        <span className="text-emerald-600 font-semibold text-[10px] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded shrink-0">
                          Collected ✅
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">Room {deliv.roomNumber}</span>
                        <span>•</span>
                        <span>{deliv.department || '—'}</span>
                        <span>•</span>
                        <span>{deliv.date || '—'}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">{deliv.itemsSummary}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {deliv.actualArrivalTime ? `Arrived at Gate: ${deliv.actualArrivalTime}` : `Expected: ${deliv.expectedTime}`}
                      </p>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </StaggerItem>
          </div>
        </Stagger>
    </div>
  );
}
