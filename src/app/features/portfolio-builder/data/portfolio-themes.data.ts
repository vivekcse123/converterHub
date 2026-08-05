import { Type } from '@angular/core';
import { AuroraThemeComponent } from '../themes/aurora/aurora-theme.component';
import { NoirThemeComponent } from '../themes/noir/noir-theme.component';
import { TerminalThemeComponent } from '../themes/terminal/terminal-theme.component';
import { StudioThemeComponent } from '../themes/studio/studio-theme.component';
import { ClassicThemeComponent } from '../themes/classic/classic-theme.component';
import { LumenThemeComponent } from '../themes/lumen/lumen-theme.component';
import { PulseThemeComponent } from '../themes/pulse/pulse-theme.component';
import { FolioThemeComponent } from '../themes/folio/folio-theme.component';

/** Whether a theme's `theme.mode` toggle actually changes anything —
 *  Noir/Terminal are dark-only by design (their identity IS the dark
 *  aesthetic); Studio/Classic haven't had a dark variant built yet. Only
 *  Aurora currently implements both. Kept honest rather than showing a
 *  "supports dark mode" badge on themes where the toggle is a no-op. */
export type ModeSupport = 'both' | 'light-only' | 'dark-only';

export type TemplateBadge = 'popular' | 'new';

export interface PortfolioThemeMeta {
  id: string;
  name: string;
  description: string;
  component: Type<{ portfolio: unknown }>;
  gradient: string; // small color-chip preview
  defaultAccent: string;
  defaultMode: 'light' | 'dark';
  modeSupport: ModeSupport;
  categories: string[];
  badges: TemplateBadge[];
  /** Visual/design-quality tier signal only — every theme in this registry
   *  ships with the same Pro subscription, there is no separate per-template
   *  purchase (unlike the Resume Builder's ₹29 premium templates). */
  isPremium: boolean;
  /** Real scroll-reveal + micro-interaction animations (IntersectionObserver-
   *  driven, see `themes/shared/scroll-reveal.directive.ts`), not present on
   *  the first 5 themes. */
  animated: boolean;
}

export const PORTFOLIO_THEMES: PortfolioThemeMeta[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Minimal & light — clean typography, generous whitespace',
    component: AuroraThemeComponent as unknown as Type<{ portfolio: unknown }>,
    gradient: 'from-slate-100 to-violet-100',
    defaultAccent: '#4f46e5',
    defaultMode: 'light',
    modeSupport: 'both',
    categories: ['Minimal', 'Writer', 'Consultant', 'UI/UX Designer'],
    badges: [],
    isPremium: false,
    animated: false,
  },
  {
    id: 'noir',
    name: 'Noir',
    description: 'Dark glass — glassmorphism, gradient mesh, bold',
    component: NoirThemeComponent as unknown as Type<{ portfolio: unknown }>,
    gradient: 'from-slate-900 via-violet-900 to-slate-900',
    defaultAccent: '#a78bfa',
    defaultMode: 'dark',
    modeSupport: 'dark-only',
    categories: ['Startup Founder', 'Agency', 'Dark', 'Glassmorphism', 'Product Designer'],
    badges: ['popular'],
    isPremium: false,
    animated: false,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Developer — monospace, code-block aesthetic',
    component: TerminalThemeComponent as unknown as Type<{ portfolio: unknown }>,
    gradient: 'from-slate-950 to-emerald-950',
    defaultAccent: '#22d3ee',
    defaultMode: 'dark',
    modeSupport: 'dark-only',
    categories: ['Software Developer', 'Backend Developer', 'Full Stack Developer', 'Frontend Developer'],
    badges: [],
    isPremium: false,
    animated: false,
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'Creative & bold — big type, tilted accents, vivid color',
    component: StudioThemeComponent as unknown as Type<{ portfolio: unknown }>,
    gradient: 'from-orange-200 to-amber-100',
    defaultAccent: '#f97316',
    defaultMode: 'light',
    modeSupport: 'light-only',
    categories: ['Creative', 'Graphic Designer', 'Photographer', 'Agency'],
    badges: ['new'],
    isPremium: false,
    animated: false,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Corporate & professional — clean, formal, resume-like',
    component: ClassicThemeComponent as unknown as Type<{ portfolio: unknown }>,
    gradient: 'from-blue-100 to-slate-200',
    defaultAccent: '#1e3a8a',
    defaultMode: 'light',
    modeSupport: 'light-only',
    categories: ['Corporate', 'Consultant', 'Freelancer', 'Architect'],
    badges: [],
    isPremium: false,
    animated: false,
  },
  {
    id: 'lumen',
    name: 'Lumen',
    description: 'Luxury editorial — serif display type, gold rules that draw in on scroll',
    component: LumenThemeComponent as unknown as Type<{ portfolio: unknown }>,
    gradient: 'from-[#faf6f0] to-[#e8dcc8]',
    defaultAccent: '#a6812c',
    defaultMode: 'light',
    modeSupport: 'light-only',
    categories: ['Luxury', 'Photographer', 'Architect', 'Consultant'],
    badges: ['new'],
    isPremium: true,
    animated: true,
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Bold & animated — drifting gradient blobs, glass cards, live skill meters',
    component: PulseThemeComponent as unknown as Type<{ portfolio: unknown }>,
    gradient: 'from-[#08080d] via-violet-700 to-cyan-600',
    defaultAccent: '#8b5cf6',
    defaultMode: 'dark',
    modeSupport: 'dark-only',
    categories: ['Product Designer', 'Startup Founder', 'UI/UX Designer', 'Creative'],
    badges: ['popular', 'new'],
    isPremium: true,
    animated: true,
  },
  {
    id: 'folio',
    name: 'Folio',
    description: 'Magazine editorial — bold masthead type, drop caps, animated timeline',
    component: FolioThemeComponent as unknown as Type<{ portfolio: unknown }>,
    gradient: 'from-white to-orange-100',
    defaultAccent: '#c2410c',
    defaultMode: 'light',
    modeSupport: 'light-only',
    categories: ['Writer', 'Consultant', 'Freelancer', 'Creative'],
    badges: ['new'],
    isPremium: true,
    animated: true,
  },
];

/** All categories any real theme currently belongs to — drives the gallery's
 *  filter chips. Deliberately not the full 20-category wishlist: only
 *  categories with at least one real template are shown, so filtering never
 *  produces a dishonest empty state. */
export const AVAILABLE_CATEGORIES: string[] = Array.from(
  new Set(PORTFOLIO_THEMES.flatMap(t => t.categories))
).sort();

export function getPortfolioThemeMeta(id: string): PortfolioThemeMeta {
  return PORTFOLIO_THEMES.find(t => t.id === id) ?? PORTFOLIO_THEMES[0];
}
