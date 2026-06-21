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
  { icon: '📄', label: 'All 30 Resume Templates'     },
  { icon: '🚫', label: 'No Watermark on PDFs'        },
  { icon: '♾️',  label: 'Unlimited Resumes & Downloads'},
  { icon: '🤖', label: 'AI Writing Assistant'        },
  { icon: '💌', label: 'Cover Letter Builder'        },
  { icon: '🌐', label: 'Portfolio Builder'           },
  { icon: '📋', label: 'Job Application Tracker'     },
  { icon: '✨', label: 'All Future Pro Features'     },
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
