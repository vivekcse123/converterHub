import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { GlobalSearchComponent } from '../../shared/components/global-search/global-search.component';
import { AdBannerComponent } from '../../shared/components/ad-banner/ad-banner.component';
import { TOOLS, Tool } from '../../core/models/tool.model';
import { TrendingService } from '../../core/services/trending.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ToolCardComponent, GlobalSearchComponent, AdBannerComponent],
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
    { value: '10M+',  label: 'Files Converted' },
    { value: '40+',   label: 'Tools Available' },
    { value: '10',    label: 'Resume Templates' },
    { value: 'Free',  label: 'To Start' },
  ];

  readonly showcaseTemplates = [
    { name: 'ATS Professional', gradient: 'from-slate-700 to-slate-900',   isPremium: true  },
    { name: 'Modern Pro',        gradient: 'from-blue-500 to-indigo-600',   isPremium: true  },
    { name: 'Minimal',           gradient: 'from-gray-400 to-gray-700',     isPremium: false },
    { name: 'Tech',              gradient: 'from-slate-900 to-emerald-600', isPremium: false },
    { name: 'Creative',          gradient: 'from-violet-500 to-purple-700', isPremium: false },
    { name: 'Elegant',           gradient: 'from-rose-400 to-pink-600',     isPremium: false },
    { name: 'Executive',         gradient: 'from-slate-800 to-yellow-600',  isPremium: false },
    { name: 'Bold',              gradient: 'from-violet-600 to-purple-800', isPremium: false },
    { name: 'Compact',           gradient: 'from-blue-600 to-indigo-700',   isPremium: false },
    { name: 'Fresher',           gradient: 'from-emerald-500 to-teal-600',  isPremium: false },
  ];

  readonly features = [
    { icon: '🎯', bg: 'bg-violet-100 dark:bg-violet-900/30',  title: 'ATS-Friendly Templates',    desc: 'All resume templates are designed to pass modern Applicant Tracking Systems without errors.' },
    { icon: '🧑‍💼', bg: 'bg-indigo-100 dark:bg-indigo-900/30', title: 'Professional Designs',       desc: 'Crafted by designers for recruiters — modern, clean, and polished layouts.' },
    { icon: '📋', bg: 'bg-rose-100 dark:bg-rose-900/30',     title: 'Biodata Builder',             desc: 'Marriage and personal biodata templates with photo support and instant PDF download.' },
    { icon: '⚡', bg: 'bg-amber-100 dark:bg-amber-900/30',   title: 'One-Click PDF Download',      desc: 'Download a polished, print-ready PDF instantly — no email or account required.' },
    { icon: '🔒', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Secure & Private',          desc: 'Your data stays on your device. Nothing is stored or shared without your permission.' },
    { icon: '⭐', bg: 'bg-orange-100 dark:bg-orange-900/30', title: 'Premium Templates',           desc: 'Unlock exclusive Pro-only designs for ₹9/month — cancel anytime, no commitment.' },
  ];
}
