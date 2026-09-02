'use client';

/**
 * Chavara motion system — the single source of truth for animation.
 * Pages import { motion, AnimatePresence, variants, components } from here,
 * never from 'framer-motion' directly, so timing/physics stay consistent.
 *
 * Feel: quiet luxury. Small distances (8–20px), soft springs, blur-in
 * entrances, no bounce past 1.02 scale. Reduced motion is respected
 * globally via <MotionProvider> in the root layout.
 */

import React, { useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';

export { motion, AnimatePresence };

/* ----------------------------- easing & springs ----------------------------- */

/** Expo-out bezier: fast start, silky settle. The house easing. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const springs: { soft: Transition; snappy: Transition; gentle: Transition } = {
  /** Default for cards, panels, layout shifts. */
  soft: { type: 'spring', stiffness: 240, damping: 32, mass: 0.9 },
  /** Hover/tap micro-interactions. */
  snappy: { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 },
  /** Large hero elements, slow reveals. */
  gentle: { type: 'spring', stiffness: 140, damping: 26, mass: 1 },
};

/* --------------------------------- variants --------------------------------- */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

/** For rows in store-driven lists; pair with <AnimatePresence> for exits. */
export const listItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { opacity: 0, x: 12, transition: { duration: 0.25, ease: 'easeIn' } },
};

export const staggerContainer = (stagger = 0.06, delayChildren = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Spread onto any motion element for a refined lift on hover. */
export const hoverLift = {
  whileHover: { y: -4, scale: 1.01 },
  whileTap: { scale: 0.985 },
  transition: springs.snappy,
} as const;

/** Softer variant for wide rows/panels where scale would warp text. */
export const hoverGlow = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.995 },
  transition: springs.snappy,
} as const;

/* -------------------------------- components -------------------------------- */

/** Wraps the app once (root layout). Honors the OS reduced-motion setting. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Route-level entrance; mounted from app/template.tsx on every navigation. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Orchestrates children entrances; children must be <StaggerItem>. */
export function Stagger({
  children,
  className,
  stagger = 0.06,
  delay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variants = fadeUp,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/** Scroll-triggered reveal for below-the-fold sections. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-40px' }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Spring-animated number for stat tiles; re-animates when `value` changes. */
export function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 90, damping: 24, mass: 1 });
  const display = useTransform(spring, (v) =>
    format ? format(v) : Math.round(v).toLocaleString()
  );
  useEffect(() => {
    raw.set(value);
  }, [value, raw]);
  return <motion.span className={className}>{display}</motion.span>;
}

/** Subtle cursor-following 3D tilt. Decorative — use sparingly (hero cards). */
export function TiltCard({
  children,
  className,
  max = 5,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), springs.soft);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), springs.soft);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  );
}
