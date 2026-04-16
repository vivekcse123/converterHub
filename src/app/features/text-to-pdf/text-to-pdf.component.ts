import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';

@Component({
  selector: 'app-text-to-pdf',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-gradient-to-r from-amber-400 to-orange-500 text-white py-14">
      <div class="container-app text-center">
        <div class="w-16 h-16 mx-auto mb-5 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">📃</div>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Text to PDF</h1>
        <p class="text-amber-100 text-lg max-w-md mx-auto">Turn plain text into a clean, formatted PDF document.</p>
      </div>
    </div>

    <div class="container-app py-12 max-w-2xl">
      <div class="card p-6 md:p-8">
        <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Your text</label>
        <textarea [(ngModel)]="text" rows="12"
          placeholder="Paste or type your text here…"
          class="input resize-none font-mono text-sm leading-relaxed">
        </textarea>

        <div class="mt-2 flex justify-between items-center text-xs text-slate-400">
          <span>{{ text.length }} characters</span>
          <button (click)="text = ''" class="hover:text-red-500 transition-colors">Clear</button>
        </div>

        <button (click)="convert()" [disabled]="!text.trim() || converter.isConverting()"
          class="btn btn-primary btn-lg w-full mt-5">
          @if (!converter.isConverting()) {
          <span>⚡ Convert to PDF</span>
          }
          @if (converter.isConverting()) {
          <span>
            <svg class="w-5 h-5 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>Converting…
          </span>
          }
        </button>
      </div>

      @if (result()) {
      <div class="card p-8 text-center mt-6 animate-bounce-in">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-white">PDF ready!</h2>
        <div class="flex gap-3 justify-center">
          <a [href]="result()!.downloadUrl" [download]="result()!.fileName" class="btn btn-primary">⬇️ Download PDF</a>
          <button (click)="result.set(null)" class="btn btn-secondary">🔄 New Text</button>
        </div>
      </div>
      }
    </div>
  `,
})
export class TextToPdfComponent {
  text   = '';
  readonly result = signal<ConversionResult | null>(null);

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  convert(): void {
    if (!this.text.trim()) return;
    this.converter.textToPdf(this.text).subscribe({
      next:  (r) => { this.result.set(r); this.notify.success('PDF ready!'); },
      error: (e) => this.notify.error('Failed', e.error?.message),
    });
  }
}
