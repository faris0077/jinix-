'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useChavaraStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User as UserIcon,
  Home,
  Calendar,
  BookOpen,
  Send,
  MapPin,
  Utensils,
  CreditCard,
  AlertCircle,
  Bell,
  Settings,
  Users,
  CheckSquare,
  ClipboardList,
  BarChart3,
  FileText,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRightLeft,
  Search,
  Bed,
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeHash, setActiveHash] = useState('');
  const { currentUser, switchRole, unreadNotificationCount, pendingLeaves } = useChavaraStore();

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  interface NavItem {
    name: string;
    href: string;
    icon: any;
    badge?: string | number;
  }

  const studentNavigation: NavItem[] = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Profile & Room', href: '/student/profile', icon: UserIcon },
    { name: 'Movement Logs', href: '/student/leave-requests', icon: Calendar },
    { name: 'Home Leave', href: '/student/home-leave', icon: Home },
    { name: 'Library Register', href: '/student/library-pass', icon: BookOpen },
    { name: 'Local Outing Log', href: '/student/outpass', icon: MapPin },
    { name: 'Class Leave', href: '/student/class-leave', icon: Send },
    { name: 'Food Orders', href: '/student/food-orders', icon: Utensils },
    { name: 'Fee Payment', href: '/student/fee-payment', icon: CreditCard },
    { name: 'Complaints', href: '/student/complaints', icon: AlertCircle },
    { name: 'Lost & Found', href: '/student/lost-found', icon: Search },
    { name: 'Room Change', href: '/student/room-change', icon: Bed },
    { name: 'Notifications', href: '/student/notifications', icon: Bell, badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined },
    { name: 'Settings', href: '/student/settings', icon: Settings },
  ];

  const wardenNavigation: NavItem[] = [
    { name: 'Warden Center', href: '/warden/dashboard', icon: LayoutDashboard },
    { name: 'Resident Directory', href: '/warden/students', icon: Users },
    { name: 'Leave & Outings', href: '/warden/approvals', icon: CheckSquare, badge: pendingLeaves.length > 0 ? pendingLeaves.length : undefined },
    { name: 'Location Roll', href: '/warden/attendance', icon: ClipboardList },
    { name: 'Announcements', href: '/warden/notices', icon: Megaphone },
    { name: 'Kitchen & Food', href: '/warden/food-analytics', icon: Utensils },
    { name: 'Complaints Log', href: '/warden/complaints', icon: AlertCircle },
    { name: 'Security Log', href: '/warden/visitors', icon: ShieldCheck },
    { name: 'Room Changes', href: '/warden/room-changes', icon: Bed, badge: 'New' },
    { name: 'Audit Reports', href: '/warden/reports', icon: FileText },
  ];

  const directorNavigation: NavItem[] = [
    { name: 'Executive KPI', href: '/director/dashboard', icon: BarChart3 },
    { name: 'Revenue & Finance', href: '/director/dashboard#revenue', icon: Award },
    { name: 'Occupancy Map', href: '/director/dashboard#occupancy', icon: Building2 },
    { name: 'Export Reports', href: '/director/reports', icon: FileText },
  ];

  const navItems: NavItem[] = 
    currentUser.role === 'warden' ? wardenNavigation :
    currentUser.role === 'director' ? directorNavigation : 
    studentNavigation;

  return (
    <aside
      className={cn(
        'relative h-screen bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-200/60 dark:border-zinc-800/60 flex flex-col transition-all duration-300 z-30 select-none soft-shadow',
        isCollapsed ? 'w-[80px]' : 'w-[260px]'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        {!isCollapsed ? (
          <Link href={`/${currentUser.role}/dashboard`} className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 font-bold text-lg shrink-0">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-zinc-900 dark:text-white tracking-tight leading-none text-base">
                Chavara
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 mt-0.5">
                Residence OS
              </span>
            </div>
          </Link>
        ) : (
          <Link href={`/${currentUser.role}/dashboard`} className="mx-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 font-bold text-lg">
              C
            </div>
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-7 h-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!isCollapsed && (
        <div className="px-3 pt-3">
          <div className="bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-transparent border border-violet-500/20 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-pulse" />
              <span className="text-xs font-semibold capitalize text-violet-900 dark:text-violet-300">
                {currentUser.role} Portal
              </span>
            </div>
            <span className="text-[10px] bg-violet-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
              Pro
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          let isActive = false;
          if (item.href.includes('#')) {
            const [baseHref, hash] = item.href.split('#');
            isActive = pathname === baseHref && activeHash === `#${hash}`;
          } else {
            const isMatchingPath = pathname === item.href || pathname.startsWith(`${item.href}/`);
            if (isMatchingPath) {
              const hasMatchingHashLink = navItems.some(nav => nav.href === `${pathname}${activeHash}` && nav.href.includes('#'));
              isActive = !hasMatchingHashLink;
            }
          }
          
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (item.href.includes('#')) {
                  const [, hash] = item.href.split('#');
                  setActiveHash(`#${hash}`);
                } else {
                  setActiveHash('');
                }
              }}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-600/20 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                )}
              />

              {!isCollapsed && (
                <span className="flex-1 truncate">{item.name}</span>
              )}

              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                  )}
                >
                  {item.badge}
                </span>
              )}

              {isCollapsed && item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-600 animate-ping" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Card & Quick Role Switcher */}
      <div className="p-3 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-sm">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/20"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {currentUser.roomNumber ? `Room ${currentUser.roomNumber}` : currentUser.role.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Interactive Role Switcher Pills */}
            <div className="pt-1">
              <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 mb-1 px-1 flex items-center justify-between">
                <span>Switch Demo View</span>
                <ArrowRightLeft className="w-3 h-3" />
              </p>
              <div className="grid grid-cols-3 gap-1">
                {(['student', 'warden', 'director'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      router.push(`/${role}/dashboard`);
                    }}
                    className={cn(
                      'text-[10px] py-1 rounded-lg font-bold uppercase transition-all',
                      currentUser.role === role
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                    )}
                  >
                    {role === 'student' ? 'Stu' : role === 'warden' ? 'War' : 'Dir'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/20"
              title={`${currentUser.name} (${currentUser.role})`}
            />
            <button
              onClick={() => {
                const nextRole = currentUser.role === 'student' ? 'warden' : currentUser.role === 'warden' ? 'director' : 'student';
                switchRole(nextRole);
                router.push(`/${nextRole}/dashboard`);
              }}
              className="w-8 h-8 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-violet-600 hover:text-white flex items-center justify-center text-xs font-bold uppercase transition-colors"
              title="Switch Demo Role"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
