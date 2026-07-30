import { Type } from '@angular/core';
import { MinimalPortfolioTemplateComponent } from '../templates/minimal/minimal-portfolio-template.component';
import { DeveloperPortfolioTemplateComponent } from '../templates/developer/developer-portfolio-template.component';
import { DesignerPortfolioTemplateComponent } from '../templates/designer/designer-portfolio-template.component';
import { FreelancerPortfolioTemplateComponent } from '../templates/freelancer/freelancer-portfolio-template.component';

export type PortfolioTemplateCategory = 'Developer' | 'Creative' | 'Freelancer' | 'Minimal';

export interface PortfolioTemplateMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  component: Type<unknown>;
  accent: string;            // tailwind gradient chip, for the picker card
  defaultAccentHex: string;
  category: PortfolioTemplateCategory;
  isPremium: boolean;
}

export const PORTFOLIO_TEMPLATES: PortfolioTemplateMeta[] = [
  {
    id: 'minimal',
    slug: 'minimal-portfolio-template',
    name: 'Minimal',
    description: 'Generalist single-column layout with high whitespace — works for any profession.',
    component: MinimalPortfolioTemplateComponent,
    accent: 'from-indigo-500 to-violet-600',
    defaultAccentHex: '#4f46e5',
    category: 'Minimal',
    isPremium: true,
  },
  {
    id: 'developer',
    slug: 'developer-portfolio-template',
    name: 'Developer',
    description: 'Dark, monospace-accented terminal aesthetic with a GitHub-forward hero.',
    component: DeveloperPortfolioTemplateComponent,
    accent: 'from-emerald-500 to-teal-700',
    defaultAccentHex: '#10b981',
    category: 'Developer',
    isPremium: true,
  },
  {
    id: 'designer',
    slug: 'designer-portfolio-template',
    name: 'Designer',
    description: 'Light, bold typography with a large image-forward project grid.',
    component: DesignerPortfolioTemplateComponent,
    accent: 'from-rose-500 to-orange-500',
    defaultAccentHex: '#e11d48',
    category: 'Creative',
    isPremium: true,
  },
  {
    id: 'freelancer',
    slug: 'freelancer-portfolio-template',
    name: 'Freelancer',
    description: 'Warm, testimonial-forward layout with a clear call-to-action and contact section.',
    component: FreelancerPortfolioTemplateComponent,
    accent: 'from-amber-500 to-orange-600',
    defaultAccentHex: '#d97706',
    category: 'Freelancer',
    isPremium: true,
  },
];

export function getPortfolioTemplateMeta(id: string | undefined): PortfolioTemplateMeta {
  return PORTFOLIO_TEMPLATES.find(t => t.id === id) ?? PORTFOLIO_TEMPLATES[0];
}
