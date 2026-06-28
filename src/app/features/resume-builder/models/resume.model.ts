export type TemplateId =
  | 'ats-professional' | 'modern-professional' | 'fresher' | 'executive'
  | 'creative' | 'minimal' | 'tech' | 'elegant' | 'compact' | 'bold'
  | 'sidebar-classic' | 'sidebar-pro'
  | 'banner-blue' | 'banner-dark'
  | 'traditional'
  | 'timeline-modern' | 'timeline-pro'
  | 'split-modern' | 'corporate-pro'
  | 'executive-elite' | 'luxury-gold'
  | 'creative-portfolio-pro'
  | 'startup-founder' | 'modern-clean'
  | 'product-manager-pro'
  | 'photo-professional' | 'photo-sidebar-modern'
  | 'photo-teacher' | 'photo-government' | 'photo-executive'
  // New unique templates added in v2
  | 'corporate-classic'
  | 'left-stripe'
  | 'two-col-classic'
  | 'academic-cv'
  | 'healthcare'
  | 'sales-achiever';

export interface DesignSettings {
  accentColor: string;
  fontFamily:  'inter' | 'roboto' | 'georgia';
  fontSize:    'small' | 'medium' | 'large';
  baseFontPt?: number;  // precise pt override; if set, takes priority over fontSize
  lineHeight:  'compact' | 'standard' | 'spacious';
  paperSize:   'a4' | 'letter';
}

export const DEFAULT_DESIGN: DesignSettings = {
  accentColor: '#1e293b',
  fontFamily:  'inter',
  fontSize:    'medium',
  baseFontPt:  10.5,
  lineHeight:  'standard',
  paperSize:   'a4',
};

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  github: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  techStack: string;
  bullets: string[];
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface CustomSectionEntry {
  id: string;
  heading: string;
  subheading: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  entries: CustomSectionEntry[];
}

/** Built-in (non-custom) resume sections that can be reordered/hidden. */
export type BuiltInSectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'interests';

/** Either a built-in section id, or `custom:<customSection.id>`. */
export type SectionRef = BuiltInSectionId | `custom:${string}`;

export interface ResumeVersion {
  versionId:   string;
  label:       string;
  savedAt:     number;
  snapshot:    Omit<ResumeData, 'versions'>;
}

export interface ResumeData {
  id: string;
  name: string;
  templateId: TemplateId;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  certifications: CertificationItem[];
  achievements: string[];
  languages: LanguageItem[];
  interests: string[];
  customSections: CustomSection[];
  sectionOrder: SectionRef[];
  sectionVisibility: Record<string, boolean>;
  design?: DesignSettings;
  updatedAt: number;
  // v2 fields
  atsScore?: number;
  publicSlug?: string;
  versions?: ResumeVersion[];
}

export const SECTION_LABELS: Record<BuiltInSectionId, string> = {
  summary: 'Professional Summary',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
  interests: 'Interests',
};

export const DEFAULT_SECTION_ORDER: SectionRef[] = [
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'certifications',
  'achievements',
  'languages',
  'interests',
];
