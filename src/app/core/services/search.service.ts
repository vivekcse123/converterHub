import { Injectable, signal, computed } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TOOLS } from '../models/tool.model';
import { SEARCH_PAGES } from '../models/search-page.model';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  kind: 'tool' | 'page';
  outputFormat?: string;
  color?: string;
  badge?: string;
  category?: string;
}

const RECENT_KEY = 'ch_recent_searches';
const MAX_RECENT = 5;

const TOOL_RESULTS: SearchResult[] = TOOLS.map(t => ({
  id: t.id, title: t.title, description: t.description, icon: t.icon, route: t.route,
  kind: 'tool', outputFormat: t.outputFormat, color: t.color, badge: t.badge, category: t.category,
}));

const PAGE_RESULTS: SearchResult[] = SEARCH_PAGES.map(p => ({
  id: p.id, title: p.title, description: p.description, icon: p.icon, route: p.route, kind: 'page',
}));

const ALL_RESULTS: SearchResult[] = [...TOOL_RESULTS, ...PAGE_RESULTS];
const RESULTS_BY_ID = new Map(ALL_RESULTS.map(r => [r.id, r]));

/** Static weights from tool.model.ts, indexed once — used to rank the
 *  "Popular" suggestion list shown before the user types anything. */
const WEIGHT_BY_ID = new Map(TOOLS.map(t => [t.id, t.weight ?? 0]));

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly querySubject = new Subject<string>();
  readonly query   = signal<string>('');
  readonly isOpen  = signal<boolean>(false);

  /** Debounced query stream for external subscribers */
  readonly query$ = this.querySubject.asObservable().pipe(
    debounceTime(150),
    distinctUntilChanged(),
  );

  private readonly recentIds = signal<string[]>(this.loadRecent());

  /** Recently selected results, newest first — only shown pre-query. */
  readonly recentResults = computed<SearchResult[]>(() =>
    this.recentIds().map(id => RESULTS_BY_ID.get(id)).filter((r): r is SearchResult => !!r)
  );

  /** Top-weighted tools — shown pre-query as discovery, not fabricated. */
  readonly popularResults = computed<SearchResult[]>(() =>
    [...TOOL_RESULTS].sort((a, b) => (WEIGHT_BY_ID.get(b.id) ?? 0) - (WEIGHT_BY_ID.get(a.id) ?? 0)).slice(0, 6)
  );

  /** Fuzzy-filtered results derived from query signal */
  readonly results = computed<SearchResult[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    return ALL_RESULTS.filter(r => this.matches(r, q)).slice(0, 8);
  });

  readonly toolResults = computed(() => this.results().filter(r => r.kind === 'tool'));
  readonly pageResults = computed(() => this.results().filter(r => r.kind === 'page'));

  setQuery(q: string): void {
    this.query.set(q);
    this.querySubject.next(q);
    this.isOpen.set(true);
  }

  open():  void { this.isOpen.set(true); }
  close(): void { this.isOpen.set(false); }
  clear(): void { this.query.set(''); this.isOpen.set(false); this.querySubject.next(''); }

  recordSelection(id: string): void {
    const next = [id, ...this.recentIds().filter(existing => existing !== id)].slice(0, MAX_RECENT);
    this.recentIds.set(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* private mode — recents just won't persist */ }
  }

  private loadRecent(): string[] {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? (JSON.parse(raw) as string[]).filter(id => RESULTS_BY_ID.has(id)) : [];
    } catch { return []; }
  }

  private matches(r: SearchResult, q: string): boolean {
    const title = r.title.toLowerCase();
    if (title.startsWith(q)) return true;
    if (title.includes(q)) return true;
    if (r.description.toLowerCase().includes(q)) return true;
    if (r.category?.toLowerCase().includes(q)) return true;
    if (r.outputFormat?.toLowerCase().includes(q)) return true;
    return this.fuzzyMatch(title, q);
  }

  private fuzzyMatch(str: string, pattern: string): boolean {
    let si = 0, pi = 0;
    while (si < str.length && pi < pattern.length) {
      if (str[si] === pattern[pi]) pi++;
      si++;
    }
    return pi === pattern.length;
  }
}
