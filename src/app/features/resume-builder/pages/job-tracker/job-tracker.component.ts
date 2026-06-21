import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CareerService, JobApplication, JobStatus, JOB_STATUS_CONFIG } from '../../services/career.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UpgradeModalComponent } from '../../components/upgrade-modal/upgrade-modal.component';

const STATUSES: { id: JobStatus | 'all'; label: string; icon: string }[] = [
  { id: 'all',         label: 'All',          icon: '📋' },
  { id: 'saved',       label: 'Saved',        icon: '🔖' },
  { id: 'applied',     label: 'Applied',      icon: '📤' },
  { id: 'interviewing',label: 'Interviewing', icon: '🎯' },
  { id: 'offer',       label: 'Offer',        icon: '🎉' },
  { id: 'rejected',    label: 'Rejected',     icon: '❌' },
];

const EMPTY_FORM = (): Partial<JobApplication> => ({
  jobTitle: '', company: '', location: '', status: 'saved',
  appliedDate: new Date().toISOString().split('T')[0],
  salary: '', jobUrl: '', notes: '',
});

@Component({
  selector: 'app-job-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, UpgradeModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showUpgrade()) {
      <app-upgrade-modal triggeredBy="job-tracker" (close)="showUpgrade.set(false)" (upgraded)="showUpgrade.set(false)" />
    }

    <!-- Add/Edit modal -->
    @if (modalOpen()) {
      <div class="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-16 pb-6 bg-black/50 backdrop-blur-sm" (click)="closeModal()">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh]" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <h2 class="font-bold text-slate-800 dark:text-white">{{ editingId() ? 'Edit Application' : 'Add Job Application' }}</h2>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition text-xl leading-none">✕</button>
          </div>
          <div class="overflow-y-auto flex-1 p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Job Title *</label>
                <input class="input w-full" placeholder="e.g. Frontend Developer" [(ngModel)]="form().jobTitle">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company *</label>
                <input class="input w-full" placeholder="e.g. Google" [(ngModel)]="form().company">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
                <input class="input w-full" placeholder="e.g. Bengaluru" [(ngModel)]="form().location">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
                <select class="input w-full" [(ngModel)]="form().status">
                  @for (s of statusOptions; track s.id) {
                    <option [value]="s.id">{{ s.icon }} {{ s.label }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Applied Date</label>
                <input type="date" class="input w-full" [(ngModel)]="form().appliedDate">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Expected Salary</label>
                <input class="input w-full" placeholder="e.g. ₹12 LPA" [(ngModel)]="form().salary">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Job URL</label>
                <input class="input w-full" placeholder="https://..." [(ngModel)]="form().jobUrl">
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Notes</label>
                <textarea class="input w-full resize-none" rows="3" placeholder="Interview notes, contacts..." [(ngModel)]="form().notes"></textarea>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
            <button class="flex-1 btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="flex-1 btn btn-primary" [disabled]="saving() || !form().jobTitle || !form().company" (click)="save()">
              {{ saving() ? 'Saving...' : (editingId() ? 'Save Changes' : 'Add Application') }}
            </button>
          </div>
        </div>
      </div>
    }

    <div class="min-h-screen bg-slate-50 dark:bg-slate-950">

      <!-- Header bar -->
      <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div class="container-app py-3 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <a routerLink="/resume-builder/dashboard" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition text-sm">← Dashboard</a>
            <span class="text-slate-300 dark:text-slate-700">|</span>
            <h1 class="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
              📋 Job Tracker
              @if (auth.isPro()) {
                <span class="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">PRO</span>
              }
            </h1>
          </div>
          @if (auth.isPro()) {
            <button class="btn btn-primary btn-sm flex items-center gap-1.5" (click)="openAdd()">
              <span class="text-base leading-none">+</span> Add Application
            </button>
          }
        </div>
      </div>

      <div class="container-app py-8">

        @if (!auth.isPro()) {
          <!-- Pro gate -->
          <div class="max-w-lg mx-auto text-center py-20">
            <div class="text-6xl mb-5">📋</div>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">Job Application Tracker</h2>
            <p class="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Track every job application, interview, and offer in one place.
              Never lose track of where you applied - upgrade to Pro to unlock.
            </p>
            <div class="grid grid-cols-2 gap-3 text-sm text-left mb-8 max-w-sm mx-auto">
              @for (f of trackerFeatures; track f) {
                <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span class="text-emerald-500">✓</span> {{ f }}
                </div>
              }
            </div>
            <button class="btn btn-primary px-8 py-3 text-base" (click)="showUpgrade.set(true)">
              ⭐ Upgrade to Pro - Unlock Tracker
            </button>
            <p class="text-xs text-slate-400 mt-4">Starting at ₹149/month · Cancel anytime</p>
          </div>
        } @else {

          <!-- Stats row -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            @for (stat of statsCards(); track stat.label) {
              <div class="card p-4 text-center">
                <p class="text-2xl font-extrabold text-slate-800 dark:text-white">{{ stat.count }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1">
                  <span>{{ stat.icon }}</span> {{ stat.label }}
                </p>
              </div>
            }
          </div>

          <!-- Status filter tabs -->
          <div class="flex flex-wrap gap-2 mb-6">
            @for (s of statuses; track s.id) {
              <button
                type="button"
                class="px-3 py-1.5 rounded-full text-xs font-semibold transition border"
                [class]="activeStatus() === s.id
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400'"
                (click)="activeStatus.set(s.id)">
                {{ s.icon }} {{ s.label }}
                @if (s.id !== 'all' && jobStats()[s.id]) {
                  <span class="ml-1 opacity-70">({{ jobStats()[s.id] }})</span>
                }
              </button>
            }
          </div>

          <!-- Job list -->
          @if (career.loading()) {
            <div class="text-center py-20 text-slate-400">Loading...</div>
          } @else if (filteredJobs().length === 0) {
            <div class="card p-14 text-center">
              <p class="text-5xl mb-4">🔍</p>
              <p class="font-semibold text-slate-700 dark:text-slate-200 mb-1">
                {{ activeStatus() === 'all' ? 'No applications yet' : 'No ' + activeStatus() + ' applications' }}
              </p>
              <p class="text-sm text-slate-400 mb-5">
                {{ activeStatus() === 'all' ? 'Start tracking your job search - add your first application.' : 'Applications with this status will appear here.' }}
              </p>
              @if (activeStatus() === 'all') {
                <button class="btn btn-primary px-6" (click)="openAdd()">+ Add First Application</button>
              }
            </div>
          } @else {
            <div class="space-y-3">
              @for (job of filteredJobs(); track job._id) {
                <div class="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-sm transition-all group">
                  <!-- Status badge -->
                  <div class="shrink-0">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" [class]="statusConfig[job.status].color">
                      {{ statusConfig[job.status].icon }} {{ statusConfig[job.status].label }}
                    </span>
                  </div>
                  <!-- Details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p class="font-bold text-slate-800 dark:text-white text-sm">{{ job.jobTitle }}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {{ job.company }}
                          @if (job.location) { · {{ job.location }} }
                          @if (job.salary) { · {{ job.salary }} }
                        </p>
                      </div>
                      <p class="text-xs text-slate-400 shrink-0">{{ job.appliedDate | date:'dd MMM yy' }}</p>
                    </div>
                    @if (job.notes) {
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1">📝 {{ job.notes }}</p>
                    }
                  </div>
                  <!-- Actions -->
                  <div class="flex items-center gap-2 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    @if (job.jobUrl) {
                      <a [href]="job.jobUrl" target="_blank" rel="noopener"
                         class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-violet-600 transition">
                        🔗 Link
                      </a>
                    }
                    <button class="text-xs px-2.5 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 transition"
                            (click)="openEdit(job)">
                      Edit
                    </button>
                    <button class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-100 hover:text-red-600 transition"
                            (click)="deleteJob(job._id)">
                      ✕
                    </button>
                  </div>
                </div>
              }
            </div>

            <div class="text-center mt-8">
              <button class="btn btn-secondary" (click)="openAdd()">+ Add Another Application</button>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class JobTrackerComponent implements OnInit {
  readonly auth   = inject(AuthService);
  readonly career = inject(CareerService);

  readonly showUpgrade  = signal(false);
  readonly modalOpen    = signal(false);
  readonly editingId    = signal<string | null>(null);
  readonly saving       = signal(false);
  readonly activeStatus = signal<JobStatus | 'all'>('all');
  readonly form         = signal<Partial<JobApplication>>(EMPTY_FORM());

  readonly statuses     = STATUSES;
  readonly statusOptions = STATUSES.filter(s => s.id !== 'all');
  readonly statusConfig  = JOB_STATUS_CONFIG;

  readonly jobStats = this.career.jobStats;

  readonly filteredJobs = computed(() => {
    const s = this.activeStatus();
    const jobs = this.career.jobs();
    return s === 'all' ? jobs : jobs.filter(j => j.status === s);
  });

  readonly statsCards = computed(() => {
    const stats = this.jobStats();
    const total = this.career.totalJobs();
    return [
      { label: 'Total',         count: total,                                    icon: '📋' },
      { label: 'Active',        count: this.career.activeJobs(),                 icon: '🔥' },
      { label: 'Interviews',    count: stats['interviewing'] ?? 0,               icon: '🎯' },
      { label: 'Offers',        count: stats['offer'] ?? 0,                      icon: '🎉' },
    ];
  });

  readonly trackerFeatures = [
    'Track applications by status', 'Add interview notes',
    'Set deadlines',                'Salary tracking',
    'Link to job postings',         'Full history',
  ];

  async ngOnInit() {
    if (this.auth.isPro()) {
      await this.career.loadJobs();
    }
  }

  openAdd() {
    this.editingId.set(null);
    this.form.set(EMPTY_FORM());
    this.modalOpen.set(true);
  }

  openEdit(job: JobApplication) {
    this.editingId.set(job._id);
    this.form.set({
      jobTitle: job.jobTitle, company: job.company, location: job.location ?? '',
      status: job.status, appliedDate: job.appliedDate?.split('T')[0] ?? '',
      salary: job.salary ?? '', jobUrl: job.jobUrl ?? '', notes: job.notes ?? '',
    });
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.editingId.set(null);
    this.form.set(EMPTY_FORM());
  }

  async save() {
    const f = this.form();
    if (!f.jobTitle?.trim() || !f.company?.trim()) return;
    this.saving.set(true);
    const id = this.editingId();
    if (id) {
      await this.career.updateJob(id, f);
    } else {
      await this.career.createJob(f);
    }
    this.saving.set(false);
    this.closeModal();
    await this.career.loadStats();
  }

  async deleteJob(id: string) {
    await this.career.deleteJob(id);
    await this.career.loadStats();
  }
}
