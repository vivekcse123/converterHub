import { Routes } from '@angular/router';
import { ROLE_ORDER, ROLE_PAGES } from './data/role-pages.data';

export const resumeBuilderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/builder/resume-builder.component').then(m => m.ResumeBuilderComponent),
    title: 'Free ATS Resume Builder — ApnaConverter',
    data: { description: 'Build a professional, ATS-friendly resume for free. Choose a template, fill in your details, see a live ATS score, and download a polished PDF — no sign-up required.' },
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/resume-pricing.component').then(m => m.ResumePricingComponent),
    title: 'Resume Builder Pricing — ApnaConverter Pro from ₹9/month',
    data: { description: 'Upgrade to ApnaConverter Pro for unlimited resumes, all premium templates, and no watermark. Plans from just ₹9/month.' },
  },
  {
    path: 'cover-letter',
    loadComponent: () => import('./pages/cover-letter/cover-letter.component').then(m => m.CoverLetterComponent),
    title: 'Cover Letter Builder — ApnaConverter',
    data: { description: 'Generate a professional, tailored cover letter from your resume data in seconds.' },
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent),
    title: 'Portfolio Builder — ApnaConverter',
    data: { description: 'Build a public portfolio page with your bio, skills, projects, and pinned resume.' },
  },
  {
    path: 'dashboard',
    redirectTo: '/dashboard',
    pathMatch: 'full',
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
