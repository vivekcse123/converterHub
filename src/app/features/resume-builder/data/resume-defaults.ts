import { DEFAULT_SECTION_ORDER, ResumeData, TemplateId } from '../models/resume.model';

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** A completely empty resume, ready for the user to fill in. */
export function createBlankResume(templateId: TemplateId = 'ats-professional', name = 'Untitled Resume'): ResumeData {
  return {
    id: uid(),
    name,
    templateId,
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      github: '',
    },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    languages: [],
    interests: [],
    customSections: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionVisibility: Object.fromEntries(DEFAULT_SECTION_ORDER.map(s => [s, true])),
    updatedAt: Date.now(),
  };
}

/** A pre-filled sample resume used for live previews on landing/gallery pages. */
export function createSampleResume(templateId: TemplateId = 'ats-professional'): ResumeData {
  return createSoftwareEngineerSample(templateId);
}

/** Software Engineer persona - 4 years experience at a tech company. */
export function createSoftwareEngineerSample(templateId: TemplateId = 'ats-professional'): ResumeData {
  const resume = createBlankResume(templateId, 'Sample Resume');
  resume.personal = {
    fullName: 'Aditi Sharma',
    jobTitle: 'Software Engineer',
    email: 'aditi.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/aditisharma',
    portfolio: 'aditisharma.dev',
    github: 'github.com/aditisharma',
  };
  resume.summary =
    'Software Engineer with 4+ years of experience building scalable web applications using Angular, Node.js, and ' +
    'cloud infrastructure. Delivered features that improved page load speed by 35% and increased user retention by 18%. ' +
    'Passionate about clean code, mentoring junior developers, and shipping high-quality products on tight timelines.';
  resume.experience = [
    {
      id: uid(),
      company: 'TechNova Solutions',
      role: 'Software Engineer',
      location: 'Bengaluru, India',
      startDate: '2022-06',
      endDate: '',
      current: true,
      bullets: [
        'Led the migration of a legacy AngularJS app to Angular 17, reducing bundle size by 42% and improving Lighthouse score from 61 to 94.',
        'Built a reusable component library adopted across 6 product teams, cutting new feature development time by 25%.',
        'Optimized REST API response times by 60% through query indexing and Redis caching.',
        'Mentored 3 junior engineers and led code reviews, improving sprint velocity by 20%.',
      ],
    },
    {
      id: uid(),
      company: 'PixelCraft Labs',
      role: 'Frontend Developer',
      location: 'Pune, India',
      startDate: '2020-07',
      endDate: '2022-05',
      current: false,
      bullets: [
        'Developed responsive UI components used by over 200,000 monthly active users.',
        'Implemented automated testing with Jasmine/Karma, increasing code coverage from 45% to 85%.',
        'Collaborated with designers to launch a redesigned checkout flow, increasing conversion rate by 12%.',
      ],
    },
  ];
  resume.education = [
    {
      id: uid(),
      institution: 'National Institute of Technology, Surat',
      degree: 'B.Tech',
      field: 'Computer Science & Engineering',
      startDate: '2016-08',
      endDate: '2020-05',
      current: false,
      gpa: '8.7/10',
      description: '',
    },
  ];
  resume.projects = [
    {
      id: uid(),
      name: 'TaskFlow - Team Productivity App',
      link: 'github.com/aditisharma/taskflow',
      techStack: 'Angular, Node.js, MongoDB, Socket.io',
      bullets: [
        'Built a real-time task management app with drag-and-drop boards used by 1,200+ users.',
        'Implemented WebSocket-based live updates, reducing sync latency to under 200ms.',
      ],
    },
  ];
  resume.skills = [
    { id: uid(), category: 'Languages', items: ['JavaScript', 'TypeScript', 'Java', 'SQL'] },
    { id: uid(), category: 'Frameworks & Libraries', items: ['Angular', 'React', 'Node.js', 'Express'] },
    { id: uid(), category: 'Tools & Platforms', items: ['Git', 'Docker', 'AWS', 'CI/CD'] },
  ];
  resume.certifications = [
    { id: uid(), name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2023-03', link: '' },
  ];
  resume.achievements = [
    'Winner, Smart India Hackathon 2019 - built an AI-based crop disease detection app.',
    'Published a technical article on Angular performance optimization with 15k+ reads.',
  ];
  resume.languages = [
    { id: uid(), name: 'English', proficiency: 'Fluent' },
    { id: uid(), name: 'Hindi', proficiency: 'Native' },
  ];
  resume.interests = ['Open source contribution', 'Competitive programming', 'Photography'];
  return resume;
}

/** Fresh Graduate persona - final year student, no work experience. */
export function createFresherSample(templateId: TemplateId = 'fresher'): ResumeData {
  const resume = createBlankResume(templateId, 'Sample Resume');
  resume.personal = {
    fullName: 'Rohan Mehta',
    jobTitle: 'Computer Science Graduate',
    email: 'rohan.mehta@gmail.com',
    phone: '+91 87654 32109',
    location: 'Mumbai, India',
    linkedin: 'linkedin.com/in/rohanmehta',
    portfolio: '',
    github: 'github.com/rohanmehta',
  };
  resume.summary =
    'Motivated Computer Science graduate from BITS Pilani with strong foundation in data structures, algorithms, and ' +
    'full-stack web development. Completed 3 internships and 2 open-source contributions during college. ' +
    'Eager to join a fast-moving team where I can build real products and grow as an engineer.';
  resume.experience = [
    {
      id: uid(),
      company: 'Infosys - Internship',
      role: 'Software Development Intern',
      location: 'Bengaluru, India',
      startDate: '2024-05',
      endDate: '2024-07',
      current: false,
      bullets: [
        'Built a REST API in Node.js used by 3 internal teams to automate report generation, saving 12 hours/week.',
        'Reduced SQL query runtime by 40% through index optimization on a 2M-row dataset.',
      ],
    },
  ];
  resume.education = [
    {
      id: uid(),
      institution: 'BITS Pilani',
      degree: 'B.E.',
      field: 'Computer Science',
      startDate: '2020-08',
      endDate: '2024-05',
      current: false,
      gpa: '9.1/10',
      description: 'Relevant coursework: DSA, DBMS, OS, Computer Networks, Machine Learning.',
    },
  ];
  resume.projects = [
    {
      id: uid(),
      name: 'StudySync - Peer Learning Platform',
      link: 'github.com/rohanmehta/studysync',
      techStack: 'React, Firebase, Tailwind CSS',
      bullets: [
        'Developed a study group platform with real-time Q&A used by 500+ BITS students.',
        'Integrated Firestore for live session syncing with sub-100ms latency.',
      ],
    },
    {
      id: uid(),
      name: 'PriceAlert - E-commerce Price Tracker',
      link: 'github.com/rohanmehta/pricealert',
      techStack: 'Python, Scrapy, PostgreSQL, Telegram Bot API',
      bullets: [
        'Built a price-scraping tool for Flipkart and Amazon tracking 5,000+ products daily.',
        'Delivered Telegram alerts reducing average purchase price by 18% for 200 users.',
      ],
    },
  ];
  resume.skills = [
    { id: uid(), category: 'Languages', items: ['Python', 'JavaScript', 'Java', 'C++', 'SQL'] },
    { id: uid(), category: 'Web Development', items: ['React', 'Node.js', 'HTML/CSS', 'REST APIs'] },
    { id: uid(), category: 'Tools', items: ['Git', 'Linux', 'Docker', 'Firebase'] },
  ];
  resume.certifications = [
    { id: uid(), name: 'Google Data Analytics Certificate', issuer: 'Google / Coursera', date: '2024-02', link: '' },
    { id: uid(), name: 'The Web Developer Bootcamp', issuer: 'Udemy', date: '2023-08', link: '' },
  ];
  resume.achievements = [
    'Top 50 - HackMIT 2023 among 1,200+ international participants.',
    'Dean\'s Merit List all 8 semesters at BITS Pilani.',
  ];
  resume.languages = [
    { id: uid(), name: 'English', proficiency: 'Fluent' },
    { id: uid(), name: 'Hindi', proficiency: 'Native' },
    { id: uid(), name: 'Marathi', proficiency: 'Native' },
  ];
  resume.interests = ['Competitive programming', 'Open source', 'Chess'];
  return resume;
}

/** Marketing Manager persona - 6 years experience in growth & digital marketing. */
export function createMarketingManagerSample(templateId: TemplateId = 'modern-professional'): ResumeData {
  const resume = createBlankResume(templateId, 'Sample Resume');
  resume.personal = {
    fullName: 'Priya Nair',
    jobTitle: 'Senior Marketing Manager',
    email: 'priya.nair@marketingpro.in',
    phone: '+91 94321 87650',
    location: 'Mumbai, India',
    linkedin: 'linkedin.com/in/priyanair',
    portfolio: 'priyanair.co',
    github: '',
  };
  resume.summary =
    'Data-driven Marketing Manager with 6+ years of experience scaling B2C and B2B brands across digital channels. ' +
    'Led campaigns that generated ₹4.2 Cr in pipeline revenue and grew social audiences by 3.2×. ' +
    'Expert in performance marketing, brand strategy, and cross-functional team leadership.';
  resume.experience = [
    {
      id: uid(),
      company: 'GrowthLab India',
      role: 'Senior Marketing Manager',
      location: 'Mumbai, India',
      startDate: '2021-03',
      endDate: '',
      current: true,
      bullets: [
        'Developed and executed a 360° digital strategy that grew organic traffic from 40k to 210k monthly visits in 18 months.',
        'Managed ₹1.8 Cr annual performance marketing budget across Google Ads and Meta, achieving 4.1× ROAS.',
        'Led a team of 7 across SEO, content, social, and paid - shipping 3 major product launch campaigns.',
        'Built an email nurture funnel with 68% open rate, generating ₹80L in quarterly pipeline.',
      ],
    },
    {
      id: uid(),
      company: 'Flipkart',
      role: 'Marketing Executive - Growth',
      location: 'Bengaluru, India',
      startDate: '2018-07',
      endDate: '2021-02',
      current: false,
      bullets: [
        'Planned and executed 12 seasonal sale campaigns (Big Billion Days, End of Reason Sale) contributing to 28% YoY revenue growth.',
        'Launched influencer marketing program that reached 2.4 Cr impressions with ₹22L spend.',
        'Created automated email sequences that improved retention by 15% among dormant users.',
      ],
    },
  ];
  resume.education = [
    {
      id: uid(),
      institution: 'Symbiosis Institute of Business Management, Pune',
      degree: 'MBA',
      field: 'Marketing & Strategy',
      startDate: '2016-06',
      endDate: '2018-05',
      current: false,
      gpa: '8.2/10',
      description: '',
    },
  ];
  resume.projects = [];
  resume.skills = [
    { id: uid(), category: 'Marketing', items: ['Performance Marketing', 'SEO/SEM', 'Content Strategy', 'Brand Management', 'Email Marketing'] },
    { id: uid(), category: 'Analytics & Tools', items: ['Google Analytics 4', 'Meta Ads Manager', 'HubSpot', 'SEMrush', 'Tableau'] },
    { id: uid(), category: 'Leadership', items: ['Team Management', 'Budget Planning', 'Campaign Strategy', 'Stakeholder Management'] },
  ];
  resume.certifications = [
    { id: uid(), name: 'Google Ads Certified - Search & Display', issuer: 'Google', date: '2023-06', link: '' },
    { id: uid(), name: 'HubSpot Content Marketing Certified', issuer: 'HubSpot Academy', date: '2022-11', link: '' },
  ];
  resume.achievements = [
    'Marketing Campaign of the Year - GrowthLab Annual Awards 2023.',
    'Speaker at DigiMarCon India 2022 on "Attribution in a Cookie-less World".',
  ];
  resume.languages = [
    { id: uid(), name: 'English', proficiency: 'Fluent' },
    { id: uid(), name: 'Hindi', proficiency: 'Fluent' },
    { id: uid(), name: 'Malayalam', proficiency: 'Native' },
  ];
  resume.interests = ['Brand storytelling', 'Growth experiments', 'Travel blogging'];
  return resume;
}

/** UI/UX Designer persona - 4 years experience in product design. */
export function createDesignerSample(templateId: TemplateId = 'creative'): ResumeData {
  const resume = createBlankResume(templateId, 'Sample Resume');
  resume.personal = {
    fullName: 'Ananya Krishnan',
    jobTitle: 'Senior UI/UX Designer',
    email: 'ananya@designstudio.io',
    phone: '+91 96543 21078',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/ananyakrishnan',
    portfolio: 'ananya.design',
    github: '',
  };
  resume.summary =
    'Product Designer with 4+ years crafting intuitive digital experiences for SaaS, fintech, and e-commerce products. ' +
    'Led end-to-end design for 3 product launches reaching 500k+ users. ' +
    'Strong background in design systems, user research, and cross-functional collaboration with engineering and product teams.';
  resume.experience = [
    {
      id: uid(),
      company: 'Razorpay',
      role: 'Senior UI/UX Designer',
      location: 'Bengaluru, India',
      startDate: '2022-01',
      endDate: '',
      current: true,
      bullets: [
        'Redesigned the merchant onboarding flow, reducing drop-off rate by 38% and cutting average completion time from 14 to 6 minutes.',
        'Built and maintained Razorpay\'s design system (120+ components) used by 15 product squads.',
        'Conducted 40+ user interviews and usability tests to validate design decisions.',
        'Collaborated with engineering to ship pixel-perfect implementations within 3-day sprints.',
      ],
    },
    {
      id: uid(),
      company: 'BYJU\'S',
      role: 'UI/UX Designer',
      location: 'Bengaluru, India',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      bullets: [
        'Designed 8 new learning modules for the BYJU\'S app used by 3M+ K-12 students.',
        'Increased in-app session duration by 22% through gamified progress tracking UI.',
        'Created 200+ screen prototypes and interactive mockups for stakeholder presentations.',
      ],
    },
  ];
  resume.education = [
    {
      id: uid(),
      institution: 'NID - National Institute of Design, Ahmedabad',
      degree: 'B.Des',
      field: 'Communication Design',
      startDate: '2016-07',
      endDate: '2020-05',
      current: false,
      gpa: '',
      description: '',
    },
  ];
  resume.projects = [
    {
      id: uid(),
      name: 'HealthMate - Telehealth App Redesign',
      link: 'ananya.design/healthmate',
      techStack: 'Figma, Principle, FigJam',
      bullets: [
        'Redesigned a telehealth consultation app from scratch following user research with 30 patients and 5 doctors.',
        'Prototype achieved a 91% task completion rate in usability testing.',
      ],
    },
  ];
  resume.skills = [
    { id: uid(), category: 'Design Tools', items: ['Figma', 'Adobe XD', 'Principle', 'Sketch', 'Framer'] },
    { id: uid(), category: 'Research & Process', items: ['User Research', 'Usability Testing', 'Wireframing', 'Prototyping', 'Design Systems'] },
    { id: uid(), category: 'Collaboration', items: ['JIRA', 'Notion', 'Zeplin', 'HTML/CSS (basic)'] },
  ];
  resume.certifications = [
    { id: uid(), name: 'Google UX Design Certificate', issuer: 'Google / Coursera', date: '2023-04', link: '' },
  ];
  resume.achievements = [
    'Awwwards Site of the Day - personal portfolio (ananya.design).',
    'Speaker at Design India Conference 2023 on "Designing for Bharat".',
  ];
  resume.languages = [
    { id: uid(), name: 'English', proficiency: 'Fluent' },
    { id: uid(), name: 'Tamil', proficiency: 'Native' },
    { id: uid(), name: 'Kannada', proficiency: 'Conversational' },
  ];
  resume.interests = ['Typography', 'Photography', 'Sustainable design'];
  return resume;
}

/** Product Manager persona - 7 years experience driving product strategy. */
export function createProductManagerSample(templateId: TemplateId = 'executive'): ResumeData {
  const resume = createBlankResume(templateId, 'Sample Resume');
  resume.personal = {
    fullName: 'Vikram Bose',
    jobTitle: 'Principal Product Manager',
    email: 'vikram.bose@pm.io',
    phone: '+91 98234 56701',
    location: 'Hyderabad, India',
    linkedin: 'linkedin.com/in/vikrambose',
    portfolio: 'vikrambose.com',
    github: '',
  };
  resume.summary =
    'Accomplished Product Manager with 7 years building and scaling B2B SaaS products from 0→1 and 1→100. ' +
    'Shipped products used by 1.2M+ users, achieving 4.6/5 average App Store rating. ' +
    'Expert at bridging engineering, design, and business to deliver measurable outcomes in fast-moving environments.';
  resume.experience = [
    {
      id: uid(),
      company: 'Freshworks',
      role: 'Principal Product Manager',
      location: 'Hyderabad, India',
      startDate: '2020-09',
      endDate: '',
      current: true,
      bullets: [
        'Owned the roadmap for Freshdesk\'s AI-assist features, which drove 31% reduction in avg. ticket resolution time.',
        'Launched a self-serve onboarding flow reducing time-to-first-value from 7 days to 48 hours for new customers.',
        'Led cross-functional squad of 22 (engineers, designers, QA) to ship 6 major feature releases in 12 months.',
        'Grew monthly active accounts from 8k to 19k by identifying and addressing friction in the upgrade funnel.',
      ],
    },
    {
      id: uid(),
      company: 'Zomato',
      role: 'Senior Product Manager - Payments',
      location: 'Gurugram, India',
      startDate: '2017-06',
      endDate: '2020-08',
      current: false,
      bullets: [
        'Led redesign of the checkout flow reducing payment failure rate from 11% to 3.2%, adding ₹18 Cr monthly GMV.',
        'Launched Zomato Pay wallet, acquiring 2.1M users in the first 6 months.',
        'Ran 200+ A/B experiments to optimize conversion, trust signals, and promotions.',
      ],
    },
  ];
  resume.education = [
    {
      id: uid(),
      institution: 'IIM Calcutta',
      degree: 'PGDM (MBA)',
      field: 'Strategy & Operations',
      startDate: '2015-06',
      endDate: '2017-04',
      current: false,
      gpa: '',
      description: '',
    },
    {
      id: uid(),
      institution: 'VIT University',
      degree: 'B.Tech',
      field: 'Information Technology',
      startDate: '2011-08',
      endDate: '2015-05',
      current: false,
      gpa: '8.5/10',
      description: '',
    },
  ];
  resume.projects = [];
  resume.skills = [
    { id: uid(), category: 'Product Skills', items: ['Roadmap Planning', 'User Research', 'A/B Testing', 'PRD Writing', 'Stakeholder Management'] },
    { id: uid(), category: 'Analytics & Data', items: ['SQL', 'Mixpanel', 'Amplitude', 'Google Analytics', 'Looker'] },
    { id: uid(), category: 'Process', items: ['Agile / Scrum', 'OKRs', 'JIRA', 'Confluence', 'Figma (review)'] },
  ];
  resume.certifications = [
    { id: uid(), name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: '2021-05', link: '' },
  ];
  resume.achievements = [
    'Featured in Product School\'s "Top 25 PMs in India 2023" list.',
    'Freshworks Innovation Award - Q3 2022 for fastest-shipped enterprise feature.',
  ];
  resume.languages = [
    { id: uid(), name: 'English', proficiency: 'Fluent' },
    { id: uid(), name: 'Bengali', proficiency: 'Native' },
    { id: uid(), name: 'Hindi', proficiency: 'Fluent' },
  ];
  resume.interests = ['Product strategy', 'Startup ecosystem', 'Cricket'];
  return resume;
}

export type SamplePersona = 'software-engineer' | 'fresher' | 'marketing-manager' | 'ui-ux-designer' | 'product-manager';

export const SAMPLE_PERSONAS: { id: SamplePersona; label: string; icon: string; description: string }[] = [
  { id: 'software-engineer', label: 'Software Engineer',  icon: '💻', description: '4 yrs · Bengaluru' },
  { id: 'fresher',           label: 'Fresh Graduate',     icon: '🎓', description: 'B.E. CS · Mumbai'  },
  { id: 'marketing-manager', label: 'Marketing Manager',  icon: '📣', description: '6 yrs · Mumbai'   },
  { id: 'ui-ux-designer',    label: 'UI/UX Designer',     icon: '🎨', description: '4 yrs · Bengaluru' },
  { id: 'product-manager',   label: 'Product Manager',    icon: '🗺️', description: '7 yrs · Hyderabad' },
];

export function createPersonaSample(persona: SamplePersona, templateId: TemplateId): ResumeData {
  switch (persona) {
    case 'software-engineer':  return createSoftwareEngineerSample(templateId);
    case 'fresher':            return createFresherSample(templateId);
    case 'marketing-manager':  return createMarketingManagerSample(templateId);
    case 'ui-ux-designer':     return createDesignerSample(templateId);
    case 'product-manager':    return createProductManagerSample(templateId);
  }
}
