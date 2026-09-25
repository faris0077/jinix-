'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChavaraStore } from '@/lib/store';
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
} from '@/lib/motion';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, isCloudSynced, authStatus, currentUser } = useChavaraStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Already signed in (e.g. navigated back to /login manually) — bounce to the dashboard.
  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.replace(`/${currentUser.role}/dashboard`);
    }
  }, [authStatus, currentUser.role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isCloudSynced) {
      const result = await login(email, password);
      setIsLoading(false);
      if (!result.ok || !result.user) {
        toast.error('Sign in failed', { description: result.error ?? 'Check your email and password.' });
        return;
      }
      toast.success('Welcome back to Chavara Residence OS!', {
        description: `Logged into ${result.user.role.toUpperCase()} portal.`,
      });
      router.push(`/${result.user.role}/dashboard`);
      return;
    }

    setIsLoading(false);
    toast.error('Sign in unavailable', { description: 'The backend is not configured on this deployment.' });
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-background text-foreground overflow-hidden relative selection:bg-violet-600 selection:text-white">
      {/* Background Ambient Gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left Side: Luxury Architectural & Campus Illustration */}
      <Stagger
        stagger={0.12}
        delay={0.1}
        className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 overflow-hidden border-r border-teal-800/40 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 hero-surface text-white"
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-teal-900/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/30 to-transparent" />

        {/* Top Branding */}
        <StaggerItem className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-teal-500 to-teal-600 flex items-center justify-center font-bold text-xl text-white shadow-xl shadow-violet-600/40">
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
              <ShieldCheck className="w-5 h-5 text-teal-100" />
              <p className="text-xs text-teal-100">Secure sign-in for residents, wardens and administrators</p>
            </div>
          </TiltCard>
        </StaggerItem>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-3 gap-4 text-left">
          {[
            { icon: ShieldCheck, title: 'Digital gate passes', desc: 'Leave, outing and library approvals' },
            { icon: GraduationCap, title: 'Resident services', desc: 'Fees, meals, complaints and rooms' },
            { icon: Heart, title: 'Live notices', desc: 'Announcements reach every resident' },
          ].map((f) => (
            <StaggerItem key={f.title} className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
              <div className="flex items-center gap-2 text-teal-100 font-bold text-sm mb-1">
                <f.icon className="w-5 h-5" />
                <span>{f.title}</span>
              </div>
              <p className="text-xs text-teal-100/80">{f.desc}</p>
            </StaggerItem>
          ))}
        </div>
      </Stagger>

      {/* Right Side: Modern Login Card */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-12 xl:px-20 relative z-10 overflow-hidden ambient-bg">
        <div aria-hidden className="orb orb-a" />
        <div aria-hidden className="orb orb-b" />
        <Stagger stagger={0.07} delay={0.12} className="relative z-10 w-full max-w-md mx-auto space-y-6 glass-strong rounded-3xl p-8 sm:p-10">
          {/* Mobile Brand Logo */}
          <StaggerItem className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-lg text-white">
              C
            </div>
            <span className="font-bold text-lg tracking-tight">Chavara Residence OS</span>
          </StaggerItem>

          {/* Form Header */}
          <StaggerItem className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Sign in to Portal</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enter your Chavara Residence email and password.
            </p>
          </StaggerItem>

          {!isCloudSynced && (
            <StaggerItem className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Backend not configured. Add <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> to <strong>.env.local</strong> to enable sign in.</span>
            </StaggerItem>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <StaggerItem className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-zinc-500 font-normal">Chavara SSO</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isCloudSynced ? 'you@chavara.edu' : undefined}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                />
              </div>
            </StaggerItem>

            <StaggerItem className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                <span>Password</span>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('Ask a warden or director to reset your password from Manage Accounts.'); }} className="text-[11px] text-violet-400 hover:underline font-normal capitalize">
                  Forgot Password?
                </a>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isCloudSynced ? 'Your password' : undefined}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
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
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-teal-600 to-teal-700 text-white font-bold text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
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
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </StaggerItem>
          </form>

          {/* Footer Legal & Security */}
          <StaggerItem className="pt-6 border-t border-zinc-200 dark:border-zinc-900 text-center space-y-2">
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
