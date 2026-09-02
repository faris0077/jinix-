'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChavaraStore } from '@/lib/store';
import { UserRole } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Building,
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle2,
  Heart
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
  EASE_OUT,
  springs,
  Stagger,
  StaggerItem,
  TiltCard,
  AnimatedNumber,
} from '@/lib/motion';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useChavaraStore();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('ananya.sharma@chavara.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'student') setEmail('ananya.sharma@chavara.edu');
    if (newRole === 'warden') setEmail('mary.thomas@chavara.edu');
    if (newRole === 'director') setEmail('celine.dsouza@chavara.edu');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      switchRole(role);
      toast.success(`Welcome back to Chavara Residence OS!`, {
        description: `Logged into ${role.toUpperCase()} executive portal.`,
      });
      router.push(`/${role}/dashboard`);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-zinc-950 text-white overflow-hidden relative selection:bg-violet-600 selection:text-white">
      {/* Background Ambient Gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left Side: Luxury Architectural & Campus Illustration */}
      <Stagger
        stagger={0.12}
        delay={0.1}
        className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 overflow-hidden border-r border-zinc-800/80 bg-zinc-900/40"
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/30 to-transparent" />

        {/* Top Branding */}
        <StaggerItem className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xl text-white shadow-xl shadow-violet-600/40">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Chavara Residence <span className="text-xs bg-violet-600/30 border border-violet-500/40 px-2 py-0.5 rounded-full text-violet-300">OS v3.5</span>
            </h1>
            <p className="text-xs text-zinc-400">Enterprise Ladies Hostel Suite</p>
          </div>
        </StaggerItem>

        {/* Center Quote Card */}
        <StaggerItem className="relative z-10 max-w-xl my-auto space-y-6">
          <TiltCard
            max={4}
            className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
            <Sparkles className="w-8 h-8 text-violet-400" />
            <blockquote className="text-2xl sm:text-3xl font-medium leading-snug text-zinc-100 tracking-tight">
              &ldquo;An award-winning sanctuary where biometric security, digital gate passes, and effortless campus living converge.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3 pt-2 border-t border-white/10">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                alt="Director"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500"
              />
              <div>
                <p className="text-sm font-bold text-white">Rev. Sr. Celine D&apos;Souza</p>
                <p className="text-xs text-violet-400">Executive Director, Chavara Institutions</p>
              </div>
            </div>
          </TiltCard>
        </StaggerItem>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-3 gap-4 text-left">
          <StaggerItem className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-1">
              <ShieldCheck className="w-5 h-5" />
              <AnimatedNumber value={99.9} format={(v) => `${v.toFixed(1)}%`} />
            </div>
            <p className="text-xs text-zinc-400">Campus Security & Location Index</p>
          </StaggerItem>

          <StaggerItem className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-lg mb-1">
              <GraduationCap className="w-5 h-5" />
              <AnimatedNumber value={450} format={(v) => `${Math.round(v)}+`} />
            </div>
            <p className="text-xs text-zinc-400">Active Female Scholars</p>
          </StaggerItem>

          <StaggerItem className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-lg mb-1">
              <Heart className="w-5 h-5" />
              <span>4 Wings</span>
            </div>
            <p className="text-xs text-zinc-400">Luxury Accommodation Blocks</p>
          </StaggerItem>
        </div>
      </Stagger>

      {/* Right Side: Modern Login Card */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-12 xl:px-20 relative z-10 bg-zinc-950">
        <Stagger stagger={0.07} delay={0.12} className="w-full max-w-md mx-auto space-y-8">
          {/* Mobile Brand Logo */}
          <StaggerItem className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-lg text-white">
              C
            </div>
            <span className="font-bold text-lg tracking-tight">Chavara Residence OS</span>
          </StaggerItem>

          {/* Form Header */}
          <StaggerItem className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Sign in to Portal</h2>
            <p className="text-sm text-zinc-400">
              Select your authorization role and access your residence dashboard.
            </p>
          </StaggerItem>

          {/* Interactive Role Selector Tabs */}
          <StaggerItem className="p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 grid grid-cols-3 gap-1.5 shadow-inner">
            {[
              { id: 'student', label: 'Student', icon: GraduationCap },
              { id: 'warden', label: 'Warden', icon: UserCheck },
              { id: 'director', label: 'Director', icon: Building },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = role === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => handleRoleChange(tab.id as UserRole)}
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors relative',
                    isSelected
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="role-tab-pill"
                      className="absolute inset-0 rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30"
                      transition={springs.soft}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 shrink-0 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </StaggerItem>

          {/* Role Status Note */}
          <StaggerItem className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 flex items-center gap-2.5 text-xs text-violet-300">
            <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Demo Mode Active: Logging in as <strong>{role === 'student' ? 'Ananya Sharma (Student)' : role === 'warden' ? 'Dr. Sr. Mary Thomas (Warden)' : "Rev. Sr. Celine D'Souza (Director)"}</strong>.</span>
          </StaggerItem>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <StaggerItem className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-zinc-500 font-normal">Chavara SSO</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                />
              </div>
            </StaggerItem>

            <StaggerItem className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span>Password</span>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('Password reset instructions sent to your campus email.'); }} className="text-[11px] text-violet-400 hover:underline font-normal capitalize">
                  Forgot Password?
                </a>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileTap={{ scale: 0.97 }}
                  transition={springs.snappy}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </div>
            </StaggerItem>

            <StaggerItem className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                <span>Remember me for 30 days</span>
              </label>
            </StaggerItem>

            <StaggerItem>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snappy}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                      className="flex items-center justify-center gap-2"
                    >
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating via Biometric Token...</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="signin"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Sign in as {role.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </StaggerItem>
          </form>

          {/* Footer Legal & Security */}
          <StaggerItem className="pt-6 border-t border-zinc-900 text-center space-y-2">
            <p className="text-[11px] text-zinc-500">
              Protected by Chavara 256-bit SSL Biometric Gate Security.
            </p>
            <p className="text-[11px] text-zinc-600">
              © 2026 Chavara Institutions. Built with Vercel & Linear UI standards.
            </p>
          </StaggerItem>
        </Stagger>
      </div>
    </div>
  );
}
