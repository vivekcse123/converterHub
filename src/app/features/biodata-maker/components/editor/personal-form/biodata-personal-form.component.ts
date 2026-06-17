import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { BiodataPersonal } from '../../../models/biodata.model';
import { LABEL, inp } from '../editor-utils';

@Component({
  selector: 'app-biodata-personal-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="space-y-4">

        <!-- Photo upload -->
        <div>
          <label [class]="lc">Profile Photo</label>
          <div class="flex items-center gap-4">
            <div class="w-20 h-24 rounded border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
              @if (b.personal.photo) {
                <img [src]="b.personal.photo" alt="Photo preview" class="w-full h-full object-cover" />
              } @else {
                <span class="text-2xl text-slate-300">👤</span>
              }
            </div>
            <div class="flex flex-col gap-2 flex-1">
              <label class="btn btn-secondary btn-sm cursor-pointer">
                📷 {{ b.personal.photo ? 'Change Photo' : 'Upload Photo' }}
                <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" (change)="onPhotoChange($event)" />
              </label>
              @if (b.personal.photo) {
                <button type="button" class="btn btn-sm text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" (click)="removePhoto()">✕ Remove</button>
              }
              <p class="text-xs text-slate-400">JPG/PNG/WebP, max 2MB. Stored locally.</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="sm:col-span-2">
            <label [class]="lc">Full Name *</label>
            <input class="input" [value]="b.personal.fullName" (input)="set('fullName', $event)" placeholder="Priya Sharma" />
          </div>
          <div>
            <label [class]="lc">Gender</label>
            <select class="input" [value]="b.personal.gender" (change)="set('gender', $event)">
              <option>Female</option><option>Male</option><option>Other</option>
            </select>
          </div>
          <div>
            <label [class]="lc">Date of Birth</label>
            <input class="input" [value]="b.personal.dateOfBirth" (input)="set('dateOfBirth', $event)" placeholder="15 March 1997" />
          </div>
          <div>
            <label [class]="lc">Time of Birth</label>
            <input class="input" [value]="b.personal.timeOfBirth" (input)="set('timeOfBirth', $event)" placeholder="10:30 AM" />
          </div>
          <div>
            <label [class]="lc">Place of Birth</label>
            <input class="input" [value]="b.personal.placeOfBirth" (input)="set('placeOfBirth', $event)" placeholder="New Delhi" />
          </div>
          <div>
            <label [class]="lc">Religion</label>
            <input class="input" list="religion-list" [value]="b.personal.religion" (input)="set('religion', $event)" placeholder="Hindu" />
            <datalist id="religion-list">
              <option>Hindu</option><option>Muslim</option><option>Christian</option><option>Sikh</option><option>Buddhist</option><option>Jain</option><option>Other</option>
            </datalist>
          </div>
          <div>
            <label [class]="lc">Caste</label>
            <input class="input" [value]="b.personal.caste" (input)="set('caste', $event)" placeholder="Brahmin" />
          </div>
          <div>
            <label [class]="lc">Sub-Caste</label>
            <input class="input" [value]="b.personal.subCaste" (input)="set('subCaste', $event)" placeholder="Saraswat" />
          </div>
          <div>
            <label [class]="lc">Gotra</label>
            <input class="input" [value]="b.personal.gotra" (input)="set('gotra', $event)" placeholder="Kashyap" />
          </div>
          <div>
            <label [class]="lc">Height</label>
            <input class="input" [value]="b.personal.height" (input)="set('height', $event)" placeholder="5'4&quot;" />
          </div>
          <div>
            <label [class]="lc">Weight</label>
            <input class="input" [value]="b.personal.weight" (input)="set('weight', $event)" placeholder="55 kg" />
          </div>
          <div>
            <label [class]="lc">Complexion</label>
            <select class="input" [value]="b.personal.complexion" (change)="set('complexion', $event)">
              <option value="">Select</option><option>Very Fair</option><option>Fair</option><option>Wheatish</option><option>Wheatish Brown</option><option>Dark</option>
            </select>
          </div>
          <div>
            <label [class]="lc">Blood Group</label>
            <select class="input" [value]="b.personal.bloodGroup" (change)="set('bloodGroup', $event)">
              <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
          </div>
          <div>
            <label [class]="lc">Marital Status</label>
            <select class="input" [value]="b.personal.maritalStatus" (change)="set('maritalStatus', $event)">
              <option>Never Married</option><option>Divorced</option><option>Widowed</option><option>Awaiting Divorce</option>
            </select>
          </div>
          <div>
            <label [class]="lc">Mother Tongue</label>
            <input class="input" [value]="b.personal.motherTongue" (input)="set('motherTongue', $event)" placeholder="Hindi" />
          </div>
          <div>
            <label [class]="lc">Nationality</label>
            <input class="input" [value]="b.personal.nationality" (input)="set('nationality', $event)" placeholder="Indian" />
          </div>
          <div>
            <label [class]="lc">Manglik</label>
            <select class="input" [value]="b.personal.manglik" (change)="set('manglik', $event)">
              <option value="">Select</option><option>No</option><option>Yes</option><option>Partial/Anshik</option><option>Not Applicable</option>
            </select>
          </div>
          <div>
            <label [class]="lc">Diet</label>
            <select class="input" [value]="b.personal.diet" (change)="set('diet', $event)">
              <option>Vegetarian</option><option>Non-Vegetarian</option><option>Eggetarian</option><option>Vegan</option><option>Jain</option>
            </select>
          </div>
        </div>
      </div>
    }
  `,
})
export class BiodataPersonalFormComponent {
  private readonly store = inject(BiodataStoreService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly lc = LABEL;

  set(field: keyof BiodataPersonal, event: Event): void {
    this.store.updatePersonal({ [field]: inp(event) } as any);
  }

  onPhotoChange(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Photo must be under 2 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => this.store.updatePersonal({ photo: (e.target?.result as string) ?? '' });
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.store.updatePersonal({ photo: '' });
  }
}
