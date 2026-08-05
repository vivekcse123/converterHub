import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';
import { ProjectsPinService } from '../../../../core/services/projects-pin.service';
import { DashboardNotificationsService } from '../../../../core/services/dashboard-notifications.service';
import { ResumeStoreService } from '../../../resume-builder/services/resume-store.service';
import { PortfolioStoreService } from '../../../portfolio-builder/services/portfolio-store.service';
import { DASHBOARD_QUICK_ACTIONS } from '../../../../shared/data/dashboard-nav.data';
import { formatBytes, formatRelativeTime } from '../../../../shared/utils/format.util';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { StatTileComponent } from '../../../../shared/components/stat-tile/stat-tile.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

interface ConversionHistoryItem {
  _id: string;
  tool: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  outputFile?: { fileName?: string; url?: string };
  createdAt: string;
}

interface HistoryResponse {
  data: ConversionHistoryItem[];
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    TitleCasePipe,
    BadgeComponent,
    IconComponent,
    StatTileComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly resumeStore = inject(ResumeStoreService);
  readonly portfolioStore = inject(PortfolioStoreService);
  readonly projectsPin = inject(ProjectsPinService);
  readonly notifications = inject(DashboardNotificationsService);
  private readonly api = inject(ApiService);

  readonly quickActions = DASHBOARD_QUICK_ACTIONS;
  readonly formatBytes = formatBytes;
  readonly formatRelativeTime = formatRelativeTime;

  readonly skeletonRows = [1, 2, 3];

  readonly historyLoading = signal(true);
  readonly historyError = signal(false);
  readonly recentHistory = signal<ConversionHistoryItem[]>([]);

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  readonly recentResumes = computed(() =>
    [...this.resumeStore.resumes()].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4)
  );

  ngOnInit(): void {
    this.portfolioStore.load();

    this.api.get<HistoryResponse>('history?page=1&limit=6').subscribe({
      next: (res) => {
        this.recentHistory.set(res.data ?? []);
        this.historyLoading.set(false);
      },
      error: () => {
        this.historyError.set(true);
        this.historyLoading.set(false);
      },
    });
  }

  isResumePinned(id: string): boolean {
    return this.projectsPin.isPinned('resume', id);
  }

  toggleResumePin(id: string, name: string): void {
    this.projectsPin.toggle({ type: 'resume', id, label: name || 'Untitled Resume', route: '/resume-builder', icon: 'file-text' });
  }

  unpin(type: 'resume' | 'portfolio' | 'biodata', id: string): void {
    const item = this.projectsPin.pinned().find((p) => p.type === type && p.id === id);
    if (item) this.projectsPin.toggle(item);
  }

  openResume(id: string): void {
    this.resumeStore.setActive(id);
  }

  statusVariant(status: ConversionHistoryItem['status']): 'success' | 'warning' | 'danger' | 'info' {
    if (status === 'completed') return 'success';
    if (status === 'failed' || status === 'cancelled') return 'danger';
    return 'info';
  }
}
