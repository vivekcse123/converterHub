import { PortfolioData, PortfolioSection, DEFAULT_THEME } from '../models/portfolio.model';

/**
 * One realistic, fully-populated portfolio used to preview themes in the
 * gallery — the same content rendered through each theme so browsing feels
 * like comparing real websites, not empty placeholder layouts.
 */
const DEMO_SECTIONS: PortfolioSection[] = [
  {
    id: 'demo-hero', type: 'hero', enabled: true, style: {},
    config: {
      headline: 'Alex Rivera',
      subheadline: 'Full-stack developer building fast, accessible web products — from first prototype to production scale.',
      photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=faces',
      ctaLabel: 'View my work',
      ctaUrl: '#projects',
      resumeCtaEnabled: true,
    },
  },
  {
    id: 'demo-about', type: 'about', enabled: true, style: {},
    config: {
      body: "I'm a full-stack engineer with 6 years of experience shipping products used by millions — from early-stage startups to Series C scale-ups. I care about clean architecture, fast page loads, and interfaces people actually enjoy using.\n\nOutside of work I mentor junior engineers and contribute to open source.",
      highlights: ['6+ years experience', 'Ex-Stripe, Ex-Notion', 'Open source maintainer', 'Based in San Francisco'],
    },
  },
  {
    id: 'demo-skills', type: 'skills', enabled: true, style: {},
    config: {
      groups: [
        { id: 'g1', label: 'Frontend', items: [
          { name: 'TypeScript', level: 'expert' }, { name: 'React', level: 'expert' },
          { name: 'Next.js', level: 'advanced' }, { name: 'Tailwind CSS', level: 'expert' },
        ] },
        { id: 'g2', label: 'Backend', items: [
          { name: 'Node.js', level: 'expert' }, { name: 'PostgreSQL', level: 'advanced' },
          { name: 'GraphQL', level: 'advanced' }, { name: 'Redis', level: 'intermediate' },
        ] },
        { id: 'g3', label: 'Infrastructure', items: [
          { name: 'AWS', level: 'advanced' }, { name: 'Docker', level: 'advanced' },
          { name: 'CI/CD', level: 'advanced' },
        ] },
      ],
    },
  },
  {
    id: 'demo-experience', type: 'experience', enabled: true, style: {},
    config: {
      items: [
        {
          id: 'e1', role: 'Senior Software Engineer', company: 'Notion', startDate: 'Jan 2022', endDate: '', current: true,
          bullets: [
            'Led the rebuild of the block-rendering engine, cutting initial page load by 40%',
            'Shipped real-time collaborative editing for 2M+ weekly active users',
            'Mentored 4 engineers through promotion to mid-level',
          ],
        },
        {
          id: 'e2', role: 'Software Engineer', company: 'Stripe', startDate: 'Jun 2019', endDate: 'Dec 2021', current: false,
          bullets: [
            'Built internal tooling adopted by 30+ engineering teams',
            'Reduced API latency p99 by 35% through targeted caching',
          ],
        },
        {
          id: 'e3', role: 'Frontend Developer', company: 'Freelance', startDate: 'Jul 2017', endDate: 'May 2019', current: false,
          bullets: ['Delivered 12+ client projects across fintech, healthcare, and e-commerce'],
        },
      ],
    },
  },
  {
    id: 'demo-projects', type: 'projects', enabled: true, style: {},
    config: {
      items: [
        {
          title: 'Fintech Dashboard',
          description: 'A real-time analytics dashboard for a payments startup — built with React, WebSockets, and D3, processing 50k events/second.',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
          url: 'https://example.com', githubUrl: 'https://github.com', tags: ['React', 'TypeScript', 'D3.js'], featured: true,
        },
        {
          title: 'DevTools Extension',
          description: 'An open-source browser extension for debugging GraphQL queries in production, 8k+ installs.',
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
          url: 'https://example.com', githubUrl: 'https://github.com', tags: ['GraphQL', 'Chrome API'], featured: true,
        },
        {
          title: 'Design System',
          description: 'A component library and design token system adopted across 6 product teams, reducing UI inconsistencies by 90%.',
          imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop',
          url: 'https://example.com', tags: ['Storybook', 'Figma', 'CSS'], featured: false,
        },
        {
          title: 'Realtime Chat SDK',
          description: 'A lightweight, embeddable chat SDK for SaaS products with presence, typing indicators, and E2E encryption.',
          imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=500&fit=crop',
          githubUrl: 'https://github.com', tags: ['Node.js', 'WebRTC'], featured: false,
        },
      ],
    },
  },
  {
    id: 'demo-education', type: 'education', enabled: true, style: {},
    config: {
      items: [
        { institution: 'University of California, Berkeley', degree: 'B.S.', field: 'Computer Science', startDate: '2013', endDate: '2017' },
      ],
    },
  },
  {
    id: 'demo-testimonials', type: 'testimonials', enabled: true, style: {},
    config: {
      items: [
        {
          quote: 'Alex is one of the strongest engineers I\'ve worked with — technically sharp, but also great at bringing the rest of the team along.',
          author: 'Sarah Chen', role: 'Engineering Manager, Notion',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
        },
        {
          quote: 'Rare combination of deep technical skill and genuine product sense. Every project shipped ahead of schedule.',
          author: 'Marcus Lee', role: 'Founder, Payflow',
          avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=faces',
        },
      ],
    },
  },
  {
    id: 'demo-contact', type: 'contact', enabled: true, style: {},
    config: { showEmail: true, showPhone: false, showSocial: true, ctaLabel: 'Get in touch' },
  },
];

export const DEMO_PORTFOLIO: PortfolioData = {
  username: 'alexrivera',
  isPublic: true,
  status: 'published',
  displayName: 'Alex Rivera',
  tagline: 'Full-Stack Developer',
  email: 'alex@example.com',
  location: 'San Francisco, CA',
  social: { github: 'https://github.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  metaTitle: 'Alex Rivera — Full-Stack Developer',
  sections: DEMO_SECTIONS,
  theme: { ...DEFAULT_THEME },
};

/** Returns a copy of the demo portfolio rendered with the given theme. */
export function demoPortfolioForTheme(templateId: string, mode: 'light' | 'dark', accentColor: string): PortfolioData {
  return {
    ...DEMO_PORTFOLIO,
    theme: { ...DEFAULT_THEME, templateId, mode, accentColor },
  };
}
