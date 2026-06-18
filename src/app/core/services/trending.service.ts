import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { TOOLS, Tool } from '../models/tool.model';

export interface TrendingEntry {
  tool: string;
  count: number;
  lastUsed: string;
}

@Injectable({ providedIn: 'root' })
export class TrendingService {
  readonly trending = signal<TrendingEntry[]>([]);
  readonly loaded   = signal<boolean>(false);

  constructor(private api: ApiService) {}

  /** Fetch trending data and cache in signal. */
  load(limit = 8, days = 7): void {
    if (this.loaded()) return;
    this.api.get<{ data: { trending: TrendingEntry[] } }>(`converters/trending?limit=${limit}&days=${days}`)
      .subscribe({
        next: (res) => {
          this.trending.set(res.data?.trending ?? []);
          this.loaded.set(true);
        },
        error: () => {
          // Graceful: use empty list, no crash
          this.loaded.set(true);
        },
      });
  }

  /** Returns TOOLS sorted by trending count (descending), falling back to static order. */
  sortedTools(allTools: Tool[]): Tool[] {
    const trend = this.trending();
    if (!trend.length) {
      // No trending data — sort by weight descending so high-weight tools appear first
      return [...allTools].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
    }
    const rank = new Map<string, number>();
    trend.forEach((t: TrendingEntry, i: number) => rank.set(t.tool, i));
    return [...allTools].sort((a, b) => {
      const inTrendA = rank.has(a.id);
      const inTrendB = rank.has(b.id);
      // Trending tools first, sorted by trending rank
      if (inTrendA && inTrendB) return rank.get(a.id)! - rank.get(b.id)!;
      if (inTrendA) return -1;
      if (inTrendB) return 1;
      // Both non-trending: sort by weight descending so high-value new tools surface
      return (b.weight ?? 0) - (a.weight ?? 0);
    });
  }
}
