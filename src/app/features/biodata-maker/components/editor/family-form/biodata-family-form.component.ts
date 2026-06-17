import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { BiodataFamily } from '../../../models/biodata.model';
import { LABEL, inp } from '../editor-utils';

@Component({
  selector: 'app-biodata-family-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label [class]="lc">Father's Name</label>
          <input class="input" [value]="b.family.fatherName" (input)="set('fatherName', $event)" placeholder="Mr. Rajesh Sharma" />
        </div>
        <div>
          <label [class]="lc">Father's Occupation</label>
          <input class="input" [value]="b.family.fatherOccupation" (input)="set('fatherOccupation', $event)" placeholder="Business" />
        </div>
        <div>
          <label [class]="lc">Mother's Name</label>
          <input class="input" [value]="b.family.motherName" (input)="set('motherName', $event)" placeholder="Mrs. Sunita Sharma" />
        </div>
        <div>
          <label [class]="lc">Mother's Occupation</label>
          <input class="input" [value]="b.family.motherOccupation" (input)="set('motherOccupation', $event)" placeholder="Homemaker" />
        </div>
        <div>
          <label [class]="lc">Brothers</label>
          <input class="input" [value]="b.family.brothers" (input)="set('brothers', $event)" placeholder="1 (Married)" />
        </div>
        <div>
          <label [class]="lc">Sisters</label>
          <input class="input" [value]="b.family.sisters" (input)="set('sisters', $event)" placeholder="1 (Unmarried)" />
        </div>
        <div>
          <label [class]="lc">Family Type</label>
          <select class="input" [value]="b.family.familyType" (change)="set('familyType', $event)">
            <option>Nuclear</option><option>Joint</option>
          </select>
        </div>
        <div>
          <label [class]="lc">Family Status</label>
          <select class="input" [value]="b.family.familyStatus" (change)="set('familyStatus', $event)">
            <option>Middle Class</option><option>Upper Middle Class</option><option>Rich / Affluent</option><option>Working Class</option>
          </select>
        </div>
        <div>
          <label [class]="lc">Family Values</label>
          <select class="input" [value]="b.family.familyValues" (change)="set('familyValues', $event)">
            <option>Traditional</option><option>Moderate</option><option>Liberal</option>
          </select>
        </div>
        <div>
          <label [class]="lc">Native Place</label>
          <input class="input" [value]="b.family.nativePlace" (input)="set('nativePlace', $event)" placeholder="Jaipur, Rajasthan" />
        </div>
        <div class="sm:col-span-2">
          <label [class]="lc">About Family</label>
          <textarea class="input min-h-16 resize-y" rows="3" [value]="b.family.aboutFamily" (input)="set('aboutFamily', $event)" placeholder="Brief description about your family background, values, and lifestyle..."></textarea>
        </div>
      </div>
    }
  `,
})
export class BiodataFamilyFormComponent {
  private readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly lc = LABEL;

  set(field: keyof BiodataFamily, event: Event): void {
    this.store.updateFamily({ [field]: inp(event) } as any);
  }
}
