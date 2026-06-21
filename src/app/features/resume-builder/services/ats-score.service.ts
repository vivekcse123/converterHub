import { Injectable } from '@angular/core';
import { ResumeData } from '../models/resume.model';

export interface AtsCheck {
  label: string;
  passed: boolean;
  weight: number;
  tip: string;
}

export interface AtsSubScore {
  label: string;
  pct: number;
  color: 'emerald' | 'amber' | 'red';
}

export interface AtsScoreResult {
  score: number;
  checks: AtsCheck[];
  suggestions: string[];
  subScores: AtsSubScore[];
}

export interface JdMatchResult {
  score: number;
  matched: string[];
  missing: string[];
  totalKeywords: number;
  // weighted by tech-term importance (more meaningful than raw score)
  weightedScore: number;
  // only tech/skill keywords that are missing - highest priority to add
  highPriorityMissing: string[];
}

const QUANTIFIED_PATTERN = /\d/;
const MIN_SUMMARY_WORDS = 40;
const MIN_TOTAL_WORDS = 300;
const MAX_TOTAL_WORDS = 900;
const MIN_SKILLS = 5;

const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by','from',
  'up','about','into','through','during','before','after','above','below','between',
  'out','off','over','under','again','then','once','is','are','was','were','be','been',
  'being','have','has','had','do','does','did','will','would','could','should','may',
  'might','must','shall','can','you','we','they','it','he','she','who','which','that',
  'this','these','those','not','no','as','if','so','than','more','most','also','just',
  'our','your','their','its','my','his','her','all','each','any','both','few','some',
  'such','own','same','other','too','very','s','t','am','need','use','using',
  'able','work','working','experience','years','year','strong','good','well','new',
  'job','role','position','candidate','required','preferred','plus','bonus',
  'including','etc','eg','ie','per','via','key','great','like','looking','join',
  'team','company','us','apply','responsibilities','qualifications','about','across',
  'ensure','provide','support','manage','maintain','within','across','between',
  'drive','build','help','make','take','get','set','let','put','run','keep',
]);

// ── Tech term registry (always preserved, weighted 2× in score) ──────────────
const TECH_TERMS = new Set([
  'javascript','typescript','python','java','kotlin','swift','golang','rust','php',
  'ruby','scala','cpp','csharp','dotnet','perl','bash','sql','html','css','sass',
  'less','react','angular','vue','svelte','nextjs','nuxt','gatsby','jquery','bootstrap',
  'tailwind','webpack','vite','rollup','redux','mobx','rxjs','graphql','apollo',
  'nodejs','express','django','flask','fastapi','spring','laravel','rails','nestjs',
  'microservices','grpc','websocket','restful','rest','soap','aws','azure','gcp',
  'docker','kubernetes','terraform','jenkins','gitlab','github','ansible','nginx',
  'serverless','lambda','s3','ec2','ecs','eks','cicd','devops','sre','helm',
  'mysql','postgresql','postgres','mongodb','redis','elasticsearch','cassandra',
  'dynamodb','sqlite','oracle','firestore','supabase','prisma','sequelize','mongoose',
  'tensorflow','pytorch','keras','opencv','pandas','numpy','scikit','langchain','llm',
  'jest','cypress','selenium','playwright','mocha','jasmine','junit','pytest','vitest',
  'git','jira','confluence','figma','postman','swagger','openapi','agile','scrum',
  'kanban','tdd','bdd','linux','unix','api','oop','mvc','mvvm','spa','ssr','pwa',
  // multi-word tech phrases also in this set for weight lookup
  'machine learning','deep learning','natural language processing','computer vision',
  'data science','data engineering','full stack','front end','back end','rest api',
  'ci/cd','design patterns','microservices architecture','system design',
  'react native','spring boot','node js','next js','vue js',
]);

// ── Normalization: abbreviation → canonical form (for dedup) ─────────────────
const NORMALIZE: Record<string, string> = {
  'js':'javascript','ts':'typescript','node':'nodejs','node.js':'nodejs',
  'react.js':'react','reactjs':'react','vue.js':'vue','vuejs':'vue',
  'next.js':'nextjs','k8s':'kubernetes','postgres':'postgresql',
  'c#':'csharp','c++':'cpp','.net':'dotnet','ci/cd':'cicd','ci cd':'cicd',
  'go lang':'golang',
};

// ── Match aliases: when looking for keyword X in resume, also accept Y ────────
const MATCH_ALIASES: Record<string, string[]> = {
  'javascript':          ['js'],
  'typescript':          ['ts'],
  'nodejs':              ['node', 'node.js'],
  'react':               ['reactjs', 'react.js', 'react js'],
  'vue':                 ['vuejs', 'vue.js', 'vue js'],
  'nextjs':              ['next.js', 'next js'],
  'kubernetes':          ['k8s'],
  'postgresql':          ['postgres'],
  'golang':              ['go lang', 'go programming'],
  'csharp':              ['c#', '.net'],
  'dotnet':              ['.net', 'c#', 'csharp'],
  'cpp':                 ['c++'],
  'cicd':                ['ci/cd', 'ci cd', 'continuous integration', 'continuous deployment'],
  'graphql':             ['gql'],
  'elasticsearch':       ['elastic search', 'elastic'],
  'machine learning':    ['ml'],
  'deep learning':       ['dl'],
  'natural language processing': ['nlp'],
  'artificial intelligence':     ['ai'],
  'aws':                 ['amazon web services'],
  'gcp':                 ['google cloud', 'google cloud platform'],
  'azure':               ['microsoft azure'],
  'rest':                ['restful', 'rest api', 'restful api'],
  'restful':             ['rest', 'rest api'],
  'html':                ['html5'],
  'css':                 ['css3'],
  'agile':               ['agile methodology', 'agile development'],
  'scrum':               ['scrum methodology'],
  'oop':                 ['object oriented', 'object-oriented'],
  'tdd':                 ['test driven', 'test-driven development'],
};

// ── Known multi-word phrases (extracted as single units, prevent double-counting) ──
const KNOWN_PHRASES = [
  'machine learning','deep learning','natural language processing','computer vision',
  'data science','data analysis','data engineering','big data',
  'full stack','front end','back end','frontend development','backend development',
  'rest api','restful api','graphql api','web services','api development',
  'continuous integration','continuous deployment','continuous delivery',
  'test driven development','behavior driven development',
  'object oriented programming','functional programming','design patterns',
  'clean architecture','microservices architecture','distributed systems',
  'system design','cloud computing','cloud native',
  'agile methodology','agile development','scrum methodology',
  'version control','code review','pair programming',
  'unit testing','integration testing','end to end testing',
  'react native','react js','vue js','node js','next js','spring boot',
  'amazon web services','google cloud platform','microsoft azure',
  'apache kafka','apache spark','sql server','oracle database',
  'problem solving','critical thinking','analytical thinking',
  'cross functional','project management','product management',
  'stakeholder management','team leadership','people management',
  'ci cd','devops practices',
];

interface KwToken { keyword: string; display: string; isTech: boolean; }

function countWords(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

function normalizeWord(w: string): string {
  const clean = w.replace(/[^a-z0-9.#+/]/g, '');
  return NORMALIZE[clean] ?? clean;
}

function extractJdKeywords(jd: string): KwToken[] {
  const text = jd.toLowerCase();
  const tokens: KwToken[] = [];
  const seen = new Set<string>();
  const coveredWords = new Set<string>();

  const addToken = (keyword: string, display: string) => {
    if (!keyword || seen.has(keyword)) return;
    seen.add(keyword);
    // also mark all aliases as seen so we don't double-count
    (MATCH_ALIASES[keyword] ?? []).forEach(a => seen.add(a));
    tokens.push({ keyword, display, isTech: TECH_TERMS.has(keyword) });
  };

  // ── Pass 1: extract known multi-word phrases ─────────────────────────────
  for (const phrase of KNOWN_PHRASES) {
    if (text.includes(phrase)) {
      const norm = normalizeWord(phrase.replace(/\s+/g, ' '));
      addToken(NORMALIZE[phrase] ?? phrase, phrase);
      phrase.split(' ').forEach(w => coveredWords.add(w));
    }
  }

  // ── Pass 2: single-word tokens ────────────────────────────────────────────
  const rawWords = text
    .replace(/[^a-z0-9\s.#+/]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  for (const raw of rawWords) {
    const word = normalizeWord(raw);
    if (!word || word.length < 2) continue;
    if (coveredWords.has(word)) continue;
    if (STOPWORDS.has(word) || /^\d+$/.test(word)) continue;
    addToken(word, raw.replace(/[^a-z0-9.#+/]/g, ''));
  }

  // ── Pass 3: smart bigrams (only from non-covered, non-stopword adjacent words) ─
  for (let i = 0; i < rawWords.length - 1; i++) {
    const a = normalizeWord(rawWords[i]);
    const b = normalizeWord(rawWords[i + 1]);
    if (
      a.length > 2 && b.length > 2 &&
      !STOPWORDS.has(a) && !STOPWORDS.has(b) &&
      !coveredWords.has(a) && !coveredWords.has(b) &&
      !TECH_TERMS.has(a) && !TECH_TERMS.has(b)  // tech terms already in pass 2
    ) {
      addToken(`${a} ${b}`, `${a} ${b}`);
    }
  }

  // Tech-first ordering, cap at 80
  const tech    = tokens.filter(t => t.isTech);
  const general = tokens.filter(t => !t.isTech);
  return [...tech, ...general].slice(0, 80);
}

@Injectable({ providedIn: 'root' })
export class AtsScoreService {
  compute(resume: ResumeData | null): AtsScoreResult {
    if (!resume) return { score: 0, checks: [], suggestions: [], subScores: [] };

    const { personal, summary, experience, education, skills } = resume;

    const contactComplete = !!(personal.email && personal.phone && personal.location);
    const jobTitlePresent = !!personal.jobTitle.trim();
    const summaryWordCount = countWords(summary);
    const summaryGood = summaryWordCount >= MIN_SUMMARY_WORDS;
    const hasExperience = experience.length > 0 && experience.some(e => e.role.trim() && e.company.trim());
    const allBullets = experience.flatMap(e => e.bullets);
    const hasQuantifiedBullets = allBullets.some(b => QUANTIFIED_PATTERN.test(b));
    const totalSkillCount = skills.reduce((sum, g) => sum + g.items.length, 0);
    const skillsGood = totalSkillCount >= MIN_SKILLS;
    const hasEducation = education.length > 0 && education.some(e => e.institution.trim() && e.degree.trim());
    const totalWordCount = this.extractAllText(resume).split(/\s+/).filter(Boolean).length;
    const lengthGood = totalWordCount >= MIN_TOTAL_WORDS && totalWordCount <= MAX_TOTAL_WORDS;

    const checks: AtsCheck[] = [
      { label: 'Contact details complete',              passed: contactComplete,       weight: 15, tip: 'Add your email, phone number, and location so recruiters and ATS systems can identify and reach you.' },
      { label: 'Job title / target role set',           passed: jobTitlePresent,       weight: 5,  tip: 'Add a job title under your name that matches the role you are applying for.' },
      { label: `Professional summary (${MIN_SUMMARY_WORDS}+ words)`, passed: summaryGood, weight: 15, tip: `Write a professional summary of at least ${MIN_SUMMARY_WORDS} words highlighting your experience, skills, and goals.` },
      { label: 'Work experience added',                 passed: hasExperience,         weight: 10, tip: 'Add at least one work experience entry with a role title and company name.' },
      { label: 'Experience bullets show measurable results', passed: hasQuantifiedBullets, weight: 15, tip: 'Use numbers, percentages, or amounts in your bullet points (e.g. "increased performance by 30%") to show measurable impact.' },
      { label: `Skills section has ${MIN_SKILLS}+ skills`, passed: skillsGood,        weight: 15, tip: `List at least ${MIN_SKILLS} relevant skills so your resume matches more keyword searches.` },
      { label: 'Education added',                       passed: hasEducation,          weight: 10, tip: 'Add your education with institution name and degree/field of study.' },
      { label: `Resume length (${MIN_TOTAL_WORDS}–${MAX_TOTAL_WORDS} words)`, passed: lengthGood, weight: 15,
        tip: totalWordCount < MIN_TOTAL_WORDS
          ? 'Your resume looks short. Add more detail to your experience, projects, or summary.'
          : 'Your resume looks long. Trim less relevant details to keep it focused on 1-2 pages.' },
    ];

    const score = Math.round(checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0));
    const suggestions = checks.filter(c => !c.passed).map(c => c.tip);

    // Sub-scores (normalized to 0–100 each)
    const fmtPct  = Math.round(((contactComplete ? 15 : 0) + (jobTitlePresent ? 5 : 0) + (lengthGood ? 15 : 0)) / 35 * 100);
    const cntPct  = Math.round(((summaryGood ? 15 : 0) + (hasExperience ? 10 : 0) + (hasQuantifiedBullets ? 15 : 0)) / 40 * 100);
    const kwPct   = Math.round(Math.min(totalSkillCount / MIN_SKILLS, 1) * 100);
    const secPct  = Math.round(((hasExperience ? 1 : 0) + (hasEducation ? 1 : 0) + (skillsGood ? 1 : 0) + (summaryGood ? 1 : 0)) / 4 * 100);
    const colorOf = (p: number): 'emerald' | 'amber' | 'red' => p >= 70 ? 'emerald' : p >= 40 ? 'amber' : 'red';

    const subScores: AtsSubScore[] = [
      { label: 'Formatting',          pct: fmtPct,  color: colorOf(fmtPct)  },
      { label: 'Content Quality',     pct: cntPct,  color: colorOf(cntPct)  },
      { label: 'Skills & Keywords',   pct: kwPct,   color: colorOf(kwPct)   },
      { label: 'Section Completeness',pct: secPct,  color: colorOf(secPct)  },
    ];

    return { score, checks, suggestions, subScores };
  }

  computeJdMatch(resume: ResumeData, jd: string): JdMatchResult {
    const empty: JdMatchResult = { score: 0, weightedScore: 0, matched: [], missing: [], totalKeywords: 0, highPriorityMissing: [] };
    if (!jd.trim()) return empty;

    const resumeText = this.extractAllText(resume).toLowerCase();
    const jdTokens   = extractJdKeywords(jd);

    const matched: string[]             = [];
    const missing: string[]             = [];
    const highPriorityMissing: string[] = [];

    let weightedMatched = 0;
    let weightedTotal   = 0;

    for (const token of jdTokens) {
      const weight = token.isTech ? 2 : 1;
      weightedTotal += weight;

      if (this.keywordInResume(token.keyword, resumeText)) {
        matched.push(token.display);
        weightedMatched += weight;
      } else {
        missing.push(token.display);
        if (token.isTech) highPriorityMissing.push(token.display);
      }
    }

    const score         = jdTokens.length > 0 ? Math.round((matched.length  / jdTokens.length)  * 100) : 0;
    const weightedScore = weightedTotal   > 0 ? Math.round((weightedMatched  / weightedTotal)     * 100) : 0;

    return {
      score,
      weightedScore,
      matched:              matched.slice(0, 40),
      missing:              missing.slice(0, 30),
      totalKeywords:        jdTokens.length,
      highPriorityMissing:  highPriorityMissing.slice(0, 15),
    };
  }

  private keywordInResume(keyword: string, resumeText: string): boolean {
    if (resumeText.includes(keyword)) return true;

    // Alias expansion
    const aliases = MATCH_ALIASES[keyword];
    if (aliases?.some(a => resumeText.includes(a))) return true;

    // Plural / singular normalization
    if (keyword.endsWith('s') && resumeText.includes(keyword.slice(0, -1))) return true;
    if (!keyword.endsWith('s') && resumeText.includes(keyword + 's'))        return true;
    if (keyword.endsWith('ing') && resumeText.includes(keyword.slice(0, -3))) return true;
    if (keyword.endsWith('ed')  && resumeText.includes(keyword.slice(0, -2))) return true;

    return false;
  }

  extractAllText(resume: ResumeData): string {
    const parts: string[] = [resume.summary, resume.personal.jobTitle, resume.personal.fullName];
    for (const e of resume.experience)   { parts.push(e.role, e.company, ...e.bullets); }
    for (const e of resume.education)    { parts.push(e.institution, e.degree, e.field, e.description); }
    for (const p of resume.projects)     { parts.push(p.name, p.techStack, ...p.bullets); }
    for (const g of resume.skills)       { parts.push(g.category, ...g.items); }
    for (const c of resume.certifications) { parts.push(c.name, c.issuer); }
    parts.push(...resume.achievements);
    for (const l of resume.languages)   { parts.push(l.name); }
    parts.push(...resume.interests);
    for (const s of resume.customSections) {
      parts.push(s.title);
      for (const e of s.entries) { parts.push(e.heading, e.subheading, e.description); }
    }
    return parts.join(' ');
  }
}
