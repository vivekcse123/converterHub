import { BadgeVariant } from '../components/badge/badge.component';

export interface HomeProductCard {
  icon: string;
  iconBg: string;
  title: string;
  /** What happens after clicking — shown on the card so the destination is never a surprise. */
  nextStep: string;
  route: string;
  queryParams?: Record<string, string>;
  badge: string | null;
  badgeVariant: BadgeVariant;
}

/**
 * Single source of truth for the homepage product grid. Replaces the old
 * `products[]` array (home.component.ts) plus a manually bolted-on, un-tracked
 * 9th "File Converter" tile that lived only in the template — that
 * duplication was a real bug (the array and the rendered grid could drift
 * independently). Also closes the gaps flagged in the redesign brief: no
 * dedicated AI Resume Writer / AI Resume Improve cards, and no distinct PDF
 * Tools vs. Image Tools cards (previously one combined "File Converter" tile).
 */
export const HOME_PRODUCT_CARDS: HomeProductCard[] = [
  { icon: '📄', iconBg: 'bg-primary-100 dark:bg-primary-900/40', title: 'Resume Builder', nextStep: 'Opens the builder, pick a template and start typing', route: '/resume-builder', badge: null, badgeVariant: 'neutral' },
  { icon: '✍️', iconBg: 'bg-violet-100 dark:bg-violet-900/40', title: 'AI Resume Writer', nextStep: 'Opens the builder with the AI panel ready to draft your summary', route: '/resume-builder', queryParams: { ai: 'writer' }, badge: 'AI', badgeVariant: 'primary' },
  { icon: '⚡', iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-900/40', title: 'AI Resume Improve', nextStep: 'Opens the builder with the AI panel ready to rewrite your bullet points', route: '/resume-builder', queryParams: { ai: 'improve' }, badge: 'AI', badgeVariant: 'primary' },
  { icon: '🎯', iconBg: 'bg-blue-100 dark:bg-blue-900/40', title: 'ATS Checker', nextStep: 'Scores your resume against a job description in real time', route: '/ats-resume-checker', badge: 'Free', badgeVariant: 'success' },
  { icon: '✉️', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', title: 'Cover Letter Builder', nextStep: 'Generates a tailored cover letter from your resume instantly', route: '/resume-builder/cover-letter', badge: 'Pro', badgeVariant: 'primary' },
  { icon: '💍', iconBg: 'bg-rose-100 dark:bg-rose-900/40', title: 'Biodata Maker', nextStep: 'Opens the biodata editor: marriage & professional formats, all free', route: '/biodata-maker', badge: 'Free', badgeVariant: 'success' },
  { icon: '🌐', iconBg: 'bg-indigo-100 dark:bg-indigo-900/40', title: 'Portfolio Builder', nextStep: 'Opens the portfolio editor, get a shareable live URL', route: '/portfolio', badge: 'Pro', badgeVariant: 'primary' },
  { icon: '✂️', iconBg: 'bg-violet-100 dark:bg-violet-900/40', title: 'Background Remover', nextStep: 'Removes the background from your photo, then lets you swap in a new one', route: '/background-remover', badge: 'New', badgeVariant: 'warning' },
  { icon: '📕', iconBg: 'bg-red-100 dark:bg-red-900/40', title: 'PDF Tools', nextStep: 'Opens the tools gallery pre-filtered to merge, split, compress & more', route: '/tools', queryParams: { category: 'pdf' }, badge: null, badgeVariant: 'neutral' },
  { icon: '🖼️', iconBg: 'bg-cyan-100 dark:bg-cyan-900/40', title: 'Image Tools', nextStep: 'Opens the tools gallery pre-filtered to image converters & editors', route: '/tools', queryParams: { category: 'image' }, badge: null, badgeVariant: 'neutral' },
  { icon: '🏛️', iconBg: 'bg-orange-100 dark:bg-orange-900/40', title: 'Govt Resume Builder', nextStep: 'Opens a template with a declaration section & passport photo', route: '/government-resume-builder', badge: 'New', badgeVariant: 'warning' },
  { icon: '🎓', iconBg: 'bg-teal-100 dark:bg-teal-900/40', title: 'Fresher Resume Builder', nextStep: 'Opens first-job templates for freshers & recent graduates', route: '/fresher-resume-builder', badge: 'Free', badgeVariant: 'success' },
  { icon: '📚', iconBg: 'bg-amber-100 dark:bg-amber-900/40', title: 'Template Library', nextStep: 'Browse 30+ templates, pick one, then build', route: '/resume-templates', badge: '30+', badgeVariant: 'warning' },
];
