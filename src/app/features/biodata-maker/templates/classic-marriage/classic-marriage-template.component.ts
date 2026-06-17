import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataData } from '../../models/biodata.model';

@Component({
  selector: 'app-classic-marriage-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classic-marriage-template.component.html',
  styleUrls: ['./classic-marriage-template.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassicMarriageTemplateComponent {
  readonly biodata = input.required<BiodataData>();

  isVisible(section: string): boolean {
    const vis = this.biodata().sectionVisibility as Record<string, boolean | undefined>;
    return vis[section] ?? true;
  }

  fullAddress(): string {
    const c = this.biodata().contact;
    return [c.address, c.city, c.state, c.pincode, c.country].filter(Boolean).join(', ');
  }

  workLocation(): string {
    const p = this.biodata().professional;
    return [p.workCity, p.workCountry].filter(Boolean).join(', ');
  }

  ageRange(): string {
    const pp = this.biodata().partnerPreferences;
    if (pp.ageFrom && pp.ageTo) return `${pp.ageFrom} – ${pp.ageTo} years`;
    return pp.ageFrom || pp.ageTo || '';
  }

  heightRange(): string {
    const pp = this.biodata().partnerPreferences;
    if (pp.heightFrom && pp.heightTo) return `${pp.heightFrom} – ${pp.heightTo}`;
    return pp.heightFrom || pp.heightTo || '';
  }

  hasProfessional(): boolean {
    const p = this.biodata().professional;
    return !!(p.occupation || p.employer || p.jobTitle || p.annualIncome);
  }

  hasPartnerPreferences(): boolean {
    const pp = this.biodata().partnerPreferences;
    return Object.values(pp).some(Boolean);
  }
}
