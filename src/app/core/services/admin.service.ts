import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AdminStats, ToolStat, DailyStat, QueueStats, Plan, AdminUser, TrendingTool } from '../models/admin.model';
import { PaginatedApiResponse, ApiResponse } from '../models/user.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers(params: Record<string, string> = {}): Observable<PaginatedApiResponse<User>> {
    const query = new URLSearchParams(params).toString();
    return this.api.get<PaginatedApiResponse<User>>(`admin/users${query ? '?' + query : ''}`);
  }

  getUser(id: string): Observable<ApiResponse<{ user: AdminUser; totalConversions: number }>> {
    return this.api.get<ApiResponse<any>>(`admin/users/${id}`);
  }

  createUser(data: Partial<User> & { password: string }): Observable<ApiResponse<{ user: User }>> {
    return this.api.post<ApiResponse<any>>('admin/users', data);
  }

  updateUser(id: string, data: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.api.patch<ApiResponse<any>>(`admin/users/${id}`, data);
  }

  deleteUser(id: string): Observable<ApiResponse<unknown>> {
    return this.api.delete<ApiResponse<unknown>>(`admin/users/${id}`);
  }

  suspendUser(id: string, hours = 24, reason?: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/suspend`, { hours, reason });
  }

  unsuspendUser(id: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/unsuspend`, {});
  }

  banUser(id: string, reason?: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/ban`, { reason });
  }

  unbanUser(id: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/unban`, {});
  }

  resetUserUsage(id: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/users/${id}/reset-usage`, {});
  }

  // ── Analytics ──────────────────────────────────────────────────────────────
  getOverview(): Observable<ApiResponse<AdminStats>> {
    return this.api.get<ApiResponse<AdminStats>>('admin/analytics/overview');
  }

  getToolStats(limit = 30): Observable<ApiResponse<ToolStat[]>> {
    return this.api.get<ApiResponse<any>>(`admin/analytics/tools?limit=${limit}`);
  }

  getDailyStats(days = 30): Observable<ApiResponse<DailyStat[]>> {
    return this.api.get<ApiResponse<any>>(`admin/analytics/daily?days=${days}`);
  }

  getSubscriptionStats(): Observable<ApiResponse<Array<{ _id: string; count: number }>>> {
    return this.api.get<ApiResponse<any>>('admin/analytics/subscriptions');
  }

  getTrending(limit = 10, days = 7): Observable<ApiResponse<{ trending: TrendingTool[]; days: number }>> {
    return this.api.get<ApiResponse<any>>(`admin/analytics/trending?limit=${limit}&days=${days}`);
  }

  // ── Queue ──────────────────────────────────────────────────────────────────
  getQueueStats(): Observable<ApiResponse<QueueStats>> {
    return this.api.get<ApiResponse<any>>('admin/queue/stats');
  }

  getFailedJobs(): Observable<ApiResponse<unknown[]>> {
    return this.api.get<ApiResponse<any>>('admin/queue/failed');
  }

  retryJob(jobId: string): Observable<ApiResponse<unknown>> {
    return this.api.post<ApiResponse<unknown>>(`admin/queue/jobs/${jobId}/retry`, {});
  }

  removeJob(jobId: string): Observable<ApiResponse<unknown>> {
    return this.api.delete<ApiResponse<unknown>>(`admin/queue/jobs/${jobId}`);
  }

  // ── Error Logs ─────────────────────────────────────────────────────────────
  getErrorLogs(limit = 100): Observable<ApiResponse<unknown[]>> {
    return this.api.get<ApiResponse<any>>(`admin/logs/errors?limit=${limit}`);
  }

  // ── Plans ──────────────────────────────────────────────────────────────────
  getPlans(): Observable<ApiResponse<Plan[]>> {
    return this.api.get<ApiResponse<any>>('admin/plans');
  }

  updatePlan(id: string, data: Partial<Plan>): Observable<ApiResponse<Plan>> {
    return this.api.put<ApiResponse<any>>(`admin/plans/${id}`, data);
  }
}
