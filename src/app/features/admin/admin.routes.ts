import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard — ApnaConverter',
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users-list.component').then(m => m.UsersListComponent),
        title: 'Manage Users — Admin',
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent),
        title: 'Analytics — Admin',
      },
      {
        path: 'jobs',
        loadComponent: () => import('./jobs/jobs-monitor.component').then(m => m.JobsMonitorComponent),
        title: 'Job Monitor — Admin',
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings — Admin',
      },
    ],
  },
];
