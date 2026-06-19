import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AdBannerComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly biodataTemplates = [
    { name: 'Marriage Classic',  gradient: 'from-rose-500 to-pink-600'    },
    { name: 'Marriage Modern',   gradient: 'from-rose-400 to-red-500'     },
    { name: 'Traditional',       gradient: 'from-orange-500 to-amber-600' },
    { name: 'Simple & Clean',    gradient: 'from-slate-500 to-slate-700'  },
    { name: 'Professional Bio',  gradient: 'from-indigo-500 to-blue-600'  },
  ];

  readonly showcaseTemplates = [
    { name: 'ATS Professional', gradient: 'from-slate-700 to-slate-900',   isPremium: true  },
    { name: 'Modern Pro',        gradient: 'from-blue-500 to-indigo-600',   isPremium: true  },
    { name: 'Minimal',           gradient: 'from-gray-400 to-gray-700',     isPremium: false },
    { name: 'Tech',              gradient: 'from-slate-900 to-emerald-600', isPremium: true  },
    { name: 'Creative',          gradient: 'from-violet-500 to-purple-700', isPremium: false },
    { name: 'Elegant',           gradient: 'from-rose-400 to-pink-600',     isPremium: false },
    { name: 'Executive',         gradient: 'from-slate-800 to-yellow-600',  isPremium: false },
    { name: 'Bold',              gradient: 'from-violet-600 to-purple-800', isPremium: false },
    { name: 'Compact',           gradient: 'from-blue-600 to-indigo-700',   isPremium: false },
    { name: 'Fresher',           gradient: 'from-emerald-500 to-teal-600',  isPremium: false },
  ];

  readonly testimonials = [
    { quote: 'Got placed at Infosys after optimizing my resume with the ATS score. The templates are clean and professional!', name: 'Priya S.', role: 'Software Engineer, Mumbai', initials: 'PS', avatarBg: 'bg-violet-500' },
    { quote: 'The marriage biodata templates are beautiful. My family loved the quality of the PDF. Highly recommended!', name: 'Rahul M.', role: 'Chartered Accountant, Delhi', initials: 'RM', avatarBg: 'bg-rose-500' },
    { quote: 'Best resume builder for freshers. Completely free, no hidden charges. Got placed in TCS in my first attempt!', name: 'Ananya K.', role: 'Fresher, Bangalore', initials: 'AK', avatarBg: 'bg-emerald-600' },
    { quote: 'The cover letter generator saved me hours of work. Professional, personalized results in just minutes.', name: 'Amit P.', role: 'Marketing Manager, Pune', initials: 'AP', avatarBg: 'bg-amber-500' },
  ];

  readonly products = [
    { icon: '📄', iconBg: 'bg-violet-100 dark:bg-violet-900/40',  title: 'Resume Builder',    desc: 'ATS-friendly resumes with live score feedback',    route: '/resume-builder',              badge: null,    badgeClass: '' },
    { icon: '✉️', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', title: 'Cover Letter',      desc: 'Tailored cover letters generated from your resume', route: '/resume-builder/cover-letter', badge: 'Pro',   badgeClass: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
    { icon: '🌐', iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',  title: 'Portfolio Builder', desc: 'Shareable public portfolio with live URL',          route: '/resume-builder/portfolio',    badge: 'Pro',   badgeClass: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
    { icon: '💍', iconBg: 'bg-rose-100 dark:bg-rose-900/40',      title: 'Biodata Maker',     desc: 'Marriage & personal biodata with photo support',   route: '/biodata-maker',               badge: null,    badgeClass: '' },
    { icon: '📋', iconBg: 'bg-amber-100 dark:bg-amber-900/40',    title: 'Job Tracker',       desc: 'Track applications, interviews, and offers',       route: '/resume-builder/dashboard',    badge: 'Pro',   badgeClass: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
    { icon: '⚡', iconBg: 'bg-slate-100 dark:bg-slate-800',       title: 'File Converter',    desc: '40+ tools — PDF, image, document, archive',        route: '/image-to-pdf',                badge: 'Free',  badgeClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
  ];

  readonly benefits = [
    { icon: '🎯', title: 'ATS Friendly',          desc: 'All resume templates pass modern ATS scanners without errors — compatible with Naukri, LinkedIn, and every major job portal.' },
    { icon: '⚡', title: 'Easy to Use',            desc: 'No design skills needed. Fill in your details, pick a template, and download a polished PDF in under 5 minutes.' },
    { icon: '🛠️', title: 'Multiple Career Tools', desc: 'Resume, cover letter, portfolio, biodata, and job tracker — everything you need in one place, not scattered across platforms.' },
    { icon: '⬇️', title: 'Instant Downloads',      desc: 'One-click PDF export. No email required. Your resume is ready to send the moment you click Download.' },
  ];
}
