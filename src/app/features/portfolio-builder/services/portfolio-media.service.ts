import { Injectable, inject } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface MediaItem {
  url: string;
  filename: string;
  uploadedAt: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioMediaService {
  private api = inject(ApiService);

  async list(): Promise<MediaItem[]> {
    const res = await firstValueFrom(this.api.get<any>('portfolio/media'));
    return res.data.media;
  }

  async remove(filename: string): Promise<void> {
    await firstValueFrom(this.api.delete<any>(`portfolio/media/${filename}`));
  }

  async upload(file: File, kind: 'avatar' | 'cover' = 'cover'): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('kind', kind);
    const res = await lastValueFrom(this.api.uploadWithProgress<{ data: { url: string } }>('portfolio/upload-image', formData));
    return res.result!.data.url;
  }
}
