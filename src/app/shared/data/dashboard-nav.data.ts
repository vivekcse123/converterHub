import { IconName } from './icon-paths.data';

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: IconName;
  /** Route relative to `/dashboard`, unless `external` is true (then absolute). */
  route: string;
  group: string;
  /** True for real, already-built pages that live outside `/dashboard/*` (e.g. Job Tracker). */
  external?: boolean;
}

/**
 * Sidebar + command palette navigation source of truth. Phase 1 only lists
 * entries with a real, built page — the full ~18-item information
 * architecture (Resume/Portfolio/Converter/AI dashboards, My Projects,
 * Templates, Media Library, Downloads, Published Sites, Analytics, Billing,
 * Notifications, Team, API Keys, Integrations, Settings, Help) is added here
 * incrementally as each later phase lands its route — never as a dead link.
 */
export const DASHBOARD_NAV: DashboardNavItem[] = [
  { id: 'home', label: 'Dashboard', icon: 'dashboard', route: '', group: 'Overview' },
  { id: 'job-tracker', label: 'Job Tracker', icon: 'briefcase', route: 'job-tracker', group: 'Overview' },
  { id: 'billing', label: 'Billing', icon: 'credit-card', route: 'billing', group: 'Account' },
  { id: 'settings', label: 'Settings', icon: 'settings', route: 'settings', group: 'Account' },
];

export function dashboardNavHref(item: DashboardNavItem): string {
  if (item.external) return item.route;
  return item.route ? `/dashboard/${item.route}` : '/dashboard';
}

export interface DashboardQuickAction {
  id: string;
  label: string;
  description: string;
  icon: IconName;
  /** Absolute app route (outside `/dashboard`). */
  route: string;
}

/** Shared by Dashboard Home's Quick Actions grid and the command palette. */
export const DASHBOARD_QUICK_ACTIONS: DashboardQuickAction[] = [
  { id: 'new-resume', label: 'New Resume', description: 'Start a fresh resume from a template', icon: 'file-text', route: '/resume-builder' },
  { id: 'new-portfolio', label: 'New Portfolio', description: 'Build your personal portfolio site', icon: 'layout-grid', route: '/portfolio' },
  { id: 'convert-file', label: 'Convert File', description: 'Browse 37+ free conversion tools', icon: 'refresh', route: '/tools' },
  { id: 'cover-letter', label: 'Generate Cover Letter', description: 'AI-assisted cover letter for any role', icon: 'send', route: '/resume-builder/cover-letter' },
  { id: 'ats-review', label: 'AI Resume Review', description: 'Get an ATS score and AI suggestions', icon: 'sparkles', route: '/resume-builder' },
  { id: 'ai-portfolio', label: 'AI Portfolio', description: 'Let AI draft your portfolio bio & projects', icon: 'sparkles', route: '/portfolio' },
  { id: 'browse-templates', label: 'Browse Templates', description: '30+ ATS-friendly resume templates', icon: 'grid', route: '/resume-templates' },
  { id: 'job-tracker', label: 'Track a Job Application', description: 'Log applications and interview stages', icon: 'briefcase', route: '/dashboard/job-tracker' },
];
