import { ChangeDetectionStrategy, Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { AdBannerComponent } from '../../../../shared/components/ad-banner/ad-banner.component';
import { ResumePreviewComponent } from '../../components/preview/resume-preview.component';
import { createSampleResume } from '../../data/resume-defaults';
import { RESUME_TEMPLATES, ResumeTemplateMeta } from '../../data/resume-templates.data';
import { ResumeData } from '../../models/resume.model';

const JSON_LD_APP_KEY = 'resume-templates-app';
const JSON_LD_WEBPAGE_KEY = 'resume-templates-webpage';
const SITE_URL = 'https://www.apnaconverter.com';

interface TemplateCard {
  meta: ResumeTemplateMeta;
  sample: ResumeData;
}

@Component({
  selector: 'app-resume-templates',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, AdBannerComponent, ResumePreviewComponent],
  templateUrl: './resume-templates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeTemplatesComponent implements OnInit {
  private readonly jsonLd = inject(JsonLdService);
  private readonly destroyRef = inject(DestroyRef);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Resume Templates', path: '/resume-templates' },
  ];

  readonly templates: TemplateCard[] = RESUME_TEMPLATES.map(meta => ({
    meta,
    sample: createSampleResume(meta.id),
  }));

  ngOnInit(): void {
    this.jsonLd.setJsonLd(JSON_LD_APP_KEY, {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ApnaConverter Resume Templates',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      url: `${SITE_URL}/resume-templates`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    });

    this.jsonLd.setJsonLd(JSON_LD_WEBPAGE_KEY, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Free ATS-Friendly Resume Templates',
      description: 'Browse free, ATS-friendly resume templates with live previews. Pick one and build your resume online for free.',
      url: `${SITE_URL}/resume-templates`,
    });

    this.destroyRef.onDestroy(() => {
      this.jsonLd.removeJsonLd(JSON_LD_APP_KEY);
      this.jsonLd.removeJsonLd(JSON_LD_WEBPAGE_KEY);
    });
  }
}
