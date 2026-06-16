import { Routes } from '@angular/router';
import { ROLE_ORDER, ROLE_PAGES } from './data/role-pages.data';

export const resumeBuilderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/builder/resume-builder.component').then(m => m.ResumeBuilderComponent),
    title: 'Free ATS Resume Builder — ApnaConverter',
    data: {
      description:
        'Build a professional, ATS-friendly resume for free. Choose a template, fill in your details, see a live ATS score, and download a polished PDF — no sign-up required.',
    },
  },
  ...ROLE_ORDER.map(slug => {
    const role = ROLE_PAGES[slug];
    return {
      path: slug,
      loadComponent: () => import('./pages/role-landing/resume-role.component').then(m => m.ResumeRoleComponent),
      title: `${role.heroTitle} — ApnaConverter`,
      data: { role: slug, description: role.metaDescription },
    };
  }),
];
