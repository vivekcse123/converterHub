import { Type } from '@angular/core';
import { TemplateId } from '../models/resume.model';
import { AtsProfessionalTemplateComponent } from '../templates/ats-professional/ats-professional-template.component';
import { ModernProfessionalTemplateComponent } from '../templates/modern-professional/modern-professional-template.component';
import { FresherTemplateComponent } from '../templates/fresher/fresher-template.component';

export interface ResumeTemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  component: Type<unknown>;
  /** Tailwind gradient classes used for the template card thumbnail. */
  accent: string;
  bestFor: string;
}

export const RESUME_TEMPLATES: ResumeTemplateMeta[] = [
  {
    id: 'ats-professional',
    name: 'ATS Professional',
    description: 'A clean, single-column layout with classic typography — built to pass through any Applicant Tracking System without errors.',
    component: AtsProfessionalTemplateComponent,
    accent: 'from-slate-700 to-slate-900',
    bestFor: 'Best for: corporate roles, government & finance applications',
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'A contemporary design with a bold accent-color header and skill tags, while staying fully ATS-compliant.',
    component: ModernProfessionalTemplateComponent,
    accent: 'from-blue-500 to-indigo-600',
    bestFor: 'Best for: tech, marketing, and product roles',
  },
  {
    id: 'fresher',
    name: 'Fresher / Entry-Level',
    description: 'Friendly icons and a structure that leads with education and projects — ideal for students and recent graduates.',
    component: FresherTemplateComponent,
    accent: 'from-emerald-500 to-teal-600',
    bestFor: 'Best for: students, internships, and first jobs',
  },
];

export function getTemplateMeta(id: TemplateId): ResumeTemplateMeta {
  return RESUME_TEMPLATES.find(t => t.id === id) ?? RESUME_TEMPLATES[0];
}
