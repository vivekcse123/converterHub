import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export type RewriteMode = 'improve' | 'shorten' | 'expand' | 'professional' | 'casual' | 'grammar';

@Injectable({ providedIn: 'root' })
export class PortfolioAiService {
  private api = inject(ApiService);

  async generateBio(input: { name?: string; role?: string; skills?: string[]; tone?: string }): Promise<string> {
    const res = await firstValueFrom(this.api.post<any>('ai/portfolio/bio', input));
    return res.data.bio;
  }

  async generateProjectDescription(input: { title: string; techStack?: string[]; summary?: string }): Promise<string> {
    const res = await firstValueFrom(this.api.post<any>('ai/portfolio/project-description', input));
    return res.data.description;
  }

  async rewrite(mode: RewriteMode, text: string): Promise<string> {
    const res = await firstValueFrom(this.api.post<any>('ai/portfolio/rewrite', { mode, text }));
    return res.data.result;
  }
}
