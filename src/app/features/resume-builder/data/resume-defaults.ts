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
      name: 'TaskFlow — Team Productivity App',
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
    'Winner, Smart India Hackathon 2019 — built an AI-based crop disease detection app.',
    'Published a technical article on Angular performance optimization with 15k+ reads.',
  ];
  resume.languages = [
    { id: uid(), name: 'English', proficiency: 'Fluent' },
    { id: uid(), name: 'Hindi', proficiency: 'Native' },
  ];
  resume.interests = ['Open source contribution', 'Competitive programming', 'Photography'];
  return resume;
}
