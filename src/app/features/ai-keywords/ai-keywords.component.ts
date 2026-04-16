import { Component, signal } from '@angular/core';
import { AiService } from '../../core/services/ai.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-ai-keywords',
  standalone: true,
  imports: [],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">AI Keyword Extraction</h1>
      <p class="text-slate-500 text-sm mb-6">Automatically extract the most relevant keywords and topics from any PDF.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div (click)="fi.click()" class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors">
          <div class="text-3xl mb-2">🏷️</div>
          <p class="text-slate-500 text-sm">{{ file() ? file()!.name : 'Drop PDF here or click to browse' }}</p>
          <input #fi type="file" accept=".pdf" class="hidden" (change)="onFile($event)" />
        </div>

        @if (loading()) {
        <div class="text-center py-4">
          <div class="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs text-slate-400 mt-2">Extracting keywords...</p>
        </div>
        }

        <button (click)="extract()" [disabled]="!file() || loading()"
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Extract Keywords
        </button>

        @if (keywords().length) {
        <div class="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase">Extracted Keywords</h3>
          <div class="flex flex-wrap gap-2">
            @for (kw of keywords(); track kw) {
            <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
              {{ kw }}
            </span>
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class AiKeywordsComponent {
  readonly file     = signal<File | null>(null);
  readonly keywords = signal<string[]>([]);
  readonly loading  = signal(false);

  constructor(private ai: AiService, private notify: NotificationService) {}

  onFile(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.file.set(f); this.keywords.set([]); } }

  extract(): void {
    if (!this.file()) return;
    this.keywords.set([]);
    this.loading.set(true);
    this.ai.extractKeywords(this.file()!).subscribe({
      next: (r) => { this.keywords.set(r.data.keywords); this.loading.set(false); },
      error: (err) => { this.notify.error(err?.error?.message || 'AI request failed'); this.loading.set(false); },
    });
  }
}
