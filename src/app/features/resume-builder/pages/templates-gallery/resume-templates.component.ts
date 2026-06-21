import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { AdBannerComponent } from '../../../../shared/components/ad-banner/ad-banner.component';
import { createSampleResume } from '../../data/resume-defaults';
import {
  RESUME_TEMPLATES,
  ResumeTemplateMeta,
  TemplateCategory,
  TemplateIndustry,
} from '../../data/resume-templates.data';
import { ResumeData } from '../../models/resume.model';

const JSON_LD_APP_KEY     = 'resume-templates-app';
const JSON_LD_WEBPAGE_KEY = 'resume-templates-webpage';
const SITE_URL            = 'https://www.apnaconverter.com';

interface TemplateCard {
  meta:   ResumeTemplateMeta;
  sample: ResumeData;
}

type AtsFilter = 'all' | '80+' | '90+' | '95+';
type PremiumFilter = 'all' | 'free' | 'premium';
type SortOption = 'popular' | 'ats' | 'rating' | 'name';

@Component({
  selector: 'app-resume-templates',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, RouterLink, FormsModule, BreadcrumbComponent, AdBannerComponent],
  templateUrl: './resume-templates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeTemplatesComponent implements OnInit {
  private readonly jsonLd    = inject(JsonLdService);
  private readonly destroyRef = inject(DestroyRef);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Resume Templates', path: '/resume-templates' },
  ];

  // ── All cards (static) ───────────────────────────────────────────────────────
  private readonly allCards: TemplateCard[] = RESUME_TEMPLATES.map(meta => ({
    meta,
    sample: createSampleResume(meta.id),
  }));

  // ── Filter state ─────────────────────────────────────────────────────────────
  readonly searchQuery    = signal('');
  readonly activeCategory = signal<TemplateCategory | 'all'>('all');
  readonly activeIndustry = signal<TemplateIndustry | 'all'>('all');
  readonly activeAts      = signal<AtsFilter>('all');
  readonly activePremium  = signal<PremiumFilter>('all');
  readonly activeSort     = signal<SortOption>('popular');

  // ── Compare state ────────────────────────────────────────────────────────────
  readonly compareIds    = signal<string[]>([]);
  readonly compareMode   = signal(false);
  readonly showCompareTable = signal(false);

  // ── Derived filtered + sorted list ──────────────────────────────────────────
  readonly filteredCards = computed(() => {
    const q        = this.searchQuery().toLowerCase().trim();
    const cat      = this.activeCategory();
    const ind      = this.activeIndustry();
    const ats      = this.activeAts();
    const prem     = this.activePremium();
    const sort     = this.activeSort();

    let cards = this.allCards.filter(c => {
      if (q && !c.meta.name.toLowerCase().includes(q)
            && !c.meta.description.toLowerCase().includes(q)
            && !c.meta.bestFor.toLowerCase().includes(q)
            && !c.meta.suitableFor.some(s => s.toLowerCase().includes(q))) {
        return false;
      }
      if (cat !== 'all' && c.meta.category !== cat)  return false;
      if (ind !== 'all' && !c.meta.industries.includes(ind) && !c.meta.industries.includes('All Industries')) return false;
      if (ats === '95+' && c.meta.atsScore < 95)     return false;
      if (ats === '90+' && c.meta.atsScore < 90)     return false;
      if (ats === '80+' && c.meta.atsScore < 80)     return false;
      if (prem === 'free'    && c.meta.isPremium)     return false;
      if (prem === 'premium' && !c.meta.isPremium)    return false;
      return true;
    });

    if (sort === 'popular') cards = [...cards].sort((a, b) => b.meta.downloads - a.meta.downloads);
    if (sort === 'ats')     cards = [...cards].sort((a, b) => b.meta.atsScore  - a.meta.atsScore);
    if (sort === 'rating')  cards = [...cards].sort((a, b) => b.meta.rating    - a.meta.rating);
    if (sort === 'name')    cards = [...cards].sort((a, b) => a.meta.name.localeCompare(b.meta.name));

    return cards;
  });

  readonly trendingCards     = computed(() => this.allCards.filter(c => c.meta.isTrending).slice(0, 4));
  readonly editorChoiceCards = computed(() => this.allCards.filter(c => c.meta.isEditorChoice).slice(0, 3));
  readonly popularCards      = computed(() => [...this.allCards].sort((a, b) => b.meta.downloads - a.meta.downloads).slice(0, 3));

  readonly compareCards = computed(() =>
    this.allCards.filter(c => this.compareIds().includes(c.meta.id))
  );

  readonly hasActiveFilters = computed(() =>
    this.searchQuery() !== '' ||
    this.activeCategory() !== 'all' ||
    this.activeIndustry() !== 'all' ||
    this.activeAts() !== 'all' ||
    this.activePremium() !== 'all'
  );

  readonly categories: (TemplateCategory | 'all')[] = [
    'all', 'Classic & ATS-Safe', 'Modern & Professional', 'Creative & Bold', 'Executive & Two-Column',
  ];

  readonly industries: (TemplateIndustry | 'all')[] = [
    'all', 'IT & Tech', 'Marketing', 'Finance', 'Healthcare', 'Design', 'Sales', 'Education', 'Management',
  ];

  readonly atsOptions: { label: string; value: AtsFilter }[] = [
    { label: 'Any ATS', value: 'all' },
    { label: '80+ ATS', value: '80+' },
    { label: '90+ ATS', value: '90+' },
    { label: '95+ ATS', value: '95+' },
  ];

  readonly premiumOptions: { label: string; value: PremiumFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Free', value: 'free' },
    { label: 'Premium', value: 'premium' },
  ];

  readonly sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest ATS', value: 'ats' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'A – Z', value: 'name' },
  ];

  // ── Compare helpers ──────────────────────────────────────────────────────────
  isInCompare(id: string): boolean {
    return this.compareIds().includes(id);
  }

  toggleCompare(id: string): void {
    const ids = this.compareIds();
    if (ids.includes(id)) {
      this.compareIds.set(ids.filter(i => i !== id));
    } else if (ids.length < 3) {
      this.compareIds.set([...ids, id]);
    }
  }

  clearCompare(): void {
    this.compareIds.set([]);
    this.compareMode.set(false);
    this.showCompareTable.set(false);
  }

  openCompareTable(): void {
    this.showCompareTable.set(true);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.activeCategory.set('all');
    this.activeIndustry.set('all');
    this.activeAts.set('all');
    this.activePremium.set('all');
    this.activeSort.set('popular');
  }

  formatDownloads(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  }

  atsColor(score: number): string {
    if (score >= 95) return 'emerald';
    if (score >= 88) return 'blue';
    return 'amber';
  }

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
