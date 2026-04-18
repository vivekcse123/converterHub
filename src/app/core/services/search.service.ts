import { Injectable, signal, computed } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TOOLS, Tool } from '../models/tool.model';

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

  /** Fuzzy-filtered results derived from query signal */
  readonly results = computed<Tool[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return TOOLS.filter(t => this.matches(t, q)).slice(0, 8);
  });

  setQuery(q: string): void {
    this.query.set(q);
    this.querySubject.next(q);
    this.isOpen.set(q.trim().length > 0);
  }

  open():  void { this.isOpen.set(this.query().trim().length > 0); }
  close(): void { this.isOpen.set(false); }
  clear(): void { this.query.set(''); this.isOpen.set(false); this.querySubject.next(''); }

  private matches(tool: Tool, q: string): boolean {
    // Exact prefix match first
    if (tool.title.toLowerCase().startsWith(q)) return true;
    // Word boundary match
    if (tool.title.toLowerCase().includes(q)) return true;
    // Description match
    if (tool.description.toLowerCase().includes(q)) return true;
    // Category match
    if (tool.category.toLowerCase().includes(q)) return true;
    // Format match
    if (tool.acceptedFormats.some(f => f.toLowerCase().includes(q))) return true;
    if (tool.outputFormat.toLowerCase().includes(q)) return true;
    // Fuzzy: check if all query chars appear in order in the title
    return this.fuzzyMatch(tool.title.toLowerCase(), q);
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
