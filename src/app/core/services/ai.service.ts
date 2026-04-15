import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/user.model';

export interface AISummarizeResult {
  fileName:   string;
  downloadUrl: string;
  summary:    string;
  tokensUsed: number;
}

export interface AIKeywordsResult {
  fileName:    string;
  downloadUrl: string;
  keywords:    string[];
  tokensUsed:  number;
}

export interface AIChatResult {
  answer:    string;
  tokensUsed: number;
}

export interface AIFormResult {
  fileName:    string;
  downloadUrl: string;
  formData:    Record<string, unknown>;
  tokensUsed:  number;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  constructor(private api: ApiService) {}

  summarize(file: File, options: { length?: string; language?: string } = {}): Observable<ApiResponse<AISummarizeResult>> {
    const fd = new FormData();
    fd.append('file', file);
    if (options.length)   fd.append('length', options.length);
    if (options.language) fd.append('language', options.language);
    return this.api.post<ApiResponse<AISummarizeResult>>('ai/summarize', fd);
  }

  uploadForChat(file: File): Observable<ApiResponse<{ sessionId: string; fileName: string }>> {
    const fd = new FormData();
    fd.append('file', file);
    return this.api.post<ApiResponse<any>>('ai/chat/upload', fd);
  }

  chat(sessionId: string, question: string, history: { role: string; content: string }[] = []): Observable<ApiResponse<AIChatResult>> {
    return this.api.post<ApiResponse<AIChatResult>>('ai/chat', { sessionId, question, history });
  }

  extractKeywords(file: File): Observable<ApiResponse<AIKeywordsResult>> {
    const fd = new FormData();
    fd.append('file', file);
    return this.api.post<ApiResponse<AIKeywordsResult>>('ai/extract-keywords', fd);
  }

  extractFormData(file: File): Observable<ApiResponse<AIFormResult>> {
    const fd = new FormData();
    fd.append('file', file);
    return this.api.post<ApiResponse<AIFormResult>>('ai/form-fill', fd);
  }
}
