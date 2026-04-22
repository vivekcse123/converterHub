import { Component, signal } from '@angular/core';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ConverterService } from '../../core/services/converter.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConversionResult } from '../../core/models/conversion.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-protect-pdf',
  standalone: true,
  imports: [FileUploadComponent, ProgressBarComponent, FormsModule],
  template: `
    <div class="bg-gradient-to-r from-red-600 to-rose-600 text-white py-14">
      <div class="container-app text-center">
        <div class="w-16 h-16 mx-auto mb-5 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🛡️</div>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Protect PDF</h1>
        <p class="text-red-100 text-lg max-w-md mx-auto">Add real password encryption to your PDF.</p>
      </div>
    </div>

    <div class="container-app py-12 max-w-2xl">
      <div class="card p-6 md:p-8">
        <app-file-upload accept="application/pdf" [multiple]="false" [maxSizeMB]="100"
          label="Drop your PDF here" sublabel="PDF files only"
          (filesSelected)="onFile($event)" />

        @if (file()) {
          <div class="mt-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                User Password <span class="text-red-500">*</span>
              </label>
              <input type="password" [(ngModel)]="userPassword" placeholder="Minimum 4 characters"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Owner Password <span class="text-slate-400 text-xs font-normal">(optional — defaults to user password)</span>
              </label>
              <input type="password" [(ngModel)]="ownerPassword" placeholder="Leave blank to use same password"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 text-xs text-amber-800 dark:text-amber-300">
              ℹ️ Your PDF will be encrypted with AES encryption. Store the password safely — there is no recovery option.
            </div>
            <div class="flex justify-center pt-2">
              <button (click)="convert()" [disabled]="converter.isConverting() || userPassword.length < 4"
                class="btn btn-primary btn-lg min-w-[200px] disabled:opacity-50">
                @if (!converter.isConverting()) { <span>🛡️ Protect PDF</span> }
                @if (converter.isConverting())  { <span>Encrypting…</span> }
              </button>
            </div>
          </div>
        }

        @if (converter.isConverting()) {
          <div class="mt-4">
            <app-progress-bar [value]="converter.uploadProgress()" label="Encrypting PDF…" />
          </div>
        }
      </div>

      @if (result()) {
        <div class="card p-8 text-center mt-6 animate-bounce-in">
          <div class="text-5xl mb-4">🔐</div>
          <h2 class="text-xl font-bold mb-2 text-slate-800 dark:text-white">PDF encrypted!</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Your PDF is now password-protected. Keep the password safe — it cannot be recovered.
          </p>
          <div class="flex gap-3 justify-center">
            <button type="button" (click)="converter.downloadResult(result()!)" class="btn btn-primary">⬇️ Download Protected PDF</button>
            <button (click)="reset()" class="btn btn-secondary">🔄 Protect Another</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProtectPdfComponent {
  readonly file   = signal<File | null>(null);
  readonly result = signal<ConversionResult | null>(null);
  userPassword  = '';
  ownerPassword = '';

  constructor(public converter: ConverterService, private notify: NotificationService) {}

  onFile(files: File[]): void { this.file.set(files[0] ?? null); this.result.set(null); }

  convert(): void {
    const f = this.file();
    if (!f || this.userPassword.length < 4) return;
    this.converter.protectPdf(f, this.userPassword, this.ownerPassword || undefined).subscribe({
      next:  (r) => { this.result.set(r); this.notify.success('Done!', 'PDF encrypted successfully.'); },
      error: (e) => this.notify.error('Failed', e.error?.message ?? 'Could not protect PDF'),
    });
  }

  reset(): void {
    this.file.set(null); this.result.set(null);
    this.userPassword = ''; this.ownerPassword = '';
    this.converter.uploadProgress.set(0);
  }
}
