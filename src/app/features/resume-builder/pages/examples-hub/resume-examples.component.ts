import { ChangeDetectionStrategy, Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { AdBannerComponent } from '../../../../shared/components/ad-banner/ad-banner.component';
import { ROLE_ORDER, ROLE_PAGES } from '../../data/role-pages.data';

const JSON_LD_WEBPAGE_KEY = 'resume-examples-webpage';
const JSON_LD_ITEMLIST_KEY = 'resume-examples-itemlist';
const SITE_URL = 'https://www.apnaconverter.com';

@Component({
  selector: 'app-resume-examples',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent, AdBannerComponent],
  templateUrl: './resume-examples.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeExamplesComponent implements OnInit {
  private readonly jsonLd = inject(JsonLdService);
  private readonly destroyRef = inject(DestroyRef);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Resume Examples', path: '/resume-examples' },
  ];

  readonly roles = ROLE_ORDER.map(slug => ROLE_PAGES[slug]);

  ngOnInit(): void {
    this.jsonLd.setJsonLd(JSON_LD_WEBPAGE_KEY, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Resume Examples by Job Title',
      description: 'Free, role-specific resume examples with sample bullet points, key skills, and ATS-friendly templates for 8 popular job titles.',
      url: `${SITE_URL}/resume-examples`,
    });

    this.jsonLd.setJsonLd(JSON_LD_ITEMLIST_KEY, {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: this.roles.map((role, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${role.title} Resume Examples`,
        url: `${SITE_URL}/resume-builder/${role.slug}`,
      })),
    });

    this.destroyRef.onDestroy(() => {
      this.jsonLd.removeJsonLd(JSON_LD_WEBPAGE_KEY);
      this.jsonLd.removeJsonLd(JSON_LD_ITEMLIST_KEY);
    });
  }
}
