import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { BiodataContact } from '../../../models/biodata.model';
import { LABEL, inp } from '../editor-utils';

@Component({
  selector: 'app-biodata-contact-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label [class]="lc">Phone *</label>
          <input class="input" type="tel" [value]="b.contact.phone" (input)="set('phone', $event)" placeholder="+91 98765 43210" />
        </div>
        <div>
          <label [class]="lc">WhatsApp Number</label>
          <input class="input" type="tel" [value]="b.contact.whatsapp" (input)="set('whatsapp', $event)" placeholder="+91 98765 43210" />
        </div>
        <div class="sm:col-span-2">
          <label [class]="lc">Email Address</label>
          <input class="input" type="email" [value]="b.contact.email" (input)="set('email', $event)" placeholder="priya@email.com" />
        </div>
        <div class="sm:col-span-2">
          <label [class]="lc">Street Address</label>
          <input class="input" [value]="b.contact.address" (input)="set('address', $event)" placeholder="42, Green Park Colony" />
        </div>
        <div>
          <label [class]="lc">City</label>
          <input class="input" [value]="b.contact.city" (input)="set('city', $event)" placeholder="New Delhi" />
        </div>
        <div>
          <label [class]="lc">State</label>
          <input class="input" [value]="b.contact.state" (input)="set('state', $event)" placeholder="Delhi" />
        </div>
        <div>
          <label [class]="lc">Pincode</label>
          <input class="input" [value]="b.contact.pincode" (input)="set('pincode', $event)" placeholder="110016" />
        </div>
        <div>
          <label [class]="lc">Country</label>
          <input class="input" [value]="b.contact.country" (input)="set('country', $event)" placeholder="India" />
        </div>
      </div>
    }
  `,
})
export class BiodataContactFormComponent {
  private readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly lc = LABEL;

  set(field: keyof BiodataContact, event: Event): void {
    this.store.updateContact({ [field]: inp(event) } as any);
  }
}
