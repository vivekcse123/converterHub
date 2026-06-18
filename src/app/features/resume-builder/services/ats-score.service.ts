import { Injectable } from '@angular/core';
import { ResumeData } from '../models/resume.model';

export interface AtsCheck {
  label: string;
  passed: boolean;
  weight: number;
  tip: string;
}

export interface AtsScoreResult {
  score: number;
  checks: AtsCheck[];
  suggestions: string[];
}

export interface JdMatchResult {
  score: number;
  matched: string[];
  missing: string[];
  totalKeywords: number;
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
  'such','own','same','other','than','too','very','s','t','am','need','use','using',
  'able','work','working','experience','years','year','strong','good','well','new',
  'able','will','must','can','shall','job','role','position','candidate','required',
  'preferred','plus','bonus','including','etc','eg','ie','per','via','key','great',
]);

function countWords(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s.+#]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));

  // Also extract multi-word tech phrases (bigrams) e.g. "machine learning", "react native"
  const bigrams: string[] = [];
  const rawWords = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < rawWords.length - 1; i++) {
    const a = rawWords[i].replace(/[^a-z0-9.+#]/g, '');
    const b = rawWords[i + 1].replace(/[^a-z0-9.+#]/g, '');
    if (a.length > 2 && b.length > 2 && !STOPWORDS.has(a) && !STOPWORDS.has(b)) {
      bigrams.push(`${a} ${b}`);
    }
  }

  return [...new Set([...words, ...bigrams])].slice(0, 60);
}

@Injectable({ providedIn: 'root' })
export class AtsScoreService {
  compute(resume: ResumeData | null): AtsScoreResult {
    if (!resume) return { score: 0, checks: [], suggestions: [] };

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

    return { score, checks, suggestions };
  }

  computeJdMatch(resume: ResumeData, jd: string): JdMatchResult {
    if (!jd.trim()) return { score: 0, matched: [], missing: [], totalKeywords: 0 };

    const resumeText = this.extractAllText(resume).toLowerCase();
    const jdKeywords = extractKeywords(jd);

    const matched: string[] = [];
    const missing: string[] = [];

    for (const kw of jdKeywords) {
      if (resumeText.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }

    const score = jdKeywords.length > 0 ? Math.round((matched.length / jdKeywords.length) * 100) : 0;
    return { score, matched: matched.slice(0, 30), missing: missing.slice(0, 20), totalKeywords: jdKeywords.length };
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
