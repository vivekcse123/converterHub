import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ResumeData } from '../models/resume.model';

export interface ShareStatus {
  published: boolean;
  slug?: string;
  views?: number;
}

@Injectable({ providedIn: 'root' })
export class ShareService {
  private api  = inject(ApiService);
  private auth = inject(AuthService);

  readonly publishing = signal(false);

  async publish(resume: ResumeData): Promise<{ slug: string } | null> {
    if (!this.auth.isLoggedIn()) return null;
    this.publishing.set(true);
    try {
      const { versions: _v, ...snapshot } = resume as any;
      const res = await firstValueFrom(this.api.post<any>('share/resume', {
        resumeId: resume.id,
        snapshot,
        name: resume.name || 'My Resume',
      }));
      return res.data ?? null;
    } catch { return null; }
    finally { this.publishing.set(false); }
  }

  async unpublish(resumeId: string): Promise<void> {
    if (!this.auth.isLoggedIn()) return;
    try { await firstValueFrom(this.api.delete<any>(`share/resume/${resumeId}`)); } catch { }
  }

  async getStatus(resumeId: string): Promise<ShareStatus> {
    if (!this.auth.isLoggedIn()) return { published: false };
    try {
      const res = await firstValueFrom(this.api.get<any>(`share/resume/${resumeId}/status`));
      return res.data ?? { published: false };
    } catch { return { published: false }; }
  }

  publicUrl(slug: string): string {
    return `${window.location.origin}/r/${slug}`;
  }
}
