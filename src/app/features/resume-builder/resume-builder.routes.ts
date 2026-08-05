import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { proGuard }  from '../../core/guards/pro.guard';
import { ROLE_ORDER, ROLE_PAGES } from './data/role-pages.data';

export const resumeBuilderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/builder/resume-builder.component').then(m => m.ResumeBuilderComponent),
    title: 'Free ATS Resume Builder | ApnaConverter',
    data: {
      hideShell: true,
      description: 'Build a professional, ATS-friendly resume for free. Choose a template, fill in your details, see a live ATS score, and download a polished PDF - no sign-up required.',
    },
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/resume-pricing.component').then(m => m.ResumePricingComponent),
    title: 'Premium Resume Templates & Career Tools Pricing | ApnaConverter',
    data: { description: 'Upgrade to ApnaConverter Pro for unlimited resumes, all 30 premium templates, cover letters, portfolios, and job tracker. Plans from ₹99/month.' },
  },
  {
    // Job Tracker now lives inside the dashboard shell so it doesn't drop
    // users back into the marketing site header/footer mid-flow.
    path: 'job-tracker',
    redirectTo: '/dashboard/job-tracker',
    pathMatch: 'full',
  },
  {
    path: 'cover-letter',
    loadComponent: () => import('./pages/cover-letter/cover-letter.component').then(m => m.CoverLetterComponent),
    canActivate: [proGuard],
    title: 'AI Cover Letter Generator & Builder | ApnaConverter',
    data: { description: 'Generate a professional, tailored cover letter from your resume data in seconds. AI-powered, free for Pro users.' },
  },
  {
    // Portfolio Builder was promoted to a standalone top-level feature at /portfolio.
    path: 'portfolio',
    redirectTo: '/portfolio',
    pathMatch: 'full',
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
      title: `${role.heroTitle} | ApnaConverter`,
      data: { role: slug, description: role.metaDescription },
    };
  }),
];
