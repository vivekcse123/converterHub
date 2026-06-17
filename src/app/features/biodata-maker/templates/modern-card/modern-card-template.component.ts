import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataData } from '../../models/biodata.model';

@Component({
  selector: 'app-modern-card-biodata-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modern-card-template.component.html',
  styleUrls: ['./modern-card-template.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModernCardTemplateComponent {
  readonly biodata = input.required<BiodataData>();

  isVisible(section: string): boolean {
    const vis = this.biodata().sectionVisibility as Record<string, boolean | undefined>;
    return vis[section] ?? true;
  }

  cityState(): string {
    const c = this.biodata().contact;
    return [c.city, c.state].filter(s => !!s).join(', ');
  }

  workLocation(): string {
    const p = this.biodata().professional;
    return [p.workCity, p.workCountry].filter(Boolean).join(', ');
  }

  hasProfessional(): boolean {
    const p = this.biodata().professional;
    return !!(p.occupation || p.employer || p.jobTitle || p.annualIncome || p.workExperience);
  }

  hasFamily(): boolean {
    const f = this.biodata().family;
    return !!(f.fatherName || f.motherName || f.brothers || f.sisters || f.nativePlace);
  }

  hasPartnerPreferences(): boolean {
    return Object.values(this.biodata().partnerPreferences).some(Boolean);
  }

  ageRange(): string {
    const pp = this.biodata().partnerPreferences;
    if (pp.ageFrom && pp.ageTo) return `${pp.ageFrom} – ${pp.ageTo} yrs`;
    return pp.ageFrom || pp.ageTo || '';
  }
}
