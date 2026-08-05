import { PortfolioData, PortfolioSection } from '../../models/portfolio.model';

/** Only enabled sections render publicly / in preview. */
export function visibleSections(p: PortfolioData): PortfolioSection[] {
  return p.sections.filter(s => s.enabled);
}

export function initials(name: string): string {
  return (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
}

export const FONT_CLASS: Record<string, string> = {
  inter: 'font-sans',
  poppins: 'font-builder',
  georgia: 'font-georgia',
  'jetbrains-mono': 'font-mono',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const HAS_SCHEME_RE = /^(mailto:|tel:|https?:\/\/|\/\/|#|\/)/i;

/** Users fill link fields (hero CTA, project links, socials) with whatever
 *  they type — a bare email, a phone number, or "linkedin.com/in/x" with no
 *  scheme. Without normalizing, `<a [href]>` resolves a schemeless value as
 *  a *relative* path against the current origin (e.g. "you@example.com"
 *  becomes "https://thissite.com/you@example.com", a 404 inside the app's
 *  own router) instead of navigating externally. Applied at render time so
 *  it also fixes links already saved before this existed. */
export function normalizeUrl(url: string | undefined | null): string {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return '#';
  if (HAS_SCHEME_RE.test(trimmed)) return trimmed;
  if (EMAIL_RE.test(trimmed)) return `mailto:${trimmed}`;
  if (PHONE_RE.test(trimmed) && /\d{7,}/.test(trimmed.replace(/\D/g, ''))) return `tel:${trimmed.replace(/[\s\-().]/g, '')}`;
  // Bare domain/path (e.g. "linkedin.com/in/alex", "github.com/alex") — treat as external.
  return `https://${trimmed}`;
}

export interface SocialLinkMeta { key: string; url: string; label: string; }

export function socialLinks(p: PortfolioData): SocialLinkMeta[] {
  const s = p.social ?? {};
  const out: SocialLinkMeta[] = [];
  if (s.github) out.push({ key: 'github', url: normalizeUrl(s.github), label: 'GitHub' });
  if (s.linkedin) out.push({ key: 'linkedin', url: normalizeUrl(s.linkedin), label: 'LinkedIn' });
  if (s.twitter) out.push({ key: 'twitter', url: normalizeUrl(s.twitter), label: 'Twitter' });
  if (s.youtube) out.push({ key: 'youtube', url: normalizeUrl(s.youtube), label: 'YouTube' });
  if (s.website) out.push({ key: 'website', url: normalizeUrl(s.website), label: 'Website' });
  return out;
}
