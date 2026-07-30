import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { initialsOf } from '../../../templates/shared/portfolio-template-helpers';

type RailIcon = 'grid' | 'resume' | 'portfolio';
interface RailLink { path: string; label: string; icon: RailIcon; }

@Component({
  selector: 'app-builder-rail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="hidden xl:flex w-[228px] shrink-0 h-full flex-col bg-slate-950 text-white px-3.5 pt-4 pb-4">
      <a routerLink="/dashboard" class="flex items-center gap-2.5 px-2 pb-5">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center font-extrabold text-sm shadow-glow">A</span>
        <span class="text-[14px] font-bold tracking-tight">ApnaConverter</span>
      </a>

      <div class="flex flex-col gap-0.5 flex-1">
        @for (l of links; track l.path) {
          <a [routerLink]="l.path"
             class="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors relative"
             [class]="isActive(l.path) ? 'bg-primary-600/25 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'">
            @if (isActive(l.path)) {
              <span class="absolute left-[-14px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r bg-primary-500"></span>
            }
            <span class="w-[18px] h-[18px] shrink-0 inline-flex">
              @switch (l.icon) {
                @case ('grid') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
                }
                @case ('resume') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>
                }
                @case ('portfolio') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 20h8"/></svg>
                }
              }
            </span>
            {{ l.label }}
          </a>
        }
      </div>

      @if (!auth.isPro()) {
        <div class="mt-3 p-3.5 rounded-2xl border border-white/10 bg-gradient-to-br from-primary-600/25 to-transparent">
          <div class="w-7 h-7 rounded-lg bg-primary-500/25 flex items-center justify-center mb-2 text-primary-300">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"><path d="M12 2l2.6 6.2L21 9l-5 4.4L17.4 20 12 16.6 6.6 20 8 13.4 3 9l6.4-.8z"/></svg>
          </div>
          <p class="text-[12px] font-bold text-white mb-1">Upgrade to Pro</p>
          <p class="text-[11px] text-slate-400 leading-snug mb-3">Unlock premium templates, publishing and more.</p>
          <a routerLink="/resume-builder/pricing"
             class="block text-center w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-[12px] font-bold transition-colors">
            Upgrade Now
          </a>
        </div>
      }

      <div class="mt-3 flex items-center gap-2.5 px-2 py-2">
        <span class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-200 shrink-0">
          {{ initials() }}
        </span>
        <div class="min-w-0">
          <p class="text-[12px] font-semibold text-white truncate">{{ auth.user()?.name || 'Your account' }}</p>
          <p class="text-[11px] text-slate-500 capitalize">{{ auth.currentPlan() }} Plan</p>
        </div>
      </div>
    </nav>
  `,
})
export class BuilderRailComponent {
  readonly auth = inject(AuthService);

  readonly links: RailLink[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid' },
    { path: '/resume-builder', label: 'Resume Builder', icon: 'resume' },
    { path: '/portfolio', label: 'Portfolio Builder', icon: 'portfolio' },
  ];

  initials(): string {
    return initialsOf(this.auth.user()?.name);
  }

  isActive(path: string): boolean {
    return path === '/portfolio';
  }
}
