import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';
import { TOOLS, Tool } from '../../core/models/tool.model';
import { TrendingService } from '../../core/services/trending.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ToolCardComponent, AdBannerComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  readonly allTools: Tool[] = TOOLS;
  activeCategory = 'all';

  readonly categories = [
    { id: 'all',      label: 'All Tools' },
    { id: 'resume',   label: '🧑‍💼 Resume' },
    { id: 'biodata',  label: '📋 Biodata' },
    { id: 'pdf',      label: '📄 PDF' },
    { id: 'image',    label: '🖼️ Image' },
    { id: 'document', label: '📝 Document' },
    { id: 'archive',  label: '🗜️ Archive' },
  ];

  constructor(public trendingService: TrendingService) {}

  ngOnInit(): void { this.trendingService.load(); }

  get filteredTools(): Tool[] {
    const sorted = this.trendingService.sortedTools(this.allTools);
    if (this.activeCategory === 'all') return sorted;
    return sorted.filter(t => t.category === this.activeCategory);
  }

  readonly stats = [
    { value: '10M+',   label: 'Files Converted' },
    { value: '10,000+', label: 'Happy Users' },
    { value: '40+',    label: 'Free Tools' },
    { value: '₹0',     label: 'To Get Started' },
  ];

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

  readonly howItWorks = [
    { icon: '📝', bg: 'bg-violet-100 dark:bg-violet-900/30',  title: 'Fill Your Details',    desc: 'Enter your personal info, experience, education and skills in our guided editor.' },
    { icon: '🎨', bg: 'bg-indigo-100 dark:bg-indigo-900/30',  title: 'Choose a Template',    desc: 'Pick from 10+ professional ATS-friendly designs. Preview instantly in real time.' },
    { icon: '⬇️', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Download PDF',        desc: 'Get a polished, print-ready PDF in one click. Share or apply directly.' },
  ];

  readonly testimonials = [
    { quote: 'Got placed at Infosys after optimizing my resume with the ATS score. The templates are clean and professional!', name: 'Priya S.', role: 'Software Engineer, Mumbai', initials: 'PS', avatarBg: 'bg-violet-500' },
    { quote: 'The marriage biodata templates are beautiful. My family loved the quality of the PDF. Highly recommended!', name: 'Rahul M.', role: 'Chartered Accountant, Delhi', initials: 'RM', avatarBg: 'bg-rose-500' },
    { quote: 'Best resume builder for freshers. Completely free, no hidden charges. Got placed in TCS in my first attempt!', name: 'Ananya K.', role: 'Fresher, Bangalore', initials: 'AK', avatarBg: 'bg-emerald-600' },
    { quote: 'The cover letter generator saved me hours of work. Professional, personalized results in just minutes.', name: 'Amit P.', role: 'Marketing Manager, Pune', initials: 'AP', avatarBg: 'bg-amber-500' },
  ];

  readonly trustBadges = [
    { icon: '🔒', label: 'SSL Secure & Private' },
    { icon: '⚡', label: 'Instant PDF Download' },
    { icon: '🆓', label: 'Free Forever Plan' },
    { icon: '✅', label: 'ATS-Optimized' },
    { icon: '🇮🇳', label: 'Made for India' },
  ];

  readonly features = [
    { icon: '🎯', bg: 'bg-violet-100 dark:bg-violet-900/30',  title: 'ATS-Friendly Templates',    desc: 'All resume templates are designed to pass modern Applicant Tracking Systems without errors.' },
    { icon: '✉️', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Cover Letter Builder',      desc: 'Generate a tailored cover letter from your resume in seconds. Three tone options — professional, confident, or enthusiastic.' },
    { icon: '🌐', bg: 'bg-indigo-100 dark:bg-indigo-900/30',  title: 'Portfolio Builder',          desc: 'Create a shareable public portfolio page with your bio, skills, projects and social links.' },
    { icon: '📋', bg: 'bg-rose-100 dark:bg-rose-900/30',     title: 'Biodata Builder',             desc: 'Marriage and personal biodata templates with photo support and instant PDF download.' },
    { icon: '⚡', bg: 'bg-amber-100 dark:bg-amber-900/30',   title: 'One-Click PDF Download',      desc: 'Download a polished, print-ready PDF instantly — no email or account required.' },
    { icon: '⭐', bg: 'bg-orange-100 dark:bg-orange-900/30', title: 'Premium Templates',           desc: 'Unlock exclusive Pro-only designs for ₹9/month — cancel anytime, no commitment.' },
  ];
}
