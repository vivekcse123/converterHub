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
    if (!trend.length) return allTools;
    const rank = new Map<string, number>();
    trend.forEach((t: TrendingEntry, i: number) => rank.set(t.tool, i));
    return [...allTools].sort((a, b) => {
      const ra = rank.has(a.id) ? rank.get(a.id)! : 9999;
      const rb = rank.has(b.id) ? rank.get(b.id)! : 9999;
      return ra - rb;
    });
  }
}
