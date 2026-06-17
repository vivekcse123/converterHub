import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiodataData } from '../../models/biodata.model';

@Component({
  selector: 'app-professional-biodata-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-template.component.html',
  styleUrls: ['./professional-template.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalTemplateComponent {
  readonly biodata = input.required<BiodataData>();

  isVisible(section: string): boolean {
    const vis = this.biodata().sectionVisibility as Record<string, boolean | undefined>;
    return vis[section] ?? true;
  }

  cityState(): string {
    const c = this.biodata().contact;
    return [c.city, c.state].filter(s => !!s).join(', ');
  }

  contactLine(): string {
    const c = this.biodata().contact;
    return [c.phone, c.email, [c.city, c.state].filter(Boolean).join(', ')].filter(Boolean).join('  ·  ');
  }

  workLocation(): string {
    const p = this.biodata().professional;
    return [p.workCity, p.workCountry].filter(Boolean).join(', ');
  }

  hasProfessional(): boolean {
    const p = this.biodata().professional;
    return !!(p.occupation || p.employer || p.jobTitle || p.annualIncome || p.workExperience);
  }
}
