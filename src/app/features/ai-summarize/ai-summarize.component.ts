import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/services/ai.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-ai-summarize',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-1">AI Summarize PDF</h1>
      <p class="text-slate-500 text-sm mb-6">Generate a concise AI summary of any PDF document.</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div (click)="fi.click()" class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors">
          <div class="text-3xl mb-2">🤖</div>
          <p class="text-slate-500 text-sm">{{ file() ? file()!.name : 'Drop PDF here or click to browse' }}</p>
          <input #fi type="file" accept=".pdf" class="hidden" (change)="onFile($event)" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-slate-500 block mb-1">Summary Length</label>
            <select [(ngModel)]="length" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="short">Short (2-3 sentences)</option>
              <option value="medium" selected>Medium (1 paragraph)</option>
              <option value="long">Long (detailed)</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">Language</label>
            <select [(ngModel)]="language" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
              <option value="English" selected>English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
        </div>

        @if (loading()) {
        <div class="text-center py-4">
          <div class="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs text-slate-400 mt-2">AI is summarizing...</p>
        </div>
        }

        <button (click)="summarize()" [disabled]="!file() || loading()"
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Summarize with AI
        </button>

        @if (summary()) {
        <div class="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase">Summary</h3>
          <p class="text-slate-800 dark:text-white text-sm leading-relaxed whitespace-pre-wrap">{{ summary() }}</p>
        </div>
        }
      </div>
    </div>
  `,
})
export class AiSummarizeComponent {
  readonly file    = signal<File | null>(null);
  readonly summary = signal<string>('');
  readonly loading = signal(false);
  length = 'medium'; language = 'English';

  constructor(private ai: AiService, private notify: NotificationService) {}

  onFile(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.file.set(f); this.summary.set(''); } }

  summarize(): void {
    if (!this.file()) return;
    this.summary.set('');
    this.loading.set(true);
    this.ai.summarize(this.file()!, { length: this.length, language: this.language }).subscribe({
      next: (r) => { this.summary.set(r.data.summary); this.loading.set(false); },
      error: (err) => { this.notify.error(err?.error?.message || 'AI request failed'); this.loading.set(false); },
    });
  }
}
