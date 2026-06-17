import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataStoreService } from '../../../services/biodata-store.service';
import { BiodataProfessional } from '../../../models/biodata.model';
import { LABEL, inp } from '../editor-utils';

@Component({
  selector: 'app-biodata-professional-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bd(); as b) {
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label [class]="lc">Occupation</label>
          <input class="input" list="occ-list" [value]="b.professional.occupation" (input)="set('occupation', $event)" placeholder="Software Engineer" />
          <datalist id="occ-list">
            <option>Business</option><option>Service / Job</option><option>Self Employed</option>
            <option>Doctor</option><option>Engineer</option><option>Lawyer</option><option>Teacher</option>
            <option>Government Employee</option><option>Homemaker</option><option>Student</option><option>Not Working</option>
          </datalist>
        </div>
        <div>
          <label [class]="lc">Job Title / Designation</label>
          <input class="input" [value]="b.professional.jobTitle" (input)="set('jobTitle', $event)" placeholder="Senior Software Engineer" />
        </div>
        <div class="sm:col-span-2">
          <label [class]="lc">Employer / Company / Organisation</label>
          <input class="input" [value]="b.professional.employer" (input)="set('employer', $event)" placeholder="Infosys Ltd." />
        </div>
        <div>
          <label [class]="lc">Work Experience</label>
          <input class="input" [value]="b.professional.workExperience" (input)="set('workExperience', $event)" placeholder="4 years" />
        </div>
        <div>
          <label [class]="lc">Annual Income</label>
          <input class="input" [value]="b.professional.annualIncome" (input)="set('annualIncome', $event)" placeholder="₹12 LPA" />
        </div>
        <div>
          <label [class]="lc">Work City</label>
          <input class="input" [value]="b.professional.workCity" (input)="set('workCity', $event)" placeholder="Bengaluru" />
        </div>
        <div>
          <label [class]="lc">Work Country</label>
          <input class="input" [value]="b.professional.workCountry" (input)="set('workCountry', $event)" placeholder="India" />
        </div>
      </div>
    }
  `,
})
export class BiodataProfessionalFormComponent {
  private readonly store = inject(BiodataStoreService);
  readonly bd = computed(() => this.store.activeBiodata());
  readonly lc = LABEL;

  set(field: keyof BiodataProfessional, event: Event): void {
    this.store.updateProfessional({ [field]: inp(event) } as any);
  }
}
