import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgComponentOutlet, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { AdBannerComponent } from '../../../../shared/components/ad-banner/ad-banner.component';
import { TemplatePreviewModalComponent } from '../../components/template-preview-modal/template-preview-modal.component';
import { createSampleResume } from '../../data/resume-defaults';
import {
  RESUME_TEMPLATES,
  ResumeTemplateMeta,
  TemplateCategory,
  TemplateIndustry,
  TemplateTag,
  TEMPLATE_TAG_GROUPS,
  getTemplateDefaultAccent,
  isAtsFriendly,
  isPhotoResume,
} from '../../data/resume-templates.data';
import { ResumeData, TemplateId } from '../../models/resume.model';
import { computeDesignVarsCss } from '../../components/preview/resume-preview.component';

/** Cards rendered per "page" of the infinite-scroll grid. */
const PAGE_SIZE = 24;

const JSON_LD_APP_KEY     = 'resume-templates-app';
const JSON_LD_WEBPAGE_KEY = 'resume-templates-webpage';
const SITE_URL            = 'https://www.apnaconverter.com';

interface TemplateCard {
  meta:   ResumeTemplateMeta;
  sample: ResumeData;
}

type AtsFilter = 'all' | '80+' | '90+' | '95+';
type PremiumFilter = 'all' | 'free' | 'premium';
type SortOption = 'popular' | 'newest' | 'ats' | 'rating' | 'name';

@Component({
  selector: 'app-resume-templates',
  standalone: true,
  // Prevents the router-outlet's fade-in animation from creating a stacking context
  // that traps the Quick Preview modal's fixed z-[9999] below the sticky site header
  // — same fix as TemplateDetailComponent, now needed here too for the same reason.
  host: { style: 'animation: none' },
  imports: [CommonModule, NgComponentOutlet, RouterLink, FormsModule, BreadcrumbComponent, AdBannerComponent, TemplatePreviewModalComponent],
  templateUrl: './resume-templates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeTemplatesComponent implements OnInit, AfterViewChecked, OnDestroy {
  private readonly jsonLd    = inject(JsonLdService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  // Sentinel lives behind `@if (hasMore())`, so it mounts/unmounts as pagination
  // progresses — ngAfterViewChecked (not a one-shot AfterViewInit) is what lets us
  // notice each time it (re)appears and re-attach the observer to the new element.
  @ViewChild('loadMoreSentinel') private sentinelRef?: ElementRef<HTMLElement>;
  private sentinelObserver?: IntersectionObserver;
  private observedSentinelEl?: HTMLElement;

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
  readonly searchQuery      = signal('');
  readonly searchInput      = signal('');   // raw, un-debounced input value bound to the field
  private searchDebounceHandle?: ReturnType<typeof setTimeout>;
  readonly activeCategory   = signal<TemplateCategory | 'all'>('all');
  readonly activeIndustry   = signal<TemplateIndustry | 'all'>('all');
  readonly activeAts        = signal<AtsFilter>('all');
  readonly activePremium    = signal<PremiumFilter>('all');
  readonly activeSort       = signal<SortOption>('popular');
  readonly atsFriendlyOnly  = signal(false);
  readonly photoResumeOnly  = signal(false);
  readonly activeTags       = signal<TemplateTag[]>([]);
  readonly showFilterDrawer = signal(false);

  readonly tagGroups = TEMPLATE_TAG_GROUPS;

  // ── Compare state ────────────────────────────────────────────────────────────
  readonly compareIds    = signal<string[]>([]);
  readonly compareMode   = signal(false);
  readonly showCompareTable = signal(false);

  // ── Quick preview modal state ───────────────────────────────────────────────
  readonly quickPreviewId = signal<TemplateId | null>(null);

  // ── Infinite scroll ──────────────────────────────────────────────────────────
  readonly visibleCount = signal(PAGE_SIZE);

  // ── Derived filtered + sorted list ──────────────────────────────────────────
  readonly filteredCards = computed(() => {
    const q        = this.searchQuery().toLowerCase().trim();
    const cat      = this.activeCategory();
    const ind      = this.activeIndustry();
    const ats      = this.activeAts();
    const prem     = this.activePremium();
    const sort     = this.activeSort();
    const atsOnly  = this.atsFriendlyOnly();
    const photoOnly = this.photoResumeOnly();
    const tags     = this.activeTags();

    let cards = this.allCards.filter(c => {
      if (q && !c.meta.name.toLowerCase().includes(q)
            && !c.meta.description.toLowerCase().includes(q)
            && !c.meta.bestFor.toLowerCase().includes(q)
            && !c.meta.suitableFor.some(s => s.toLowerCase().includes(q))
            && !c.meta.tags.some(t => t.toLowerCase().includes(q))) {
        return false;
      }
      if (cat !== 'all' && c.meta.category !== cat)  return false;
      if (ind !== 'all' && !c.meta.industries.includes(ind) && !c.meta.industries.includes('All Industries')) return false;
      if (ats === '95+' && c.meta.atsScore < 95)     return false;
      if (ats === '90+' && c.meta.atsScore < 90)     return false;
      if (ats === '80+' && c.meta.atsScore < 80)     return false;
      if (prem === 'free'    && c.meta.isPremium)     return false;
      if (prem === 'premium' && !c.meta.isPremium)    return false;
      if (atsOnly && !isAtsFriendly(c.meta))          return false;
      if (photoOnly && !isPhotoResume(c.meta))        return false;
      if (tags.length && !tags.every(t => c.meta.tags.includes(t))) return false;
      return true;
    });

    if (sort === 'popular') cards = [...cards].sort((a, b) => b.meta.downloads - a.meta.downloads);
    if (sort === 'newest')  cards = [...cards].sort((a, b) => Number(!!b.meta.isNew) - Number(!!a.meta.isNew) || b.meta.downloads - a.meta.downloads);
    if (sort === 'ats')     cards = [...cards].sort((a, b) => b.meta.atsScore  - a.meta.atsScore);
    if (sort === 'rating')  cards = [...cards].sort((a, b) => b.meta.rating    - a.meta.rating);
    if (sort === 'name')    cards = [...cards].sort((a, b) => a.meta.name.localeCompare(b.meta.name));

    return cards;
  });

  /** Slice of `filteredCards()` actually rendered — grows as the user scrolls (see `loadMore`). */
  readonly visibleCards = computed(() => this.filteredCards().slice(0, this.visibleCount()));
  readonly hasMore      = computed(() => this.visibleCount() < this.filteredCards().length);

  /** Resets pagination back to the first page whenever the filtered result set changes. */
  private readonly _resetPaginationOnFilterChange = effect(() => {
    this.filteredCards();
    this.visibleCount.set(PAGE_SIZE);
  }, { allowSignalWrites: true });

  loadMore(): void {
    this.visibleCount.update(n => n + PAGE_SIZE);
  }

  isAtsFriendly = isAtsFriendly;
  isPhotoResume = isPhotoResume;

  onSearchInput(value: string): void {
    this.searchInput.set(value);
    clearTimeout(this.searchDebounceHandle);
    this.searchDebounceHandle = setTimeout(() => this.searchQuery.set(value), 180);
  }

  clearSearch(): void {
    this.searchInput.set('');
    clearTimeout(this.searchDebounceHandle);
    this.searchQuery.set('');
  }

  toggleTag(tag: TemplateTag): void {
    const tags = this.activeTags();
    this.activeTags.set(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  }

  isTagActive(tag: TemplateTag): boolean {
    return this.activeTags().includes(tag);
  }

  openQuickPreview(id: TemplateId): void {
    this.quickPreviewId.set(id);
  }

  closeQuickPreview(): void {
    this.quickPreviewId.set(null);
  }

  /** The navigable set for the quick-preview modal — respects the user's current filters. */
  readonly previewNavigationList = computed(() => this.filteredCards().map(c => c.meta));

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
    this.activePremium() !== 'all' ||
    this.atsFriendlyOnly() ||
    this.photoResumeOnly() ||
    this.activeTags().length > 0
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
    { label: 'Newest', value: 'newest' },
    { label: 'Highest ATS', value: 'ats' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'A – Z', value: 'name' },
  ];

  // ── Compare helpers ──────────────────────────────────────────────────────────
  isInCompare(id: string): boolean {
    return this.compareIds().includes(id);
  }

  /** CSS custom-property string for thumbnail containers — seeds accent colour and font vars. */
  getTplDesignVars(meta: ResumeTemplateMeta): string {
    return computeDesignVarsCss({ accentColor: getTemplateDefaultAccent(meta) });
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
    this.searchInput.set('');
    clearTimeout(this.searchDebounceHandle);
    this.searchQuery.set('');
    this.activeCategory.set('all');
    this.activeIndustry.set('all');
    this.activeAts.set('all');
    this.activePremium.set('all');
    this.activeSort.set('popular');
    this.atsFriendlyOnly.set(false);
    this.photoResumeOnly.set(false);
    this.activeTags.set([]);
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

  /** (Re)attaches the infinite-scroll IntersectionObserver whenever the sentinel mounts/unmounts. */
  ngAfterViewChecked(): void {
    const el = this.sentinelRef?.nativeElement;
    if (el === this.observedSentinelEl) return;
    this.sentinelObserver?.disconnect();
    this.observedSentinelEl = el;
    if (!el || !isPlatformBrowser(this.platformId)) return;
    this.sentinelObserver = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) this.loadMore();
    }, { rootMargin: '600px' });
    this.sentinelObserver.observe(el);
  }

  ngOnDestroy(): void {
    this.sentinelObserver?.disconnect();
  }
}
