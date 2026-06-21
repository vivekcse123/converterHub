import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeStoreService } from '../../../services/resume-store.service';
import { PhotoUploadComponent } from '../../photo-upload/photo-upload.component';
import { LABEL_CLASS, inputValue } from '../editor-utils';

@Component({
  selector: 'app-personal-info-form',
  standalone: true,
  imports: [CommonModule, PhotoUploadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resume(); as r) {
      <app-photo-upload />
      <div class="grid grid-cols-1 gap-4 p-4">
        <div class="">
          <label [class]="labelClass">Full Name</label>
          <input class="input" [value]="r.personal.fullName" (input)="update('fullName', $event)" placeholder="Jane Doe" />
        </div>
        <div class="">
          <label [class]="labelClass">Job Title</label>
          <input class="input" [value]="r.personal.jobTitle" (input)="update('jobTitle', $event)" placeholder="Software Engineer" />
        </div>
        <div>
          <label [class]="labelClass">Email</label>
          <input class="input" type="email" [value]="r.personal.email" (input)="update('email', $event)" placeholder="jane@email.com" />
        </div>
        <div>
          <label [class]="labelClass">Phone</label>
          <input class="input" type="tel" [value]="r.personal.phone" (input)="update('phone', $event)" placeholder="+91 98765 43210" />
        </div>
        <div class="">
          <label [class]="labelClass">Location</label>
          <input class="input" [value]="r.personal.location" (input)="update('location', $event)" placeholder="City, Country" />
        </div>
        <div>
          <label [class]="labelClass">LinkedIn</label>
          <input class="input" [value]="r.personal.linkedin" (input)="update('linkedin', $event)" placeholder="linkedin.com/in/username" />
        </div>
        <div>
          <label [class]="labelClass">GitHub</label>
          <input class="input" [value]="r.personal.github" (input)="update('github', $event)" placeholder="github.com/username" />
        </div>
        <div class="">
          <label [class]="labelClass">Portfolio / Website</label>
          <input class="input" [value]="r.personal.portfolio" (input)="update('portfolio', $event)" placeholder="yourname.dev" />
        </div>
      </div>
    }
  `,
})
export class PersonalInfoFormComponent {
  private readonly store = inject(ResumeStoreService);
  readonly resume = computed(() => this.store.activeResume());
  readonly labelClass = LABEL_CLASS;

  update(field: keyof import('../../../models/resume.model').PersonalInfo, event: Event): void {
    this.store.updatePersonal({ [field]: inputValue(event) });
  }
}
