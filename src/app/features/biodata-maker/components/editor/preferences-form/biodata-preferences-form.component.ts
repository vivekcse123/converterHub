import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { BiodataPartnerPreferences } from '../../../models/biodata.model';
import { LABEL, inp } from '../editor-utils';

@Component({
  selector: 'app-biodata-preferences-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="space-y-3">
        <p class="text-xs text-slate-500 dark:text-slate-400">Describe the qualities and background you're looking for in a life partner.</p>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label [class]="lc">Age From</label>
            <input class="input" [value]="b.partnerPreferences.ageFrom" (input)="set('ageFrom', $event)" placeholder="26" />
          </div>
          <div>
            <label [class]="lc">Age To</label>
            <input class="input" [value]="b.partnerPreferences.ageTo" (input)="set('ageTo', $event)" placeholder="32" />
          </div>
          <div>
            <label [class]="lc">Height From</label>
            <input class="input" [value]="b.partnerPreferences.heightFrom" (input)="set('heightFrom', $event)" placeholder="5'6&quot;" />
          </div>
          <div>
            <label [class]="lc">Height To</label>
            <input class="input" [value]="b.partnerPreferences.heightTo" (input)="set('heightTo', $event)" placeholder="6'0&quot;" />
          </div>
        </div>
        <div>
          <label [class]="lc">Preferred Religion</label>
          <input class="input" [value]="b.partnerPreferences.religion" (input)="set('religion', $event)" placeholder="Hindu" />
        </div>
        <div>
          <label [class]="lc">Preferred Caste</label>
          <input class="input" [value]="b.partnerPreferences.caste" (input)="set('caste', $event)" placeholder="Brahmin (Caste no bar for good match)" />
        </div>
        <div>
          <label [class]="lc">Education Preference</label>
          <input class="input" [value]="b.partnerPreferences.education" (input)="set('education', $event)" placeholder="Graduate or above" />
        </div>
        <div>
          <label [class]="lc">Occupation Preference</label>
          <input class="input" [value]="b.partnerPreferences.occupation" (input)="set('occupation', $event)" placeholder="Working Professional / Business" />
        </div>
        <div>
          <label [class]="lc">Preferred Location</label>
          <input class="input" [value]="b.partnerPreferences.location" (input)="set('location', $event)" placeholder="Delhi NCR / Open to relocation" />
        </div>
        <div>
          <label [class]="lc">Other Expectations</label>
          <textarea class="input min-h-16 resize-y" rows="3" [value]="b.partnerPreferences.other" (input)="set('other', $event)" placeholder="Looking for an educated, well-settled, family-oriented individual..."></textarea>
        </div>
      </div>
    }
  `,
})
export class BiodataPreferencesFormComponent {
  private readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly lc = LABEL;

  set(field: keyof BiodataPartnerPreferences, event: Event): void {
    this.store.updatePartnerPreferences({ [field]: inp(event) } as any);
  }
}
