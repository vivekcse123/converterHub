/**
 * Single source of truth for plan pricing and feature access.
 * Used by: pricing page, upgrade modal, dashboard, backend (mirrored in subscription.controller.js).
 */

export const PLAN_PRICES = {
  monthly: {
    paise:        9900,
    display:      '₹99',
    period:       '/mo',
    tagline:      'Cancel anytime',
    annualCost:   '₹1,188 if billed monthly',
  },
  yearly: {
    paise:         69900,
    display:       '₹699',
    period:        '/yr',
    monthlyEquiv:  '₹58/mo',
    tagline:       'Save ₹489 · 5 months free!',
    regularPrice:  '₹1,188',
    savingsPct:    '41%',
  },
  lifetime: {
    paise:     149900,
    display:   '₹1,499',
    period:    ' once',
    tagline:   'Pay once · Use forever',
    equiv:     '≈ 15 months of Monthly',
  },
} as const;

export type PaidPlan = keyof typeof PLAN_PRICES;
export type PlanType = 'free' | PaidPlan;

/** Feature rows shown in comparison table. freeVal / proVal = display string. freeOk / proOk = check color. */
export interface PlanFeatureRow {
  label:   string;
  freeVal: string;
  proVal:  string;
  freeOk:  boolean;
  proOk:   boolean;
  section?: string;
}

export const FEATURE_TABLE: Array<PlanFeatureRow & { section?: string }> = [
  // section header - only section field
  { section: 'Resume Builder', label: '', freeVal: '', proVal: '', freeOk: false, proOk: false },
  { label: 'Free templates',         freeVal: '16',             proVal: 'All 30 ✓',          freeOk: true,  proOk: true  },
  { label: 'Premium templates',      freeVal: '✗',              proVal: '14 exclusive ✓',     freeOk: false, proOk: true  },
  { label: 'Resumes',                freeVal: 'Up to 2',        proVal: 'Unlimited ✓',        freeOk: true,  proOk: true  },
  { label: 'PDF downloads',          freeVal: '3 / day',        proVal: 'Unlimited ✓',        freeOk: true,  proOk: true  },
  { label: 'PDF watermark',          freeVal: 'Yes',            proVal: 'None ✓',             freeOk: false, proOk: true  },
  { label: 'ATS score',              freeVal: 'Basic',          proVal: '4 sub-scores ✓',     freeOk: true,  proOk: true  },
  { label: 'AI writing assistant',   freeVal: '✗',              proVal: '✓',                  freeOk: false, proOk: true  },
  { section: 'Career Tools', label: '', freeVal: '', proVal: '', freeOk: false, proOk: false },
  { label: 'Cover Letter Builder',   freeVal: '✗',              proVal: '✓ Unlimited',        freeOk: false, proOk: true  },
  { label: 'Portfolio Builder',      freeVal: '✗',              proVal: '✓ Public URL',       freeOk: false, proOk: true  },
  { label: 'Job Application Tracker',freeVal: '✗',              proVal: '✓ Full',             freeOk: false, proOk: true  },
  { label: 'Biodata Maker',          freeVal: 'Basic ✓',        proVal: 'Full ✓',             freeOk: true,  proOk: true  },
  { section: 'Access & Support', label: '', freeVal: '', proVal: '', freeOk: false, proOk: false },
  { label: 'New features',           freeVal: 'Standard',       proVal: 'Early access ✓',     freeOk: true,  proOk: true  },
  { label: 'Future Pro features',    freeVal: '✗',              proVal: 'Always ✓',           freeOk: false, proOk: true  },
  { label: 'Priority support',       freeVal: '✗',              proVal: '✓',                  freeOk: false, proOk: true  },
];

/** Short list used in upgrade modal and free plan column. */
export const FREE_PLAN_BULLETS = [
  { text: 'Resume Builder',                 ok: true  },
  { text: '16 free templates',              ok: true  },
  { text: 'Basic ATS score',                ok: true  },
  { text: 'Up to 2 resumes saved',          ok: true  },
  { text: 'PDF download (with watermark)',   ok: true  },
  { text: 'Premium templates',              ok: false },
  { text: 'No watermark',                   ok: false },
  { text: 'Cover Letter Builder',           ok: false },
  { text: 'Portfolio Builder',              ok: false },
  { text: 'Job Tracker',                    ok: false },
];

export const PRO_HIGHLIGHTS = [
  { svgPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'All 30 Resume Templates'      },
  { svgPath: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',                          label: 'No Watermark on PDFs'         },
  { svgPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',            label: 'Unlimited Resumes & Downloads'},
  { svgPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', label: 'AI Writing Assistant' },
  { svgPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',                  label: 'Cover Letter Builder'         },
  { svgPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Portfolio Builder' },
  { svgPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', label: 'Job Application Tracker' },
  { svgPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',              label: 'All Future Pro Features'     },
];

export const PRO_FULL_LIST = [
  'All 30 templates (14 exclusive premium)',
  'No watermark on downloaded PDFs',
  'Unlimited resumes & downloads',
  'Full ATS score with 4 sub-scores',
  'AI writing assistant',
  'Cover Letter Builder (unlimited)',
  'Portfolio Builder with public URL',
  'Job Application Tracker',
  'Early access to new templates',
  'Priority support',
];

export const YEARLY_EXTRA = [
  'Everything in Monthly',
  '5 months free (save ₹489)',
  'Early access to every new template',
  'Exclusive yearly-only designs',
  'Priority email support',
  'All future Pro features - always',
];
