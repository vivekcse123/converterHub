import { IconName } from './icon-paths.data';

export interface AdminNavItem {
  id: string;
  label: string;
  route: string;
  icon: IconName;
  /** Sidebar item shows only if the current admin has at least one of these permissions. */
  permissions: string[];
}

// Only modules with real, working backends this phase — no "Coming Soon"
// entries. New items get added here exactly when their backend ships.
export const ADMIN_NAV: AdminNavItem[] = [
  { id: 'dashboard',    label: 'Dashboard',            route: 'dashboard',    icon: 'grid',        permissions: ['analytics.view'] },
  { id: 'users',        label: 'Users',                route: 'users',       icon: 'users',        permissions: ['users.view'] },
  { id: 'portfolios',   label: 'Portfolios',           route: 'portfolios',  icon: 'globe',         permissions: ['portfolios.view'] },
  { id: 'conversions',  label: 'File Conversions',     route: 'conversions', icon: 'file-text',     permissions: ['conversions.view'] },
  { id: 'subscriptions', label: 'Subscriptions & Payments', route: 'subscriptions', icon: 'credit-card', permissions: ['payments.view', 'users.subscription.manage'] },
  { id: 'analytics',    label: 'Analytics & Revenue',  route: 'analytics',   icon: 'bar-chart-2',   permissions: ['analytics.view'] },
  { id: 'activity',     label: 'Activity Logs',        route: 'activity',    icon: 'activity',      permissions: ['activity.view'] },
  { id: 'settings',     label: 'Settings',             route: 'settings',    icon: 'settings',      permissions: ['settings.plans.manage', 'settings.branding.manage', 'settings.logs.view'] },
];
