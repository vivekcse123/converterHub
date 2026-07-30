import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { NotificationService } from '../../../../core/services/notification.service';

const SITE_URL = 'https://www.apnaconverter.com';

@Component({
  selector: 'app-portfolio-share-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="close.emit()">
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-5" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">Share your portfolio</h2>
          <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" (click)="close.emit()">✕</button>
        </div>

        <div class="flex flex-col items-center gap-3">
          @if (qrDataUrl()) {
            <img [src]="qrDataUrl()" alt="QR code linking to your portfolio" class="w-40 h-40 rounded-xl border border-slate-200 dark:border-slate-700" />
          }
          <button type="button" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline" (click)="downloadQr()">Download QR code</button>
        </div>

        <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span class="text-xs text-slate-500 dark:text-slate-400 truncate flex-1">{{ publicUrl() }}</span>
          <button type="button" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline shrink-0" (click)="copyLink()">Copy</button>
        </div>

        <div class="grid grid-cols-5 gap-2">
          <button type="button" class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-80 flex items-center justify-center text-lg" title="LinkedIn" (click)="shareTo('linkedin')">💼</button>
          <button type="button" class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-80 flex items-center justify-center text-lg" title="X / Twitter" (click)="shareTo('twitter')">🐦</button>
          <button type="button" class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-80 flex items-center justify-center text-lg" title="WhatsApp" (click)="shareTo('whatsapp')">💬</button>
          <button type="button" class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-80 flex items-center justify-center text-lg" title="Facebook" (click)="shareTo('facebook')">📘</button>
          <button type="button" class="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 hover:opacity-80 flex items-center justify-center text-lg" title="Email" (click)="shareTo('email')">✉️</button>
        </div>
      </div>
    </div>
  `,
})
export class PortfolioShareCardComponent implements OnInit {
  readonly username = input.required<string>();
  readonly displayName = input<string>('');
  readonly close = output<void>();

  private notify = inject(NotificationService);
  readonly qrDataUrl = signal('');
  readonly publicUrl = computed(() => `${SITE_URL}/p/${this.username()}`);

  async ngOnInit(): Promise<void> {
    try {
      this.qrDataUrl.set(await QRCode.toDataURL(this.publicUrl(), { width: 320, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } }));
    } catch { /* QR generation is a nice-to-have; failure shouldn't block the share panel */ }
  }

  copyLink(): void {
    navigator.clipboard?.writeText(this.publicUrl());
    this.notify.success('Link copied');
  }

  downloadQr(): void {
    if (!this.qrDataUrl()) return;
    const a = document.createElement('a');
    a.href = this.qrDataUrl();
    a.download = `${this.username()}-portfolio-qr.png`;
    a.click();
  }

  shareTo(network: 'linkedin' | 'twitter' | 'whatsapp' | 'facebook' | 'email'): void {
    const url = encodeURIComponent(this.publicUrl());
    const text = encodeURIComponent(`Check out my portfolio${this.displayName() ? ' — ' + this.displayName() : ''}`);
    const targets: Record<typeof network, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      email: `mailto:?subject=${text}&body=${url}`,
    };
    window.open(targets[network], '_blank', 'noopener,noreferrer');
  }
}
