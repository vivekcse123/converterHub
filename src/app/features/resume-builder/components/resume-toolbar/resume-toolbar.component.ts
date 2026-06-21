import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResumeStoreService } from '../../services/resume-store.service';
import { ResumePdfService } from '../../services/resume-pdf.service';
import { ResumeAuthGateService } from '../../services/resume-auth-gate.service';
import { ShareService } from '../../services/share.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UpgradeModalComponent } from '../upgrade-modal/upgrade-modal.component';
import { inputValue } from '../editor/editor-utils';

@Component({
  selector: 'app-resume-toolbar',
  standalone: true,
  imports: [CommonModule, UpgradeModalComponent],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex flex-1 items-center gap-2 min-w-0">
        <input
          class="input flex-1 min-w-0 font-medium"
          [value]="resume()?.name ?? ''"
          (input)="rename($event)"
          placeholder="Resume name"
          aria-label="Resume name"
        />
        <select class="input w-auto max-w-[160px] shrink-0" [value]="store.activeId() ?? ''" (change)="switchResume($event)" aria-label="Switch resume">
          @for (r of store.resumes(); track r.id) {
            <option [value]="r.id">{{ r.name || 'Untitled Resume' }}</option>
          }
        </select>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap shrink-0">
        <button type="button" class="btn btn-secondary btn-sm" (click)="store.createResume()" title="Create a new blank resume">
          + New
        </button>
        <button type="button" class="btn btn-secondary btn-sm" (click)="duplicate()" title="Duplicate this resume">
          ⧉ Duplicate
        </button>
        @if (auth.isPro()) {
          <button type="button" class="btn btn-secondary btn-sm whitespace-nowrap" (click)="share()" [disabled]="shareSvc.publishing()" title="Share a public link to this resume">
            @if (shareSvc.publishing()) { ⏳ Sharing... } @else { 🔗 Share }
          </button>
        }
        <button
          type="button"
          class="btn btn-secondary btn-sm text-red-600 hover:text-red-700 dark:text-red-400"
          (click)="remove()"
          [disabled]="store.resumes().length <= 1"
          title="Delete this resume"
        >
          🗑️ Delete
        </button>
        <button type="button"
          class="btn btn-primary btn-sm whitespace-nowrap"
          (click)="download()"
          [disabled]="downloading()"
          [title]="templateLocked() ? 'Pro subscription required for this template' : 'Download as PDF'">
          @if (downloading()) {
            ⏳ Generating...
          } @else if (templateLocked()) {
            🔒 Download PDF
          } @else {
            ⬇️ Download PDF
          }
        </button>
      </div>
    </div>

    <!-- Share success banner -->
    @if (shareUrl()) {
      <div class="mt-2 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-2.5">
        <span class="text-emerald-600 dark:text-emerald-400 text-xs font-semibold shrink-0">🔗 Public link:</span>
        <span class="text-xs text-slate-700 dark:text-slate-200 flex-1 truncate font-mono">{{ shareUrl() }}</span>
        <button class="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline shrink-0" (click)="copyLink()">Copy</button>
        <button class="text-slate-400 hover:text-slate-600 text-xs shrink-0" (click)="shareUrl.set('')">✕</button>
      </div>
    }

    <!-- Upgrade modal - shown when free user tries to download a premium template -->
    @if (authGate.showUpgrade()) {
      <app-upgrade-modal (close)="authGate.dismissUpgrade()" />
    }
  `,
})
export class ResumeToolbarComponent {
  readonly store      = inject(ResumeStoreService);
  readonly auth       = inject(AuthService);
  readonly shareSvc   = inject(ShareService);
  readonly authGate   = inject(ResumeAuthGateService);
  private  pdfService = inject(ResumePdfService);
  private  notify     = inject(NotificationService);

  readonly resume      = computed(() => this.store.activeResume());
  readonly downloading = signal(false);
  readonly shareUrl    = signal('');

  readonly isPremiumTemplate = computed(() =>
    this.pdfService.isPremiumTemplate(this.resume()?.templateId ?? '')
  );

  readonly templateLocked = computed(() => {
    const tplId = this.resume()?.templateId ?? '';
    return this.pdfService.isPremiumTemplate(tplId)
      && !this.auth.isPro()
      && !this.auth.hasPurchasedTemplate(tplId);
  });

  rename(event: Event): void {
    const id = this.store.activeId();
    if (id) this.store.renameResume(id, inputValue(event));
  }

  switchResume(event: Event): void { this.store.setActive(inputValue(event)); }

  duplicate(): void {
    const id = this.store.activeId();
    if (id) this.store.duplicateResume(id);
  }

  remove(): void {
    const id = this.store.activeId();
    if (id) this.store.deleteResume(id);
  }

  async share(): Promise<void> {
    const r = this.resume();
    if (!r) return;
    const result = await this.shareSvc.publish(r);
    if (result?.slug) {
      const url = this.shareSvc.publicUrl(result.slug);
      this.shareUrl.set(url);
      this.store.setPublicSlug(r.id, result.slug);
    } else {
      this.notify.error('Share failed', 'Could not publish resume. Please try again.');
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.shareUrl()).then(() => this.notify.success('Link copied!'));
  }

  async download(): Promise<void> {
    const resume = this.resume();
    if (!resume || this.downloading()) return;
    if (!this.authGate.canDownload(resume.templateId)) return;
    this.downloading.set(true);
    try {
      await this.pdfService.download(resume);
    } catch (err: any) {
      const status = err?.status ?? err?.error?.status;
      if (status === 403) {
        this.authGate.showUpgrade.set(true);
      } else {
        this.notify.error('Download failed', 'Could not generate PDF. Please try again.');
      }
    } finally {
      this.downloading.set(false);
    }
  }
}
