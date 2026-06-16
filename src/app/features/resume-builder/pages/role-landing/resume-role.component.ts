import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { AdBannerComponent } from '../../../../shared/components/ad-banner/ad-banner.component';
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { createSampleResume } from '../../data/resume-defaults';
import { ROLE_PAGES, RolePageContent, RoleSlug } from '../../data/role-pages.data';
import { ResumeData } from '../../models/resume.model';

const JSON_LD_FAQ_KEY = 'resume-role-faq';
const JSON_LD_HOWTO_KEY = 'resume-role-howto';

const DEFAULT_ROLE: RoleSlug = 'software-engineer';

@Component({
  selector: 'app-resume-role',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, AdBannerComponent, ResumePreviewComponent],
  templateUrl: './resume-role.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeRoleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jsonLd = inject(JsonLdService);
  private readonly destroyRef = inject(DestroyRef);

  readonly content = signal<RolePageContent>(ROLE_PAGES[DEFAULT_ROLE]);
  readonly sampleResume = signal<ResumeData | null>(null);

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: 'Home', path: '/' },
    { label: 'Resume Examples', path: '/resume-examples' },
    { label: this.content().title, path: `/resume-builder/${this.content().slug}` },
  ]);

  ngOnInit(): void {
    const role = (this.route.snapshot.data['role'] as RoleSlug | undefined) ?? DEFAULT_ROLE;
    const content = ROLE_PAGES[role] ?? ROLE_PAGES[DEFAULT_ROLE];
    this.content.set(content);

    const sample = createSampleResume(content.recommendedTemplate);
    sample.personal.jobTitle = content.title;
    this.sampleResume.set(sample);

    this.setJsonLd(content);
    this.destroyRef.onDestroy(() => {
      this.jsonLd.removeJsonLd(JSON_LD_FAQ_KEY);
      this.jsonLd.removeJsonLd(JSON_LD_HOWTO_KEY);
    });
  }

  private setJsonLd(content: RolePageContent): void {
    this.jsonLd.setJsonLd(JSON_LD_FAQ_KEY, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });

    this.jsonLd.setJsonLd(JSON_LD_HOWTO_KEY, {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to write a ${content.title} resume`,
      step: content.howToSteps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    });
  }
}
