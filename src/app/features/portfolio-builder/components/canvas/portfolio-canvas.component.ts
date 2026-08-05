import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PortfolioStoreService } from '../../services/portfolio-store.service';
import { PortfolioData, PortfolioSection, SECTION_LABELS } from '../../models/portfolio.model';
import { BlockShellComponent } from './block-shell.component';
import { AddBlockMenuComponent } from './add-block-menu.component';
import { HeroBlockComponent } from './blocks/hero-block.component';
import { AboutBlockComponent } from './blocks/about-block.component';
import { SkillsBlockComponent } from './blocks/skills-block.component';
import { ExperienceBlockComponent } from './blocks/experience-block.component';
import { ProjectsBlockComponent } from './blocks/projects-block.component';
import { EducationBlockComponent } from './blocks/education-block.component';
import { TestimonialsBlockComponent } from './blocks/testimonials-block.component';
import { ContactBlockComponent } from './blocks/contact-block.component';
import { getThemePreset } from '../../themes/shared/theme-presets';

@Component({
  selector: 'app-portfolio-canvas',
  standalone: true,
  imports: [
    DragDropModule, BlockShellComponent, AddBlockMenuComponent,
    HeroBlockComponent, AboutBlockComponent, SkillsBlockComponent, ExperienceBlockComponent,
    ProjectsBlockComponent, EducationBlockComponent, TestimonialsBlockComponent, ContactBlockComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div [class]="'min-h-full transition-colors duration-200 ' + preset().pageBg + ' ' + preset().pageText">
    <div class="max-w-3xl mx-auto py-10 px-4 sm:px-0" cdkDropList (cdkDropListDropped)="onDrop($event)">
      @for (section of portfolio().sections; track section.id) {
        <div cdkDrag [cdkDragData]="section" class="mb-6">
          <app-block-shell
            [section]="section"
            [theme]="portfolio().theme"
            [label]="labels[section.type]"
            [editable]="true"
            [selected]="selectedId() === section.id"
            [removable]="isRemovable(section)"
            (select)="store.selectSection(section.id)"
            (duplicate)="store.duplicateSection(section.id)"
            (toggleEnabled)="store.toggleSectionEnabled(section.id)"
            (remove)="store.removeSection(section.id)">

            @switch (section.type) {
              @case ('hero')         { <app-hero-block [section]="asHero(section)" [theme]="portfolio().theme" /> }
              @case ('about')        { <app-about-block [section]="asAbout(section)" [theme]="portfolio().theme" /> }
              @case ('skills')       { <app-skills-block [section]="asSkills(section)" [theme]="portfolio().theme" /> }
              @case ('experience')   { <app-experience-block [section]="asExperience(section)" [theme]="portfolio().theme" /> }
              @case ('projects')     { <app-projects-block [section]="asProjects(section)" [theme]="portfolio().theme" /> }
              @case ('education')    { <app-education-block [section]="asEducation(section)" [theme]="portfolio().theme" /> }
              @case ('testimonials') { <app-testimonials-block [section]="asTestimonials(section)" [theme]="portfolio().theme" /> }
              @case ('contact')      { <app-contact-block [section]="asContact(section)" [theme]="portfolio().theme" /> }
            }
          </app-block-shell>
        </div>
      }

      <app-add-block-menu (add)="store.addSection($event)" />
    </div>
    </div>
  `,
})
export class PortfolioCanvasComponent {
  portfolio = input.required<PortfolioData>();

  readonly store = inject(PortfolioStoreService);
  readonly labels = SECTION_LABELS;
  readonly selectedId = this.store.selectedSectionId;

  preset() { return getThemePreset(this.portfolio().theme.templateId); }

  onDrop(event: CdkDragDrop<PortfolioSection[]>): void {
    const sections = [...this.portfolio().sections];
    moveItemInArray(sections, event.previousIndex, event.currentIndex);
    this.store.reorderSections(sections);
  }

  /** Hero is locked/singular — but if more than one somehow exists (e.g. from
   *  a since-fixed bug), the extras stay removable so users can self-heal. */
  isRemovable(section: PortfolioSection): boolean {
    if (section.type !== 'hero') return true;
    return this.portfolio().sections.filter(s => s.type === 'hero').length > 1;
  }

  // Narrowing casts — each section's `type` discriminant guarantees its `config` shape
  // (set by createDefaultSection / the server), so a cast here is safe and avoids
  // repeating the same switch/narrowing logic in every block component.
  asHero(s: PortfolioSection) { return s as any; }
  asAbout(s: PortfolioSection) { return s as any; }
  asSkills(s: PortfolioSection) { return s as any; }
  asExperience(s: PortfolioSection) { return s as any; }
  asProjects(s: PortfolioSection) { return s as any; }
  asEducation(s: PortfolioSection) { return s as any; }
  asTestimonials(s: PortfolioSection) { return s as any; }
  asContact(s: PortfolioSection) { return s as any; }
}
