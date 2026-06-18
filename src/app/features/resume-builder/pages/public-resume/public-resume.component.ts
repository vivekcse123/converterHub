import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { ResumeData } from '../../models/resume.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-public-resume',
  standalone: true,
  imports: [CommonModule, RouterLink, ResumePreviewComponent],
  template: `
    @if (loading()) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-500 text-sm">Loading resume…</p>
        </div>
      </div>
    } @else if (notFound()) {
      <div class="min-h-screen flex items-center justify-center p-6">
        <div class="text-center max-w-md">
          <p class="text-6xl mb-4">📄</p>
          <h1 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Resume Not Found</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">This resume link is invalid or has been unpublished by its owner.</p>
          <a routerLink="/resume-builder" class="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold">Build Your Own Resume</a>
        </div>
      </div>
    } @else if (resume()) {
      <!-- Minimal top bar -->
      <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <a routerLink="/" class="text-xs font-bold text-violet-700 dark:text-violet-400">ApnaConverter</a>
        <div class="flex items-center gap-3">
          @if (views() > 0) {
            <span class="text-xs text-slate-400">{{ views() }} view{{ views() !== 1 ? 's' : '' }}</span>
          }
          <a routerLink="/resume-builder" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition">Create Your Resume →</a>
        </div>
      </div>

      <!-- Resume -->
      <div class="py-8 px-4 flex flex-col items-center gap-6">
        <div class="text-center">
          <h1 class="text-xl font-extrabold text-slate-900 dark:text-white">{{ resumeName() }}</h1>
          <p class="text-sm text-slate-400 mt-1">Shared via ApnaConverter Resume Builder</p>
        </div>
        <div class="w-full max-w-[820px]">
          <app-resume-preview [resume]="resume()!" />
        </div>
        <div class="text-center py-4">
          <p class="text-sm text-slate-500 mb-3">Like this resume?</p>
          <a routerLink="/resume-builder" class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-lg">Create Your Own Free Resume</a>
        </div>
      </div>
    }
  `,
})
export class PublicResumeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api   = inject(ApiService);

  readonly loading  = signal(true);
  readonly notFound = signal(false);
  readonly resume   = signal<ResumeData | null>(null);
  readonly resumeName = signal('');
  readonly views    = signal(0);

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    try {
      const res = await firstValueFrom(this.api.get<any>(`public/r/${slug}`));
      if (res.success && res.data?.snapshot) {
        this.resume.set(res.data.snapshot as ResumeData);
        this.resumeName.set(res.data.name ?? 'Resume');
        this.views.set(res.data.views ?? 0);
      } else {
        this.notFound.set(true);
      }
    } catch {
      this.notFound.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
