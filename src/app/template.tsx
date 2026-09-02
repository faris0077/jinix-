'use client';

import { PageTransition } from '@/lib/motion';

// template.tsx remounts on every route change, giving each page a
// consistent entrance without per-page boilerplate.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
