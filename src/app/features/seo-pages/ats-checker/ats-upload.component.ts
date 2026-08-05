import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

const ACCEPTED_EXT = ['.pdf', '.docx', '.txt'];

@Component({
  selector: 'app-ats-upload',
  standalone: true,
  host: { class: 'block' },
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-4">
      <div class="relative">
        <label
          class="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
          [class]="isDragging() ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          (dragover)="$event.preventDefault(); isDragging.set(true)"
          (dragleave)="isDragging.set(false)"
          (drop)="onDrop($event)">
          <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-xs text-slate-500 dark:text-slate-400 text-center px-4">
            @if (selectedFile()) {
              <span class="font-semibold text-emerald-600">{{ selectedFile()!.name }}</span> — ready to analyze
            } @else {
              Drop your resume (PDF, DOCX or TXT) here, or <span class="text-emerald-600 font-semibold">browse</span>
            }
          </span>
          <input type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                 class="sr-only" (change)="onFileSelect($event)">
        </label>
        @if (fileError()) {
          <p class="text-xs text-red-500 mt-1.5">{{ fileError() }}</p>
        }
      </div>

      <div class="flex items-center gap-3">
        <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
        <span class="text-xs text-slate-400 font-medium">or paste text</span>
        <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
      </div>

      <textarea
        [(ngModel)]="pastedText"
        (ngModelChange)="onTextInput()"
        rows="7"
        placeholder="Paste your resume text here…&#10;&#10;e.g. Name, email, phone, professional summary, work experience, education, skills..."
        class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono leading-relaxed placeholder:font-sans placeholder:text-slate-400"></textarea>

      <button type="button" [disabled]="!canSubmit()" (click)="submit()"
        class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
        🎯 Analyze My Resume
      </button>
      <p class="text-[11px] text-slate-400 text-center">Real AI analysis — takes a few seconds. No signup required.</p>
    </div>
  `,
})
export class AtsUploadComponent {
  fileSubmit = output<File>();
  textSubmit = output<string>();

  readonly isDragging = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly fileError = signal('');
  pastedText = '';

  readonly canSubmit = signal(false);

  private updateCanSubmit(): void {
    this.canSubmit.set(!!this.selectedFile() || this.pastedText.trim().length > 30);
  }

  onTextInput(): void {
    if (this.pastedText.trim()) this.selectedFile.set(null);
    this.updateCanSubmit();
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.acceptFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.acceptFile(file);
  }

  private acceptFile(file: File): void {
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
    if (!ACCEPTED_EXT.includes(ext)) {
      this.fileError.set('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    this.fileError.set('');
    this.pastedText = '';
    this.selectedFile.set(file);
    this.updateCanSubmit();
  }

  submit(): void {
    const file = this.selectedFile();
    if (file) { this.fileSubmit.emit(file); return; }
    if (this.pastedText.trim().length > 30) this.textSubmit.emit(this.pastedText.trim());
  }
}
