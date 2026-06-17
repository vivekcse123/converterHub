import { Type } from '@angular/core';
import { TemplateId } from '../models/resume.model';
import { AtsProfessionalTemplateComponent } from '../templates/ats-professional/ats-professional-template.component';
import { ModernProfessionalTemplateComponent } from '../templates/modern-professional/modern-professional-template.component';
import { FresherTemplateComponent } from '../templates/fresher/fresher-template.component';
import { ExecutiveTemplateComponent } from '../templates/executive/executive-template.component';
import { CreativeTemplateComponent } from '../templates/creative/creative-template.component';
import { MinimalTemplateComponent } from '../templates/minimal/minimal-template.component';
import { TechTemplateComponent } from '../templates/tech/tech-template.component';
import { ElegantTemplateComponent } from '../templates/elegant/elegant-template.component';
import { CompactTemplateComponent } from '../templates/compact/compact-template.component';
import { BoldTemplateComponent } from '../templates/bold/bold-template.component';

export type TemplateCategory = 'Classic & ATS-Safe' | 'Modern & Professional' | 'Creative & Bold' | 'Executive & Two-Column';

export interface ResumeTemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  component: Type<unknown>;
  /** Tailwind gradient classes used for the template card thumbnail. */
  accent: string;
  bestFor: string;
  category: TemplateCategory;
}

export const RESUME_TEMPLATES: ResumeTemplateMeta[] = [
  {
    id: 'ats-professional',
    name: 'ATS Professional',
    description: 'A clean, single-column layout with classic typography — built to pass through any Applicant Tracking System without errors.',
    component: AtsProfessionalTemplateComponent,
    accent: 'from-slate-700 to-slate-900',
    bestFor: 'Best for: corporate roles, government & finance applications',
    category: 'Classic & ATS-Safe',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Pure typography, no color — lets your content speak for itself with refined whitespace.',
    component: MinimalTemplateComponent,
    accent: 'from-gray-400 to-gray-700',
    bestFor: 'Best for: consultants, academics, and executive candidates',
    category: 'Classic & ATS-Safe',
  },
  {
    id: 'fresher',
    name: 'Fresher / Entry-Level',
    description: 'Friendly icons and a structure that leads with education and projects — ideal for students and recent graduates.',
    component: FresherTemplateComponent,
    accent: 'from-emerald-500 to-teal-600',
    bestFor: 'Best for: students, internships, and first jobs',
    category: 'Classic & ATS-Safe',
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'A contemporary design with a bold accent-color header and skill tags, while staying fully ATS-compliant.',
    component: ModernProfessionalTemplateComponent,
    accent: 'from-blue-500 to-indigo-600',
    bestFor: 'Best for: tech, marketing, and product roles',
    category: 'Modern & Professional',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Dark header with emerald accents and code-style skill tags — built for engineers and developers.',
    component: TechTemplateComponent,
    accent: 'from-slate-900 to-emerald-600',
    bestFor: 'Best for: software engineers, DevOps, and data scientists',
    category: 'Modern & Professional',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Centered serif layout with rose-pink tones and ornamental details — refined and sophisticated.',
    component: ElegantTemplateComponent,
    accent: 'from-rose-400 to-pink-600',
    bestFor: 'Best for: healthcare, education, and hospitality professionals',
    category: 'Modern & Professional',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'A vibrant purple-gradient header with pill-style sections — for professionals who want to stand out.',
    component: CreativeTemplateComponent,
    accent: 'from-violet-500 to-purple-700',
    bestFor: 'Best for: designers, content creators, and marketing roles',
    category: 'Creative & Bold',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Full-bleed violet gradient header and strong color-block sections — unapologetically confident.',
    component: BoldTemplateComponent,
    accent: 'from-violet-600 to-purple-800',
    bestFor: 'Best for: startup, agency, and leadership roles',
    category: 'Creative & Bold',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Two-column navy and gold layout with a bold sidebar — commands authority for senior and C-level roles.',
    component: ExecutiveTemplateComponent,
    accent: 'from-slate-800 to-yellow-600',
    bestFor: 'Best for: senior management, C-level, and finance roles',
    category: 'Executive & Two-Column',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Dense two-column layout with a blue sidebar — fits maximum experience on a single page.',
    component: CompactTemplateComponent,
    accent: 'from-blue-600 to-indigo-700',
    bestFor: 'Best for: senior professionals with extensive experience',
    category: 'Executive & Two-Column',
  },
];

export function getTemplateMeta(id: TemplateId): ResumeTemplateMeta {
  return RESUME_TEMPLATES.find(t => t.id === id) ?? RESUME_TEMPLATES[0];
}

export const TEMPLATE_CATEGORIES: { label: TemplateCategory; icon: string; hint: string }[] = [
  { label: 'Classic & ATS-Safe',        icon: '📄', hint: 'Passes any ATS scanner — safe for all job portals' },
  { label: 'Modern & Professional',     icon: '💼', hint: 'Polished color accents, still recruiter-friendly' },
  { label: 'Creative & Bold',           icon: '🎨', hint: 'Eye-catching designs for standout applications' },
  { label: 'Executive & Two-Column',    icon: '🏆', hint: 'Sidebar layout — maximises space for senior profiles' },
];

export function getTemplatesByCategory(category: TemplateCategory): ResumeTemplateMeta[] {
  return RESUME_TEMPLATES.filter(t => t.category === category);
}
