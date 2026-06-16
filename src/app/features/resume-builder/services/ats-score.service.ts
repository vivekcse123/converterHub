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

const QUANTIFIED_PATTERN = /\d/;
const MIN_SUMMARY_WORDS = 40;
const MIN_TOTAL_WORDS = 300;
const MAX_TOTAL_WORDS = 900;
const MIN_SKILLS = 5;

function countWords(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

@Injectable({ providedIn: 'root' })
export class AtsScoreService {
  compute(resume: ResumeData | null): AtsScoreResult {
    if (!resume) {
      return { score: 0, checks: [], suggestions: [] };
    }

    const { personal, summary, experience, education, skills } = resume;

    const contactComplete = !!(personal.email && personal.phone && personal.location);
    const jobTitlePresent = !!personal.jobTitle.trim();
    const summaryWordCount = countWords(summary);
    const summaryGood = summaryWordCount >= MIN_SUMMARY_WORDS;

    const hasExperience = experience.length > 0 && experience.some(e => e.role.trim() && e.company.trim());

    const allExperienceBullets = experience.flatMap(e => e.bullets);
    const hasQuantifiedBullets = allExperienceBullets.some(b => QUANTIFIED_PATTERN.test(b));

    const totalSkillCount = skills.reduce((sum, g) => sum + g.items.length, 0);
    const skillsGood = totalSkillCount >= MIN_SKILLS;

    const hasEducation = education.length > 0 && education.some(e => e.institution.trim() && e.degree.trim());

    const totalWordCount = this.totalWordCount(resume);
    const lengthGood = totalWordCount >= MIN_TOTAL_WORDS && totalWordCount <= MAX_TOTAL_WORDS;

    const checks: AtsCheck[] = [
      {
        label: 'Contact details complete',
        passed: contactComplete,
        weight: 15,
        tip: 'Add your email, phone number, and location so recruiters and ATS systems can identify and reach you.',
      },
      {
        label: 'Job title / target role set',
        passed: jobTitlePresent,
        weight: 5,
        tip: 'Add a job title under your name that matches the role you are applying for.',
      },
      {
        label: `Professional summary (${MIN_SUMMARY_WORDS}+ words)`,
        passed: summaryGood,
        weight: 15,
        tip: `Write a professional summary of at least ${MIN_SUMMARY_WORDS} words highlighting your experience, skills, and goals.`,
      },
      {
        label: 'Work experience added',
        passed: hasExperience,
        weight: 10,
        tip: 'Add at least one work experience entry with a role title and company name.',
      },
      {
        label: 'Experience bullets show measurable results',
        passed: hasQuantifiedBullets,
        weight: 15,
        tip: 'Use numbers, percentages, or amounts in your bullet points (e.g. "increased performance by 30%") to show measurable impact.',
      },
      {
        label: `Skills section has ${MIN_SKILLS}+ skills`,
        passed: skillsGood,
        weight: 15,
        tip: `List at least ${MIN_SKILLS} relevant skills so your resume matches more keyword searches.`,
      },
      {
        label: 'Education added',
        passed: hasEducation,
        weight: 10,
        tip: 'Add your education with institution name and degree/field of study.',
      },
      {
        label: `Resume length (${MIN_TOTAL_WORDS}-${MAX_TOTAL_WORDS} words)`,
        passed: lengthGood,
        weight: 15,
        tip: totalWordCount < MIN_TOTAL_WORDS
          ? 'Your resume looks short. Add more detail to your experience, projects, or summary.'
          : 'Your resume looks long. Trim less relevant details to keep it focused on 1-2 pages.',
      },
    ];

    const score = Math.round(checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0));
    const suggestions = checks.filter(c => !c.passed).map(c => c.tip);

    return { score, checks, suggestions };
  }

  private totalWordCount(resume: ResumeData): number {
    const parts: string[] = [resume.summary];

    for (const exp of resume.experience) {
      parts.push(exp.role, exp.company, ...exp.bullets);
    }
    for (const edu of resume.education) {
      parts.push(edu.institution, edu.degree, edu.field, edu.description);
    }
    for (const proj of resume.projects) {
      parts.push(proj.name, ...proj.bullets);
    }
    for (const group of resume.skills) {
      parts.push(group.category, ...group.items);
    }
    for (const cert of resume.certifications) {
      parts.push(cert.name, cert.issuer);
    }
    parts.push(...resume.achievements);
    for (const lang of resume.languages) {
      parts.push(lang.name);
    }
    parts.push(...resume.interests);
    for (const section of resume.customSections) {
      parts.push(section.title);
      for (const entry of section.entries) {
        parts.push(entry.heading, entry.subheading, entry.description);
      }
    }

    return parts.reduce((sum, p) => sum + countWords(p), 0);
  }
}
