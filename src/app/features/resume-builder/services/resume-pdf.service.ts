import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ResumeData } from '../models/resume.model';
import { PREMIUM_TEMPLATE_IDS } from '../data/resume-templates.data';
import { environment } from '../../../../environments/environment';

const API_BASE = environment.apiUrl ?? '/api';

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'resume';
}

@Injectable({ providedIn: 'root' })
export class ResumePdfService {
  private http = inject(HttpClient);

  get premiumTemplateIds(): string[] { return PREMIUM_TEMPLATE_IDS; }

  isPremiumTemplate(templateId: string): boolean {
    return PREMIUM_TEMPLATE_IDS.includes(templateId as any);
  }

  /**
   * Downloads the resume as a PDF.
   * Generation and access control are enforced server-side:
   *   - Premium templates require an active Pro subscription (backend returns 403 otherwise)
   *   - Free users receive a watermarked PDF
   */
  async download(resume: ResumeData): Promise<void> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      resume,
      templateId: resume.templateId,
      resumeName: resume.name || resume.personal?.fullName || 'resume',
    };

    const blob = await firstValueFrom(
      this.http.post(`${API_BASE}/resume/pdf`, body, {
        headers,
        responseType: 'blob',
      })
    );

    const filename = `${slugify(resume.personal?.fullName || resume.name)}-resume.pdf`;
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('ch_access_token') || null;
  }
}
