import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';

export interface JobApplication {
  _id:          string;
  jobTitle:     string;
  company:      string;
  location?:    string;
  jobUrl?:      string;
  salary?:      string;
  status:       JobStatus;
  appliedDate:  string;
  deadlineDate?: string;
  notes?:       string;
  resumeId?:    string;
  matchScore?:  number;
  tags?:        string[];
  timeline?:    { event: string; date: string; note?: string }[];
  createdAt:    string;
  updatedAt:    string;
}

export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: string; icon: string }> = {
  saved:        { label: 'Saved',        color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',       icon: '🔖' },
  applied:      { label: 'Applied',      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',          icon: '📤' },
  interviewing: { label: 'Interviewing', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',  icon: '🎯' },
  offer:        { label: 'Offer',        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: '🎉' },
  rejected:     { label: 'Rejected',     color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',              icon: '❌' },
  withdrawn:    { label: 'Withdrawn',    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',      icon: '↩' },
};

@Injectable({ providedIn: 'root' })
export class CareerService {
  private api  = inject(ApiService);
  private auth = inject(AuthService);

  readonly jobs      = signal<JobApplication[]>([]);
  readonly jobStats  = signal<Record<string, number>>({});
  readonly loading   = signal(false);

  async loadJobs(status?: string): Promise<void> {
    if (!this.auth.isLoggedIn()) return;
    this.loading.set(true);
    try {
      const params = status ? `?status=${status}` : '';
      const res = await firstValueFrom(this.api.get<any>(`career/jobs${params}`));
      this.jobs.set(res.data ?? []);
      this.jobStats.set(res.meta?.statusCounts ?? {});
    } catch { } finally { this.loading.set(false); }
  }

  async loadStats(): Promise<{ statusCounts: Record<string,number>; total: number }> {
    if (!this.auth.isLoggedIn()) return { statusCounts: {}, total: 0 };
    try {
      const res = await firstValueFrom(this.api.get<any>('career/stats'));
      this.jobStats.set(res.data?.statusCounts ?? {});
      return res.data ?? { statusCounts: {}, total: 0 };
    } catch { return { statusCounts: {}, total: 0 }; }
  }

  async createJob(data: Partial<JobApplication>): Promise<JobApplication | null> {
    try {
      const res = await firstValueFrom(this.api.post<any>('career/jobs', data));
      const job = res.data?.job;
      if (job) this.jobs.update(j => [job, ...j]);
      return job ?? null;
    } catch { return null; }
  }

  async updateJob(id: string, data: Partial<JobApplication>): Promise<void> {
    const res = await firstValueFrom(this.api.patch<any>(`career/jobs/${id}`, data));
    const updated = res.data?.job;
    if (updated) this.jobs.update(j => j.map(x => x._id === id ? updated : x));
  }

  async deleteJob(id: string): Promise<void> {
    await firstValueFrom(this.api.delete<any>(`career/jobs/${id}`));
    this.jobs.update(j => j.filter(x => x._id !== id));
  }

  totalJobs(): number { return Object.values(this.jobStats()).reduce((a: number, b: number) => a + (b as number), 0); }
  activeJobs(): number { return (this.jobStats()['applied'] ?? 0) + (this.jobStats()['interviewing'] ?? 0); }
}
