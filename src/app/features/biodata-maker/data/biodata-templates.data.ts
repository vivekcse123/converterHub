import { Type } from '@angular/core';
import { BiodataTemplateId } from '../models/biodata.model';
import { ClassicMarriageTemplateComponent } from '../templates/classic-marriage/classic-marriage-template.component';
import { ProfessionalTemplateComponent } from '../templates/professional/professional-template.component';
import { ModernCardTemplateComponent } from '../templates/modern-card/modern-card-template.component';

export interface BiodataTemplateMeta {
  id: BiodataTemplateId;
  name: string;
  description: string;
  badge: string;
  gradient: string;
  component: Type<any>;
}

export const BIODATA_TEMPLATES: BiodataTemplateMeta[] = [
  {
    id: 'classic-marriage',
    name: 'Classic Marriage',
    description: 'Traditional Indian marriage biodata with photo, family details, and ornamental border.',
    badge: 'Most Popular',
    gradient: 'from-rose-500 to-pink-600',
    component: ClassicMarriageTemplateComponent,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, modern format for job applications or general professional use.',
    badge: 'Clean & Modern',
    gradient: 'from-indigo-500 to-blue-600',
    component: ProfessionalTemplateComponent,
  },
  {
    id: 'modern-card',
    name: 'Modern Card',
    description: 'Contemporary card-style design with a vibrant header and circular photo.',
    badge: 'Eye-catching',
    gradient: 'from-primary-500 to-purple-600',
    component: ModernCardTemplateComponent,
  },
];

export function getTemplateMeta(id: BiodataTemplateId): BiodataTemplateMeta {
  return BIODATA_TEMPLATES.find(t => t.id === id) ?? BIODATA_TEMPLATES[0];
}
