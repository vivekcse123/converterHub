import { environment } from 'src/environments/environment';

export type PortfolioSectionType =
  | 'hero' | 'about' | 'skills' | 'experience' | 'projects'
  | 'education' | 'testimonials' | 'contact';

/** The image-upload endpoint returns a host-relative path (`/portfolio-media/...`).
 *  In dev the frontend (4200) and backend (3000) are different origins, so that
 *  path must be resolved against the API's origin, not the current page's. */
const BACKEND_ORIGIN = environment.apiUrl.replace(/\/api\/?$/, '');

export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return url;
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Section types the user can freely add another instance of (hero is locked, singular). */
export const ADDABLE_SECTION_TYPES: PortfolioSectionType[] = [
  'about', 'skills', 'experience', 'projects', 'education', 'testimonials', 'contact',
];

export const SECTION_LABELS: Record<PortfolioSectionType, string> = {
  hero: 'Hero',
  about: 'About',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  testimonials: 'Testimonials',
  contact: 'Contact',
};

export const SECTION_ICONS: Record<PortfolioSectionType, string> = {
  hero: '🏠', about: '👤', skills: '💡', experience: '💼',
  projects: '🚀', education: '🎓', testimonials: '💬', contact: '✉️',
};

export interface HeroConfig {
  headline: string;
  subheadline: string;
  photoUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  resumeCtaEnabled: boolean;
}

export interface AboutConfig {
  body: string;
  highlights: string[];
}

export interface SkillItem { name: string; level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'; }
export interface SkillGroup { id: string; label: string; items: SkillItem[]; }
export interface SkillsConfig { groups: SkillGroup[]; }

export interface ExperienceItem {
  id: string; role: string; company: string; startDate: string; endDate: string; current: boolean; bullets: string[];
}
export interface ExperienceConfig { items: ExperienceItem[]; }

export interface ProjectItem {
  title: string; description: string; imageUrl?: string; url?: string; githubUrl?: string;
  tags: string[]; featured: boolean;
}
export interface ProjectsConfig { items: ProjectItem[]; }

export interface EducationItem {
  institution: string; degree: string; field: string; startDate: string; endDate: string;
}
export interface EducationConfig { items: EducationItem[]; }

export interface TestimonialItem { quote: string; author: string; role: string; avatarUrl?: string; }
export interface TestimonialsConfig { items: TestimonialItem[]; }

export interface ContactConfig {
  showEmail: boolean; showPhone: boolean; showSocial: boolean; ctaLabel: string;
}

export type PortfolioSectionConfig =
  | HeroConfig | AboutConfig | SkillsConfig | ExperienceConfig
  | ProjectsConfig | EducationConfig | TestimonialsConfig | ContactConfig;

/** Per-block visual overrides set from the property panel. All optional — an
 *  unset property means "use the active theme's default for this block type." */
export interface PortfolioBlockStyle {
  padding?: 'compact' | 'cozy' | 'spacious';
  radius?: 'none' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'soft' | 'strong';
  align?: 'left' | 'center' | 'right';
  background?: 'none' | 'surface' | 'accent-tint' | 'gradient';
  animation?: 'none' | 'fade-up' | 'fade-in' | 'slide-in';
}

export interface PortfolioSection<T = PortfolioSectionConfig> {
  id: string;
  type: PortfolioSectionType;
  enabled: boolean;
  config: T;
  style: PortfolioBlockStyle;
}

export interface PortfolioTheme {
  templateId: string;
  accentColor: string;
  secondaryColor?: string;
  fontFamily: 'inter' | 'poppins' | 'georgia' | 'jetbrains-mono';
  mode: 'light' | 'dark';
  layoutWidth: 'narrow' | 'wide';
  radius: 'sharp' | 'rounded' | 'pill';
  glassEffect: boolean;
}

export const DEFAULT_THEME: PortfolioTheme = {
  templateId: 'aurora',
  accentColor: '#4f46e5',
  secondaryColor: '#0ea5e9',
  fontFamily: 'inter',
  mode: 'dark',
  layoutWidth: 'wide',
  radius: 'rounded',
  glassEffect: false,
};

export interface PortfolioSocial {
  linkedin?: string; github?: string; twitter?: string; website?: string; youtube?: string;
}

export interface PortfolioData {
  _id?: string;
  username: string;
  isPublic: boolean;
  status: 'draft' | 'published';
  displayName?: string;
  tagline?: string;
  about?: string;
  photoUrl?: string;
  location?: string;
  email?: string;
  phone?: string;
  social?: PortfolioSocial;
  pinnedResumeId?: string;
  metaTitle?: string;
  metaDescription?: string;
  sections: PortfolioSection[];
  theme: PortfolioTheme;
  views?: number;
  publishedAt?: string;
}

let uidCounter = 0;
export function uid(prefix = 'sec'): string {
  uidCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${uidCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createDefaultSection(type: PortfolioSectionType): PortfolioSection {
  const id = uid(type);
  const style: PortfolioBlockStyle = {};
  switch (type) {
    case 'hero':
      return { id, type, enabled: true, style, config: { headline: '', subheadline: '', photoUrl: '', ctaLabel: '', ctaUrl: '', resumeCtaEnabled: false } as HeroConfig };
    case 'about':
      return { id, type, enabled: true, style, config: { body: '', highlights: [] } as AboutConfig };
    case 'skills':
      return { id, type, enabled: true, style, config: { groups: [{ id: uid('grp'), label: 'Skills', items: [] }] } as SkillsConfig };
    case 'experience':
      return { id, type, enabled: true, style, config: { items: [] } as ExperienceConfig };
    case 'projects':
      return { id, type, enabled: true, style, config: { items: [] } as ProjectsConfig };
    case 'education':
      return { id, type, enabled: true, style, config: { items: [] } as EducationConfig };
    case 'testimonials':
      return { id, type, enabled: true, style, config: { items: [] } as TestimonialsConfig };
    case 'contact':
      return { id, type, enabled: true, style, config: { showEmail: true, showPhone: false, showSocial: true, ctaLabel: 'Get in touch' } as ContactConfig };
  }
}

/** The Hero section's config is the source of truth for display name/tagline now that the identity panel no longer edits them directly. */
export function getHeroConfig(p: PortfolioData): HeroConfig | undefined {
  return p.sections.find(s => s.type === 'hero')?.config as HeroConfig | undefined;
}

export function getDisplayName(p: PortfolioData): string {
  return getHeroConfig(p)?.headline || p.displayName || p.username;
}

export function getTagline(p: PortfolioData): string {
  return getHeroConfig(p)?.subheadline || p.tagline || '';
}

/** Fills in fields Phase 1 added (`style`, `theme.glassEffect`) for documents saved before they existed. */
function normalizeSections(raw: any[]): PortfolioSection[] {
  return (raw ?? []).map((s: any) => ({ ...s, style: s.style ?? {} }));
}

function normalizeTheme(raw: any): PortfolioTheme {
  return { ...DEFAULT_THEME, ...(raw ?? {}) };
}

/** Maps a raw API portfolio document to the frontend PortfolioData shape, reading either the `draft` or `published` snapshot. */
export function mapServerPortfolio(doc: any, blobKey: 'draft' | 'published' = 'draft'): PortfolioData {
  const blob = doc[blobKey] ?? {};
  return {
    _id: doc._id,
    username: doc.username ?? blob.username ?? '',
    isPublic: !!doc.isPublic,
    status: doc.status ?? 'draft',
    displayName: blob.displayName ?? doc.displayName,
    tagline: blob.tagline ?? doc.tagline,
    about: blob.about ?? doc.about,
    photoUrl: blob.photoUrl ?? doc.photoUrl,
    location: blob.location ?? doc.location,
    email: blob.email ?? doc.email,
    phone: blob.phone ?? doc.phone,
    social: blob.social ?? doc.social ?? {},
    pinnedResumeId: blob.pinnedResumeId ?? doc.pinnedResumeId,
    metaTitle: blob.metaTitle ?? doc.metaTitle,
    metaDescription: blob.metaDescription ?? doc.metaDescription,
    sections: normalizeSections(blob.sections ?? doc.sections ?? []),
    theme: normalizeTheme(blob.theme ?? doc.theme),
    views: doc.views,
    publishedAt: doc.publishedAt,
  };
}

export function createBlankPortfolio(): PortfolioData {
  return {
    username: '',
    // Matches the backend schema default — the "Publish" button only ever
    // copies draft → published, it doesn't separately flip this flag, so it
    // must already be true or a freshly published portfolio stays invisible.
    isPublic: true,
    status: 'draft',
    social: {},
    sections: [createDefaultSection('hero'), createDefaultSection('contact')],
    theme: { ...DEFAULT_THEME },
  };
}
