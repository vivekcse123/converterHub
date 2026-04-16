import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { ConversionHistory, PaginatedResponse } from '../../core/models/conversion.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly history  = signal<ConversionHistory[]>([]);
  readonly loading  = signal(true);
  readonly total    = signal(0);
  page = 1;

  constructor(
    public auth:    AuthService,
    private api:    ApiService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void { this.loadHistory(); }

  loadHistory(): void {
    this.loading.set(true);
    this.api.get<PaginatedResponse<ConversionHistory>>(`history?page=${this.page}&limit=20`)
      .subscribe({
        next: (res) => {
          this.history.set(res.data);
          this.total.set(res.pagination.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  deleteEntry(id: string): void {
    this.api.delete<void>(`history/${id}`).subscribe({
      next: () => {
        this.history.update((h) => h.filter((e) => e._id !== id));
        this.notify.success('Deleted');
      },
      error: () => this.notify.error('Failed to delete'),
    });
  }

  toolLabel(tool: string): string {
    const map: Record<string, string> = {
      'image-to-pdf':   'Image → PDF',
      'pdf-to-word':    'PDF → Word',
      'word-to-pdf':    'Word → PDF',
      'pdf-merge':      'PDF Merge',
      'pdf-split':      'PDF Split',
      'pdf-compress':   'PDF Compress',
      'image-resize':   'Image Resize',
      'image-compress': 'Image Compress',
      'image-convert':  'Image Convert',
      'text-to-pdf':    'Text → PDF',
      'create-zip':     'Create ZIP',
    };
    return map[tool] ?? tool;
  }

  statusClass(status: string): string {
    const c: Record<string, string> = {
      completed:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      failed:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      pending:    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    };
    return c[status] ?? c['pending'];
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }
}
