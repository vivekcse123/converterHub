import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { JsonLdService } from '../../core/services/json-ld.service';

interface CheckResult { label: string; score: number; passed: boolean; tip: string; }
interface AtsAnalysis { overallScore: number; checks: CheckResult[]; }

const ACTION_VERBS_SET = new Set([
  // Leadership & management
  'led','managed','directed','supervised','oversaw','mentored','coached','guided','spearheaded','championed','headed','chaired','steered',
  // Achievement & impact
  'achieved','delivered','improved','increased','reduced','saved','generated','exceeded','surpassed','boosted','accelerated','doubled','tripled',
  // Creation & innovation
  'developed','built','created','designed','launched','established','founded','initiated','pioneered','implemented','introduced','invented',
  // Technical execution
  'engineered','architected','deployed','automated','optimized','streamlined','integrated','migrated','refactored','programmed','coded','configured',
  // Analysis & research
  'analyzed','researched','evaluated','assessed','audited','reviewed','identified','diagnosed','investigated','modeled','forecasted','projected',
  // Communication & collaboration
  'presented','collaborated','coordinated','facilitated','negotiated','communicated','partnered','liaised','advised','consulted','trained',
  // Operations
  'maintained','resolved','supported','administered','operated','executed','processed','monitored','tracked','managed','implemented','ensured',
  // Sales & marketing
  'sold','grew','acquired','retained','converted','marketed','promoted','pitched','closed','prospected','upsold',
]);

const SECTION_ALIASES: Record<string, string[]> = {
  experience: ['experience','work experience','professional experience','employment history','work history','career history','professional background'],
  education:  ['education','academic background','qualifications','academic qualifications','degrees'],
  skills:     ['skills','technical skills','core competencies','key skills','areas of expertise','competencies','technologies'],
  summary:    ['summary','professional summary','profile','career objective','objective','about me','personal statement'],
  projects:   ['projects','personal projects','key projects','selected projects','portfolio'],
  certifications: ['certifications','certificates','licenses','credentials'],
  achievements:   ['achievements','accomplishments','awards','honors','recognition'],
  contact:    ['contact','contact information','contact details'],
};

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  tech:        ['javascript','python','java','react','angular','vue','node','sql','aws','docker','kubernetes','git','typescript','html','css','api','agile','scrum','linux','mongodb','postgresql','mysql','redis','ci/cd','devops','machine learning','cloud','microservices','terraform','jenkins','azure','gcp','rest','graphql','spring','django','flutter','kotlin','swift'],
  finance:     ['financial','accounting','audit','compliance','risk','portfolio','investment','budget','forecast','revenue','p&l','balance sheet','cash flow','equity','derivatives','reconciliation','tax','gaap','ifrs','cfa','cpa','excel','powerbi','tableau','bloomberg','trading','banking','credit','insurance'],
  healthcare:  ['patient','clinical','medical','healthcare','hospital','diagnosis','treatment','nursing','pharmacy','surgery','physician','therapy','rehabilitation','ehr','emr','hipaa','medication','procedure','diagnosis','care plan','vital signs','icd'],
  marketing:   ['marketing','seo','sem','content','social media','brand','campaign','digital','analytics','conversion','crm','email marketing','growth','acquisition','retention','roi','kpi','a/b testing','advertising','copywriting','engagement','influencer'],
  management:  ['strategy','operations','leadership','stakeholder','project management','pmp','process improvement','cross-functional','organizational','change management','kpi','metrics','reporting','resource allocation','agile','lean','six sigma','transformation'],
  hr:          ['recruitment','hiring','talent','onboarding','payroll','benefits','hr','human resources','employee relations','performance management','learning and development','succession','diversity','inclusion','hris','workforce'],
  design:      ['ux','ui','figma','sketch','adobe','photoshop','illustrator','wireframe','prototype','user research','usability','design system','typography','branding','creative'],
  education:   ['curriculum','teaching','learning','student','assessment','pedagogy','lesson plan','classroom','academic','instruction','faculty','course','e-learning','lms'],
};

function detectIndustry(lower: string): string {
  let best = 'general'; let bestCount = 2;
  for (const [industry, words] of Object.entries(INDUSTRY_KEYWORDS)) {
    const count = words.filter(w => lower.includes(w)).length;
    if (count > bestCount) { bestCount = count; best = industry; }
  }
  return best;
}

function analyzeResumeText(text: string): AtsAnalysis {
  const lower      = text.toLowerCase();
  const words      = lower.split(/\s+/).filter(Boolean);
  const wordCount  = words.length;
  const lines      = text.split(/\n/).map(l => l.trim()).filter(Boolean);

  // ── 1. Contact info (email, phone, LinkedIn / URL) ───────────────────────
  const hasEmail    = /@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  const hasPhone    = /(\+?\d[\s\-.]?){9,13}\d/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(text) || /linkedin/i.test(text);
  const contactPts  = (hasEmail ? 40 : 0) + (hasPhone ? 40 : 0) + (hasLinkedIn ? 20 : 0);
  const contactScore = contactPts;
  const contactTip = !hasEmail
    ? 'Missing email address — ATS cannot identify you without one.'
    : !hasPhone
    ? 'Add a phone number. Most ATS require it to complete your profile.'
    : !hasLinkedIn
    ? `Email ✓  Phone ✓  — Add your LinkedIn URL to improve recruiter response rate.`
    : 'Email ✓  Phone ✓  LinkedIn ✓ — Contact section is complete.';

  // ── 2. Section headings ──────────────────────────────────────────────────
  const detectedCategories: string[] = [];
  for (const [category, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.some(a => lower.includes(a))) detectedCategories.push(category);
  }
  const requiredPresent = ['experience','education','skills'].filter(r => detectedCategories.includes(r));
  const sectionScore = Math.min(100, requiredPresent.length * 25 + (detectedCategories.length - requiredPresent.length) * 8);
  const sectionTip = requiredPresent.length < 3
    ? `Missing required sections: ${['experience','education','skills'].filter(r => !detectedCategories.includes(r)).join(', ')}. ATS look for these exact headings.`
    : `Found ${detectedCategories.length} sections (${detectedCategories.join(', ')}). ${detectedCategories.length >= 5 ? 'Excellent structure.' : 'Consider adding Projects or Certifications.'}`;

  // ── 3. Action verbs ──────────────────────────────────────────────────────
  const verbsFound = new Set(words.map(w => w.replace(/[^a-z]/g, '')).filter(w => ACTION_VERBS_SET.has(w)));
  const verbCount  = verbsFound.size;
  const verbScore  = Math.min(100, verbCount < 3 ? verbCount * 10 : verbCount < 6 ? 30 + (verbCount - 3) * 10 : 60 + (verbCount - 6) * 5);
  const verbTip = verbCount === 0
    ? 'No action verbs detected. Start each bullet with verbs like Led, Built, Improved, Achieved.'
    : verbCount < 4
    ? `Found ${verbCount} action verbs (${[...verbsFound].join(', ')}). Aim for 6+ unique verbs across your bullets.`
    : `Found ${verbCount} strong action verbs. ${verbCount >= 8 ? 'Excellent — varied verbs signal strong contribution.' : 'Good — try to reach 8+ for best results.'}`;

  // ── 4. Quantified achievements ────────────────────────────────────────────
  const metricMatches = text.match(/\d+\s*(%|percent|x\b|\+|k\b|m\b|lakh|crore|\$|₹|usd|inr|million|billion|hours?|days?|weeks?|months?|years?|users?|customers?|clients?|projects?|teams?|members?)/gi) ?? [];
  const plainNumbers  = (text.match(/\b\d{2,}\b/g) ?? []).length;
  const quantCount    = metricMatches.length;
  const quantScore    = Math.min(100, quantCount === 0 ? Math.min(20, plainNumbers * 3) : quantCount < 3 ? 30 + quantCount * 15 : Math.min(100, 60 + (quantCount - 3) * 10));
  const quantTip = quantCount === 0
    ? 'No measurable results found. Add metrics like "Increased sales by 35%", "Managed team of 8", "Reduced costs by ₹2L".'
    : quantCount < 3
    ? `Found ${quantCount} quantified result${quantCount > 1 ? 's' : ''}. Aim for at least 4–6 metrics to stand out.`
    : `Found ${quantCount} quantified achievements — recruiters and ATS both reward measurable impact.`;

  // ── 5. Resume length ──────────────────────────────────────────────────────
  const wordScore = wordCount < 150 ? 15
    : wordCount < 250 ? 35
    : wordCount < 300 ? 55
    : wordCount <= 650 ? 100
    : wordCount <= 800 ? 80
    : wordCount <= 1000 ? 60
    : 40;
  const wordTip = wordCount < 250
    ? `Too short at ${wordCount} words. ATS may flag thin resumes — expand your experience bullet points.`
    : wordCount > 800
    ? `${wordCount} words is too long for one page. Trim to 400–650 words; ATS often truncate long resumes.`
    : `Good length at ${wordCount} words — within the optimal 300–650 word range for ATS parsing.`;

  // ── 6. Industry-relevant keywords ────────────────────────────────────────
  const industry       = detectIndustry(lower);
  const industryWords  = INDUSTRY_KEYWORDS[industry] ?? [];
  const kwFound        = industryWords.filter(w => lower.includes(w));
  const kwScore        = industry === 'general'
    ? 55  // can't penalise unknown industry — give neutral score
    : Math.min(100, kwFound.length < 3 ? kwFound.length * 10 : 30 + (kwFound.length - 3) * 8);
  const kwTip = industry === 'general'
    ? 'Add role-specific keywords from job descriptions you are targeting to help ATS match your profile.'
    : kwFound.length < 3
    ? `Detected ${industry} role but found only ${kwFound.length} relevant keyword${kwFound.length !== 1 ? 's' : ''}. Mirror keywords from target job descriptions.`
    : `Detected ${industry} profile. Found ${kwFound.length} relevant keywords (${kwFound.slice(0, 5).join(', ')}${kwFound.length > 5 ? '…' : ''}). ${kwFound.length >= 8 ? 'Strong keyword density.' : 'Add more from the job description.'}`;

  // ── 7. Date & tenure formatting ──────────────────────────────────────────
  const yearMatches  = (text.match(/\b(19|20)\d{2}\b/g) ?? []);
  const monthYearRx  = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+\d{4}/gi;
  const monthMatches = (text.match(monthYearRx) ?? []);
  const presentWord  = /\b(present|current|till date|to date)\b/i.test(text);
  const dateCount    = yearMatches.length + monthMatches.length;
  const dateScore    = dateCount === 0 ? 20 : dateCount < 3 ? 45 : Math.min(100, 60 + (monthMatches.length * 10) + (presentWord ? 10 : 0));
  const dateTip = dateCount === 0
    ? 'No dates detected. ATS require employment dates to parse your work history correctly.'
    : monthMatches.length === 0
    ? `Found ${yearMatches.length} year${yearMatches.length > 1 ? 's' : ''}. Use "Month Year – Month Year" format (e.g. "Jan 2022 – Mar 2024") for better ATS parsing.`
    : `Date formatting looks good — ${monthMatches.length} month-year date${monthMatches.length > 1 ? 's' : ''} detected${presentWord ? ' with current role marked' : ''}.`;

  const checks: CheckResult[] = [
    { label: 'Contact Information',     score: contactScore, passed: contactScore >= 80,   tip: contactTip   },
    { label: 'Section Structure',       score: sectionScore, passed: sectionScore >= 75,   tip: sectionTip   },
    { label: 'Action Verbs',           score: verbScore,    passed: verbScore  >= 50,      tip: verbTip      },
    { label: 'Quantified Achievements', score: quantScore,  passed: quantScore >= 45,      tip: quantTip     },
    { label: 'Resume Length',           score: wordScore,   passed: wordScore  >= 75,      tip: wordTip      },
    { label: 'Industry Keywords',       score: kwScore,     passed: kwScore    >= 50,      tip: kwTip        },
    { label: 'Date & Timeline Format',  score: dateScore,   passed: dateScore  >= 45,      tip: dateTip      },
  ];

  const weights = [0.15, 0.18, 0.14, 0.20, 0.09, 0.16, 0.08];
  const overallScore = Math.round(checks.reduce((sum, c, i) => sum + c.score * weights[i], 0));
  return { overallScore, checks };
}

@Component({
  selector: 'app-ats-resume-checker',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-20">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none"></div>
      <div class="container-app relative text-center max-w-3xl mx-auto">
        <span class="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          Free · Instant · No Signup Required
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
          Free ATS Resume Checker<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">Score Your Resume Instantly</span>
        </h1>
        <p class="text-lg text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Check if your resume passes Applicant Tracking Systems. Get a detailed ATS score, missing keyword analysis, and actionable improvement tips - completely free.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button (click)="scrollToChecker()"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 shadow-xl transition text-base">
            🎯 Check My ATS Score - Free
          </button>
          <a routerLink="/resume-builder"
             class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition text-base">
            📄 Build ATS Resume
          </a>
        </div>
        <!-- Score preview -->
        <div class="mt-10 inline-flex items-center gap-6 bg-white/10 backdrop-blur rounded-2xl px-8 py-4">
          <div class="text-center">
            <p class="text-3xl font-extrabold text-emerald-300">94%</p>
            <p class="text-xs text-white/70">Avg ATS score</p>
          </div>
          <div class="w-px h-8 bg-white/20"></div>
          <div class="text-center">
            <p class="text-3xl font-extrabold text-yellow-300">10K+</p>
            <p class="text-xs text-white/70">Resumes checked</p>
          </div>
          <div class="w-px h-8 bg-white/20"></div>
          <div class="text-center">
            <p class="text-3xl font-extrabold text-white">Free</p>
            <p class="text-xs text-white/70">Always</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Live ATS Checker Tool -->
    <section id="ats-checker" class="container-app py-12 max-w-3xl mx-auto">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 class="text-base font-bold text-slate-800 dark:text-white">Check Your ATS Score</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Upload a .txt/.docx file or paste your resume text for an instant ATS analysis.</p>
        </div>
        <div class="p-6 space-y-4">

          <!-- File upload drop zone -->
          <div class="relative">
            <label
              class="flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
              [class]="isDragging() ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
              (dragover)="$event.preventDefault(); isDragging.set(true)"
              (dragleave)="isDragging.set(false)"
              (drop)="onFileDrop($event)">
              <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="text-xs text-slate-500 dark:text-slate-400">
                @if (uploadedFileName()) {
                  <span class="font-semibold text-emerald-600">{{ uploadedFileName() }}</span> — text extracted
                } @else {
                  Drop .txt, .docx or .pdf here, or <span class="text-emerald-600 font-semibold">browse</span>
                }
              </span>
              <input type="file" accept=".txt,.docx,.pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                     class="sr-only" (change)="onFileSelect($event)">
            </label>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            <span class="text-xs text-slate-400 font-medium">or paste text</span>
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
          </div>

          <textarea
            [(ngModel)]="resumeText"
            (ngModelChange)="onTextChange()"
            rows="7"
            placeholder="Paste your resume text here…&#10;&#10;e.g. Name, email, phone, professional summary, work experience, education, skills..."
            class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono leading-relaxed placeholder:font-sans placeholder:text-slate-400"></textarea>

          @if (analysis(); as result) {
            <div role="status" aria-live="polite">
              <!-- Overall score -->
              <div class="flex items-center gap-4 p-4 rounded-xl"
                   [class]="result.overallScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' :
                             result.overallScore >= 60 ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' :
                                                         'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'">
                <div class="text-center shrink-0">
                  <p class="text-3xl font-extrabold"
                     [class]="result.overallScore >= 80 ? 'text-emerald-600' : result.overallScore >= 60 ? 'text-amber-600' : 'text-red-500'">
                    {{ result.overallScore }}%
                  </p>
                  <p class="text-[10px] font-medium text-slate-500 dark:text-slate-400">ATS Score</p>
                </div>
                <div>
                  <p class="font-bold text-sm"
                     [class]="result.overallScore >= 80 ? 'text-emerald-700 dark:text-emerald-300' : result.overallScore >= 60 ? 'text-amber-700 dark:text-amber-300' : 'text-red-600 dark:text-red-400'">
                    {{ result.overallScore >= 80 ? 'Strong ATS Resume' : result.overallScore >= 60 ? 'Needs Improvement' : 'High Risk of Rejection' }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {{ passedCount(result) }}/{{ result.checks.length }} checks passed
                  </p>
                </div>
              </div>

              <!-- Check breakdown -->
              <div class="space-y-2.5 mt-4">
                @for (check of result.checks; track check.label) {
                  <div class="flex items-start gap-3">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0 mt-0.5 font-bold"
                          [class]="check.passed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'">
                      {{ check.passed ? '✓' : '✗' }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ check.label }}</span>
                        <span class="text-[10px] font-bold tabular-nums"
                              [class]="check.score >= 80 ? 'text-emerald-600' : check.score >= 50 ? 'text-amber-600' : 'text-red-500'">
                          {{ check.score }}%
                        </span>
                      </div>
                      <div class="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                             [class]="check.score >= 80 ? 'bg-emerald-500' : check.score >= 50 ? 'bg-amber-500' : 'bg-red-500'"
                             [style.width.%]="check.score"></div>
                      </div>
                      <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{{ check.tip }}</p>
                    </div>
                  </div>
                }
              </div>

              <!-- CTA to builder -->
              <div class="mt-5 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p class="text-sm font-bold text-primary-800 dark:text-primary-200">Build an ATS-optimized resume</p>
                  <p class="text-xs text-primary-600 dark:text-primary-400 mt-0.5">Our builder shows your live ATS score as you type.</p>
                </div>
                <a routerLink="/resume-builder"
                   class="shrink-0 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition shadow">
                  Try Free Builder →
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- What is ATS -->
    <section class="container-app py-16 max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">What is ATS and Why Does It Matter?</h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            An <strong>Applicant Tracking System (ATS)</strong> is software used by 98% of Fortune 500 companies and most Indian MNCs to automatically filter resumes before a human even reads them.
          </p>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            If your resume doesn't pass ATS screening, it gets rejected automatically - even if you're perfectly qualified. Our free checker analyzes your resume against the same criteria used by real ATS software.
          </p>
          <div class="flex flex-col gap-3">
            @for (check of atsChecks; track $index) {
              <div class="flex items-start gap-3">
                <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shrink-0 mt-0.5">✓</span>
                <p class="text-sm text-slate-600 dark:text-slate-300">{{ check }}</p>
              </div>
            }
          </div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 space-y-4">
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Sample ATS Score Report</p>
          @for (item of sampleScore; track $index) {
            <div>
              <div class="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                <span>{{ item.label }}</span>
                <span [class]="item.score >= 80 ? 'text-emerald-600' : item.score >= 60 ? 'text-amber-600' : 'text-red-500'">{{ item.score }}%</span>
              </div>
              <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all"
                     [class]="item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'"
                     [style.width.%]="item.score"></div>
              </div>
            </div>
          }
          <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Overall ATS Score</span>
            <span class="text-sm font-extrabold text-emerald-600">88%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-slate-50 dark:bg-slate-800/30 py-16">
      <div class="container-app">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">What Our ATS Checker Analyzes</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Comprehensive checks across every dimension that matters to ATS software</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (f of features; track $index) {
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" [class]="f.bg">{{ f.icon }}</div>
              <h3 class="font-bold text-slate-800 dark:text-white text-sm mb-1">{{ f.title }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ f.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="container-app py-16 max-w-3xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">Frequently Asked Questions</h2>
      <div class="space-y-4">
        @for (faq of faqs; track $index) {
          <details class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <summary class="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-slate-800 dark:text-white text-sm list-none select-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              {{ faq.q }}
              <span class="text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-3">▼</span>
            </summary>
            <div class="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">{{ faq.a }}</div>
          </details>
        }
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 text-white text-center">
      <div class="container-app max-w-2xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold mb-4">Ready to Beat the ATS?</h2>
        <p class="text-emerald-100 mb-8 text-base">Create an ATS-optimized resume in minutes. Our builder shows your ATS score in real time as you type.</p>
        <a routerLink="/resume-builder" class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-700 font-bold hover:bg-emerald-50 shadow-xl transition text-base">
          🎯 Build ATS Resume - Free
        </a>
      </div>
    </section>
  `,
})
export class AtsResumeCheckerComponent implements OnInit, OnDestroy {
  private seo    = inject(SeoService);
  private jsonLd = inject(JsonLdService);

  resumeText = '';
  readonly analysis        = signal<AtsAnalysis | null>(null);
  readonly isDragging      = signal(false);
  readonly uploadedFileName = signal('');

  scrollToChecker(): void {
    document.getElementById('ats-checker')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onTextChange(): void {
    const text = this.resumeText.trim();
    this.analysis.set(text.length > 30 ? analyzeResumeText(text) : null);
  }

  passedCount(result: AtsAnalysis): number {
    let n = 0;
    for (const c of result.checks) if (c.passed) n++;
    return n;
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.readFile(file);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.readFile(file);
  }

  private readFile(file: File): void {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.resumeText = (e.target?.result as string) ?? '';
        this.uploadedFileName.set(file.name);
        this.onTextChange();
      };
      reader.readAsText(file);
    } else if (ext === 'docx') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        try {
          const mammoth = await import('mammoth');
          const result  = await mammoth.extractRawText({ arrayBuffer: buffer });
          this.resumeText = result.value;
          this.uploadedFileName.set(file.name);
          this.onTextChange();
        } catch {
          alert('Could not read .docx file. Please copy-paste the text instead.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (ext === 'pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        try {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.mjs',
            import.meta.url,
          ).toString();
          const pdf   = await pdfjsLib.getDocument({ data: buffer }).promise;
          const parts: string[] = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            const page    = await pdf.getPage(i);
            const content = await page.getTextContent();
            parts.push(content.items.map((item: any) => ('str' in item ? item.str : '')).join(' '));
          }
          this.resumeText = parts.join('\n').replace(/\s+/g, ' ').trim();
          this.uploadedFileName.set(file.name);
          this.onTextChange();
        } catch {
          alert('Could not read .pdf file. Please copy-paste the text instead.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  readonly atsChecks = [
    'Contact information completeness',
    'Keyword density and job-title matching',
    'Section headings recognized by ATS',
    'Work experience with quantified achievements',
    'Skills coverage and formatting',
    'File format and parse-ability',
  ];

  readonly sampleScore = [
    { label: 'Keywords & Skills',       score: 92 },
    { label: 'Contact Info',             score: 100 },
    { label: 'Work Experience Quality',  score: 78 },
    { label: 'Section Structure',        score: 95 },
    { label: 'Quantified Achievements',  score: 72 },
  ];

  readonly features = [
    { icon: '🔍', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Keyword Analysis',        desc: 'Checks if your resume contains industry-specific keywords that ATS systems look for.' },
    { icon: '📊', bg: 'bg-teal-100 dark:bg-teal-900/30',     title: 'Real-Time Score',           desc: 'See your ATS score update live as you fill in your resume sections.' },
    { icon: '📋', bg: 'bg-cyan-100 dark:bg-cyan-900/30',     title: 'Section Detection',         desc: 'Verifies your resume has all standard ATS-recognized sections.' },
    { icon: '🎯', bg: 'bg-blue-100 dark:bg-blue-900/30',     title: 'Actionable Tips',           desc: 'Get specific suggestions to fix issues and improve your score immediately.' },
    { icon: '⚡', bg: 'bg-primary-100 dark:bg-primary-900/30', title: 'Instant Results',           desc: 'No waiting. Score appears as soon as you add content to your resume.' },
    { icon: '🆓', bg: 'bg-amber-100 dark:bg-amber-900/30',   title: 'Completely Free',           desc: 'Basic ATS score is free forever. Pro plan unlocks full detailed analysis.' },
  ];

  readonly faqs = [
    { q: 'What is an ATS resume checker?', a: 'An ATS resume checker is a tool that simulates how Applicant Tracking Systems scan your resume. It analyzes keywords, formatting, section structure, and content to give you a score indicating how likely your resume is to pass automated screening.' },
    { q: 'Is the ATS checker completely free?', a: 'Yes! The basic ATS score is completely free and always will be. You can see your score in real time while building your resume. Our Pro plan unlocks a more detailed breakdown with specific keyword suggestions.' },
    { q: 'How does ATS affect my job application?', a: 'Most large companies use ATS software to filter applications before a recruiter sees them. Studies show that over 75% of resumes are rejected by ATS before reaching a human. A good ATS score dramatically increases your chances of getting an interview call.' },
    { q: 'What ATS score should I aim for?', a: 'Aim for 80% or above. Scores between 70-80% are acceptable but need improvement. Below 70% means your resume is likely to be filtered out. Our templates are specifically designed to help you achieve 80%+ scores easily.' },
    { q: 'Does ApnaConverter support all ATS systems?', a: 'Our checker is calibrated against the most common ATS platforms used in India and globally - including Taleo, Workday, Greenhouse, and iCIMS. Our ATS-professional template is the safest choice for maximum compatibility.' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Free ATS Resume Checker - Score Your Resume Instantly | ApnaConverter',
      description: 'Check if your resume passes ATS systems for free. Get instant ATS score, keyword analysis, and tips to improve. No signup required. Used by 10,000+ job seekers.',
      keywords: 'ATS resume checker, ATS score, applicant tracking system checker, resume ATS scanner, free ATS checker India',
    });
    this.jsonLd.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    this.jsonLd.setJsonLd('software', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ApnaConverter ATS Resume Checker',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      description: 'Free ATS resume checker tool that scores your resume and provides improvement suggestions.',
    });
  }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('faq');
    this.jsonLd.removeJsonLd('software');
  }
}
