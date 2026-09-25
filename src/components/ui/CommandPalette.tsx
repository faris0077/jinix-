'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useChavaraStore } from '@/lib/store';
import {
  LayoutDashboard,
  Calendar,
  Home,
  BookOpen,
  MapPin,
  Utensils,
  CreditCard,
  AlertCircle,
  Users,
  CheckSquare,
  BarChart3,
  Search,
  Sparkles,
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence, EASE_OUT, Stagger, StaggerItem } from '@/lib/motion';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { currentUser } = useChavaraStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-md z-50"
          />

          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                scale: 0.98,
                y: -10,
                filter: 'blur(4px)',
                transition: { duration: 0.18, ease: 'easeIn' },
              }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="w-full max-w-2xl glass-strong rounded-3xl overflow-hidden pointer-events-auto"
            >
              <Command
                label="Global Command Palette"
                shouldFilter={true}
                className="w-full"
              >
                <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Type a command or search modules... (e.g. 'Leave', 'Complaints', 'Approvals')"
                    className="w-full py-4 bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => onOpenChange(false)}
                    className="p-1 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Command.List className="max-h-[380px] overflow-y-auto p-2 space-y-2">
                  <Command.Empty className="py-10 text-center text-sm text-zinc-500">
                    No results found for <span className="font-bold text-zinc-900 dark:text-white">"{search}"</span>.
                  </Command.Empty>

                  <Stagger stagger={0.05} delay={0.05} className="space-y-2">
                  {/* Student Modules */}
                  {currentUser.role === 'student' && (
                  <StaggerItem className="[&:has([cmdk-group][hidden])]:hidden">
                  <Command.Group heading="🎓 Student Modules" className="px-2 py-1.5 text-xs font-bold text-zinc-400 uppercase">
                    {[
                      { name: 'Student Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
                      { name: 'Request Leave (Multi-step)', href: '/student/leave-requests', icon: Calendar },
                      { name: 'Home Leave & Food Req', href: '/student/home-leave', icon: Home },
                      { name: 'Library Digital Pass', href: '/student/library-pass', icon: BookOpen },
                      { name: 'Local Outing & Movement Log', href: '/student/outpass', icon: MapPin },
                      { name: 'Swiggy / Zomato Delivery Log & Meals', href: '/student/food-orders', icon: Utensils },
                      { name: 'Pay Hostel Fees & Receipts', href: '/student/fee-payment', icon: CreditCard },
                      { name: 'Log Maintenance Complaint', href: '/student/complaints', icon: AlertCircle },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.href}
                          onSelect={() => runCommand(() => router.push(item.href))}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                        >
                          <Icon className="w-4 h-4 text-zinc-500" />
                          <span>{item.name}</span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                  </StaggerItem>
                  )}

                  {/* Warden Modules */}
                  {currentUser.role === 'warden' && (
                  <StaggerItem className="[&:has([cmdk-group][hidden])]:hidden">
                  <Command.Group heading="🛡️ Warden Modules" className="px-2 py-1.5 text-xs font-bold text-zinc-400 uppercase">
                    {[
                      { name: 'Warden Command Center', href: '/warden/dashboard', icon: LayoutDashboard },
                      { name: 'Approve Leaves & Outpasses (Live Queue)', href: '/warden/approvals', icon: CheckSquare },
                      { name: 'Student Directory Table', href: '/warden/students', icon: Users },
                      { name: 'Daily Attendance Roll-call', href: '/warden/attendance', icon: UserCheck },
                      { name: 'Kitchen Food Analytics & Tally', href: '/warden/food-analytics', icon: Utensils },
                      { name: 'Manage Student Complaints', href: '/warden/complaints', icon: AlertCircle },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.name}
                          onSelect={() => runCommand(() => router.push(item.href))}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                        >
                          <Icon className="w-4 h-4 text-violet-500" />
                          <span>{item.name}</span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                  </StaggerItem>
                  )}

                  {/* Director Modules */}
                  {currentUser.role === 'director' && (
                  <StaggerItem className="[&:has([cmdk-group][hidden])]:hidden">
                  <Command.Group heading="👔 Director Executive Suite" className="px-2 py-1.5 text-xs font-bold text-zinc-400 uppercase">
                    {[
                      { name: 'Executive C-Suite KPI Dashboard', href: '/director/dashboard', icon: BarChart3 },
                      { name: 'Financial & Occupancy Export Reports', href: '/director/reports', icon: FileText },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.name}
                          onSelect={() => runCommand(() => router.push(item.href))}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                        >
                          <Icon className="w-4 h-4 text-amber-500" />
                          <span>{item.name}</span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                  </StaggerItem>
                  )}
                  </Stagger>
                </Command.List>

                <div className="px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span>Navigate with <kbd className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">↑</kbd> <kbd className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">↓</kbd></span>
                    <span>Select with <kbd className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">Enter</kbd></span>
                  </div>
                  <span className="flex items-center gap-1 font-semibold text-violet-600 dark:text-violet-400">
                    <Sparkles className="w-3 h-3" /> Quick Search
                  </span>
                </div>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
