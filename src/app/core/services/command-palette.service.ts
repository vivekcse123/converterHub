import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DASHBOARD_NAV, DASHBOARD_QUICK_ACTIONS, dashboardNavHref } from '../../shared/data/dashboard-nav.data';
import { ADMIN_NAV } from '../../shared/data/admin-nav.data';
import { IconName } from '../../shared/data/icon-paths.data';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: IconName;
  route: string;
  group: 'Navigate' | 'Create' | 'Admin';
}

const DASHBOARD_COMMANDS: CommandItem[] = [
  ...DASHBOARD_NAV.map((n): CommandItem => ({
    id: `nav-${n.id}`,
    label: n.label,
    icon: n.icon,
    route: dashboardNavHref(n),
    group: 'Navigate',
  })),
  ...DASHBOARD_QUICK_ACTIONS.map((a): CommandItem => ({
    id: `action-${a.id}`,
    label: a.label,
    description: a.description,
    icon: a.icon,
    route: a.route,
    group: 'Create',
  })),
];

const ADMIN_COMMANDS: CommandItem[] = ADMIN_NAV.map((n): CommandItem => ({
  id: `admin-${n.id}`,
  label: n.label,
  icon: n.icon,
  route: `/admin/${n.route}`,
  group: 'Admin',
}));

/**
 * Cmd/Ctrl+K command menu. Static registry today (nav + quick actions) —
 * matches the fuzzy-match approach already used by `SearchService` for the
 * site-wide tool search rather than introducing a different algorithm.
 * Scoped to the current section (admin vs. dashboard) so results stay
 * relevant to where the user actually is.
 */
@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
  private readonly router = inject(Router);

  readonly isOpen = signal(false);
  readonly query = signal('');
  private readonly inAdmin = signal(this.router.url.startsWith('/admin'));

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.inAdmin.set(this.router.url.startsWith('/admin'));
    });
  }

  private readonly scopedCommands = computed(() => (this.inAdmin() ? ADMIN_COMMANDS : DASHBOARD_COMMANDS));

  readonly results = computed<CommandItem[]>(() => {
    const q = this.query().trim().toLowerCase();
    const pool = this.scopedCommands();
    if (!q) return pool;
    return pool.filter((c) => this.matches(c, q));
  });

  open(): void {
    this.query.set('');
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  setQuery(q: string): void {
    this.query.set(q);
  }

  private matches(item: CommandItem, q: string): boolean {
    const label = item.label.toLowerCase();
    if (label.startsWith(q) || label.includes(q)) return true;
    if (item.description?.toLowerCase().includes(q)) return true;
    return this.fuzzyMatch(label, q);
  }

  private fuzzyMatch(str: string, pattern: string): boolean {
    let si = 0;
    let pi = 0;
    while (si < str.length && pi < pattern.length) {
      if (str[si] === pattern[pi]) pi++;
      si++;
    }
    return pi === pattern.length;
  }
}
