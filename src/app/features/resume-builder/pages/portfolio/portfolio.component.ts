import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CareerService, Portfolio } from '../../services/career.service';
import { JsonLdService } from '../../../../core/services/json-ld.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UpgradeModalComponent } from '../../components/upgrade-modal/upgrade-modal.component';

type Tab = 'basic' | 'social' | 'skills' | 'projects';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UpgradeModalComponent],
  template: `
    @if (showUpgrade()) {
      <app-upgrade-modal (close)="showUpgrade.set(false)" />
    }

    <div class="container-app py-8 space-y-6 max-w-3xl">
      <!-- Header -->
      <div class="flex items-center gap-3 flex-wrap">
        <a routerLink="/dashboard" class="text-xs text-slate-400 hover:text-violet-600 transition">← Dashboard</a>
        <span class="text-slate-300 dark:text-slate-700">|</span>
        <h1 class="text-xl font-extrabold text-slate-900 dark:text-white">Portfolio Builder</h1>
        @if (portfolio()?.isPublic && portfolio()?.username) {
          <a [href]="'/p/' + portfolio()!.username" target="_blank"
             class="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:opacity-80 transition">
            🌐 View Public Page →
          </a>
        }
      </div>

      @if (!auth.isPro()) {
        <div class="min-h-[70vh] flex items-center justify-center">
        <div class="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-2xl p-10 text-center space-y-4 w-full max-w-md">
          <p class="text-5xl">🌐</p>
          <p class="text-lg font-bold text-slate-800 dark:text-white">Portfolio Page — Pro Only</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">Create a beautiful public profile page with your bio, skills, projects, and pinned resume. Available on Pro.</p>
          <button class="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:opacity-90 transition shadow-md"
                  (click)="showUpgrade.set(true)">Upgrade to Pro ⭐</button>
        </div>
        </div>
      } @else {

        <!-- Tab bar -->
        <div class="flex gap-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          @for (t of tabs; track t.id) {
            <button class="flex-1 py-2.5 text-xs font-semibold transition"
                    [class]="tab() === t.id ? 'bg-violet-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
                    (click)="tab.set(t.id)">{{ t.icon }} {{ t.label }}</button>
          }
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">

          <!-- ── Basic Info ── -->
          @if (tab() === 'basic') {
            <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Basic Info</h2>

            <div>
              <label class="text-xs font-semibold text-slate-500 block mb-1">Username (your public URL) *</label>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400 shrink-0">apnaconverter.com/p/</span>
                <input type="text" [(ngModel)]="form.username" (input)="normalizeUsername()" (blur)="checkUsername()"
                       placeholder="yourname" maxlength="50"
                       class="flex-1 px-3 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                       [style.border-color]="usernameStatus() === 'available' ? '#34d399' : (usernameStatus() === 'taken' || usernameStatus() === 'invalid') ? '#f87171' : ''" />
              </div>
              @if (usernameStatus() === 'available') { <p class="text-xs text-emerald-600 mt-1">✅ Username available</p> }
              @if (usernameStatus() === 'taken') { <p class="text-xs text-red-500 mt-1">❌ Username already taken</p> }
              @if (usernameStatus() === 'invalid') { <p class="text-xs text-red-500 mt-1">⚠️ Only lowercase letters, numbers, hyphens and underscores (e.g. vivek-kumar)</p> }
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">Display Name</label>
                <input type="text" [(ngModel)]="form.displayName" placeholder="Priya Sharma"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">Tagline</label>
                <input type="text" [(ngModel)]="form.tagline" placeholder="Full-Stack Developer"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-500 block mb-1">About</label>
              <textarea [(ngModel)]="form.about" rows="3"
                        placeholder="Write a short bio about yourself..."
                        class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">Location</label>
                <input type="text" [(ngModel)]="form.location" placeholder="Bangalore, India"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">Contact Email</label>
                <input type="email" [(ngModel)]="form.email" placeholder="hello@example.com"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 block mb-1">Mobile Number <span class="font-normal text-slate-400">(optional)</span></label>
              <input type="tel" [(ngModel)]="form.phone" placeholder="+91 98765 43210"
                     class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <p class="text-[11px] text-slate-400 mt-1">Only shown on your public portfolio if you choose to display it.</p>
            </div>

            <div class="flex items-center gap-3 pt-1">
              <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">Make portfolio public</label>
              <button class="relative w-10 h-6 rounded-full shrink-0 transition-all duration-200"
                      [style.background]="form.isPublic ? '#7c3aed' : '#cbd5e1'"
                      (click)="form.isPublic = !form.isPublic">
                <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                      [style.transform]="form.isPublic ? 'translateX(16px)' : 'translateX(0)'"></span>
              </button>
            </div>
          }

          <!-- ── Social ── -->
          @if (tab() === 'social') {
            <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Social Links</h2>
            @for (link of socialLinks; track link.key) {
              <div>
                <label class="text-xs font-semibold text-slate-500 block mb-1">{{ link.icon }} {{ link.label }}</label>
                <input type="url" [(ngModel)]="form.social![link.key]" [placeholder]="link.placeholder"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            }
          }

          <!-- ── Skills ── -->
          @if (tab() === 'skills') {
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300">Skills</h2>
              <button class="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline" (click)="addSkill()">+ Add</button>
            </div>
            @for (skill of form.skills ?? []; track skill; let i = $index) {
              <div class="flex items-center gap-2">
                <input type="text" [(ngModel)]="skill.name" placeholder="Skill name"
                       class="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
                <select [(ngModel)]="skill.level"
                        class="px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 focus:outline-none">
                  @for (l of skillLevels; track l) { <option [value]="l.toLowerCase()">{{ l }}</option> }
                </select>
                <button class="text-red-400 hover:text-red-600 text-sm px-1" (click)="removeSkill(i)">✕</button>
              </div>
            }
          }

          <!-- ── Projects ── -->
          @if (tab() === 'projects') {
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-bold text-slate-700 dark:text-slate-300">Projects</h2>
              <button class="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline" (click)="addProject()">+ Add</button>
            </div>
            @for (proj of form.projects ?? []; track proj; let i = $index) {
              <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold text-slate-600 dark:text-slate-300">Project {{ i + 1 }}</p>
                  <button class="text-red-400 hover:text-red-600 text-xs" (click)="removeProject(i)">Remove</button>
                </div>
                <input type="text" [(ngModel)]="proj.title" placeholder="Project title"
                       class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
                <textarea [(ngModel)]="proj.description" rows="2" placeholder="What it does..."
                          class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 resize-none focus:outline-none"></textarea>
                <div class="grid grid-cols-2 gap-2">
                  <input type="url" [(ngModel)]="proj.url" placeholder="Live URL"
                         class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
                  <input type="url" [(ngModel)]="proj.githubUrl" placeholder="GitHub URL"
                         class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none" />
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" [id]="'featured-' + i" [(ngModel)]="proj.featured" class="rounded" />
                  <label [for]="'featured-' + i" class="text-xs text-slate-500">Featured project</label>
                </div>
              </div>
            }
          }

          <!-- Save button -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition shadow-md"
                    [disabled]="saving()"
                    (click)="save()">
              {{ saving() ? 'Saving...' : '💾 Save Portfolio' }}
            </button>
            @if (portfolio()?.username && portfolio()?.isPublic) {
              <a [href]="'/p/' + portfolio()!.username" target="_blank"
                 class="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                Preview →
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class PortfolioComponent implements OnInit, OnDestroy {
  readonly career  = inject(CareerService);
  readonly auth    = inject(AuthService);
  private notify   = inject(NotificationService);
  private jsonLd   = inject(JsonLdService);

  readonly showUpgrade    = signal(false);
  readonly saving         = signal(false);
  readonly tab            = signal<Tab>('basic');
  readonly usernameStatus = signal<'idle' | 'available' | 'taken' | 'invalid'>('idle');

  portfolio = this.career.portfolio;

  readonly tabs = [
    { id: 'basic'    as Tab, icon: '👤', label: 'Basic' },
    { id: 'social'   as Tab, icon: '🔗', label: 'Social' },
    { id: 'skills'   as Tab, icon: '💡', label: 'Skills' },
    { id: 'projects' as Tab, icon: '🚀', label: 'Projects' },
  ];

  readonly socialLinks = [
    { key: 'linkedin'  as keyof Portfolio['social'], icon: '💼', label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/yourname' },
    { key: 'github'    as keyof Portfolio['social'], icon: '🐙', label: 'GitHub',    placeholder: 'https://github.com/yourname' },
    { key: 'twitter'   as keyof Portfolio['social'], icon: '🐦', label: 'Twitter/X', placeholder: 'https://twitter.com/yourname' },
    { key: 'website'   as keyof Portfolio['social'], icon: '🌐', label: 'Website',   placeholder: 'https://yoursite.com' },
    { key: 'youtube'   as keyof Portfolio['social'], icon: '▶️', label: 'YouTube',   placeholder: 'https://youtube.com/@yourchannel' },
  ];

  readonly skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  form: Partial<Portfolio & { social: Portfolio['social'] }> = {
    username: '', displayName: '', tagline: '', about: '', location: '', email: '', phone: '',
    isPublic: false, social: {}, skills: [], projects: [],
  };

  async ngOnInit(): Promise<void> {
    this.jsonLd.setJsonLd('portfolio-builder-app', {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication',
      name: 'ApnaConverter Portfolio Builder',
      url: 'https://www.apnaconverter.com/resume-builder/portfolio',
      applicationCategory: 'BusinessApplication',
      description: 'Create a public portfolio page with your bio, skills, projects, and social links. Share a professional profile with employers — free with ApnaConverter Pro.',
      offers: { '@type': 'Offer', price: '9', priceCurrency: 'INR', description: 'Available on Pro plan from ₹9/month' },
    });
    if (!this.auth.isPro()) return;
    await this.career.loadPortfolio();
    const p = this.career.portfolio();
    if (p) this.form = { ...p, social: { ...p.social }, skills: [...(p.skills ?? [])], projects: [...(p.projects ?? [])] };
  }

  normalizeUsername(): void {
    if (!this.form.username) return;
    this.form.username = this.form.username
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '')
      .replace(/-+/g, '-');
  }

  readonly USERNAME_RE = /^[a-z0-9_-]{3,50}$/;

  async checkUsername(): Promise<void> {
    this.normalizeUsername();
    const u = this.form.username?.trim() ?? '';
    if (!u || u.length < 3) { this.usernameStatus.set('idle'); return; }
    if (!this.USERNAME_RE.test(u)) { this.usernameStatus.set('invalid'); return; }
    const existing = this.career.portfolio()?.username;
    if (u === existing) { this.usernameStatus.set('idle'); return; }
    const avail = await this.career.checkUsername(u);
    this.usernameStatus.set(avail ? 'available' : 'taken');
  }

  addSkill():       void { this.form.skills = [...(this.form.skills ?? []), { name: '', level: 'intermediate' }]; }
  removeSkill(i: number): void { this.form.skills = this.form.skills!.filter((_, idx) => idx !== i); }
  addProject():     void { this.form.projects = [...(this.form.projects ?? []), { title: '', description: '', featured: false }]; }
  removeProject(i: number): void { this.form.projects = this.form.projects!.filter((_, idx) => idx !== i); }

  ngOnDestroy(): void {
    this.jsonLd.removeJsonLd('portfolio-builder-app');
  }

  async save(): Promise<void> {
    if (!this.form.username?.trim()) { this.notify.warning('Username is required'); return; }
    if (this.usernameStatus() === 'invalid') { this.notify.warning('Invalid username — only lowercase letters, numbers, hyphens, underscores allowed'); return; }
    if (this.usernameStatus() === 'taken') { this.notify.warning('Username already taken — choose a different one'); return; }
    this.saving.set(true);
    const result = await this.career.savePortfolio(this.form as Portfolio);
    this.saving.set(false);
    if (result) {
      this.notify.success('Portfolio saved', result.isPublic ? `Public at /p/${result.username}` : 'Portfolio saved (not public).');
      this.usernameStatus.set('idle');
    } else {
      this.notify.error('Save failed', 'Could not save portfolio. Please try again.');
    }
  }
}
