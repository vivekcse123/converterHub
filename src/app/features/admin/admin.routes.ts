import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard | ApnaConverter',
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users-list.component').then(m => m.UsersListComponent),
        title: 'Users - Admin',
      },
      {
        path: 'portfolios',
        loadComponent: () => import('./portfolios/portfolios-list.component').then(m => m.PortfoliosListComponent),
        title: 'Portfolios - Admin',
      },
      {
        path: 'conversions',
        loadComponent: () => import('./conversions/conversions-list.component').then(m => m.ConversionsListComponent),
        title: 'File Conversions - Admin',
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./subscriptions/subscriptions-overview.component').then(m => m.SubscriptionsOverviewComponent),
        title: 'Subscriptions & Payments - Admin',
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/analytics-dashboard.component').then(m => m.AnalyticsDashboardComponent),
        title: 'Analytics & Revenue - Admin',
      },
      {
        path: 'activity',
        loadComponent: () => import('./activity-logs/activity-logs.component').then(m => m.ActivityLogsComponent),
        title: 'Activity Logs - Admin',
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings - Admin',
      },
    ],
  },
];
