import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.base}/${path}`);
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.base}/${path}`, body);
  }

  /**
   * Upload files with progress tracking.
   * @returns Observable that emits progress (0–100) then the response.
   */
  uploadWithProgress<T>(path: string, formData: FormData): Observable<{ progress: number; result?: T }> {
    const req = new HttpRequest('POST', `${this.base}/${path}`, formData, {
      reportProgress: true,
    });

    return this.http.request<T>(req).pipe(
      map((event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          return { progress: Math.round((100 * event.loaded) / event.total) };
        }
        if (event.type === HttpEventType.Response) {
          return { progress: 100, result: event.body as T };
        }
        return { progress: 0 };
      }),
      catchError((err) => throwError(() => err))
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}/${path}`);
  }
}
