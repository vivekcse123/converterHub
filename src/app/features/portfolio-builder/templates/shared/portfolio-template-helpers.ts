import { PortfolioSection, PortfolioSectionType, PortfolioTheme } from '../../models/portfolio.model';

export const FONT_STACKS: Record<PortfolioTheme['fontFamily'], string> = {
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  poppins: "'Poppins', ui-sans-serif, system-ui, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  'jetbrains-mono': "'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace",
};

export const RADIUS_VALUES: Record<PortfolioTheme['radius'], string> = {
  sharp: '2px',
  rounded: '1rem',
  pill: '9999px',
};

export function layoutMaxWidthClass(width: PortfolioTheme['layoutWidth']): string {
  return width === 'narrow' ? 'max-w-2xl' : 'max-w-5xl';
}

/** Returns enabled sections in their stored order. */
export function visibleSections(sections: PortfolioSection[]): PortfolioSection[] {
  return sections.filter(s => s.enabled);
}

export function sectionOfType<T = any>(sections: PortfolioSection[], type: PortfolioSectionType): PortfolioSection<T> | undefined {
  return sections.find(s => s.type === type) as PortfolioSection<T> | undefined;
}

export function initialsOf(name: string | undefined): string {
  const n = (name || 'U').trim();
  return n.split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

const PROJECT_GRADIENTS = [
  'from-primary-500 to-indigo-600', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-slate-600 to-slate-800',
];
export function projectGradient(i: number): string {
  return PROJECT_GRADIENTS[i % PROJECT_GRADIENTS.length];
}
