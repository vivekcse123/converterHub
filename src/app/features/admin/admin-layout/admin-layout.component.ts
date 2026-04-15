import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <!-- Sidebar -->
      <aside class="w-64 shrink-0 bg-slate-900 text-white flex flex-col">
        <div class="px-6 py-5 border-b border-slate-700">
          <span class="text-xl font-bold tracking-tight">
            <span class="text-indigo-400">⚙</span> Admin Panel
          </span>
        </div>
        <nav class="flex-1 p-4 space-y-1">
          <a *ngFor="let item of navItems" [routerLink]="item.path" routerLinkActive="bg-indigo-600 text-white"
             class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <span class="text-lg">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </a>
        </nav>
        <div class="p-4 border-t border-slate-700">
          <div class="text-xs text-slate-400 mb-2">{{ auth.user()?.email }}</div>
          <div class="flex gap-2">
            <a routerLink="/" class="text-xs text-slate-400 hover:text-white">← Back to app</a>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  constructor(public auth: AuthService) {}

  navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard'   },
    { path: '/admin/users',     icon: '👥', label: 'Users'        },
    { path: '/admin/analytics', icon: '📈', label: 'Analytics'    },
    { path: '/admin/jobs',      icon: '⚙️', label: 'Job Monitor'  },
    { path: '/admin/settings',  icon: '🛠', label: 'Settings'      },
  ];
}
