import { TemplateId } from '../models/resume.model';

export interface RoleFaq {
  q: string;
  a: string;
}

export interface RolePageContent {
  slug: string;
  /** Short role title, e.g. "Software Engineer". */
  title: string;
  /** Page H1. */
  heroTitle: string;
  /** Intro paragraph below the H1. */
  intro: string;
  /** Meta description for SEO. */
  metaDescription: string;
  recommendedTemplate: TemplateId;
  /** Example resume bullet points tailored to this role. */
  bulletExamples: string[];
  /** Key ATS keywords / skills recruiters search for. */
  keySkills: string[];
  /** "How to write a ... resume" steps for the HowTo schema. */
  howToSteps: { title: string; description: string }[];
  faqs: RoleFaq[];
}

/** Slugs in the order they should appear on /resume-examples and in the route config. */
export const ROLE_ORDER = [
  'software-engineer',
  'frontend-developer',
  'angular-developer',
  'react-developer',
  'java-developer',
  'data-analyst',
  'accountant',
  'teacher',
] as const;

export type RoleSlug = (typeof ROLE_ORDER)[number];

export const ROLE_PAGES: Record<RoleSlug, RolePageContent> = {
  'software-engineer': {
    slug: 'software-engineer',
    title: 'Software Engineer',
    heroTitle: 'Software Engineer Resume Examples & Free Builder',
    intro:
      'A great software engineer resume proves impact, not just responsibility. Recruiters and ATS systems scan for ' +
      'measurable results — performance gains, scale, reliability — alongside the languages, frameworks, and tools ' +
      'you use daily. Use the examples below as inspiration, then build your own ATS-friendly resume in minutes with ' +
      'our free builder.',
    metaDescription:
      'Free software engineer resume builder with ATS-friendly templates, real bullet-point examples, and key skills recruiters search for.',
    recommendedTemplate: 'ats-professional',
    bulletExamples: [
      'Designed and shipped a microservice handling 2M+ requests/day, reducing average API latency by 45%.',
      'Led migration of a monolithic application to a microservices architecture, cutting deployment time from 2 hours to 10 minutes.',
      'Wrote unit and integration tests that increased code coverage from 58% to 91%, reducing production bugs by 30%.',
      'Mentored 4 junior engineers and ran weekly code reviews, improving sprint velocity by 20%.',
      'Optimized PostgreSQL queries and added Redis caching, reducing database load by 60% during peak traffic.',
    ],
    keySkills: [
      'Data Structures & Algorithms', 'System Design', 'Java / Python / JavaScript', 'REST APIs',
      'Microservices', 'SQL & NoSQL Databases', 'Git & CI/CD', 'Cloud (AWS/Azure/GCP)',
      'Unit Testing', 'Agile/Scrum',
    ],
    howToSteps: [
      { title: 'Start with a strong summary', description: 'Open with 2-3 lines covering your years of experience, core tech stack, and a standout achievement.' },
      { title: 'Quantify your experience', description: 'For each role, write 3-5 bullet points that lead with an action verb and include a measurable result (%, time saved, users impacted).' },
      { title: 'List relevant technical skills', description: 'Group languages, frameworks, databases, and tools so ATS software can match them against the job description.' },
      { title: 'Add projects and education', description: 'Include personal or open-source projects with links, plus your degree and graduation year.' },
      { title: 'Run an ATS check', description: 'Use the live ATS score panel in the builder to confirm your resume hits the key checks before downloading.' },
    ],
    faqs: [
      { q: 'How long should a software engineer resume be?', a: 'One page for under 8 years of experience, and at most two pages for senior or staff-level engineers. Focus on your most recent and most relevant roles.' },
      { q: 'Should I include a GitHub or portfolio link?', a: 'Yes. Add your GitHub, LinkedIn, and portfolio URL in the contact section — recruiters frequently check these to verify hands-on experience.' },
      { q: 'How do I make my resume ATS-friendly?', a: 'Use a single-column layout, standard section headings, and avoid tables, images, or text boxes. Our ATS Professional template is built for this.' },
      { q: 'What if I don’t have professional experience yet?', a: 'Highlight internships, academic projects, hackathons, and open-source contributions with the same quantified bullet-point style used for jobs.' },
      { q: 'Which skills should I prioritize?', a: 'Match the keywords in the job description first — languages, frameworks, and tools mentioned there — then add complementary skills like system design or testing.' },
    ],
  },

  'frontend-developer': {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    heroTitle: 'Frontend Developer Resume Examples & Free Builder',
    intro:
      'Frontend developer resumes need to balance technical depth with visible impact — page speed, accessibility, ' +
      'conversion rates, and user experience improvements all matter to hiring teams. Pair a clean, modern layout ' +
      'with concrete metrics to stand out, then export an ATS-ready PDF with our free builder.',
    metaDescription:
      'Free frontend developer resume builder with modern templates, example bullet points, and key skills like React, Angular, and accessibility.',
    recommendedTemplate: 'modern-professional',
    bulletExamples: [
      'Rebuilt the product landing page with a mobile-first responsive design, increasing conversion rate by 18%.',
      'Improved Lighthouse performance score from 64 to 96 by code-splitting routes and lazy-loading images.',
      'Implemented WCAG 2.1 AA accessibility standards across 30+ components, passing a third-party audit.',
      'Built a reusable component library in Storybook adopted by 5 product teams, cutting UI development time by 25%.',
      'Migrated a legacy jQuery codebase to a modern component-based framework with zero downtime.',
    ],
    keySkills: [
      'HTML5 & CSS3', 'JavaScript / TypeScript', 'React / Angular / Vue', 'Responsive & Mobile-First Design',
      'Accessibility (WCAG)', 'Performance Optimization', 'REST & GraphQL APIs', 'Webpack / Vite',
      'Tailwind CSS / SASS', 'Git & Code Review',
    ],
    howToSteps: [
      { title: 'Lead with measurable UI impact', description: 'Highlight performance scores, conversion lifts, or accessibility improvements in your top bullet points.' },
      { title: 'Show your framework expertise', description: 'Call out the specific frameworks, libraries, and build tools you’ve used in production.' },
      { title: 'Include a portfolio link', description: 'Link to a live portfolio or GitHub showcasing real UI work — visuals make frontend resumes stand out.' },
      { title: 'Keep it single-column for ATS', description: 'Avoid multi-column or graphic-heavy layouts; use our Modern Professional template for a clean, ATS-safe design.' },
      { title: 'Check your ATS score', description: 'Use the live score panel to confirm contact info, skills, and summary all meet ATS best practices.' },
    ],
    faqs: [
      { q: 'Which template is best for a frontend developer?', a: 'The Modern Professional template works well — it has a contemporary design with accent colors while remaining fully ATS-compliant and single-column.' },
      { q: 'Should I list every framework I’ve touched?', a: 'No — focus on the 1-2 frameworks you’re strongest in and most relevant to the job, plus core fundamentals like JavaScript, HTML, and CSS.' },
      { q: 'How do I show design skills on a resume?', a: 'Mention collaboration with designers, Figma-to-code workflows, and any UI/UX improvements you shipped, backed by metrics where possible.' },
      { q: 'Is a portfolio link necessary?', a: 'Strongly recommended. Add it to the contact section so recruiters can quickly view your live projects and code quality.' },
      { q: 'How do I tailor my resume for each job?', a: 'Adjust your skills section and summary to mirror the exact framework names and tools listed in the job posting.' },
    ],
  },

  'angular-developer': {
    slug: 'angular-developer',
    title: 'Angular Developer',
    heroTitle: 'Angular Developer Resume Examples & Free Builder',
    intro:
      'Angular roles often look for deep framework knowledge — RxJS, state management, performance tuning, and ' +
      'testing discipline. Showcase enterprise-scale Angular projects with concrete before/after metrics, and use ' +
      'our free builder to package it all into a polished, ATS-friendly resume.',
    metaDescription:
      'Free Angular developer resume builder with ATS-friendly templates, example bullet points, and must-have Angular skills and keywords.',
    recommendedTemplate: 'modern-professional',
    bulletExamples: [
      'Migrated a legacy AngularJS application to Angular 17 with standalone components, reducing bundle size by 42%.',
      'Implemented NgRx state management across 12 feature modules, eliminating prop-drilling and reducing bugs by 35%.',
      'Adopted Angular signals for reactive state, cutting unnecessary re-renders and improving UI responsiveness by 30%.',
      'Wrote 200+ unit tests with Jasmine and Karma, raising code coverage from 50% to 88%.',
      'Built a shared Angular component library used across 6 internal applications, saving an estimated 100+ dev hours per quarter.',
    ],
    keySkills: [
      'Angular (Standalone Components & Signals)', 'TypeScript', 'RxJS', 'NgRx / State Management',
      'Angular Material', 'Unit Testing (Jasmine/Karma)', 'REST APIs', 'SSR / Angular Universal',
      'Performance Optimization', 'CI/CD',
    ],
    howToSteps: [
      { title: 'Highlight Angular version experience', description: 'Mention specific Angular versions and modern features like standalone components, signals, and the new control flow syntax.' },
      { title: 'Show measurable performance wins', description: 'Quantify bundle size reductions, Lighthouse score improvements, or load-time savings from your Angular work.' },
      { title: 'Demonstrate testing discipline', description: 'Include unit and e2e testing experience with Jasmine, Karma, Jest, or Cypress and coverage improvements.' },
      { title: 'List state management tools', description: 'Call out RxJS, NgRx, or signal-based state management — these are common ATS keyword matches for Angular roles.' },
      { title: 'Use an ATS-safe, modern template', description: 'Choose the Modern Professional template for a polished look that still passes ATS parsing.' },
    ],
    faqs: [
      { q: 'Should I mention which Angular versions I’ve used?', a: 'Yes — list the major versions (e.g. Angular 14-17) and call out modern features like standalone components or signals if you’ve used them.' },
      { q: 'Is RxJS experience important to include?', a: 'Very. RxJS and reactive programming patterns are commonly required for Angular roles, so include specific examples like custom operators or complex stream handling.' },
      { q: 'What if my Angular experience is mostly from one company?', a: 'Break that experience into multiple projects or modules within the role to show breadth — each can have its own set of quantified bullet points.' },
      { q: 'Should I include Angular certifications?', a: 'If you have one, add it to a Certifications section — it can help your resume stand out, though hands-on project experience matters more.' },
      { q: 'How technical should the skills section be?', a: 'List specific libraries and tools (RxJS, NgRx, Angular Material, Jest) rather than generic terms like "frontend development".' },
    ],
  },

  'react-developer': {
    slug: 'react-developer',
    title: 'React Developer',
    heroTitle: 'React Developer Resume Examples & Free Builder',
    intro:
      'React resumes stand out when they show fluency with hooks, state management, and modern tooling like Next.js. ' +
      'Pair that with metrics on performance, bundle size, or feature delivery speed, and use our free builder to ' +
      'turn it into a clean, ATS-friendly resume in minutes.',
    metaDescription:
      'Free React developer resume builder with modern, ATS-friendly templates, example bullet points, and essential React skills and keywords.',
    recommendedTemplate: 'modern-professional',
    bulletExamples: [
      'Built a server-rendered e-commerce storefront with Next.js, improving SEO traffic by 40% and first-load time by 35%.',
      'Refactored class components to functional components with hooks across 50+ files, reducing code size by 20%.',
      'Implemented Redux Toolkit for global state management, cutting state-related bugs by 30%.',
      'Wrote 150+ tests with Jest and React Testing Library, achieving 90% coverage on core user flows.',
      'Optimized component re-renders with memoization and virtualization, improving list scroll performance by 50% on large datasets.',
    ],
    keySkills: [
      'React (Hooks)', 'JavaScript / TypeScript', 'Next.js', 'Redux / Context API / Zustand',
      'Jest & React Testing Library', 'REST & GraphQL APIs', 'Webpack / Vite', 'Tailwind CSS',
      'Performance Optimization', 'Git & CI/CD',
    ],
    howToSteps: [
      { title: 'Lead with React expertise', description: 'Mention hooks, component architecture, and any meta-frameworks (Next.js, Remix) you’ve used in production.' },
      { title: 'Quantify performance and delivery', description: 'Include metrics like bundle size reductions, load-time improvements, or features shipped per sprint.' },
      { title: 'Show state management experience', description: 'List the state management approach you’ve used — Redux, Context API, Zustand, or React Query.' },
      { title: 'Highlight testing practices', description: 'Call out Jest, React Testing Library, or Cypress experience and resulting coverage improvements.' },
      { title: 'Use a clean, ATS-friendly template', description: 'The Modern Professional template gives a contemporary feel while keeping the layout ATS-safe.' },
    ],
    faqs: [
      { q: 'Should I include Next.js experience separately from React?', a: 'List Next.js as its own skill since many roles specifically require it for SSR/SSG, routing, and API routes.' },
      { q: 'How do I describe component library work?', a: 'Mention the number of components built or maintained, adoption across teams, and any design-system alignment.' },
      { q: 'What metrics matter most for React roles?', a: 'Bundle size, Core Web Vitals (LCP, CLS, FID), render performance, and feature delivery velocity are all strong signals.' },
      { q: 'Do I need to know TypeScript for React jobs?', a: 'Most modern React roles expect TypeScript. If you have experience, list it explicitly alongside React.' },
      { q: 'Should I add a live demo link?', a: 'Yes — a deployed project (Vercel, Netlify) with source code on GitHub gives recruiters a fast way to verify your skills.' },
    ],
  },

  'java-developer': {
    slug: 'java-developer',
    title: 'Java Developer',
    heroTitle: 'Java Developer Resume Examples & Free Builder',
    intro:
      'Java developer resumes are evaluated on backend fundamentals — Spring Boot, databases, microservices, and ' +
      'system reliability. Use specific, quantified achievements from your projects, then generate a clean, ' +
      'single-column, ATS-friendly PDF with our free builder.',
    metaDescription:
      'Free Java developer resume builder with ATS-friendly templates, example bullet points, and key Java, Spring Boot, and microservices skills.',
    recommendedTemplate: 'ats-professional',
    bulletExamples: [
      'Developed RESTful microservices with Spring Boot serving 1.5M+ daily requests with 99.9% uptime.',
      'Optimized JPA/Hibernate queries and added database indexing, reducing average response time by 50%.',
      'Implemented a Kafka-based event-driven pipeline processing 500K+ messages per day across 8 services.',
      'Increased JUnit test coverage from 60% to 92%, catching critical bugs before production releases.',
      'Containerized legacy services with Docker and deployed to Kubernetes, cutting deployment time from 1 hour to 8 minutes.',
    ],
    keySkills: [
      'Java (8-21)', 'Spring Boot / Spring Framework', 'Hibernate / JPA', 'Microservices Architecture',
      'REST APIs', 'SQL (MySQL/PostgreSQL)', 'Maven / Gradle', 'JUnit & Mockito',
      'Docker & Kubernetes', 'Kafka / Messaging Systems',
    ],
    howToSteps: [
      { title: 'Highlight backend frameworks', description: 'Lead with Spring Boot, Hibernate, and any microservices or messaging systems you’ve worked with.' },
      { title: 'Quantify reliability and scale', description: 'Include uptime percentages, request volumes, and latency improvements wherever possible.' },
      { title: 'Show database expertise', description: 'Mention specific databases, query optimization work, and any indexing or caching strategies.' },
      { title: 'Demonstrate DevOps familiarity', description: 'List Docker, Kubernetes, CI/CD pipelines, and cloud platforms you’ve deployed to.' },
      { title: 'Use a classic ATS-safe layout', description: 'The ATS Professional template’s plain single-column format is ideal for corporate and enterprise Java roles.' },
    ],
    faqs: [
      { q: 'Which Java version should I list?', a: 'List the range of versions you’ve worked with (e.g. Java 8-17) and highlight experience with newer features like streams, lambdas, and records if relevant.' },
      { q: 'Is Spring Boot experience mandatory?', a: 'It’s the most commonly requested framework for Java backend roles. If you have experience, feature it prominently in your skills and bullet points.' },
      { q: 'How do I show microservices experience without naming the company’s product?', a: 'Describe the architecture and your contribution generically — e.g. "developed a payment processing microservice" — without disclosing proprietary details.' },
      { q: 'Should I include cloud platform experience?', a: 'Yes, AWS, Azure, or GCP experience is highly valued for backend roles — mention specific services you’ve used (EC2, S3, Lambda, etc.).' },
      { q: 'What’s the best template for Java/backend roles?', a: 'The ATS Professional template — plain, single-column, and optimized for the conservative ATS systems used by large enterprises.' },
    ],
  },

  'data-analyst': {
    slug: 'data-analyst',
    title: 'Data Analyst',
    heroTitle: 'Data Analyst Resume Examples & Free Builder',
    intro:
      'Data analyst resumes need to show the full pipeline — from querying and cleaning data to building dashboards ' +
      'that drive decisions. Quantify the business impact of your analysis (revenue, cost savings, efficiency gains), ' +
      'and use our free builder to produce a polished, ATS-friendly resume.',
    metaDescription:
      'Free data analyst resume builder with ATS-friendly templates, example bullet points, and key SQL, Excel, Python, and BI tool skills.',
    recommendedTemplate: 'ats-professional',
    bulletExamples: [
      'Built 15+ interactive Power BI dashboards used by leadership to track KPIs across 5 business units.',
      'Wrote complex SQL queries to analyze 10M+ row datasets, reducing report generation time from 3 days to 2 hours.',
      'Automated weekly reporting with Python and Pandas, saving the team 8 hours per week.',
      'Identified a pricing inefficiency through cohort analysis that increased monthly revenue by $50K.',
      'Designed and ran A/B tests on product features, informing decisions that improved user retention by 12%.',
    ],
    keySkills: [
      'SQL', 'Excel (Pivot Tables, VLOOKUP)', 'Python (Pandas, NumPy)', 'Power BI / Tableau',
      'Data Visualization', 'Statistical Analysis', 'A/B Testing', 'ETL & Data Cleaning',
      'Dashboard Design', 'Data Storytelling',
    ],
    howToSteps: [
      { title: 'Lead with business impact', description: 'Frame your analysis work around the business outcomes it drove — revenue, cost savings, efficiency.' },
      { title: 'List your analytics toolkit', description: 'Include SQL, Excel, Python/R, and the BI tools (Power BI, Tableau, Looker) you’re proficient in.' },
      { title: 'Show data pipeline experience', description: 'Mention ETL processes, data cleaning, and how you ensured data quality and accuracy.' },
      { title: 'Highlight dashboards and reporting', description: 'Quantify how many dashboards or reports you built and who used them.' },
      { title: 'Keep formatting ATS-friendly', description: 'Use the ATS Professional template to ensure your skills and metrics are parsed correctly by recruiting software.' },
    ],
    faqs: [
      { q: 'How important is SQL for a data analyst resume?', a: 'Extremely important — SQL is the most commonly required skill for data analyst roles. Include specific examples of complex queries or optimizations.' },
      { q: 'Should I list specific BI tools?', a: 'Yes — name the exact tools (Power BI, Tableau, Looker, Google Data Studio) since recruiters and ATS often search for these by name.' },
      { q: 'How do I quantify analysis that doesn’t have obvious numbers?', a: 'Tie it to outcomes like decisions made, time saved, or stakeholders served — e.g. "informed a decision that reduced churn by 8%".' },
      { q: 'Is a certification (e.g. Google Data Analytics) worth listing?', a: 'Yes, especially for entry-level candidates — add it to a Certifications section to strengthen your profile alongside project experience.' },
      { q: 'What if I’m transitioning from another field?', a: 'Highlight transferable skills like Excel, reporting, or statistics from your previous role, and showcase any data projects or coursework you’ve completed.' },
    ],
  },

  accountant: {
    slug: 'accountant',
    title: 'Accountant',
    heroTitle: 'Accountant Resume Examples & Free Builder',
    intro:
      'Accountant resumes are judged on precision, compliance, and the financial impact of your work. Highlight ' +
      'reconciliations, audits, cost savings, and software expertise with clear, quantified statements, then create ' +
      'a polished, ATS-friendly resume with our free builder.',
    metaDescription:
      'Free accountant resume builder with ATS-friendly templates, example bullet points, and key accounting software and compliance skills.',
    recommendedTemplate: 'ats-professional',
    bulletExamples: [
      'Managed monthly close process for $20M in revenue, reducing close time from 10 days to 5.',
      'Reconciled over 500 vendor accounts monthly, reducing discrepancies by 35% through process improvements.',
      'Prepared and filed GST/tax returns for 3 entities, ensuring 100% on-time compliance over 2 years.',
      'Implemented an automated invoicing workflow in QuickBooks, saving 6 hours of manual work per week.',
      'Supported annual audit by preparing schedules and documentation, resulting in zero audit findings.',
    ],
    keySkills: [
      'Financial Reporting', 'GAAP / IFRS', 'Tally / QuickBooks / SAP', 'Accounts Payable & Receivable',
      'Bank Reconciliation', 'Budgeting & Forecasting', 'Tax Preparation & GST Compliance', 'Audit Support',
      'MS Excel (Advanced)', 'Accounts Finalization',
    ],
    howToSteps: [
      { title: 'Lead with financial scope', description: 'State the size of the books, budgets, or transaction volumes you’ve managed to give context to your experience.' },
      { title: 'Quantify accuracy and efficiency', description: 'Highlight reductions in close time, error rates, or processing time achieved through your work.' },
      { title: 'List accounting software', description: 'Name the ERP and accounting tools you’ve used — Tally, QuickBooks, SAP, Zoho Books, etc.' },
      { title: 'Show compliance expertise', description: 'Mention tax filing, GST/VAT compliance, and audit support experience with specific outcomes.' },
      { title: 'Use a formal, ATS-safe template', description: 'The ATS Professional template’s conservative layout suits finance and accounting employers well.' },
    ],
    faqs: [
      { q: 'Which accounting software should I list?', a: 'List every ERP/accounting tool you’ve used hands-on — e.g. Tally, QuickBooks, SAP, Zoho Books — since these are common ATS keyword matches.' },
      { q: 'How do I show impact in an accounting role?', a: 'Quantify time saved, error reduction, amounts reconciled or processed, and audit outcomes — numbers make accounting achievements concrete.' },
      { q: 'Should I include certifications like CA, CPA, or CMA?', a: 'Yes — add a Certifications section and list your designation, status (qualified/pursuing), and the awarding body.' },
      { q: 'What if my experience is mostly data entry and reconciliation?', a: 'Frame it around accuracy and volume — e.g. "Processed 200+ invoices weekly with 99.8% accuracy" — to show reliability and scale.' },
      { q: 'Is a one-page resume enough for accounting roles?', a: 'For early to mid-career accountants, yes. Senior finance professionals with 10+ years of experience can extend to two pages.' },
    ],
  },

  teacher: {
    slug: 'teacher',
    title: 'Teacher',
    heroTitle: 'Teacher Resume Examples & Free Builder',
    intro:
      'Teacher resumes should highlight subject expertise, classroom impact, and student outcomes — test score ' +
      'improvements, engagement initiatives, and extracurricular leadership all matter. Build a warm, professional, ' +
      'ATS-friendly resume in minutes with our free builder, perfect for new graduates and experienced educators alike.',
    metaDescription:
      'Free teacher resume builder with ATS-friendly templates, example bullet points, and key classroom management and curriculum skills.',
    recommendedTemplate: 'fresher',
    bulletExamples: [
      'Designed and delivered a Grade 9 mathematics curriculum, improving average test scores by 15% over one academic year.',
      'Implemented project-based learning activities that increased student engagement and class participation by 30%.',
      'Mentored 25+ students through a weekly after-school tutoring program, with 90% reporting improved confidence in the subject.',
      'Integrated digital tools (Google Classroom, Kahoot) into lesson plans, streamlining grading and feedback by 40%.',
      'Organized and led the school’s annual science fair, coordinating 100+ student projects and 10 staff volunteers.',
    ],
    keySkills: [
      'Curriculum Development', 'Lesson Planning', 'Classroom Management', 'Student Assessment & Grading',
      'Differentiated Instruction', 'Google Classroom / LMS Tools', 'Parent-Teacher Communication',
      'Extracurricular Leadership', 'Subject Matter Expertise', 'Educational Technology',
    ],
    howToSteps: [
      { title: 'Highlight subject and grade expertise', description: 'State the subjects and grade levels you’re experienced or certified to teach in your summary.' },
      { title: 'Show measurable student outcomes', description: 'Include improvements in test scores, attendance, or engagement tied to your teaching methods.' },
      { title: 'List classroom and ed-tech tools', description: 'Mention LMS platforms, digital tools, and any technology you’ve integrated into lessons.' },
      { title: 'Include extracurricular involvement', description: 'Add clubs, sports, or events you’ve led — these show leadership and well-roundedness.' },
      { title: 'Use a friendly, ATS-safe template', description: 'The Fresher template’s clear structure works well for new graduates and experienced teachers alike.' },
    ],
    faqs: [
      { q: 'What should a new graduate teacher include without classroom experience?', a: 'Highlight student-teaching placements, tutoring experience, relevant coursework, and any volunteer work with children or classrooms.' },
      { q: 'How do I show impact as a teacher?', a: 'Use metrics where possible — test score improvements, attendance rates, or participation increases — alongside specific initiatives you led.' },
      { q: 'Should I list certifications like B.Ed or teaching licenses?', a: 'Yes — add a Certifications section listing your degree, teaching license/certification, and the issuing board or university.' },
      { q: 'How do I describe extracurricular activities?', a: 'Treat them like projects — name the activity, your role, and the outcome (e.g. number of students involved, awards won).' },
      { q: 'What template works best for a teaching resume?', a: 'The Fresher/Entry-Level template is friendly and well-structured, ideal for both new graduates and experienced educators.' },
    ],
  },
};
