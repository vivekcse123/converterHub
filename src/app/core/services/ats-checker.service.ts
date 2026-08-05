import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/user.model';
import { AtsReport } from '../models/ats-checker.model';

@Injectable({ providedIn: 'root' })
export class AtsCheckerService {
  private http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  analyzeFile(file: File): Observable<{ reportId: string; report: AtsReport }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<ApiResponse<{ reportId: string; report: AtsReport }>>(`${this.base}/ai/ats/analyze`, formData)
      .pipe(map(res => res.data));
  }

  analyzeText(text: string): Observable<{ reportId: string; report: AtsReport }> {
    return this.http
      .post<ApiResponse<{ reportId: string; report: AtsReport }>>(`${this.base}/ai/ats/analyze`, { text })
      .pipe(map(res => res.data));
  }

  getReport(id: string): Observable<AtsReport> {
    return this.http
      .get<ApiResponse<{ report: AtsReport }>>(`${this.base}/ai/ats/report/${id}`)
      .pipe(map(res => res.data.report));
  }
}
