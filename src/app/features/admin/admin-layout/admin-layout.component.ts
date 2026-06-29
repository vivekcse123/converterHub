import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">

      <!-- Mobile top bar -->
      <header class="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <a routerLink="/" (click)="sidebarOpen.set(false)" class="flex items-center gap-2">
          <img src="assets/web-app-manifest-192x192.png" alt="ApnaConverter" class="w-8 h-8 object-contain">
          <span class="font-bold text-sm tracking-tight">Apna<span class="text-primary-400">Converter</span> <span class="text-slate-400 font-normal">Admin</span></span>
        </a>
        <button (click)="sidebarOpen.set(!sidebarOpen())" class="p-2 rounded-lg hover:bg-slate-700 transition-colors">
          @if (sidebarOpen()) {
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          } @else {
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          }
        </button>
      </header>

      <!-- Overlay -->
      @if (sidebarOpen()) {
        <div class="lg:hidden fixed inset-0 bg-black/50 z-30" (click)="sidebarOpen.set(false)"></div>
      }

      <div class="flex">
        <!-- Sidebar -->
        <aside [class]="sidebarOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
               class="fixed lg:sticky top-0 lg:top-0 z-40 h-screen w-64 shrink-0 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out">
          <div class="hidden lg:block px-5 py-4 border-b border-slate-700">
            <a routerLink="/" class="flex items-center gap-2.5 group" title="Back to ApnaConverter">
              <img src="assets/web-app-manifest-192x192.png" alt="ApnaConverter" class="w-9 h-9 object-contain group-hover:scale-105 transition-transform">
              <div>
                <p class="font-bold text-sm tracking-tight leading-tight">Apna<span class="text-primary-400">Converter</span></p>
                <p class="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Admin Panel</p>
              </div>
            </a>
            <a routerLink="/" class="mt-2.5 flex items-center gap-1 text-[11px] text-slate-400 hover:text-primary-400 transition-colors font-medium">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Back to Home
            </a>
          </div>
          <nav class="flex-1 p-4 space-y-1 overflow-y-auto mt-2 lg:mt-0">
            @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-indigo-600 text-white"
               (click)="sidebarOpen.set(false)"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
              <span class="text-lg">{{ item.icon }}</span>
              <span class="text-sm font-medium">{{ item.label }}</span>
            </a>
            }
          </nav>
          <div class="p-4 border-t border-slate-700">
            <div class="text-xs text-slate-400 truncate">{{ auth.user()?.email }}</div>
          </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1 min-w-0 overflow-auto">
          <div class="p-4 lg:p-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  readonly sidebarOpen = signal(false);
  constructor(public auth: AuthService) {}

  navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard'   },
    { path: '/admin/users',     icon: '👥', label: 'Users'        },
    { path: '/admin/analytics', icon: '📈', label: 'Analytics'    },
    { path: '/admin/jobs',      icon: '⚙️', label: 'Job Monitor'  },
    { path: '/admin/settings',  icon: '🛠', label: 'Settings'     },
  ];
}
