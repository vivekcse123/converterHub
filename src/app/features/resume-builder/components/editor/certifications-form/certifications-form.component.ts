import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { CertificationItem } from '../../../models/resume.model';
import { LABEL_CLASS, inputValue } from '../editor-utils';

@Component({
  selector: 'app-certifications-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      @for (cert of certifications(); track cert.id; let i = $index) {
        <div class="card p-5 relative">
          <div class="flex items-center justify-between mb-3">
            <span class="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              Certification {{ i + 1 }}
            </span>
            <button type="button" class="text-slate-400 hover:text-red-500 transition-colors text-sm" (click)="store.removeCertification(cert.id)" aria-label="Remove certification">
              🗑️ Remove
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label [class]="labelClass">Certification Name</label>
              <input class="input" [value]="cert.name" (input)="patch(cert.id, 'name', $event)" placeholder="AWS Certified Developer – Associate" />
            </div>
            <div>
              <label [class]="labelClass">Issuing Organization</label>
              <input class="input" [value]="cert.issuer" (input)="patch(cert.id, 'issuer', $event)" placeholder="Amazon Web Services" />
            </div>
            <div>
              <label [class]="labelClass">Date Earned</label>
              <input class="input" type="month" [value]="cert.date" (input)="patch(cert.id, 'date', $event)" />
            </div>
            <div class="sm:col-span-2">
              <label [class]="labelClass">Credential Link (optional)</label>
              <input class="input" [value]="cert.link" (input)="patch(cert.id, 'link', $event)" placeholder="credential verification URL" />
            </div>
          </div>
        </div>
      }
    </div>

    <button type="button" class="btn btn-primary btn-sm mt-4" (click)="store.addCertification()">+ Add Certification</button>
  `,
})
export class CertificationsFormComponent {
  readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly certifications = computed(() => this.resume()?.certifications ?? []);
  readonly labelClass = LABEL_CLASS;

  patch(id: string, field: keyof CertificationItem, event: Event): void {
    this.store.updateCertification(id, { [field]: inputValue(event) } as Partial<CertificationItem>);
  }
}
