/** Real, navigable site pages that aren't converter/builder "tools" — kept
 *  as a separate small index so global search can surface them (templates
 *  gallery, pricing, etc.) without conflating them with the TOOLS catalog. */
export interface SearchPage {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

export const SEARCH_PAGES: SearchPage[] = [
  { id: 'page-resume-templates', title: 'Resume Templates', description: 'Browse 70+ free and premium ATS-friendly resume templates.', icon: '🗂️', route: '/resume-templates' },
  { id: 'page-tools',            title: 'All Converter Tools', description: 'Browse every PDF, image, and document conversion tool.', icon: '🧰', route: '/tools' },
  { id: 'page-pricing',          title: 'Pricing', description: 'Compare free and Pro plans for resumes, portfolios, and AI tools.', icon: '💳', route: '/resume-builder/pricing' },
];
