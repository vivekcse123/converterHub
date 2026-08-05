import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { proGuard } from '../../core/guards/pro.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-shell.component').then((m) => m.DashboardShellComponent),
    canActivate: [authGuard],
    data: { hideShell: true },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/dashboard-home.component').then((m) => m.DashboardHomeComponent),
        title: 'Dashboard | ApnaConverter',
        data: { description: 'Your ApnaConverter dashboard — resumes, portfolios, conversions, and account overview.' },
      },
      {
        path: 'job-tracker',
        loadComponent: () => import('../resume-builder/pages/job-tracker/job-tracker.component').then((m) => m.JobTrackerComponent),
        canActivate: [proGuard],
        title: 'Job Application Tracker | ApnaConverter',
        data: { description: 'Track every job application, interview, and offer in one place. Pro feature.' },
      },
      {
        path: 'billing',
        loadComponent: () => import('./pages/billing/dashboard-billing.component').then((m) => m.DashboardBillingComponent),
        title: 'Billing | ApnaConverter',
        data: { description: 'Manage your ApnaConverter subscription and view your payment history.' },
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/dashboard-settings.component').then((m) => m.DashboardSettingsComponent),
        title: 'Settings | ApnaConverter',
        data: { description: 'Manage your ApnaConverter profile, password, and appearance preferences.' },
      },
    ],
  },
];
